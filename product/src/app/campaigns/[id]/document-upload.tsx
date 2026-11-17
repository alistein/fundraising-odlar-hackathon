"use client";

import { FileUploadIcon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { setMascotMood } from "@/components/mascot";
import { Button } from "@/components/ui/button";

export function DocumentUpload({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    const body = new FormData();
    body.set("file", file);
    const res = await fetch(`/api/campaigns/${campaignId}/documents`, { method: "POST", body });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMascotMood("alert");
      toast.error(data.error ?? "Xəta baş verdi");
      return;
    }
    if (data.document.checkStatus === "flagged") {
      setMascotMood("alert");
      toast.error("Sənəd şübhəlidir");
    } else {
      setMascotMood("happy");
      toast.success("Sənəd yoxlanıldı və şifrələndi");
    }
    router.refresh();
  }

  return (
    <>
      <input
        ref={input}
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
        onClick={() => input.current?.click()}
        className="w-full"
      >
        <Icon icon={FileUploadIcon} size={20} />
        Sənəd əlavə et
      </Button>
    </>
  );
}
