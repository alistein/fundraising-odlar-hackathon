"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { setMascotMood } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function NewCampaignForm({ clinics }: { clinics: { id: string; name: string }[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [clinicId, setClinicId] = useState(clinics[0]?.id ?? "");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: f.get("title"),
        story: f.get("story"),
        patientName: f.get("patientName"),
        relation: f.get("relation"),
        diagnosis: f.get("diagnosis"),
        targetAzn: Number(f.get("targetAzn")),
        clinicId,
        declaredCard: f.get("declaredCard") || undefined,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMascotMood("alert");
      toast.error(data.error ?? "Xəta baş verdi");
      return;
    }
    setMascotMood("happy");
    toast.success("Klinikaya göndərildi");
    router.push(`/campaigns/${data.campaign.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Başlıq" id="title">
        <Input id="title" name="title" required minLength={3} />
      </Field>
      <Field label="Hekayə" id="story">
        <Textarea id="story" name="story" required minLength={10} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Xəstə" id="patientName">
          <Input id="patientName" name="patientName" required />
        </Field>
        <Field label="Qohumluq" id="relation">
          <Input id="relation" name="relation" required />
        </Field>
      </div>
      <Field label="Diaqnoz" id="diagnosis">
        <Input id="diagnosis" name="diagnosis" required />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Məbləğ, ₼" id="targetAzn">
          <Input id="targetAzn" name="targetAzn" type="number" inputMode="decimal" min="1" required />
        </Field>
        <Field label="Klinika" id="clinic">
          <Select value={clinicId} onValueChange={setClinicId}>
            <SelectTrigger id="clinic" className="h-12! w-full rounded-xl px-4 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {clinics.map((c) => (
                <SelectItem key={c.id} value={c.id} className="rounded-lg py-2">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Kart nömrəsi" id="declaredCard">
        <Input
          id="declaredCard"
          name="declaredCard"
          inputMode="numeric"
          autoComplete="off"
          pattern="[0-9 ]{16,19}"
          placeholder="0000 0000 0000 0000"
        />
      </Field>
      <Button size="lg" disabled={busy} className="mt-3 w-full">
        Təsdiqə göndər
      </Button>
    </form>
  );
}
