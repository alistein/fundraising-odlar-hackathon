import { z } from "zod";
import { detectType } from "@/lib/checker/document";
import { type CheckEvent, type CheckInput, runCheck } from "@/lib/checker/pipeline";

const MAX_BYTES = 5 * 1024 * 1024;
const Text = z.object({ q: z.string().trim().min(4).max(8000) });

const fail = (status: number, error: string) => Response.json({ error }, { status });

// Public: paste an appeal, a link, a code or a card number, or upload a
// screenshot or a document. Nothing uploaded here is stored.
//
// The answer is a stream of JSON lines (CheckEvent), one per pipeline step, so
// the page can show each step as it really finishes.
export async function POST(req: Request) {
  let input: CheckInput;
  if (req.headers.get("content-type")?.includes("multipart/form-data")) {
    const file = (await req.formData()).get("file");
    if (!(file instanceof File)) return fail(400, "Fayl seçilməyib");
    if (file.size > MAX_BYTES) return fail(413, "Fayl 5 MB-dan böyükdür");
    const buf = Buffer.from(await file.arrayBuffer());
    if (!detectType(buf)) return fail(415, "Yalnız PDF, JPG və ya PNG");
    input = { file: buf };
  } else {
    const body = Text.safeParse(await req.json().catch(() => null));
    if (!body.success) return fail(400, "Yanlış məlumat");
    input = { text: body.data.q };
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (e: CheckEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(e)}\n`));
      try {
        await runCheck(input, emit);
      } catch (e) {
        console.error(e);
        emit({ type: "error", message: "Server xətası" });
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}
