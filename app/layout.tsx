import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChangeTheme } from "./(site)/components/ui/misc/ChangeTheme";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { type ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ReactQueryProvider from "./query-provider";
import { TRPCProvider } from "@/lib/server/provider";
import { StrictMode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestionale Wasabi",
  description: "Applicazione gestionale per Wasabi Sushi a Trieste",
};

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <StrictMode>
          <ReactQueryProvider>
            <TRPCProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <SidebarProvider defaultOpen={false} className="overflow-x-hidden">
                  {children}
                  <Toaster richColors position="bottom-center" duration={1500} />
                  <div className="fixed bottom-4 right-4 hover:cursor-pointer">
                    <ChangeTheme />
                  </div>
                </SidebarProvider>
              </ThemeProvider>
            </TRPCProvider>
          </ReactQueryProvider>
        </StrictMode>
      </body>
    </html>
  );
}
