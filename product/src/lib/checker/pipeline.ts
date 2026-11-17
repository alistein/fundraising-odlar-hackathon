// The check pipeline: six steps in a fixed order, then one score.
//
//   1 ai      is it machine-made / written to pressure        (model + content credentials)
//   2 edit    was the file edited after it was issued          (metadata + pixel forensics + model)
//   3 web     does the same story circulate elsewhere          (our memory + public web search)
//   4 mygov   is the organiser a verified person               (SIMULATED, see lib/mygov.ts)
//   5 clinic  is it a registered Safefund campaign             (rules; id kept for history)
//   6 report  has a clinic reported it as fake                 (optional, outside the core flow)
//
// Core flow: AI gate (steps 1–3) → MyGov gate (step 4). Clinics do not confirm;
// they can only report. Steps are emitted as they finish so the page can show real progress.
// Only step 5 can make something trustworthy; the others can only lower trust.
import { db, schema } from "@/db";
import { campaignIdentity } from "@/lib/mygov";
import { clinicReportsFor } from "@/lib/reports";
import { sha256 } from "@/lib/crypto";
import { campaignOf, findDocumentByCode, findDocumentsByHash, fingerprint } from "@/lib/documents";
import { readFile, rereadIdentifiers, searchWeb, webSearchEnabled } from "./ai";
import { checkIdentifier, ID_LABEL, sameId } from "./identifiers";
import { detectGenerated } from "./detector";
import { inspectDocument } from "./document";
import { analyseImage } from "./forensics";
import { classifyOrigin } from "./origin";
import { analyseAppeal, type AppealAnalysis, type AppealVerdict, type CampaignRef } from "./index";
import { containment, extractIdentifiers, storyTokens } from "./text";

export const STEP_IDS = ["ai", "edit", "web", "mygov", "clinic", "report"] as const;
export type StepId = (typeof STEP_IDS)[number];

// pass: positive evidence. info: nothing either way. warn / fail: lowers trust. skip: not applicable.
export type StepStatus = "pass" | "info" | "warn" | "fail" | "skip";
export type Step = { id: StepId; status: StepStatus; findings: string[] };

export type Tone = "ok" | "neutral" | "warn" | "danger";

export type Report = {
  score: number; // 0–100
  tone: Tone;
  title: string;
  steps: Step[];
  campaign: Omit<CampaignRef, "organiserId"> | null;
  /** Uploaded image with the suspicious area marked (data URL). */
  heatmap?: string;
};

export type CheckEvent =
  | { type: "start"; id: StepId }
  | { type: "step"; step: Step }
  | { type: "done"; report: Report }
  | { type: "error"; message: string };

export type CheckInput = { text: string } | { file: Buffer };

// ── Scoring ─────────────────────────────────────────────────────────────────

const POINTS: Record<StepId, { pass: number; warn: number; fail: number }> = {
  ai: { pass: 5, warn: -15, fail: -35 },
  edit: { pass: 5, warn: -15, fail: -35 },
  web: { pass: 5, warn: -20, fail: -40 },
  mygov: { pass: 10, warn: -10, fail: -20 },
  clinic: { pass: 35, warn: -15, fail: -45 },
  report: { pass: 0, warn: -15, fail: -45 },
};

export function score(steps: Step[]): number {
  let s = 50; // nothing known either way
  for (const { id, status } of steps)
    if (status === "pass" || status === "warn" || status === "fail") s += POINTS[id][status];

  const clinicPassed = steps.some((x) => x.id === "clinic" && x.status === "pass");
  const anyFail = steps.some((x) => x.status === "fail");
  const anyWarn = steps.some((x) => x.status === "warn");
  // Outside the registry nothing is trustworthy, however clean it looks.
  if (!clinicPassed) s = Math.min(s, 60);
  // An unconfirmed clinic report keeps a campaign out of the trusted band until we hear back.
  if (steps.some((x) => x.id === "report" && x.status === "warn")) s = Math.min(s, 70);
  // One hard failure outweighs everything else.
  if (anyFail) s = Math.min(s, 35);
  // A registered, MyGov-confirmed campaign and nothing contradicts that.
  if (clinicPassed && !anyFail && !anyWarn) s = Math.max(s, 85);
  return Math.max(0, Math.min(100, Math.round(s)));
}

