import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MemberType } from "@/lib/constants";
import { getContrastingColor } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getChzzkLiveStatus } from "@/lib/api";

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
	const [isLive, setIsLive] = useState(false);

	useEffect(() => {
		const checkLiveStatus = async () => {
			try {
				const channelId = member.chzzkUrl.replace(
					"https://chzzk.naver.com/",
					"",
				);
				const status = await getChzzkLiveStatus(channelId);
				setIsLive(status.content?.status === "OPEN");
			} catch (error) {
				console.error(`Failed to fetch live status for ${member.name}:`, error);
				setIsLive(false);
			}
		};

		checkLiveStatus();
		const interval = setInterval(checkLiveStatus, 30000); // 30초마다 상태 확인

		return () => clearInterval(interval);
	}, [member.chzzkUrl, member.name]);

	return (
		<Button
			className={`cursor-pointer ${!isLive ? "opacity-50" : ""}`}
			variant={"outline"}
			style={{
				backgroundColor: member.primaryColor,
				fontWeight: "bold",
				// member의 primaryColor가 너무 어두우면 흰색 글자로 변경
				color: getContrastingColor(member.primaryColor),
			}}
			onClick={() => isLive && onToggle(member.name)}
			disabled={!isLive}
		>
			{isSelected && <Check className="w-4 h-4" />}
			{member.name}
		</Button>
	);
}
