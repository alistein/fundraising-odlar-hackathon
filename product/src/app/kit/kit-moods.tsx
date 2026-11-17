"use client";

import { useState } from "react";
import { Mascot, type MascotMood } from "@/components/mascot";
import { cn } from "@/lib/utils";

const MOODS: [MascotMood, string][] = [
  ["idle", "idle"],
  ["thinking", "thinking"],
  ["happy", "happy"],
  ["alert", "alert"],
];

export function KitMoods() {
  // Bumping the key replays one-shot animations (hop, shake) on click.
  const [plays, setPlays] = useState<Record<string, number>>({});

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {MOODS.map(([mood, label]) => (
        <button
          key={mood}
          onClick={() => setPlays((p) => ({ ...p, [mood]: (p[mood] ?? 0) + 1 }))}
          className={cn(
            "press flex flex-col items-center gap-5 rounded-2xl border bg-card pt-10 pb-6 outline-none hover:shadow-strong focus-visible:ring-3 focus-visible:ring-ring/40",
          )}
        >
          <Mascot key={plays[mood] ?? 0} mood={mood} size={112} />
          <span className="font-mono text-sm text-muted-foreground">{label}</span>
        </button>
      ))}
    </section>
  );
}
