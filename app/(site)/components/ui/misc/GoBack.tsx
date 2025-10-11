"use client";

import { ArrowBendUpLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

interface GoBackProps {
  path: string;
}
export default function GoBack({ path }: GoBackProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="absolute text-4xl top-4 left-4">
      <Link href={path}>
        <ArrowBendUpLeftIcon
          size={32}
          className={`hover:cursor-pointer transition-transform duration-700 ease-in-out ${
            hovered ? "rotate-[-720deg]" : "rotate-0"
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </Link>
    </div>
  );
}
