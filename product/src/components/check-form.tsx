"use client";

import {
  Alert02Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  File01Icon,
  Globe02Icon,
  Hospital01Icon,
  IdentityCardIcon,
  InformationCircleIcon,
  Loading03Icon,
  MinusSignIcon,
  PencilEdit02Icon,
  Robot01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { Mascot, type MascotMood, setMascotMood } from "@/components/mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type { CheckEvent, Report, Step, StepId, StepStatus, Tone } from "@/lib/checker/pipeline";
import { cn } from "@/lib/utils";

type IconData = typeof Alert02Icon;

// Same order as the pipeline runs them.
const STEPS: { id: StepId; label: string; icon: IconData }[] = [
  { id: "ai", label: "Süni intellekt yoxlaması", icon: Robot01Icon },
  { id: "edit", label: "Redaktə izləri", icon: PencilEdit02Icon },
  { id: "web", label: "İnternetdə oxşar paylaşımlar", icon: Globe02Icon },
  { id: "mygov", label: "MyGov (demo)", icon: IdentityCardIcon },
  { id: "clinic", label: "Klinika reyestri", icon: Hospital01Icon },
];

const STATUS: Record<StepStatus, { icon: IconData; chip: string }> = {
  pass: { icon: CheckmarkBadge01Icon, chip: "bg-lime text-lime-foreground" },
  info: { icon: InformationCircleIcon, chip: "bg-secondary text-secondary-foreground" },
  warn: { icon: Alert02Icon, chip: "bg-warning text-warning-foreground" },
  fail: { icon: Cancel01Icon, chip: "bg-destructive-soft text-destructive" },
  skip: { icon: MinusSignIcon, chip: "bg-muted text-muted-foreground" },
};

const TONE: Record<Tone, { chip: string; mood: MascotMood; notify: (m: string) => void }> = {
  ok: { chip: "bg-lime text-lime-foreground", mood: "happy", notify: toast.success },
  neutral: { chip: "bg-secondary text-secondary-foreground", mood: "thinking", notify: toast.message },
  warn: { chip: "bg-warning text-warning-foreground", mood: "alert", notify: toast.warning },
  danger: { chip: "bg-destructive-soft text-destructive", mood: "alert", notify: toast.error },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function CheckForm() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState<StepId | null>(null);
  const [steps, setSteps] = useState<Partial<Record<StepId, Step>>>({});
  const [report, setReport] = useState<Report | null>(null);
  const [started, setStarted] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    return run({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ q }),
    });
  }

  function checkFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const body = new FormData();
    body.set("file", file);
    return run({ method: "POST", body });
  }

  function failed(message: string) {
    setBusy(false);
    setRunning(null);
    setStarted(false);
    setMascotMood("alert");
    toast.error(message);
  }

  async function run(init: RequestInit) {
    setBusy(true);
    setStarted(true);
    setSteps({});
    setReport(null);
    setRunning("ai");

    let res: Response;
    try {
      res = await fetch("/api/check", init);
    } catch {
      return failed("Xəta baş verdi");
    }
    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => null);
      return failed(data?.error ?? "Xəta baş verdi");
    }

    // The server sends one JSON line per pipeline event as each step finishes.
    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line) as CheckEvent;
        if (event.type === "start") setRunning(event.id);
        else if (event.type === "step") {
          // Steps that finish instantly would flash past; let each one be seen.
          await sleep(260);
          setSteps((s) => ({ ...s, [event.step.id]: event.step }));
          setRunning(null);
        } else if (event.type === "done") {
          await sleep(200);
          setReport(event.report);
          setBusy(false);
          setMascotMood(TONE[event.report.tone].mood, 2400);
          TONE[event.report.tone].notify(event.report.title);
        } else return failed(event.message);
      }
    }
    setBusy(false);
    setRunning(null);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <Mascot size={112} listen mood={busy ? "thinking" : "idle"} />
      <h1 className="display text-4xl sm:text-6xl">Elanı yoxla</h1>
      <form onSubmit={submit} className="flex w-full flex-col gap-3">
        <Textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Elan mətni, link, kod və ya kart nömrəsi"
          placeholder="Elan mətni, link, kod və ya kart nömrəsi"
          rows={4}
          spellCheck={false}
          className="rounded-3xl px-5 py-4 text-left text-lg shadow-medium"
        />
        <Button size="lg" disabled={busy || q.trim().length < 4} className="w-full">
          <Icon icon={Search01Icon} size={20} />
          Yoxla
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          onChange={checkFile}
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
          className="w-full"
        >
          <Icon icon={File01Icon} size={20} />
          Şəkil və ya sənəd
        </Button>
      </form>

      {started && (
        <section
          aria-live="polite"
          aria-busy={busy}
          className="w-full animate-in rounded-3xl border bg-card p-6 text-left shadow-strong duration-300 fade-in slide-in-from-bottom-2 sm:p-8"
        >
          {report && (
            <header className="mb-8 animate-in duration-500 fade-in slide-in-from-bottom-1">
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "grid size-20 shrink-0 place-items-center rounded-full",
                    TONE[report.tone].chip,
                  )}
                >
                  <span className="display text-3xl tabular-nums">{report.score}</span>
                </span>
                <h2 className="display text-2xl sm:text-3xl">{report.title}</h2>
              </div>
              <Progress value={report.score} max={100} className="mt-5" />
            </header>
          )}

          <ol className="divide-y border-y">
            {STEPS.map(({ id, label, icon }) => {
              const step = steps[id];
              const active = running === id && !step;
              const mark = step ? STATUS[step.status] : null;
              return (
                <li
                  key={id}
                  className={cn(
                    "py-4 transition-opacity duration-300",
                    !step && !active && "opacity-40",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon icon={icon} size={22} className="shrink-0" />
                    <p className="min-w-0 flex-1 font-semibold">{label}</p>
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full",
                        mark?.chip,
                      )}
                    >
                      {mark ? (
                        <Icon icon={mark.icon} size={18} className="animate-in duration-300 zoom-in-50" />
                      ) : (
                        active && <Icon icon={Loading03Icon} size={20} className="animate-spin" />
                      )}
                    </span>
                  </div>
                  {step && step.findings.length > 0 && (
                    <ul className="mt-2 animate-in space-y-1 pl-[34px] text-foreground/80 duration-300 fade-in">
                      {step.findings.map((f) => (
                        <li key={f} className="break-words">
                          {f.startsWith("http") ? (
                            <a
                              href={f}
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-4"
                            >
                              {new URL(f).hostname}
                            </a>
                          ) : (
                            f
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>

          {report?.heatmap && (
            // A generated data URL: next/image has nothing to optimise here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={report.heatmap}
              alt="Şübhəli hissə qırmızı ilə işarələnib"
              className="mt-6 w-full animate-in rounded-2xl border duration-500 fade-in"
            />
          )}

          {report?.campaign && (
            <Link
              href={`/campaigns/${report.campaign.id}`}
              className="press mt-6 flex animate-in items-center gap-4 rounded-2xl bg-secondary p-4 outline-none duration-500 fade-in focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{report.campaign.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Icon icon={Hospital01Icon} size={16} />
                  <span className="truncate">{report.campaign.clinicName}</span>
                </p>
              </div>
              {report.campaign.code && (
                <Badge className="font-mono">{report.campaign.code}</Badge>
              )}
              <Icon icon={ArrowRight01Icon} size={20} />
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
