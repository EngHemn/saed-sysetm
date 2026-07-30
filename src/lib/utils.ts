import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function formatPhoneForDisplay(phone: string): string {
  return phone;
}

export function getLocalizedValue(value: string | null | undefined, lang: string): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") {
      return parsed[lang] || parsed["en"] || parsed["ku"] || "";
    }
  } catch {
    // Not JSON, return legacy plain text as is
  }
  return value;
}
