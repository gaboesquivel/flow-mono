import { ThemeProvider } from "@repo/ui/components/theme-provider";

import { AppProviders } from "./_components/providers";
import "@repo/ui/globals.css";
import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  description: "MCP-first agentic Turborepo template.",
  title: "Flow Mono",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <NuqsAdapter>
          <AppProviders>
            <ThemeProvider>{children}</ThemeProvider>
          </AppProviders>
        </NuqsAdapter>
      </body>
    </html>
  );
}
