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
			}}
			onClick={() => onToggle(member.name)}
		>
			{isSelected && <Check className="w-4 h-4" />}
			{member.name}
		</Button>
	);
}
