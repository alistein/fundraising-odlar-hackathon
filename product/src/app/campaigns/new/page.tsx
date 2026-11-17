import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { NewCampaignForm } from "./new-campaign-form";

export default async function NewCampaignPage() {
  const user = await getSession();
  if (user?.role !== "organiser")
    return <p className="text-muted-foreground">Təşkilatçı rolunu seçin.</p>;

  const clinics = await db
    .select({ id: schema.clinics.id, name: schema.clinics.name })
    .from(schema.clinics);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <h1 className="display text-4xl">Kampaniya yarat</h1>
      <NewCampaignForm clinics={clinics} />
    </div>
  );
}
