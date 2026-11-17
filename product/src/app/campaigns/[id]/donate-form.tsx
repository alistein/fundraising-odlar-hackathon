"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { setMascotMood } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PRESETS = [10, 20, 50, 100];

export function DonateForm({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("20");
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch(`/api/campaigns/${campaignId}/donate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amountAzn: Number(amount), anonymous }),
    });
    setBusy(false);
    if (!res.ok) {
      setMascotMood("alert");
      toast.error((await res.json()).error ?? "Xəta baş verdi");
      return;
    }
    setMascotMood("happy");
    toast.success("İanə reyestrə yazıldı");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(String(p))}
            aria-pressed={amount === String(p)}
            className={cn(
              "press h-11 rounded-full text-sm font-semibold tabular-nums shadow-[inset_0_0_0_1px_var(--input)] outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              amount === String(p)
                ? "bg-lime text-lime-foreground shadow-[inset_0_0_0_2px_var(--primary)]"
                : "hover:bg-secondary",
            )}
          >
            {p} ₼
          </button>
        ))}
      </div>
      <div className="relative">
        <Input
          type="number"
          inputMode="decimal"
          min="1"
          step="0.01"
          required
          aria-label="Məbləğ"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-14 pr-12 text-2xl font-bold tabular-nums"
        />
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl font-bold text-muted-foreground">
          ₼
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <Checkbox id="anon" checked={anonymous} onCheckedChange={(v) => setAnonymous(v === true)} />
        <Label htmlFor="anon">Anonim</Label>
      </div>
      <Button size="lg" disabled={busy} className="w-full">
        İanə et
      </Button>
    </form>
  );
}
