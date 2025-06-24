export interface ChzzkLiveStatus {
  code: number;
  message: string;
  content: {
    status: "OPEN" | "CLOSE";
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

export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

const API_CONFIG = {
  timeout: 10000,
  retryCount: 2,
  retryDelay: 1000,
} as const;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryCount: number = API_CONFIG.retryCount
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `HTTP 에러: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    const isRetryable =
      error instanceof ApiError &&
      error.status &&
      error.status >= 500 &&
      error.status < 600;

    if (isRetryable && retryCount > 0) {
      console.warn(
        `API 요청 실패, ${retryCount}번 재시도 예정:`,
        error.message
      );
      await delay(API_CONFIG.retryDelay);
      return fetchWithRetry(url, options, retryCount - 1);
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("요청 시간 초과", 408, "TIMEOUT");
    }

    throw error;
  }
}

export async function getChzzkLiveStatus(
  channelId: string
): Promise<ChzzkLiveStatus> {
  if (!channelId || typeof channelId !== "string") {
    throw new ApiError(
      "올바르지 않은 채널 ID입니다.",
      400,
      "INVALID_CHANNEL_ID"
    );
  }

  try {
    const response = await fetchWithRetry(
      `/api/chzzk/live-status?channelId=${encodeURIComponent(channelId)}`
    );

    const data = (await response.json()) as ChzzkLiveStatus;

    if (!data || typeof data.code !== "number") {
      throw new ApiError(
        "올바르지 않은 API 응답 형식입니다.",
        502,
        "INVALID_RESPONSE"
      );
    }

    if (data.code !== 200) {
      throw new ApiError(
        data.message || "라이브 상태 조회에 실패했습니다.",
        data.code,
        "API_ERROR"
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("라이브 상태 조회 중 예상치 못한 에러:", error);
    throw new ApiError(
      "라이브 상태 조회 중 오류가 발생했습니다.",
      500,
      "UNKNOWN_ERROR"
    );
  }
}

export function createMultiViewUrl(streamCodes: string[]): string {
  if (!streamCodes || streamCodes.length === 0) {
    throw new Error("스트림 코드가 없습니다.");
  }

  const validCodes = streamCodes.filter(
    (code) => code && typeof code === "string"
  );

  if (validCodes.length === 0) {
    throw new Error("유효한 스트림 코드가 없습니다.");
  }

  return `https://mul.live/${validCodes.join("/")}`;
}
