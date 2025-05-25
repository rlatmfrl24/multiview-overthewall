"use client";

import { useState } from "react";
import { members } from "@/lib/constants";
import { MemberList } from "@/components/MemberList";
import { SelectedMembersList } from "@/components/SelectedMembersList";
import type { DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export default function Home() {
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

	const handleToggleMember = (memberName: string) => {
		if (selectedMembers.includes(memberName)) {
			setSelectedMembers(selectedMembers.filter((name) => name !== memberName));
		} else {
			setSelectedMembers([...selectedMembers, memberName]);
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setSelectedMembers((items) => {
				const oldIndex = items.indexOf(active.id as string);
				const newIndex = items.indexOf(over?.id as string);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const handleCreateMultiView = () => {
		const selectedMemberObjects = members.filter((member) =>
			selectedMembers.includes(member.name),
		);
		const streamCodes = selectedMemberObjects.map((member) => {
			return member.chzzkUrl.replace("https://chzzk.naver.com/", "");
		});
		window.open(`https://mul.live/${streamCodes.join("/")}`, "_blank");
	};

	return (
		<div className="flex flex-col gap-2 my-2">
			<MemberList
				title="Stardays"
				members={members.filter((member) => member.group === "Stardays")}
				selectedMembers={selectedMembers}
				onToggleMember={handleToggleMember}
			/>
			<MemberList
				title="Luvdia"
				members={members.filter((member) => member.group === "Luvdia")}
				selectedMembers={selectedMembers}
				onToggleMember={handleToggleMember}
			/>
			<MemberList
				title="Hi-Blueming"
				members={members.filter((member) => member.group === "Hi-Blueming")}
				selectedMembers={selectedMembers}
				onToggleMember={handleToggleMember}
			/>
			<SelectedMembersList
				selectedMembers={selectedMembers}
				allMembers={members}
				onDragOver={handleDragOver}
				onReset={() => setSelectedMembers([])}
				onCreateMultiView={handleCreateMultiView}
			/>
		</div>
	);
}
