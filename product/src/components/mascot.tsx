"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import "@/styles/mascot.css";

export type MascotMood = "idle" | "happy" | "thinking" | "alert";
/** Face colour. Brand lime everywhere except a check result. */
export type MascotTone = "safe" | "warning" | "danger";

const EVENT = "safefund:mood";

/** Make every listening mascot react for a moment, e.g. after a donation. */
export function setMascotMood(mood: MascotMood, ms = 1600) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { mood, ms } }));
}

// Geometry matches brand/logo/kit/safefund-mascot.svg (256 grid).
const OUTER =
  "M128 26C176 26 214 40 220 62C228 92 226 150 204 186C186 214 158 232 128 232C98 232 70 214 52 186C30 150 28 92 36 62C42 40 80 26 128 26Z";
const INNER =
  "M128 38C84 38 52 50 47 66C40 93 42 146 62 179C78 205 102 220 128 220C154 220 178 205 194 179C214 146 216 93 209 66C204 50 172 38 128 38Z";
const SMILE = "M106 160A22 22 0 0 0 150 160A6 6 0 0 0 138 160A10 10 0 0 1 118 160A6 6 0 0 0 106 160Z";
const BIG_SMILE = "M102 156A26 26 0 0 0 154 156A6.5 6.5 0 0 0 141 156A13 13 0 0 1 115 156A6.5 6.5 0 0 0 102 156Z";
// Closed, smiling eyes: two arches
const HAPPY_EYES =
  "M83 128A13 13 0 0 1 109 128A3.5 3.5 0 0 1 102 128A6 6 0 0 0 90 128A3.5 3.5 0 0 1 83 128Z" +
  "M147 128A13 13 0 0 1 173 128A3.5 3.5 0 0 1 166 128A6 6 0 0 0 154 128A3.5 3.5 0 0 1 147 128Z";

export function Mascot({
  mood = "idle",
  size = 32,
  listen = false,
  tone = "safe",
  gaze,
  className,
}: {
  mood?: MascotMood;
  size?: number;
  /** React to setMascotMood() calls anywhere on the page. */
  listen?: boolean;
  tone?: MascotTone;
  /** Where the eyes look, each axis -1…1 (e.g. following a caret). Ignored while thinking. */
  gaze?: { x: number; y: number } | null;
  className?: string;
}) {
  const [override, setOverride] = useState<MascotMood | null>(null);

  useEffect(() => {
    if (!listen) return;
    let timer: ReturnType<typeof setTimeout>;
    const onMood = (e: Event) => {
      const { mood, ms } = (e as CustomEvent<{ mood: MascotMood; ms: number }>).detail;
      setOverride(mood);
      clearTimeout(timer);
      timer = setTimeout(() => setOverride(null), ms);
    };
    window.addEventListener(EVENT, onMood);
    return () => {
      window.removeEventListener(EVENT, onMood);
      clearTimeout(timer);
    };
  }, [listen]);

  const current = override ?? mood;

  return (
    <svg
      viewBox="24 20 208 218"
      width={size}
      height={size}
      aria-hidden
      data-mood={current}
      data-tone={tone}
      // key restarts the one-shot hop/shake each time the mood changes
      key={current}
      className={cn("mascot shrink-0", className)}
    >
      <g className="m-body">
        <path d={OUTER} fill="var(--mascot-face)" />
        <path className="m-tone m-tone-warning" d={OUTER} fill="var(--mascot-face-warning)" />
        <path className="m-tone m-tone-danger" d={OUTER} fill="var(--mascot-face-danger)" />
        <path d={OUTER + INNER} fill="var(--mascot-ink)" fillRule="evenodd" />
        <g className="m-cheeks">
          {(["", "-warning", "-danger"] as const).map((t) => (
            <g key={t} className={t && `m-tone m-tone${t}`} fill={`var(--mascot-cheek${t})`}>
              <ellipse cx="78" cy="152" rx="16" ry="9" />
              <ellipse cx="178" cy="152" rx="16" ry="9" />
            </g>
          ))}
        </g>
        <g
          className="m-look"
          style={
            gaze && current !== "thinking"
              ? { transform: `translate(${gaze.x * 11}px, ${gaze.y * 7}px)` }
              : undefined
          }
        >
          <g className="m-eyes-open">
            <g className="m-blink" fill="var(--mascot-ink)">
              <circle cx="96" cy="124" r="13" />
              <circle cx="160" cy="124" r="13" />
            </g>
            <g className="m-shine" fill="var(--mascot-shine)">
              <circle cx="100" cy="119" r="4" />
              <circle cx="164" cy="119" r="4" />
            </g>
          </g>
        </g>
        <path className="m-eyes-happy" d={HAPPY_EYES} fill="var(--mascot-ink)" />
        <g fill="var(--mascot-ink)">
          <path className="m-mouth m-mouth-smile" d={SMILE} />
          <path className="m-mouth m-mouth-big" d={BIG_SMILE} />
          <rect className="m-mouth m-mouth-flat" x="115" y="158" width="26" height="8" rx="4" />
          <ellipse className="m-mouth m-mouth-o" cx="128" cy="166" rx="9" ry="11" />
        </g>
      </g>
    </svg>
  );
}
