import type { MemberType } from "@/lib/constants";
import { MemberToggle } from "./MemberToggle";

interface MemberListProps {
	title: string;
	members: MemberType[];
	selectedMembers: string[];
	onToggleMember: (memberName: string) => void;
}

export function MemberList({
	title,
	members,
	selectedMembers,
	onToggleMember,
}: MemberListProps) {
	return (
		<>
			<h2 className="text-xl font-bold">{title}</h2>
			<div className="flex gap-2">
				{members.map((member) => (
					<MemberToggle
						key={member.name}
						member={member}
						isSelected={selectedMembers.includes(member.name)}
						onToggle={onToggleMember}
					/>
				))}
			</div>
		</>
	);
}
