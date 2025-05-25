import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MemberType } from "@/lib/constants";

interface MemberToggleProps {
	member: MemberType;
	isSelected: boolean;
	onToggle: (memberName: string) => void;
}

export function MemberToggle({
	member,
	isSelected,
	onToggle,
}: MemberToggleProps) {
	return (
		<Button
			className="cursor-pointer"
			variant={"outline"}
			style={{
				backgroundColor: member.primaryColor,
				fontWeight: "bold",
				// member의 primaryColor가 너무 어두우면 흰색 글자로 변경
				color: getContrastingColor(member.primaryColor),
			}}
			onClick={() => onToggle(member.name)}
		>
			{isSelected && <Check className="w-4 h-4" />}
			{member.name}
		</Button>
	);
}

function getContrastingColor(color: string) {
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
