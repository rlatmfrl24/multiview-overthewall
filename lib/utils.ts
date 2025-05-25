import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getContrastingColor(color: string) {
	// HEX 색상 처리
	if (color.startsWith("#")) {
		const hex = color.replace("#", "");
		const r = Number.parseInt(hex.substring(0, 2), 16);
		const g = Number.parseInt(hex.substring(2, 4), 16);
		const b = Number.parseInt(hex.substring(4, 6), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5 ? "black" : "white";
	}

	// RGB 색상 처리
	const rgb = color.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (!rgb) return "black";

	const [r, g, b] = rgb.map(Number);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "black" : "white";
}
