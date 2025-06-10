"use client";

import { useState } from "react";
import { members } from "@/lib/constants";
import { MemberList } from "@/components/MemberList";
import { SelectedMembersList } from "@/components/SelectedMembersList";
import type { DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Switch } from "@/components/ui/switch";

export default function Home() {
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const [isLiveOnly, setIsLiveOnly] = useState(false);

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
		const sortedStreamCodes = selectedMembers.map((memberName) => {
			const member = selectedMemberObjects.find((m) => m.name === memberName);
			return member?.chzzkUrl.replace("https://chzzk.naver.com/", "");
		});

		window.open(`https://mul.live/${sortedStreamCodes.join("/")}`, "_blank");
	};

	return (
		<div className="flex flex-col gap-2 my-2">
			<p className="text-sm text-gray-500">
				멤버를 선택한 후, &quot;멀티뷰 생성&quot; 버튼을 클릭하면 mul.live
				링크로 멀티뷰 링크가 생성됩니다.
			</p>
			<div className="flex items-center gap-2">
				<Switch checked={isLiveOnly} onCheckedChange={setIsLiveOnly} />
				<p className="text-sm">현재 방송중인 멤버의 버튼만 활성화</p>
			</div>
			<MemberList
				title="Stardays"
				members={members.filter((member) => member.group === "Stardays")}
				selectedMembers={selectedMembers}
				onToggleMember={handleToggleMember}
				isLiveOnly={isLiveOnly}
			/>
			<MemberList
				title="Luvdia"
				members={members.filter((member) => member.group === "Luvdia")}
				selectedMembers={selectedMembers}
				onToggleMember={handleToggleMember}
				isLiveOnly={isLiveOnly}
			/>
			<MemberList
				title="Hi-Blueming"
				members={members.filter((member) => member.group === "Hi-Blueming")}
				selectedMembers={selectedMembers}
				onToggleMember={handleToggleMember}
				isLiveOnly={isLiveOnly}
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
