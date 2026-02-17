import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteNav } from "./_components/site-nav";
import { SiteFooter } from "./_components/site-footer";
import { ThemeProvider } from "./_components/theme-provider";
import { ToastProvider } from "./_components/toast";

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
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <SiteNav />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
