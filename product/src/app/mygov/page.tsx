import { notFound, redirect } from "next/navigation";
import { getCampaign } from "@/lib/campaigns";
import { ConsentForm } from "./consent-form";

// MOCK MyGov consent screen. Not the real service; synthetic data only.
export default async function MygovConsent({ searchParams }: PageProps<"/mygov">) {
  const { kampaniya } = await searchParams;
  const row = typeof kampaniya === "string" ? await getCampaign(kampaniya) : null;
  if (!row) notFound();
  const c = row.campaign;
  if (c.status === "rejected" || c.identityVerifiedAt) redirect(`/campaigns/${c.id}`);
  return <ConsentForm campaignId={c.id} campaignTitle={c.title} />;
}
