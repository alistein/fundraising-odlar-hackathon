"use client";

import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Copy01Icon,
  File01Icon,
  FileUploadIcon,
  IdentityCardIcon,
  Loading03Icon,
  MinusSignIcon,
  PencilEdit02Icon,
  Robot01Icon,
  SearchList01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { Mascot, setMascotMood } from "@/components/mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GateStepId } from "@/lib/gate";
import { NewCampaignForm } from "./new-campaign-form";

type Doc = { id: string; filename: string; checkStatus: string; checkSignals: string[] };
type GateStep = { id: GateStepId; status: "pass" | "warn" | "fail" | "skip"; findings: string[] };
type Gate = { status: "pass" | "warn" | "fail"; steps: GateStep[] };
type Resume = { id: string; title: string; docs: Doc[]; ai: Gate | null } | null;

// The AI gate's checks, in the order they run (same idea as the link checker's steps).
const GATE_STEPS: { id: GateStepId; label: string; icon: typeof File01Icon }[] = [
  { id: "docs", label: "Tibbi sənədlər", icon: File01Icon },
  { id: "forgery", label: "Sənəd saxtakarlığı", icon: SearchList01Icon },
  { id: "clone", label: "Hekayənin təkrarı", icon: Copy01Icon },
  { id: "story", label: "Hekayənin AI oxunuşu", icon: Robot01Icon },
];

const MARK = {
  pass: { icon: CheckmarkBadge01Icon, chip: "bg-lime text-lime-foreground" },
  warn: { icon: Alert02Icon, chip: "bg-warning text-warning-foreground" },
  fail: { icon: Cancel01Icon, chip: "bg-destructive-soft text-destructive" },
  skip: { icon: MinusSignIcon, chip: "bg-muted text-muted-foreground" },
} as const;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STEPS = [
  { label: "Məlumat", icon: PencilEdit02Icon },
  { label: "Sənədlər", icon: File01Icon },
  { label: "AI yoxlaması", icon: Robot01Icon },
  { label: "MyGov", icon: IdentityCardIcon },
];

