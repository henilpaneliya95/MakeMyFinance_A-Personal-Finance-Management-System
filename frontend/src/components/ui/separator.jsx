import React from "react";
import { cn } from "@/lib/utils"; // Make sure this file exists too

export function Separator({ className = "", ...props }) {
  return (
    <div
      className={cn("my-4 h-px w-full bg-gray-300", className)}
      {...props}
    />
  );
}
