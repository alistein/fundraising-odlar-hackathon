"use client";

import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { setMascotMood } from "@/components/mascot";
import { Button } from "@/components/ui/button";

export function DocumentConfirm({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    const res = await fetch(`/api/documents/${documentId}/confirm`, { method: "POST" });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMascotMood("alert");
      toast.error(data.error ?? "Xəta baş verdi");
      return;
    }
    setMascotMood("happy");
    toast.success(`Sənəd təsdiqləndi: ${data.document.code}`);
    router.refresh();
  }

  return (
    <Button type="button" size="sm" disabled={busy} onClick={confirm}>
      <Icon icon={CheckmarkBadge01Icon} size={16} />
      Təsdiqlə
    </Button>
  );
}