export function CampaignWizard({
  clinics,
  resume,
}: {
  clinics: { id: string; name: string }[];
  resume: Resume;
}) {
  const router = useRouter();
  const [id, setId] = useState(resume?.id ?? null);
  const [docs, setDocs] = useState<Doc[]>(resume?.docs ?? []);
  const [gate, setGate] = useState<Gate | null>(resume?.ai ?? null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  // How many gate steps are on screen; they appear one by one after a run.
  const [shown, setShown] = useState(resume?.ai?.steps.length ?? 0);
  const fileInput = useRef<HTMLInputElement>(null);

  // 0 details · 1 documents · 2 AI gate · 3 MyGov
  const step = !id ? 0 : checking ? 2 : gate ? 3 : 1;

  function created(newId: string) {
    setId(newId);
    // Keep the campaign in the URL so a reload resumes here.
    router.replace(`/campaigns/new?kampaniya=${newId}`, { scroll: false });
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !id) return;
    setBusy(true);
    const body = new FormData();
    body.set("file", file);
    const res = await fetch(`/api/campaigns/${id}/documents`, { method: "POST", body });
    const data = await res.json().catch(() => null);
    setBusy(false);
    if (!res.ok) {
      setMascotMood("alert");
      toast.error(data?.error ?? "Xəta baş verdi");
      return;
    }
    setDocs((d) => [...d, data.document]);
    if (data.document.checkStatus === "flagged") {
      setMascotMood("alert");
      toast.error("Sənəd şübhəlidir");
    } else {
      setMascotMood("happy");
      toast.success("Sənəd yükləndi və şifrələndi");
    }
  }

  async function runGate() {
    if (!id) return;
    setChecking(true);
    setShown(0);
    const res = await fetch(`/api/campaigns/${id}/ai-gate`, { method: "POST" });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setChecking(false);
      setMascotMood("alert");
      toast.error(data?.error ?? "Xəta baş verdi");
      return;
    }
    setGate(data);
    // Reveal each check in turn so the organiser can follow what was looked at.
    for (let i = 1; i <= data.steps.length; i++) {
      await sleep(450);
      setShown(i);
    }
    setChecking(false);
    if (data.status === "fail") {
      setMascotMood("alert");
      toast.error("AI yoxlamasında problem tapıldı");
    } else {
      setMascotMood("happy");
      toast.success("AI yoxlamasından keçdi");
    }
  }

  return (
    <div className="space-y-8">
      <ol className="grid grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.label} className="relative flex flex-col items-center gap-2 text-center">
            {i > 0 && (
              // Connector from the previous step's circle to this one; fills as steps complete.
              <span
                aria-hidden
                className="absolute top-[22px] right-[calc(50%+30px)] left-[calc(-50%+30px)] h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-border"
              >
                <span
                  className={cn(
                    "block h-full origin-left bg-primary transition-transform duration-500 ease-(--ease-default) motion-reduce:transition-none",
                    i <= step ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            )}
            <span
              className={cn(
                "grid size-11 place-items-center rounded-full border transition-[background-color,color,border-color] duration-300",
                i < step && "border-transparent bg-lime text-lime-foreground",
                i === step && "border-primary bg-primary text-primary-foreground",
                i > step && "bg-card text-muted-foreground",
              )}
            >
              <Icon icon={i < step ? CheckmarkBadge01Icon : s.icon} size={20} />
            </span>
            <span className={cn("text-sm font-semibold", i > step && "text-muted-foreground")}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && <NewCampaignForm clinics={clinics} onCreated={created} />}

      {step === 1 && (
        <section className="animate-in space-y-5 duration-300 fade-in slide-in-from-bottom-2">
          {docs.length > 0 && (
            <ul className="space-y-3">
              {docs.map((d) => (
                <li key={d.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <Icon icon={File01Icon} size={20} />
                    <p className="min-w-0 flex-1 truncate font-semibold">{d.filename}</p>
                    <Badge variant={d.checkStatus === "flagged" ? "destructive" : "verified"}>
                      <Icon icon={d.checkStatus === "flagged" ? Alert02Icon : CheckmarkBadge01Icon} />
                      {d.checkStatus === "flagged" ? "Şübhəli" : "Təmiz"}
                    </Badge>
                  </div>
                  {d.checkSignals.length > 0 && (
                    <ul className="mt-3 space-y-1 text-destructive">
                      {d.checkSignals.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            onChange={upload}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
          />
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
            className="w-full border-2 border-primary text-primary"
          >
            <Icon icon={busy ? Loading03Icon : FileUploadIcon} size={20} className={cn(busy && "animate-spin")} />
            Tibbi sənəd yüklə
          </Button>
          <Button size="lg" disabled={busy || checking || docs.length === 0} onClick={runGate} className="w-full">
            <Icon icon={Robot01Icon} size={20} />
            AI yoxlamasına göndər
          </Button>
        </section>
      )}

      {(checking || gate) && (
        <section className="animate-in space-y-6 rounded-3xl border bg-card p-6 shadow-strong duration-300 fade-in slide-in-from-bottom-2 sm:p-8">
          <div className="flex items-center gap-4">
            <Mascot
              size={72}
              tone={!gate || checking ? "safe" : gate.status === "fail" ? "danger" : gate.status === "warn" ? "warning" : "safe"}
              mood={!gate || checking ? "thinking" : gate.status === "fail" ? "alert" : gate.status === "warn" ? "thinking" : "happy"}
            />
            <h2 className="display text-2xl sm:text-3xl">
              {!gate || checking
                ? "AI yoxlayır"
                : gate.status === "fail"
                  ? "Problem tapıldı"
                  : "AI yoxlamasından keçdi"}
            </h2>
          </div>

          <ol className="divide-y border-y">
            {GATE_STEPS.map(({ id: stepId, label, icon }, i) => {
              const result = i < shown ? gate?.steps.find((x) => x.id === stepId) : undefined;
              const active = checking && i === shown;
              const mark = result ? MARK[result.status] : null;
              return (
                <li
                  key={stepId}
                  className={cn("py-4 transition-opacity duration-300", !result && !active && "opacity-40")}
                >
                  <div className="flex items-center gap-3">
                    <Icon icon={icon} size={22} className="shrink-0" />
                    <p className="min-w-0 flex-1 font-semibold">{label}</p>
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", mark?.chip)}>
                      {mark ? (
                        <Icon icon={mark.icon} size={18} className="animate-in duration-300 zoom-in-50" />
                      ) : (
                        active && <Icon icon={Loading03Icon} size={20} className="animate-spin" />
                      )}
                    </span>
                  </div>
                  {result && result.findings.length > 0 && (
                    <ul
                      className={cn(
                        "mt-2 animate-in space-y-1 pl-[34px] duration-300 fade-in",
                        result.status === "fail" ? "text-destructive" : "text-foreground/80",
                      )}
                    >
                      {result.findings.map((f) => (
                        <li key={f} className="break-words">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>

          {gate && !checking && id && (
            <Button
              asChild
              size="lg"
              variant={gate.status === "fail" ? "outline" : "default"}
              className={cn("w-full animate-in duration-300 fade-in", gate.status === "fail" && "border-2 border-primary text-primary")}
            >
              <Link href={`/mygov?kampaniya=${id}`}>
                <Icon icon={IdentityCardIcon} size={20} />
                MyGov ilə davam et
              </Link>
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
