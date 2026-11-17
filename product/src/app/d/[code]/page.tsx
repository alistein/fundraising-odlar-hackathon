import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { findDocumentByCode, fingerprint } from "@/lib/documents";

// Public proof page for one clinic-confirmed document. This is where the QR
// code printed on a post or an invoice leads.
export default async function DocumentProofPage({ params }: PageProps<"/d/[code]">) {
  const { code } = await params;
  const doc = await findDocumentByCode(code.toUpperCase());
  if (!doc) notFound();

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  // The library draws in black on white; hand colour over to the design tokens.
  const qr = (await QRCode.toString(`${origin}/d/${doc.code}`, { type: "svg", margin: 0 }))
    .replace(/<path fill="#ffffff"[^>]*\/>/, "")
    .replace(/stroke="#000000"/, 'stroke="currentColor"');

  const facts: [string, React.ReactNode][] = [
    ["Klinika", doc.clinicName],
    [
      "Kampaniya",
      <Link key="c" href={`/campaigns/${doc.campaignId}`} className="underline underline-offset-4">
        {doc.campaignTitle}
      </Link>,
    ],
    ["Təsdiq tarixi", doc.confirmedAt!.toLocaleDateString("az-AZ")],
    ["Barmaq izi", <span key="f" className="font-mono">{fingerprint(doc.sha256)}</span>],
  ];

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center gap-2">
        <Badge variant="verified">
          <Icon icon={CheckmarkBadge01Icon} />
          Klinika təsdiqləyib
        </Badge>
        <Badge className="font-mono">{doc.code}</Badge>
      </div>
      <h1 className="display mt-4 text-3xl sm:text-5xl">Təsdiqlənmiş sənəd</h1>

      <dl className="mt-10 divide-y border-y">
        {facts.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-6 py-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <div
        role="img"
        aria-label={`QR kod: ${doc.code}`}
        className="mx-auto mt-10 size-48 text-primary"
        dangerouslySetInnerHTML={{ __html: qr }}
      />
    </div>
  );
}
