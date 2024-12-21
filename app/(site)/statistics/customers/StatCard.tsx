import React from "react";

interface StatCardProps {
  label: string;
  children?: React.ReactNode;
}

export default function StatCard({ label, children }: StatCardProps) {
  return (
    <div className="w-full flex-grow h-full border rounded-lg p-4 bg-white overflow-y-auto">
      <div className="text-center w-full mb-4">{label}</div>
      {children}
    </div>
  );
}
