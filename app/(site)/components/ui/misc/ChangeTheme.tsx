"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ChangeTheme() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const path = usePathname();

  const size = 40; // approx button size
  const margin = 16;

  // Default to bottom right
  const getDefaultPos = () => ({
    top: typeof window !== "undefined" ? window.innerHeight - size - margin : 0,
    left: typeof window !== "undefined" ? window.innerWidth - size - margin : 0,
  });

  const [pos, setPos] = React.useState<{ top: number; left: number }>(getDefaultPos());
  const [dragging, setDragging] = React.useState(false);
  const [snapping, setSnapping] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
    // Set position on mount (for SSR)
    setPos(getDefaultPos());
    // Update position on resize
    const handleResize = () => setPos(getDefaultPos());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, []);

  const isHomePage = path.includes("home");
  const isDark = theme === "dark" || resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // handle dragging
  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!dragging) return;
      setSnapping(false);
      setPos({ top: e.clientY, left: e.clientX });
    };
    const handleUp = () => {
      if (!dragging) return;

      setDragging(false);

      // Snap logic
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // distances to corners
      const corners = [
        { top: margin, left: margin }, // top-left
        { top: margin, left: vw - size - margin }, // top-right
        { top: vh - size - margin, left: margin }, // bottom-left
        { top: vh - size - margin, left: vw - size - margin }, // bottom-right
      ];

      const closest = corners.reduce((prev, curr) => {
        const dPrev = Math.hypot(prev.top - pos.top, prev.left - pos.left);
        const dCurr = Math.hypot(curr.top - pos.top, curr.left - pos.left);
        return dCurr < dPrev ? curr : prev;
      });

      setSnapping(true);
      setPos(closest);

      // Remove snapping after animation
      setTimeout(() => setSnapping(false), 300);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, pos]);

  if (!mounted) return null;

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: 1000,
        transition: snapping ? "top 0.3s cubic-bezier(.4,2,.6,1), left 0.3s cubic-bezier(.4,2,.6,1)" : undefined,
        willChange: snapping ? "top,left" : undefined,
      }}
      onClick={toggleTheme}
      onMouseDown={() => setDragging(true)}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
