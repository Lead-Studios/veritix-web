"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface WebSocketCheckInState {
  checkInCount: number;
  totalCapacity: number;
  lastUpdated: Date | null;
  connected: boolean;
}

interface CheckinUpdateMessage {
  type: "checkin_update";
  checkInCount: number;
  totalCapacity: number;
}

function isCheckinUpdateMessage(value: unknown): value is CheckinUpdateMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as CheckinUpdateMessage).type === "checkin_update" &&
    typeof (value as CheckinUpdateMessage).checkInCount === "number" &&
    typeof (value as CheckinUpdateMessage).totalCapacity === "number"
  );
}

export function useWebSocketCheckInCounter(
  eventId: string | null,
  wsUrl: string,
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
          if (isCheckinUpdateMessage(data)) {
            setState({
              checkInCount: data.checkInCount,
              totalCapacity: data.totalCapacity,
              lastUpdated: new Date(),
              connected: true,
            });
          }
        } catch (e: unknown) {
          console.error("Failed to parse WebSocket message", e);
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
    } catch (e: unknown) {
      console.error("WebSocket connection failed", e);
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
