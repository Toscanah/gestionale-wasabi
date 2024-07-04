import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./(site)/components/theme-provider";
import { ChangeTheme } from "./(site)/components/ChangeTheme";

import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-left" />
          <div className="fixed bottom-4 right-4 hover:cursor-pointer">
            <ChangeTheme />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
