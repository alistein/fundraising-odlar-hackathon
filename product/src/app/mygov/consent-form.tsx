"use client";

import {
  Cancel01Icon,
  CheckmarkBadge01Icon,
  IdentityCardIcon,
  Loading03Icon,
  LockKeyIcon,
  SentIcon,
  ShieldKeyIcon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { Mascot, setMascotMood } from "@/components/mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// SIMULATED MyGov exchange: the steps imitate what a real integration would do.
// Only the last one calls our server; nothing goes to MyGov.
const STEPS = [
  { label: "MyGov ilə təhlükəsiz bağlantı", icon: ShieldKeyIcon },
  { label: "Şəxsiyyət vəsiqəsi axtarılır", icon: IdentityCardIcon },
  { label: "Ad və soyad yoxlanılır", icon: UserCheck01Icon },
  { label: "Təsdiq Safefund-a göndərilir", icon: SentIcon },
];

type StepState = { status: "done" | "fail"; finding: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ConsentForm({ campaignId, campaignTitle }: { campaignId: string; campaignTitle: string }) {
  const router = useRouter();
  const [fin, setFin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<StepState[]>([]);
  const [success, setSuccess] = useState<{ live: boolean } | null>(null);

  const ready = !!fin.trim() && !!firstName.trim() && !!lastName.trim();
  const finTail = fin.trim().slice(-2);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setRunning(true);
    setResults([]);
    const done = (finding: string) =>
      setResults((r) => [...r, { status: "done", finding }]);

    await sleep(700);
    done("Bağlantı quruldu");
    await sleep(900);
    done(`Şəxsiyyət vəsiqəsi tapıldı · FIN •••••${finTail}`);
    await sleep(800);
    done(`${firstName.trim()} ${lastName.trim()} · uyğundur`);

    const [res] = await Promise.all([
      fetch(`/api/campaigns/${campaignId}/identity`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fin, firstName, lastName }),
      }),
      sleep(700),
    ]);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setResults((r) => [...r, { status: "fail", finding: data?.issues?.[0]?.message ?? data?.error ?? "Xəta baş verdi" }]);
      setRunning(false);
      setMascotMood("alert");
      toast.error(data?.issues?.[0]?.message ?? data?.error ?? "Xəta baş verdi");
      return;
    }
    done("Təsdiq qəbul edildi");
    await sleep(300);
    setRunning(false);
    setMascotMood("happy");
    toast.success("MyGov tərəfindən təsdiqləndi");
    setSuccess({ live: !!data?.live });
  }

  function finish() {
    router.push(`/campaigns/${campaignId}`);
    router.refresh();
  }

  const started = running || results.length > 0;

  return (
    <div className="mx-auto max-w-md pt-4 sm:pt-10">
      <form onSubmit={submit} className="space-y-6 rounded-3xl border bg-card p-6 shadow-strong sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-lg font-bold">
            <Icon icon={IdentityCardIcon} size={24} />
            MyGov
          </span>
          <Badge variant="pending">demo</Badge>
        </div>
        <h1 className="display text-2xl sm:text-3xl">{campaignTitle}</h1>

        {!started ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="fin">FIN</Label>
              <Input
                id="fin"
                value={fin}
                onChange={(e) => setFin(e.target.value.toUpperCase())}
                autoComplete="off"
                spellCheck={false}
                className="h-12 font-mono text-lg tracking-widest uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first">Ad</Label>
                <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last">Soyad</Label>
                <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button size="lg" disabled={!ready}>
                <Icon icon={LockKeyIcon} size={20} />
                Razıyam, təsdiqlə
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href={`/campaigns/${campaignId}`}>İmtina</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <ol className="divide-y border-y" aria-live="polite">
              {STEPS.map((s, i) => {
                const r = results[i];
                const active = running && i === results.length;
                return (
                  <li
                    key={s.label}
                    className={cn("py-4 transition-opacity duration-300", !r && !active && "opacity-40")}
                  >
                    <div className="flex items-center gap-3">
                      <Icon icon={s.icon} size={22} className="shrink-0" />
                      <p className="min-w-0 flex-1 font-semibold">{s.label}</p>
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full",
                          r?.status === "done" && "bg-lime text-lime-foreground",
                          r?.status === "fail" && "bg-destructive-soft text-destructive",
                        )}
                      >
                        {r ? (
                          <Icon
                            icon={r.status === "done" ? CheckmarkBadge01Icon : Cancel01Icon}
                            size={18}
                            className="animate-in duration-300 zoom-in-50"
                          />
                        ) : (
                          active && <Icon icon={Loading03Icon} size={20} className="animate-spin" />
                        )}
                      </span>
                    </div>
                    {r && (
                      <p
                        className={cn(
                          "mt-1 animate-in pl-[34px] duration-300 fade-in",
                          r.status === "fail" ? "text-destructive" : "text-foreground/80",
                        )}
                      >
                        {r.finding}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
            {!running && results.some((r) => r.status === "fail") && (
              <Button type="button" size="lg" className="w-full" onClick={() => setResults([])}>
                Yenidən cəhd et
              </Button>
            )}
          </>
        )}
      </form>

      <Dialog open={!!success} onOpenChange={(open) => !open && finish()}>
        <DialogContent className="items-center text-center sm:max-w-md">
          <div className="flex flex-col items-center gap-4 pt-2">
            <Mascot size={96} mood="happy" />
            <DialogTitle className="display text-2xl sm:text-3xl">MyGov tərəfindən təsdiqləndi</DialogTitle>
            <p className="text-base text-foreground/80">{campaignTitle}</p>
            <Badge variant={success?.live ? "verified" : "pending"}>
              <Icon icon={success?.live ? CheckmarkBadge01Icon : Loading03Icon} size={14} />
              {success?.live ? "Kampaniya canlıdır" : "AI nəticəsi yoxlanılır"}
            </Badge>
          </div>
          <Button size="lg" className="mt-2 w-full" onClick={finish}>
            Kampaniyaya keç
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
