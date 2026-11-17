import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import Link from "next/link";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { UserMenu } from "@/components/user-menu";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import "./globals.css";

// Brand face: warm, rounded humanist sans (open-licence stand-in for GoFundMe Sans).
// latin-ext covers Azerbaijani letters (ə, ğ, ı, ş, ç, ö, ü).
const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Safefund",
  description: "Klinika tərəfindən təsdiqlənmiş tibbi ianə kampaniyaları",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [user, users] = await Promise.all([
    getSession(),
    db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users),
  ]);

  return (
    <html lang="az" className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="material sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl backdrop-saturate-150">
          <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
            <nav className="flex items-center gap-1">
              <Button asChild variant="ghost" size="sm">
                <Link href="/ledger">Reyestr</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/verify">Yoxla</Link>
              </Button>
            </nav>
            <Link href="/" aria-label="Safefund" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
              <Mascot size={34} listen />
              <span className="max-sm:hidden">safefund</span>
            </Link>
            <div className="flex items-center justify-end gap-2">
              {user?.role === "organiser" && (
                <Button asChild variant="outline" size="sm" className="max-sm:hidden">
                  <Link href="/campaigns/new">Kampaniya yarat</Link>
                </Button>
              )}
              {user?.role === "clinic" && (
                <Button asChild variant="outline" size="sm" className="max-sm:hidden">
                  <Link href="/clinic">Təsdiq gözləyənlər</Link>
                </Button>
              )}
              <UserMenu users={users} current={user ? { id: user.id, name: user.name } : null} />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">{children}</main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
