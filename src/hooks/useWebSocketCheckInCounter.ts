"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface WebSocketCheckInState {
  checkInCount: number;
  totalCapacity: number;
  lastUpdated: Date | null;
  connected: boolean;
}

export function useWebSocketCheckInCounter(
  eventId: string | null,
  wsUrl: string
) {
  const [state, setState] = useState<WebSocketCheckInState>({
    checkInCount: 0,
    totalCapacity: 0,
    lastUpdated: null,
    connected: false,
  });
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!eventId) return;

    try {
      const ws = new WebSocket(`${wsUrl}?eventId=${eventId}`);

      ws.onopen = () => {
        setState((prev) => ({ ...prev, connected: true }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "checkin_update") {
            setState({
              checkInCount: data.checkInCount,
              totalCapacity: data.totalCapacity,
              lastUpdated: new Date(),
              connected: true,
            });
          }
        } catch {
          // ignore malformed
        }
      };

      ws.onclose = () => {
        setState((prev) => ({ ...prev, connected: false }));
        wsRef.current = null;
      };

      ws.onerror = () => {
        ws.close();
      };

      wsRef.current = ws;
    } catch {
      // connection failed
    }
  }, [eventId, wsUrl]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setState((prev) => ({ ...prev, connected: false }));
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return { ...state };
}
