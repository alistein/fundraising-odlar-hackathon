import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import Link from "next/link";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="az" className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="material sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl backdrop-saturate-150">
          <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
            <nav className="flex items-center gap-1">
              <Button asChild variant="ghost" size="sm">
                <Link href="/stats">Statistika</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/campaigns">Kampaniyalar</Link>
              </Button>
            </nav>
            <Link href="/" aria-label="Safefund" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
              <Mascot size={34} listen />
              <span className="max-sm:hidden">safefund</span>
            </Link>
            <div className="flex justify-end">
              <Button asChild size="sm">
                <Link href="/campaigns/new">
                  <Icon icon={Add01Icon} size={16} />
                  <span className="max-sm:hidden">Kampaniya yarat</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">{children}</main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
