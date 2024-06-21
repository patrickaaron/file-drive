import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Id } from "../../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
