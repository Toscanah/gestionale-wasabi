import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { type ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ReactQueryProvider from "./query-provider";
import { TRPCProvider } from "@/lib/trpc/provider";
import { StrictMode } from "react";
import { cookies } from "next/headers";
import { ChangeTheme } from "@/components/shared/misc/ChangeTheme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestionale Wasabi",
  description: "Applicazione gestionale per Wasabi Sushi a Trieste",
};

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <StrictMode>
          <ReactQueryProvider>
            <TRPCProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <SidebarProvider defaultOpen={defaultOpen}>
                  {children}
                  <Toaster richColors position="bottom-center" duration={1500} />
                  <ChangeTheme />
                </SidebarProvider>
              </ThemeProvider>
            </TRPCProvider>
          </ReactQueryProvider>
        </StrictMode>
      </body>
    </html>
  );
}