export const toneOf = (s: number): Tone =>
  s >= 80 ? "ok" : s >= 60 ? "neutral" : s >= 40 ? "warn" : "danger";

// ── Steps shared by text and files ──────────────────────────────────────────

const CLINIC_STATUS: Record<AppealVerdict, StepStatus> = {
  verified: "pass",
  declared: "info",
  route_mismatch: "fail",
  rejected: "info", // the report step carries the failure
  stale: "warn",
  altered: "warn",
  serial_card: "warn",
  multi_route: "warn",
  pressure: "warn",
  unknown: "warn",
  not_appeal: "skip",
};

function aiStepForAppeal(a: AppealAnalysis): Step {
  if (!a.aiUsed) return { id: "ai", status: "skip", findings: [] };
  if (a.isAppeal === false)
    return { id: "ai", status: "skip", findings: ["Bu mətn ianə elanına oxşamır"] };

  // A registered campaign is judged by the registry, not by its tone: a real
  // family writes urgently too. Show what was read, take no points.
  if (a.campaign) {
    const seen = [...a.manipulation, ...a.implausible];
    return seen.length
      ? { id: "ai", status: "info", findings: seen }
      : { id: "ai", status: "pass", findings: ["Manipulyasiya əlaməti tapılmadı"] };
  }

  const findings = [...a.implausible, ...a.manipulation, ...a.missing];
  if (a.disputed) findings.push("İkinci yoxlama manipulyasiyanı təsdiqləmədi");
  if (a.implausible.length >= 2 || a.manipulation.length >= 3)
    return { id: "ai", status: "fail", findings };
  if (a.implausible.length || a.manipulation.length)
    return { id: "ai", status: "warn", findings };
  // Nothing manipulative. Gaps are worth showing but are not an accusation.
  return a.missing.length
    ? { id: "ai", status: "info", findings }
    : { id: "ai", status: "pass", findings: ["Manipulyasiya əlaməti tapılmadı"] };
}

async function webStep(
  memory: string[],
  memoryStatus: StepStatus,
  claims: AppealAnalysis["claims"],
): Promise<Step> {
  const found = claims && webSearchEnabled() ? await searchWeb(claims) : null;
  const findings = [...memory];
  let status = memoryStatus;
  const worse = (s: StepStatus) => {
    const rank: StepStatus[] = ["skip", "info", "pass", "warn", "fail"];
    if (rank.indexOf(s) > rank.indexOf(status)) status = s;
  };
  if (found) {
    if (found.outcome === "none") {
      findings.push("İnternetdə oxşar paylaşım tapılmadı");
      worse("info");
    } else {
      findings.push(found.note || "İnternetdə oxşar paylaşım tapıldı");
      for (const s of found.sources) findings.push(s.url);
      worse(found.outcome === "reported" ? "fail" : found.outcome === "conflicting" ? "warn" : "info");
    }
  }
  if (findings.length === 0) return { id: "web", status: "skip", findings: [] };
  return { id: "web", status, findings };
}

async function mygovStep(campaign: CampaignRef | null): Promise<Step> {
  if (!campaign)
    return { id: "mygov", status: "skip", findings: ["Təşkilatçı qeydiyyatdan keçməyib"] };
  const { verified } = await campaignIdentity(campaign.id);
  return verified
    ? { id: "mygov", status: "pass", findings: ["Təşkilatçının şəxsiyyəti təsdiqlənib"] }
    : { id: "mygov", status: "warn", findings: ["Təşkilatçı MyGov ilə təsdiqlənməyib"] };
}

async function reportStep(campaign: CampaignRef | null): Promise<Step> {
  if (!campaign) return { id: "report", status: "skip", findings: [] };
  const reports = await clinicReportsFor(campaign.id);
  const confirmed = reports.find((r) => r.confirmedAt);
  if (confirmed)
    return {
      id: "report",
      status: "fail",
      findings: [`${confirmed.clinicName} bu kampaniyanı saxta kimi bildirib`],
    };
  if (reports.length)
    return { id: "report", status: "warn", findings: ["Klinika şikayəti var, yoxlanılır"] };
  return { id: "report", status: "pass", findings: ["Klinika şikayəti yoxdur"] };
}

