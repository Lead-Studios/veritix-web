'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface PaymentEvent {
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  message?: string;
}

function isPaymentEvent(value: unknown): value is PaymentEvent {
  return (
    typeof value === 'object' && value !== null && 'txHash' in value && 'status' in value
  );
}

interface UsePaymentWebSocketOptions {
  url: string;
  onPaymentUpdate?: (event: PaymentEvent) => void;
  reconnectInterval?: number;
}

export function usePaymentWebSocket({
  url,
  onPaymentUpdate,
  reconnectInterval = 5000,
}: UsePaymentWebSocketOptions) {
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setWsStatus('connecting');

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setWsStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (isPaymentEvent(data)) {
            onPaymentUpdate?.(data);
          }
        } catch (e: unknown) {
          console.error('Failed to parse WebSocket message', e);
        }
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
        wsRef.current = null;
        reconnectTimerRef.current = setTimeout(connect, reconnectInterval);
      };

      ws.onerror = () => {
        setWsStatus('error');
        ws.close();
      };

      wsRef.current = ws;
    } catch (e: unknown) {
      console.error('Failed to create WebSocket', e);
      setWsStatus('error');
      reconnectTimerRef.current = setTimeout(connect, reconnectInterval);
    }
  }, [url, onPaymentUpdate, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsStatus('disconnected');
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return { wsStatus };
}
