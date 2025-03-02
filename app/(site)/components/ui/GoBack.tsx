"use client";

import { ArrowBendUpLeft } from "@phosphor-icons/react";
import Link from "next/link";

interface GoBackProps {
  path: string;
}

export default function GoBack({ path }: GoBackProps) {
  return (
    <div className="absolute text-4xl top-4 left-4">
      <Link href={path}>
        <ArrowBendUpLeft size={32} className="hover:cursor-pointer" />
      </Link>
    </div>
  );
}