// ── Runner ──────────────────────────────────────────────────────────────────

export async function runCheck(input: CheckInput, emit: (e: CheckEvent) => void): Promise<void> {
  const steps: Step[] = [];
  /** Announce a step, compute it, publish it. */
  const run = async (id: StepId, work: () => Promise<Step> | Step) => {
    emit({ type: "start", id });
    const step = await work();
    steps.push(step);
    emit({ type: "step", step });
    return step;
  };
  const skip = (id: StepId, why?: string) =>
    run(id, () => ({ id, status: "skip", findings: why ? [why] : [] }));
  const finish = (title: string, campaign: CampaignRef | null, heatmap?: string) => {
    const s = score(steps);
    emit({
      type: "done",
      report: {
        score: s,
        tone: toneOf(s),
        title,
        steps,
        campaign: campaign && {
          id: campaign.id,
          title: campaign.title,
          code: campaign.code,
          clinicName: campaign.clinicName,
        },
        heatmap,
      },
    });
  };

  /** Steps 3–5 for anything that reads as an appeal (pasted text or a transcribed screenshot). */
  const appealTail = async (a: AppealAnalysis, heatmap?: string) => {
    await run("web", () =>
      webStep(
        a.memory,
        a.verdict === "serial_card"
          ? "fail"
          : a.verdict === "multi_route"
            ? "warn"
            : a.memory.length
              ? "info"
              : "skip",
        a.claims,
      ),
    );
    await run("mygov", () => mygovStep(a.campaign));
    await run("clinic", () => ({
      id: "clinic",
      status: CLINIC_STATUS[a.verdict],
      findings: a.registry,
    }));
    await run("report", () => reportStep(a.campaign));
    // "Not verified" undersells an appeal that a step has already failed.
    const failed = steps.some((x) => x.status === "fail");
    const reported = steps.some((x) => x.id === "report" && x.status === "warn");
    finish(
      a.verdict === "unknown" && failed
        ? "Şübhəli elan"
        : reported && !failed
          ? "Klinika şikayəti yoxlanılır"
          : a.title,
      a.campaign,
      heatmap,
    );
  };

  // ── Text ──
  if ("text" in input) {
    const [docCode] = extractIdentifiers(input.text).docCodes;
    if (docCode) {
      // A clinic's document code answers for itself.
      const doc = await findDocumentByCode(docCode);
      await skip("ai");
      await skip("edit");
      await skip("web");
      await run("mygov", () => mygovStep(doc ? campaignOf(doc) : null));
      await run("clinic", () =>
        doc
          ? {
              id: "clinic",
              status: "pass",
              findings: [
                `${doc.clinicName} bu sənədi təsdiqləyib`,
                `Faylın barmaq izi: ${fingerprint(doc.sha256)}`,
              ],
            }
          : {
              id: "clinic",
              status: "fail",
              findings: [`${docCode} kodu ilə heç bir klinika sənəd təsdiqləməyib`],
            },
      );
      await run("report", () => reportStep(doc ? campaignOf(doc) : null));
      return finish(doc ? "Klinika təsdiqləyib" : "Kod reyestrdə yoxdur", doc ? campaignOf(doc) : null);
    }

    emit({ type: "start", id: "ai" });
    const a = await analyseAppeal(input.text);
    const ai = aiStepForAppeal(a);
    steps.push(ai);
    emit({ type: "step", step: ai });
    await skip("edit", "Fayl yüklənməyib");
    return appealTail(a);
  }

  // ── File ──
  const plain = input.file;
  const report = inspectDocument(plain);
  if (!report.type) throw new Error("unsupported file type"); // the route validates before calling

  // The registry first: a file the clinic confirmed, byte for byte, needs no analysis.
  const rows = await findDocumentsByHash(sha256(plain));
  const confirmed = rows.find((r) => r.confirmedAt);
  if (confirmed) {
    const why = "Klinika təsdiqlədiyi fayldır";
    await skip("ai", why);
    await skip("edit", why);
    await skip("web");
    await run("mygov", () => mygovStep(campaignOf(confirmed)));
    await run("clinic", () => ({
      id: "clinic",
      status: "pass",
      findings: [
        `${confirmed.clinicName} bu sənədi təsdiqləyib`,
        `Kod: ${confirmed.code}`,
        `Faylın barmaq izi: ${fingerprint(confirmed.sha256)}`,
      ],
    }));
    await run("report", () => reportStep(campaignOf(confirmed)));
    return finish("Klinika təsdiqləyib", campaignOf(confirmed));
  }
  const known = rows.at(0);

  // Model and pixel forensics start together; steps are published in order.
  emit({ type: "start", id: "ai" });
  const pixelsPromise = analyseImage(plain, report.type);
  const [reading, origin, detected] = await Promise.all([
    readFile(plain, report.type),
    classifyOrigin(plain, report.type),
    report.type === "pdf" ? null : detectGenerated(plain),
  ]);
  const credentialMark = report.signals.includes(AI_MARK);
  const metadata = report.signals.filter((s) => s !== AI_MARK);

  // A screenshot of a post: transcribe it and treat it as an appeal.
  if (reading?.kind === "appeal_screenshot" && reading.appealText?.trim()) {
    const a = await analyseAppeal(reading.appealText);
    const ai = aiStepForAppeal(a);
    // The local detector runs here too; a screenshot is outside what it can judge.
    if (detected !== null)
      ai.findings.push(
        `Öz detektorumuz: ${Math.round(detected * 100)}% (çəkilməmiş şəkillərdə etibarlı deyil)`,
      );
    steps.push(ai);
    emit({ type: "step", step: ai });
    const pixels = await run("edit", async () => {
      const p = await pixelsPromise;
      const found = [...metadata, ...(p?.signals ?? [])];
      return found.length
        ? { id: "edit", status: "fail", findings: found }
        : { id: "edit", status: "info", findings: ["Dəyişiklik izi tapılmadı"] };
    }).then(() => pixelsPromise);
    return appealTail(a, pixels?.heatmap ?? undefined);
  }

  const isDocument = !reading || reading.kind === "medical_document";
  // Check digits of the official numbers on the page. A number that fails is
  // only reported if a second, independent reading gives the same digits:
  // one misread digit must not become an accusation.
  const suspect = (reading?.kind === "medical_document" ? reading.identifiers : []).filter(
    (i) => i.legible && checkIdentifier(i.kind, i.value) === "invalid",
  );
  const second = suspect.length ? await rereadIdentifiers(plain, report.type) : null;
  const invented = suspect
    .filter((i) => second?.identifiers.some((j) => j.legible && sameId(i.value, j.value)))
    .map((i) => `${ID_LABEL[i.kind]} ${i.value}: yoxlama rəqəmi düz gəlmir, belə nömrə mövcud ola bilməz`);

  // Step 1 for a document weighs three independent sources:
  //   credential  a generator's own mark inside the file (proof)
  //   origin      measured from pixels: camera photo, scan, or rendered (no model)
  //   model       what a vision model sees
  // One source alone is a warning. Two that agree is a failure. A camera
  // origin contradicts the model, so the model's opinion is downgraded.
  // A low-confidence hunch from the model is not a source.
  const modelSays = !!reading?.looksAiGenerated && reading.confidence !== "low";
  const rendered = origin?.origin === "digital";
  const optical = origin?.origin === "camera" || origin?.origin === "scan";
  const measured = origin && origin.origin !== "unknown" ? origin.evidence : [];
  // Our own detector runs on every image, whatever it shows. It was trained on
  // photographs: on screenshots and rendered pages it calls everything
  // generated. So its number is always shown, but it only counts as a source
  // when the picture looks like a photograph — the case the origin check cannot judge.
  const inDomain = optical && detected !== null;
  const detectorSays = inDomain && detected >= 0.9;
  const detectorNote =
    detected === null
      ? []
      : [
          inDomain
            ? `Öz detektorumuz: süni yaradılma ehtimalı ${Math.round(detected * 100)}%`
            : `Öz detektorumuz: ${Math.round(detected * 100)}% (çəkilməmiş şəkillərdə etibarlı deyil)`,
        ];
  const seenByModel = modelSays
    ? [...reading!.tamperSigns.slice(0, 4), "Süni intellektlə yaradılmış kimi görünür"]
    : [];
  // Not a medical document: say so, and still run every local check on it.
  const kindNote = reading && !isDocument ? ["Bu fayl tibbi sənədə və ya elana oxşamır"] : [];
  const step = (status: StepStatus, ...parts: string[][]): Step => ({
    id: "ai",
    status,
    findings: [...kindNote, ...parts.flat()],
  });

  let aiStep: Step;
  if (invented.length)
    // Arithmetic, not opinion: a real institution's number passes its own check digit.
    aiStep = step("fail", invented, detectorNote, seenByModel);
  else if (credentialMark) aiStep = step("fail", [AI_MARK], measured, detectorNote, seenByModel);
  else if (modelSays && rendered) aiStep = step("fail", measured, detectorNote, seenByModel);
  else if (detectorSays && modelSays)
    // Two independent models agree on a picture that looks like a photograph.
    aiStep = step("fail", detectorNote, seenByModel);
  else if (detectorSays) aiStep = step("warn", detectorNote, measured);
  else if (modelSays) aiStep = step("warn", measured, detectorNote, seenByModel);
  else if (rendered && origin!.square) aiStep = step("warn", measured, detectorNote);
  else if (optical)
    // Looking like a photograph proves nothing: image generators now draw the
    // grain, the uneven light and the hand holding the page. No points.
    aiStep = step("info", measured, detectorNote);
  else if (rendered)
    // A clinic's own export looks like this too: worth saying, not worth points.
    aiStep = step("info", measured, detectorNote);
  else if (measured.length || detectorNote.length) aiStep = step("info", measured, detectorNote);
  else if (reading && isDocument) aiStep = step("pass", ["Süni intellekt izi tapılmadı"]);
  else aiStep = step("skip");
  steps.push(aiStep);
  emit({ type: "step", step: aiStep });

  const pixels = await pixelsPromise;
  await run("edit", () => {
    // When the model already called the whole image synthetic, its observations sit in step 1.
    const seen = reading?.kind === "medical_document" && !reading.looksAiGenerated
      ? reading.tamperSigns.slice(0, 4)
      : [];
    // Not a document or an appeal: nothing here is ours to judge.
    if (!isDocument) return { id: "edit", status: "skip", findings: [] };
    const found = [...metadata, ...(pixels?.signals ?? []), ...seen];
    if (found.length) return { id: "edit", status: "fail", findings: found };
    return {
      id: "edit",
      status: isDocument ? "pass" : "skip",
      findings: isDocument ? ["Dəyişiklik izi tapılmadı"] : [],
    };
  });

  const docClaims =
    reading?.kind === "medical_document" && reading.patientName
      ? { patientName: reading.patientName, diagnosis: null, clinic: reading.clinic }
      : null;
  await run("web", () => webStep([], "skip", docClaims));
  await run("mygov", () => mygovStep(known ? campaignOf(known) : null));

  await run("clinic", async () => {
    if (!isDocument) return { id: "clinic", status: "skip", findings: [] };
    const findings: string[] = [];
    if (known) findings.push("Təşkilatçı yükləyib, klinika hələ təsdiqləməyib");
    else {
      findings.push("Bu sənəd reyestrdə yoxdur");
      if (reading?.clinic) {
        const named = storyTokens(reading.clinic);
        const clinics = await db.select().from(schema.clinics);
        const clinic = clinics.find((c) => containment(storyTokens(c.name), named) >= 0.6);
        findings.push(
          clinic ? `${clinic.name} bu sənədi təsdiqləməyib` : "Sənəddəki klinika reyestrdə yoxdur",
        );
      }
    }
    if (!report.hasMetadata) findings.push("Faylın mənşə məlumatı silinib");
    return { id: "clinic", status: "warn", findings };
  });
  await run("report", () => reportStep(known ? campaignOf(known) : null));

  const failed = steps.some((s) => s.status === "fail");
  finish(
    !isDocument
      ? aiStep.status === "fail" || aiStep.status === "warn"
        ? "Şəkil şübhəlidir"
        : "Sənəd tanınmadı"
      : failed
        ? "Sənəd şübhəlidir"
        : "Sənəd təsdiqlənməyib",
    known ? campaignOf(known) : null,
    isDocument ? (pixels?.heatmap ?? undefined) : undefined,
  );
}

const AI_MARK = "Süni intellektlə yaradılma izi";
