export interface ChzzkLiveStatus {
	code: number;
	message: string;
	content: {
		status: string;
		liveTitle: string;
		liveCategory: string;
		liveImageUrl: string;
		defaultThumbnailImageUrl: string;
		concurrentUserCount: number;
		accumulateCount: number;
		openDate: string;
		adult: boolean;
		chatChannelId: string;
		categoryType: string;
		liveId: number;
		livePollingStatusJson: string;
		channelId: string;
		channelName: string;
		channelImageUrl: string;
		verifiedMark: boolean;
		channelType: string;
	} | null;
}

export async function getChzzkLiveStatus(
	channelId: string,
): Promise<ChzzkLiveStatus> {
	const response = await fetch(`/api/chzzk/live-status?channelId=${channelId}`);
	return response.json();
}
