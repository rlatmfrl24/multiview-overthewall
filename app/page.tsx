"use client";

import { useState, useCallback, useMemo } from "react";
import { members, extractChannelId } from "@/lib/constants";
import { createMultiViewUrl } from "@/lib/api";
import { MemberList } from "@/components/MemberList";
import { SelectedMembersList } from "@/components/SelectedMembersList";
import type { DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Switch } from "@/components/ui/switch";

const GROUPS = ['Stardays', 'Luvdia', 'Hi-Blueming'] as const;

export default function Home() {
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const [isLiveOnly, setIsLiveOnly] = useState(false);

	// 그룹별 멤버 목록을 메모이제이션
	const groupedMembers = useMemo(() => {
		return GROUPS.map(group => ({
			title: group,
			members: members.filter(member => member.group === group)
		}));
	}, []);

	// 멤버 토글 핸들러 메모이제이션
	const handleToggleMember = useCallback((memberName: string) => {
		setSelectedMembers(prev => {
			if (prev.includes(memberName)) {
				return prev.filter(name => name !== memberName);
			}
			return [...prev, memberName];
		});
	}, []);

	// 드래그 오버 핸들러 메모이제이션
	const handleDragOver = useCallback((event: DragOverEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setSelectedMembers(items => {
				const oldIndex = items.indexOf(active.id as string);
				const newIndex = items.indexOf(over?.id as string);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}, []);

	// 선택 초기화 핸들러 메모이제이션
	const handleReset = useCallback(() => {
		setSelectedMembers([]);
	}, []);

	// 멀티뷰 생성 핸들러 메모이제이션 (개선된 버전)
	const handleCreateMultiView = useCallback(() => {
		if (selectedMembers.length === 0) return;

		try {
			const selectedMemberObjects = [...members].filter(member =>
				selectedMembers.includes(member.name)
			);
			
			const streamCodes = selectedMembers
				.map(memberName => {
					const member = selectedMemberObjects.find(m => m.name === memberName);
					return member ? extractChannelId(member.chzzkUrl) : null;
				})
				.filter((code): code is string => code !== null);

			if (streamCodes.length === 0) {
				alert('유효한 스트림 코드를 찾을 수 없습니다.');
				return;
			}

			const multiViewUrl = createMultiViewUrl(streamCodes);
			window.open(multiViewUrl, "_blank");
		} catch (error) {
			console.error('멀티뷰 생성 중 오류:', error);
			alert('멀티뷰 생성 중 오류가 발생했습니다.');
		}
	}, [selectedMembers]);

	// 라이브 전용 모드 토글 핸들러 메모이제이션
	const handleLiveOnlyToggle = useCallback((checked: boolean) => {
		setIsLiveOnly(checked);
	}, []);

	return (
		<main className="flex flex-col gap-2 my-2">
			<div className="mb-4 p-4 rounded-lg border">
				<p className="text-sm mb-3">
					멤버를 선택한 후, <strong>&quot;멀티뷰 생성&quot;</strong> 버튼을 클릭하면 
					mul.live 링크로 멀티뷰 링크가 생성됩니다.
				</p>
				<div className="flex items-center gap-2">
					<Switch 
						checked={isLiveOnly} 
						onCheckedChange={handleLiveOnlyToggle}
						id="live-only-switch"
					/>
					<label htmlFor="live-only-switch" className="text-sm cursor-pointer">
						📺 현재 방송중인 멤버의 버튼만 활성화
					</label>
				</div>
			</div>

			<div className="space-y-4">
				{groupedMembers.map(({ title, members: groupMembers }) => (
					<MemberList
						key={title}
						title={title}
						members={groupMembers}
						selectedMembers={selectedMembers}
						onToggleMember={handleToggleMember}
						isLiveOnly={isLiveOnly}
					/>
				))}
			</div>

			<SelectedMembersList
				selectedMembers={selectedMembers}
				allMembers={members}
				onDragOver={handleDragOver}
				onReset={handleReset}
				onCreateMultiView={handleCreateMultiView}
			/>
		</main>
	);
}
