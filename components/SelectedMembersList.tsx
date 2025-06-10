import { Button } from "@/components/ui/button";
import type { MemberType } from "@/lib/constants";
import { SortableMemberItem } from "./SortableMemberItem";
import {
	DndContext,
	type DragOverEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface SelectedMembersListProps {
	selectedMembers: string[];
	allMembers: MemberType[];
	onDragOver: (event: DragOverEvent) => void;
	onReset: () => void;
	onCreateMultiView: () => void;
}

export function SelectedMembersList({
	selectedMembers,
	allMembers,
	onDragOver,
	onReset,
	onCreateMultiView,
}: SelectedMembersListProps) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	return (
		<div className="flex flex-col gap-2 mt-4">
			<div className="flex gap-2 items-center">
				<h2 className="text-xl font-bold">선택 리스트</h2>
				<Button size={"sm"} variant={"outline"} onClick={onReset}>
					Reset
				</Button>
			</div>
			<p className="text-sm text-gray-500">
				멤버의 이름을 Drag & Drop 하여 순서를 바꿀 수 있습니다.
			</p>
			{selectedMembers.length > 6 && (
				<p className="text-sm text-red-500">
					6개 이상의 멀티뷰를 생성할 시, 컴퓨팅 환경에 지장을 줄 수 있습니다.
				</p>
			)}
			<DndContext sensors={sensors} onDragOver={onDragOver}>
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
										allMembers.find((m) => m.name === member) as MemberType
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
				onClick={onCreateMultiView}
			>
				멀티뷰 생성
			</Button>
		</div>
	);
}
