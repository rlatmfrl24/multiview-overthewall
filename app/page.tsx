"use client";

import { Toggle } from "@/components/ui/toggle";

export default function Home() {
	return (
		<div className="flex flex-col gap-4 my-2">
			<h2 className="text-xl font-bold">Stardays</h2>
			<div>
				<Toggle className="cursor-pointer">반님</Toggle>
				<Toggle className="cursor-pointer">쿠레나이 나츠키</Toggle>
				<Toggle className="cursor-pointer">테리눈나</Toggle>
			</div>
			<h2 className="text-xl font-bold">Luvdia</h2>
			<div>
				<Toggle className="cursor-pointer">빙하유</Toggle>
				<Toggle className="cursor-pointer">양메이</Toggle>
				<Toggle className="cursor-pointer">유리리</Toggle>
			</div>
			<h2 className="text-xl font-bold">Hi-Blueming</h2>
			<div>
				<Toggle className="cursor-pointer">온하루</Toggle>
				<Toggle className="cursor-pointer">김아테</Toggle>
				<Toggle className="cursor-pointer">하네</Toggle>
				<Toggle className="cursor-pointer">오토노 소리</Toggle>
			</div>
		</div>
	);
}
