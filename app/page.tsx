"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { members, type MemberType } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function Home() {
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
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
				<h2 className="text-xl font-bold">선택 리스트</h2>
				{selectedMembers.length > 0 && (
					<div className="flex gap-2 flex-wrap border p-2 rounded-md">
						{selectedMembers.map((member) => (
							<div
								key={member}
								className="px-2 py-1 rounded-md"
								style={{
									backgroundColor: members.find((m) => m.name === member)
										?.primaryColor,
									fontWeight: "bold",
								}}
							>
								{member}
							</div>
						))}
					</div>
				)}
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
