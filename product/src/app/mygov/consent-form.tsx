"use client";

import { IdentityCardIcon, LockKeyIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { setMascotMood } from "@/components/mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ConsentForm({ campaignId, campaignTitle }: { campaignId: string; campaignTitle: string }) {
  const router = useRouter();
  const [fin, setFin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch(`/api/campaigns/${campaignId}/identity`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fin, firstName, lastName }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMascotMood("alert");
      toast.error(data?.issues?.[0]?.message ?? data?.error ?? "Xəta baş verdi");
      return;
    }
    setMascotMood("happy");
    toast.success("Şəxsiyyət MyGov ilə təsdiqləndi");
    router.push(`/campaigns/${campaignId}`);
    router.refresh();
  }

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
          <Button size="lg" disabled={busy || !fin.trim() || !firstName.trim() || !lastName.trim()}>
            <Icon icon={LockKeyIcon} size={20} />
            Razıyam, təsdiqlə
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href={`/campaigns/${campaignId}`}>İmtina</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
