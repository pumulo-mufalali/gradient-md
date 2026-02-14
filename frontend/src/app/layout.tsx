import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "./_components/site-nav";
import { ThemeProvider } from "./_components/theme-provider";

export const metadata: Metadata = {
  title: "GradientMD — AI Medical Triage Assistant",
  description:
    "Understand your symptoms, assess urgency, and get cited clinical guidance from WHO, CDC, and NIH sources. Powered by DigitalOcean Gradient AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-[var(--color-primary)]/30">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <SiteNav />
            <main className="flex-1 flex flex-col items-center justify-center w-full py-12 md:py-20 lg:py-24">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
