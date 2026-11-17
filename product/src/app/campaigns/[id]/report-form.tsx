"use client";

import { Flag02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { setMascotMood } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReportForm({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch(`/api/campaigns/${campaignId}/report`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ clinicName, email, reason }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMascotMood("alert");
      toast.error(data?.issues?.[0]?.message ?? data?.error ?? "Xəta baş verdi");
      return;
    }
    setMascotMood("happy");
    toast.success("Bildiriş göndərildi, e-poçtunuza yazacağıq");
    setOpen(false);
    setClinicName("");
    setEmail("");
    setReason("");
    router.refresh();
  }

  if (!open)
    return (
      <Button variant="ghost" size="lg" className="w-full text-destructive" onClick={() => setOpen(true)}>
        <Icon icon={Flag02Icon} size={20} />
        Klinika olaraq bildir
      </Button>
    );

  return (
    <form
      onSubmit={submit}
      className="animate-in space-y-4 rounded-2xl border p-4 duration-300 fade-in slide-in-from-bottom-1"
    >
      <div className="space-y-2">
        <Label htmlFor="r-clinic">Klinika</Label>
        <Input id="r-clinic" value={clinicName} onChange={(e) => setClinicName(e.target.value)} className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="r-email">Klinikanın e-poçtu</Label>
        <Input
          id="r-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="r-reason">Səbəb</Label>
        <Textarea id="r-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
          Ləğv et
        </Button>
        <Button variant="destructive" className="flex-1" disabled={busy}>
          Bildir
        </Button>
      </div>
    </form>
  );
}
