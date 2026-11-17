import { desc } from "drizzle-orm";
import { Mascot } from "@/components/mascot";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db, schema } from "@/db";
import { verifyChain } from "@/lib/ledger";
import { formatAZN } from "@/lib/money";
import { cn } from "@/lib/utils";

export default async function LedgerPage() {
  const [entries, check] = await Promise.all([
    db.select().from(schema.ledgerEntries).orderBy(desc(schema.ledgerEntries.seq)),
    verifyChain(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-4xl sm:text-6xl">Reyestr</h1>
        {check.ok ? (
          <Badge variant="verified" className="h-8 px-3">
            <Mascot size={20} />
            Zəncir bütövdür
          </Badge>
        ) : (
          <Badge variant="destructive" className="h-8 px-3">
            <Mascot mood="alert" size={20} />
            Zəncir pozulub · #{check.brokenAtSeq}
          </Badge>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <Table className="text-base">
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="h-12 w-16 px-5">#</TableHead>
              <TableHead className="px-5">Kimdən</TableHead>
              <TableHead className="px-5 max-sm:hidden">Tarix</TableHead>
              <TableHead className="px-5 max-md:hidden">Heş</TableHead>
              <TableHead className="px-5 text-right">Məbləğ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow
                key={e.seq}
                className={cn(
                  "hover:bg-transparent",
                  !check.ok && e.seq === check.brokenAtSeq && "bg-destructive-soft hover:bg-destructive-soft",
                )}
              >
                <TableCell className="px-5 py-4 text-muted-foreground tabular-nums">{e.seq}</TableCell>
                <TableCell className="px-5 font-semibold">
                  <span className="flex items-center gap-3">
                    <UserAvatar seed={e.label === "Anonim" ? e.hash : e.label} name={e.label} className="size-8" />
                    {e.label}
                  </span>
                </TableCell>
                <TableCell className="px-5 text-muted-foreground max-sm:hidden">
                  {new Date(e.createdAt).toLocaleString("az-AZ", {
                    timeZone: "Asia/Baku",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="px-5 font-mono text-xs text-muted-foreground max-md:hidden">
                  {e.hash.slice(0, 16)}
                </TableCell>
                <TableCell className="px-5 text-right font-bold tabular-nums">
                  {formatAZN(e.amountQepik)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
