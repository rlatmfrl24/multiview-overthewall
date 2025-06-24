import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MemberType } from "@/lib/constants";
import { getContrastingColor } from "@/lib/utils";
import { useMemo, memo, useCallback } from "react";
import { useLiveStatus } from "@/lib/hooks/useLiveStatus";

interface MemberToggleProps {
	member: MemberType;
	isSelected: boolean;
	onToggle: (memberName: string) => void;
	isLiveOnly: boolean;
}

export const MemberToggle = memo(function MemberToggle({
	member,
	isSelected,
	onToggle,
	isLiveOnly,
}: MemberToggleProps) {
	// 채널 ID 추출을 메모이제이션
	const channelId = useMemo(() => {
		return member.chzzkUrl.split("/").pop() || null;
	}, [member.chzzkUrl]);

	const { isLive, isLoading, error } = useLiveStatus(channelId, isLiveOnly);

	// 버튼 클릭 핸들러 메모이제이션
	const handleClick = useCallback(() => {
		onToggle(member.name);
	}, [onToggle, member.name]);

	// 비활성화 상태 계산 메모이제이션
	const isDisabled = useMemo(() => {
		return (isLiveOnly && !isLive && !isLoading) || isLoading;
	}, [isLiveOnly, isLive, isLoading]);

	// 버튼 스타일 메모이제이션
	const buttonStyle = useMemo(() => ({
		backgroundColor: member.primaryColor,
		fontWeight: "bold" as const,
		color: getContrastingColor(member.primaryColor),
	}), [member.primaryColor]);

	// 렌더링할 아이콘 메모이제이션
	const renderIcon = useMemo(() => {
		if (isLoading) {
			return <Loader2 className="w-4 h-4 animate-spin" />;
		}
		if (isSelected) {
			return <Check className="w-4 h-4" />;
		}
		return null;
	}, [isLoading, isSelected]);

	// 에러 발생 시 콘솔에 출력 (개발 환경에서만)
	if (error && process.env.NODE_ENV === 'development') {
		console.warn(`${member.name} 라이브 상태 확인 오류:`, error);
	}

	return (
		<Button
			variant="outline"
			style={buttonStyle}
			onClick={handleClick}
			disabled={isDisabled}
			className="transition-opacity duration-200"
			title={isLiveOnly ? (isLive ? "현재 방송중" : "방송 중이 아님") : undefined}
		>
			{renderIcon}
			{member.name}
		</Button>
	);
});
