import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MemberType } from "@/lib/constants";
import { getContrastingColor } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { getChzzkLiveStatus } from "@/lib/api";

interface MemberToggleProps {
	member: MemberType;
	isSelected: boolean;
	onToggle: (memberName: string) => void;
	isLiveOnly: boolean;
}

export function MemberToggle({
	member,
	isSelected,
	onToggle,
	isLiveOnly,
}: MemberToggleProps) {
	const [isLive, setIsLive] = useState(false);

	useEffect(() => {
		const fetchLiveStatus = async () => {
			const channelId = member.chzzkUrl.split("/").pop();
			if (!channelId) {
				return;
			}

			const liveStatus = await getChzzkLiveStatus(channelId);
			setIsLive(liveStatus.content?.status === "OPEN");
		};
		if (isLiveOnly) {
			fetchLiveStatus();
		}
	}, [member.chzzkUrl, isLiveOnly]);

	const isDisabled = useMemo(() => {
		return isLiveOnly && !isLive;
	}, [isLive, isLiveOnly]);

	return (
		<Button
			variant={"outline"}
			style={{
				backgroundColor: member.primaryColor,
				fontWeight: "bold",
				// member의 primaryColor가 너무 어두우면 흰색 글자로 변경
				color: getContrastingColor(member.primaryColor),
			}}
			onClick={() => onToggle(member.name)}
			disabled={isDisabled}
		>
			{isSelected && <Check className="w-4 h-4" />}
			{member.name}
		</Button>
	);
}
