"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { setMascotMood } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ConfirmForm({
  campaignId,
  defaultCostAzn,
}: {
  campaignId: string;
  defaultCostAzn: number;
}) {
  const router = useRouter();
  const [cost, setCost] = useState(String(defaultCostAzn));
  const [busy, setBusy] = useState(false);

  async function decide(decision: "confirm" | "reject") {
    setBusy(true);
    const res = await fetch(`/api/campaigns/${campaignId}/confirm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        decision === "confirm" ? { decision, confirmedCostAzn: Number(cost) } : { decision },
      ),
    });
    setBusy(false);
    if (!res.ok) {
      setMascotMood("alert");
      toast.error((await res.json()).error ?? "Xəta baş verdi");
      return;
    }
    setMascotMood(decision === "confirm" ? "happy" : "alert");
    toast.success(decision === "confirm" ? "Təsdiqləndi" : "Rədd edildi");
    router.refresh();
  }

  return (
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <div className="min-w-40 flex-1 space-y-2">
        <Label htmlFor={`cost-${campaignId}`}>Müalicə xərci, ₼</Label>
        <Input
          id={`cost-${campaignId}`}
          type="number"
          inputMode="decimal"
          min="1"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="font-semibold tabular-nums"
        />
      </div>
      <Button size="lg" disabled={busy} onClick={() => decide("confirm")}>
        Təsdiqlə
      </Button>
      <Button size="lg" variant="destructive" disabled={busy} onClick={() => decide("reject")}>
        Rədd et
      </Button>
    </div>
  );
}
