import { useState, useEffect, useCallback, useRef } from "react";
import { getChzzkLiveStatus } from "@/lib/api";

interface LiveStatusCache {
  [channelId: string]: {
    isLive: boolean;
    timestamp: number;
    isLoading: boolean;
  };
}

const CACHE_DURATION = 30000; // 30초 캐시
const liveStatusCache: LiveStatusCache = {};
const pendingRequests = new Map<string, Promise<boolean>>();

export function useLiveStatus(
  channelId: string | null,
  enabled: boolean = true
) {
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLiveStatus = useCallback(async (id: string): Promise<boolean> => {
    // 캐시 확인
    const cached = liveStatusCache[id];
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.isLive;
    }

    // 진행 중인 요청이 있는지 확인
    if (pendingRequests.has(id)) {
      return pendingRequests.get(id)!;
    }

    // 새로운 요청 생성
    const requestPromise = (async () => {
      try {
        const response = await getChzzkLiveStatus(id);
        const liveStatus = response.content?.status === "OPEN";

        // 캐시 업데이트
        liveStatusCache[id] = {
          isLive: liveStatus,
          timestamp: now,
          isLoading: false,
        };

        return liveStatus;
      } catch (error) {
        console.error(`라이브 상태 확인 실패 (${id}):`, error);
        throw error;
      } finally {
        pendingRequests.delete(id);
      }
    })();

    pendingRequests.set(id, requestPromise);
    return requestPromise;
  }, []);

  useEffect(() => {
    if (!enabled || !channelId) {
      setIsLive(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 캐시된 데이터 먼저 확인
    const cached = liveStatusCache[channelId];
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      setIsLive(cached.isLive);
      setIsLoading(cached.isLoading);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchLiveStatus(channelId)
      .then((status) => {
        if (!controller.signal.aborted) {
          setIsLive(status);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || "라이브 상태 확인 실패");
          setIsLive(false);
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [channelId, enabled, fetchLiveStatus]);

  const refetch = useCallback(() => {
    if (!channelId) return;

    // 캐시 무효화
    delete liveStatusCache[channelId];

    setIsLoading(true);
    setError(null);

    fetchLiveStatus(channelId)
      .then((status) => {
        setIsLive(status);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "라이브 상태 확인 실패");
        setIsLive(false);
        setIsLoading(false);
      });
  }, [channelId, fetchLiveStatus]);

  return { isLive, isLoading, error, refetch };
}
