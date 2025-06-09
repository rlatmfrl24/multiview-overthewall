import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const channelId = searchParams.get("channelId");

	if (!channelId) {
		return NextResponse.json(
			{ error: "channelId is required" },
			{ status: 400 },
		);
	}

	try {
		const response = await fetch(
			`https://api.chzzk.naver.com/polling/v2/channels/${channelId}/live-status`,
		);
		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Failed to fetch live status:", error);
		return NextResponse.json(
			{ error: "Failed to fetch live status" },
			{ status: 500 },
		);
	}
}
