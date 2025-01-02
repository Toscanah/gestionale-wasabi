"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setTheme("light");
    router.push("./home");
  }, [router]);

  return <>Ciao!</>;
}
