import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MemberType } from "@/lib/constants";

interface SortableMemberItemProps {
	member: MemberType;
}

export function SortableMemberItem({ member }: SortableMemberItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: member.name });

	const style = {
		transform: transform ? CSS.Translate.toString(transform) : undefined,
		transition,
		backgroundColor: member.primaryColor,
	};

	return (
		<div
			className="px-2 py-1 rounded-md font-bold cursor-move"
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={style}
		>
			{member.name}
		</div>
	);
}
