import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스명을 병합하는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * RGB 값으로부터 휘도(luminance)를 계산하는 함수
 */
function calculateLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * HEX 색상 문자열을 RGB 값으로 변환하는 함수
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * RGB 문자열을 파싱하는 함수
 */
function parseRgbString(
  rgb: string
): { r: number; g: number; b: number } | null {
  const match = rgb.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)\)/);
  return match
    ? {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
      }
    : null;
}

/**
 * 주어진 배경색에 대해 가장 적합한 텍스트 색상을 반환하는 함수
 * 웹 접근성 가이드라인(WCAG)을 기반으로 대비를 계산합니다.
 */
export function getContrastingColor(
  backgroundColor: string
): "black" | "white" {
  if (!backgroundColor) return "black";

  let r: number, g: number, b: number;

  // HEX 색상 처리
  if (backgroundColor.startsWith("#")) {
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return "black";
    ({ r, g, b } = rgb);
  }
  // RGB 색상 처리
  else if (backgroundColor.includes("rgb")) {
    const rgb = parseRgbString(backgroundColor);
    if (!rgb) return "black";
    ({ r, g, b } = rgb);
  }
  // 기타 색상 형식은 기본값 반환
  else {
    return "black";
  }

  // 휘도 계산 후 임계값(0.5)을 기준으로 텍스트 색상 결정
  const luminance = calculateLuminance(r, g, b);
  return luminance > 0.5 ? "black" : "white";
}

/**
 * 문자열이 유효한 URL인지 확인하는 함수
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 배열에서 중복을 제거하는 함수
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * 지연 실행을 위한 Promise 기반 유틸리티
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 안전한 JSON 파싱 함수
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
