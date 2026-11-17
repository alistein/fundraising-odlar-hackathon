// Our own AI-image detector: a model we host ourselves (product/detector).
// No third party sees the image. Returns the probability that a photograph was
// generated, or null when the service is not running.
//
// Only meaningful for pictures that look like photographs — see the note in
// detector/server.py. Off unless DETECTOR_URL is set.

export async function detectGenerated(image: Buffer): Promise<number | null> {
  const url = process.env.DETECTOR_URL;
  if (!url) return null;
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/detect`, {
      method: "POST",
      body: new Uint8Array(image),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const { ai } = (await res.json()) as { ai?: number };
    return typeof ai === "number" && ai >= 0 && ai <= 1 ? ai : null;
  } catch {
    return null;
  }
}
