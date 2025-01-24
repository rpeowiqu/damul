import { clsx, type ClassValue } from "clsx";
import { CommandIcon, Home } from "lucide-react";
import { Profiler } from "react";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
