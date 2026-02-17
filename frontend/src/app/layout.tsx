import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteNav } from "./_components/site-nav";
import { ThemeProvider } from "./_components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GradientMD - AI Medical Triage Assistant",
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
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
