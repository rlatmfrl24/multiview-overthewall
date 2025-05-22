"use client";

import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { Check } from "lucide-react";
import { members } from "@/lib/constants";

export default function Home() {
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const MemberToggle = ({ name }: { name: string }) => {
		return (
			<Toggle
				className="cursor-pointer"
				variant={"outline"}
				onClick={() => {
					if (selectedMembers.includes(name)) {
						setSelectedMembers(
							selectedMembers.filter((member) => member !== name),
						);
					} else {
						setSelectedMembers([...selectedMembers, name]);
					}
				}}
			>
				{selectedMembers.includes(name) && <Check className="w-4 h-4" />}
				{name}
			</Toggle>
		);
	};

	return (
		<div className="flex flex-col gap-4 my-2">
			<h2 className="text-xl font-bold">Stardays</h2>
			<div className="flex gap-2">
				{members
					.filter((member) => member.group === "Stardays")
					.map((member) => (
						<MemberToggle key={member.name} name={member.name} />
					))}
			</div>
			<h2 className="text-xl font-bold">Luvdia</h2>
			<div className="flex gap-2">
				{members
					.filter((member) => member.group === "Luvdia")
					.map((member) => (
						<MemberToggle key={member.name} name={member.name} />
					))}
			</div>
			<h2 className="text-xl font-bold">Hi-Blueming</h2>
			<div className="flex gap-2">
				{members
					.filter((member) => member.group === "Hi-Blueming")
					.map((member) => (
						<MemberToggle key={member.name} name={member.name} />
					))}
			</div>

			<div className="flex gap-2">
				{selectedMembers.map((member) => (
					<div key={member}>{member}</div>
				))}
			</div>
		</div>
	);
}
