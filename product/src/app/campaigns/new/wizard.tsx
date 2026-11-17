"use client";

import {
  Alert02Icon,
  CheckmarkBadge01Icon,
  File01Icon,
  FileUploadIcon,
  IdentityCardIcon,
  Loading03Icon,
  PencilEdit02Icon,
  Robot01Icon,
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
import { NewCampaignForm } from "./new-campaign-form";

type Doc = { id: string; filename: string; checkStatus: string; checkSignals: string[] };
type Gate = { status: "pass" | "warn" | "fail"; signals: string[] };
type Resume = { id: string; title: string; docs: Doc[]; ai: Gate | null } | null;

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
  const fileInput = useRef<HTMLInputElement>(null);

  // 0 details · 1 documents · 2 AI gate · 3 MyGov
  const step = !id ? 0 : gate ? (gate.status === "fail" ? 2 : 3) : checking ? 2 : 1;

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
    const res = await fetch(`/api/campaigns/${id}/ai-gate`, { method: "POST" });
    const data = await res.json().catch(() => null);
    setChecking(false);
    if (!res.ok) {
      setMascotMood("alert");
      toast.error(data?.error ?? "Xəta baş verdi");
      return;
    }
    setGate(data);
    if (data.status === "fail") {
      setMascotMood("alert");
      toast.error("AI yoxlamasından keçmədi");
    } else {
      setMascotMood("happy");
      toast.success("AI yoxlamasından keçdi");
    }
  }

  return (
    <div className="space-y-8">
      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li key={s.label} className="flex flex-col items-center gap-2 text-center">
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

      {checking && (
        <section className="flex flex-col items-center gap-4 py-10">
          <Mascot size={96} mood="thinking" />
          <p className="text-lg font-semibold">AI yoxlayır</p>
        </section>
      )}

      {gate && (
        <section
          className={cn(
            "animate-in space-y-5 rounded-3xl border bg-card p-6 shadow-strong duration-300 fade-in slide-in-from-bottom-2",
          )}
        >
          <div className="flex items-center gap-4">
            <Mascot
              size={72}
              tone={gate.status === "fail" ? "danger" : gate.status === "warn" ? "warning" : "safe"}
              mood={gate.status === "fail" ? "alert" : gate.status === "warn" ? "thinking" : "happy"}
            />
            <h2 className="display text-2xl sm:text-3xl">
              {gate.status === "fail" ? "AI yoxlamasından keçmədi" : "AI yoxlamasından keçdi"}
            </h2>
          </div>
          <ul className="space-y-1 text-foreground/80">
            {gate.signals.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {gate.status !== "fail" && id && (
            <Button asChild size="lg" className="w-full">
              <Link href={`/mygov?kampaniya=${id}`}>
                <Icon icon={IdentityCardIcon} size={20} />
                MyGov ilə təsdiqlə
              </Link>
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
