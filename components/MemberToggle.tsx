import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MemberType } from "@/lib/constants";
import { getContrastingColor } from "@/lib/utils";

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
