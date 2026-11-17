// TODO (Sprint III): "verify this campaign" — clone detection.
// Plan: accept a pasted link or card number -> exact match on our campaign URLs
// -> pg_trgm similarity on title/story to spot copies with a swapped card.
export async function POST() {
  return Response.json({ error: "Hələ hazır deyil" }, { status: 501 });
}
