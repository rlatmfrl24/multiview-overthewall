import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MemberType } from "@/lib/constants";
import { getContrastingColor } from "@/lib/utils";
import { memo, useMemo } from "react";

interface SortableMemberItemProps {
	member: MemberType;
}

export const SortableMemberItem = memo(function SortableMemberItem({ 
	member 
}: SortableMemberItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: member.name });

	// 스타일을 메모이제이션
	const style = useMemo(() => ({
		transform: transform ? CSS.Translate.toString(transform) : undefined,
		transition,
		backgroundColor: member.primaryColor,
		color: getContrastingColor(member.primaryColor),
	}), [transform, transition, member.primaryColor]);

	return (
		<div
			className="px-2 py-1 rounded-md font-bold cursor-move hover:shadow-md transition-shadow"
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={style}
			title={`${member.name} - 드래그하여 순서 변경`}
		>
			{member.name}
		</div>
	);
});
