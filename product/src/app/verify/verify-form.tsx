"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { Mascot, setMascotMood } from "@/components/mascot";
import { Button } from "@/components/ui/button";

// TODO (Sprint III): show the verdict returned by POST /api/verify.
export function VerifyForm() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ q }),
    });
    if (!res.ok) {
      setMascotMood("alert");
      toast.error((await res.json()).error ?? "Xəta baş verdi");
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <Mascot size={112} listen mood={focused && q ? "thinking" : "idle"} />
      <h1 className="display text-4xl sm:text-6xl">Kampaniyanı yoxla</h1>
      <form
        onSubmit={submit}
        className="flex h-16 w-full items-center gap-2 rounded-full border border-input bg-background pr-2 pl-5 shadow-medium transition-[border-color,box-shadow] duration-150 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20"
      >
        <Icon icon={Search01Icon} size={22} className="shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Link və ya kart nömrəsi"
          placeholder="Link və ya kart nömrəsi"
          className="h-full min-w-0 flex-1 bg-transparent text-left text-lg outline-none placeholder:text-muted-foreground"
        />
        <Button size="lg" disabled={!q.trim()}>
          Yoxla
        </Button>
      </form>
    </div>
  );
}
