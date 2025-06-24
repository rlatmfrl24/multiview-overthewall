import type { MemberType } from "@/lib/constants";
import { MemberToggle } from "./MemberToggle";
import { memo } from "react";

interface MemberListProps {
	title: string;
	members: readonly MemberType[];
	selectedMembers: string[];
	onToggleMember: (memberName: string) => void;
	isLiveOnly: boolean;
}

export const MemberList = memo(function MemberList({
	title,
	members,
	selectedMembers,
	onToggleMember,
	isLiveOnly,
}: MemberListProps) {
	return (
		<section>
			<h2 className="text-xl font-bold mb-2">{title}</h2>
			<div className="flex gap-2 flex-wrap">
				{members.map((member) => (
					<MemberToggle
						key={member.name}
						member={member}
						isSelected={selectedMembers.includes(member.name)}
						onToggle={onToggleMember}
						isLiveOnly={isLiveOnly}
					/>
				))}
			</div>
		</section>
	);
});
