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
import { memo, useMemo, useCallback } from "react";

interface SelectedMembersListProps {
	selectedMembers: string[];
	allMembers: readonly MemberType[];
	onDragOver: (event: DragOverEvent) => void;
	onReset: () => void;
	onCreateMultiView: () => void;
}

const MAX_RECOMMENDED_MEMBERS = 6;

export const SelectedMembersList = memo(function SelectedMembersList({
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

	// 선택된 멤버 객체들을 메모이제이션
	const selectedMemberObjects = useMemo(() => {
		const memberMap = new Map(allMembers.map(member => [member.name, member]));
		return selectedMembers.map(name => memberMap.get(name)).filter(Boolean) as MemberType[];
	}, [selectedMembers, allMembers]);

	// 경고 메시지 표시 여부
	const showWarning = useMemo(() => {
		return selectedMembers.length > MAX_RECOMMENDED_MEMBERS;
	}, [selectedMembers.length]);

	// 멀티뷰 생성 가능 여부
	const canCreateMultiView = useMemo(() => {
		return selectedMembers.length > 0;
	}, [selectedMembers.length]);

	// 리셋 버튼 클릭 핸들러
	const handleReset = useCallback(() => {
		onReset();
	}, [onReset]);

	// 멀티뷰 생성 버튼 클릭 핸들러
	const handleCreateMultiView = useCallback(() => {
		onCreateMultiView();
	}, [onCreateMultiView]);

	return (
		<div className="flex flex-col gap-2 mt-4">
			<div className="flex gap-2 items-center">
				<h2 className="text-xl font-bold">선택 리스트</h2>
				<Button 
					size="sm" 
					variant="outline" 
					onClick={handleReset}
					disabled={!canCreateMultiView}
				>
					초기화
				</Button>
			</div>
			
			<p className="text-sm text-gray-500">
				멤버의 이름을 드래그 앤 드롭하여 순서를 바꿀 수 있습니다.
			</p>
			
			{showWarning && (
				<p className="text-sm text-red-500">
					⚠️ {MAX_RECOMMENDED_MEMBERS}개 이상의 멀티뷰를 생성할 시, 컴퓨팅 환경에 지장을 줄 수 있습니다.
				</p>
			)}

			{canCreateMultiView && (
				<DndContext sensors={sensors} onDragOver={onDragOver}>
					<SortableContext
						items={selectedMembers}
						strategy={verticalListSortingStrategy}
					>
						<div className="flex gap-2 flex-wrap border p-2 rounded-md bg-gray-50/50">
							{selectedMemberObjects.map((member) => (
								<SortableMemberItem key={member.name} member={member} />
							))}
						</div>
					</SortableContext>
				</DndContext>
			)}

			<Button
				size="lg"
				className="text-xl font-bold"
				disabled={!canCreateMultiView}
				onClick={handleCreateMultiView}
			>
				멀티뷰 생성
			</Button>
		</div>
	);
});
