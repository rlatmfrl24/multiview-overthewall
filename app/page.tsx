"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { members, type MemberType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
	DndContext,
	type DragOverEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Home() {
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	useEffect(() => {
		console.log(selectedMembers);
	}, [selectedMembers]);

	const MemberToggle = ({ member }: { member: MemberType }) => {
		return (
			<Button
				className="cursor-pointer"
				variant={"outline"}
				style={{
					backgroundColor: member.primaryColor,
					fontWeight: "bold",
				}}
				onClick={() => {
					if (selectedMembers.includes(member.name)) {
						setSelectedMembers(
							selectedMembers.filter(
								(selectedMember) => selectedMember !== member.name,
							),
						);
					} else {
						setSelectedMembers([...selectedMembers, member.name]);
					}
				}}
			>
				{selectedMembers.includes(member.name) && <Check className="w-4 h-4" />}
				{member.name}
			</Button>
		);
	};

	function handleDragOver(event: DragOverEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setSelectedMembers((items) => {
				const oldIndex = items.indexOf(active.id as string);
				const newIndex = items.indexOf(over?.id as string);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	return (
		<div className="flex flex-col gap-2 my-2">
			<h2 className="text-xl font-bold">Stardays</h2>
			<div className="flex gap-2">
				{members
					.filter((member) => member.group === "Stardays")
					.map((member) => (
						<MemberToggle key={member.name} member={member} />
					))}
			</div>
			<h2 className="text-xl font-bold">Luvdia</h2>
			<div className="flex gap-2">
				{members
					.filter((member) => member.group === "Luvdia")
					.map((member) => (
						<MemberToggle key={member.name} member={member} />
					))}
			</div>
			<h2 className="text-xl font-bold">Hi-Blueming</h2>
			<div className="flex gap-2">
				{members
					.filter((member) => member.group === "Hi-Blueming")
					.map((member) => (
						<MemberToggle key={member.name} member={member} />
					))}
			</div>
			<div className="flex flex-col gap-2 mt-4">
				<div className="flex gap-2 items-center">
					<h2 className="text-xl font-bold">선택 리스트</h2>
					<Button
						size={"sm"}
						variant={"outline"}
						onClick={() => setSelectedMembers([])}
					>
						Reset
					</Button>
				</div>
				<DndContext sensors={sensors} onDragOver={handleDragOver}>
					<SortableContext
						items={selectedMembers}
						strategy={verticalListSortingStrategy}
					>
						{selectedMembers.length > 0 && (
							<div className="flex gap-2 flex-wrap border p-2 rounded-md">
								{selectedMembers.map((member) => (
									<SortableMemberItem
										key={member}
										member={
											members.find((m) => m.name === member) as MemberType
										}
									/>
								))}
							</div>
						)}
					</SortableContext>
				</DndContext>

				<Button
					size={"lg"}
					className="text-xl font-bold"
					disabled={selectedMembers.length === 0}
					onClick={() => {
						window.open(
							makeMultiViewLink(
								members.filter((member) =>
									selectedMembers.includes(member.name),
								),
							),
							"_blank",
						);
					}}
				>
					멀티뷰 생성
				</Button>
			</div>
		</div>
	);
}

function makeMultiViewLink(members: MemberType[]) {
	const streamCodes = members.map((member) => {
		const response = member.chzzkUrl.replace("https://chzzk.naver.com/", "");
		return response;
	});

	return `https://mul.live/${streamCodes.join("/")}`;
}

const SortableMemberItem = ({ member }: { member: MemberType }) => {
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
};
