"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ChangeTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark" || resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        // Perfectly attached to both walls
        "fixed bottom-0 right-0 z-50",
        // Slightly larger for smoother curvature
        "w-9 h-9 flex items-center justify-center rounded-tl-[1.25rem]",
        // Borders only on the visible sides
        "border-t border-l border-border",
        // Smooth background and hover
        "bg-background hover:bg-accent hover:text-accent-foreground shadow-sm transition-all"
      )}
    >
      {/* Center the icon visually */}
      <div className="relative translate-x-[3px] -translate-y-[-3px] flex items-center justify-center">
        <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
    </button>
  );
}
