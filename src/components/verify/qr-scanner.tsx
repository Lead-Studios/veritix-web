'use client';

import * as React from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DetectedBarcode {
  rawValue: string;
}

interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
}

type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;
type CameraState = 'idle' | 'starting' | 'on' | 'unsupported' | 'denied' | 'missing' | 'failed';

function barcodeDetector(): BarcodeDetectorCtor | null {
  if (typeof window === 'undefined') return null;
  return (window as Window & { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector ?? null;
}

function cameraErrorState(error: unknown): CameraState {
  const name = error instanceof Error ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied';
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'missing';
  return 'failed';
}

const CAMERA_MESSAGES: Partial<Record<CameraState, string>> = {
  unsupported:
    'This browser cannot scan QR codes with the camera. Enter the code below instead, or use Chrome on Android.',
  denied: 'Camera access was blocked. Allow it in the browser settings, or enter the code below.',
  missing: 'No camera was found on this device. Enter the ticket code below instead.',
  failed: 'The camera could not be started. Enter the code below instead.',
};

export interface QRScannerProps {
  onScan: (value: string) => void;
  disabled?: boolean;
}

export function QRScanner({ onScan, disabled = false }: QRScannerProps) {
  const [camera, setCamera] = React.useState<CameraState>('idle');
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const mountedRef = React.useRef(false);
  const startRequestRef = React.useRef(0);

  const releaseStream = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      startRequestRef.current += 1;
      releaseStream();
    };
  }, [releaseStream]);

  const stopCamera = React.useCallback(() => {
    startRequestRef.current += 1;
    releaseStream();
    setCamera('idle');
  }, [releaseStream]);

  const startCamera = React.useCallback(async () => {
    if (!barcodeDetector() || !navigator.mediaDevices?.getUserMedia) {
      setCamera('unsupported');
      return;
    }

    setCamera('starting');
    const requestId = ++startRequestRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      if (!mountedRef.current || requestId !== startRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (!mountedRef.current || requestId !== startRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      setCamera('on');
    } catch (error) {
      if (!mountedRef.current || requestId !== startRequestRef.current) return;
      releaseStream();
      setCamera(cameraErrorState(error));
    }
  }, [releaseStream]);

  React.useEffect(() => {
    if (camera !== 'on') return;
    const Detector = barcodeDetector();
    if (!Detector) {
      releaseStream();
      setCamera('unsupported');
      return;
    }

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let detector: BarcodeDetectorLike;
    try {
      detector = new Detector({ formats: ['qr_code'] });
    } catch {
      releaseStream();
      setCamera('unsupported');
      return;
    }

    const tick = async () => {
      if (stopped) return;
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        try {
          const codes = await detector.detect(video);
          const value = codes[0]?.rawValue;
          if (value && !stopped) onScan(value);
        } catch {
          // An unreadable frame is normal; try the next one.
        }
      }
      if (!stopped) timer = setTimeout(tick, 250);
    };

    void tick();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [camera, onScan, releaseStream]);

  return (
    <section aria-labelledby="verify-camera-heading" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id="verify-camera-heading" className="text-lg font-medium">
          Camera
        </h2>
        {camera === 'on' || camera === 'starting' ? (
          <Button variant="outline" size="sm" onClick={stopCamera}>
            <CameraOff className="mr-2 h-4 w-4" aria-hidden="true" /> Stop camera
          </Button>
        ) : (
          <Button size="sm" onClick={startCamera} disabled={disabled}>
            <Camera className="mr-2 h-4 w-4" aria-hidden="true" /> Start camera
          </Button>
        )}
      </div>

      {camera === 'starting' && (
        <p role="status" className="text-sm text-muted-foreground">
          Starting camera…
        </p>
      )}
      <div
        className={cn(
          'relative aspect-square w-full overflow-hidden rounded-lg bg-black',
          camera !== 'on' && camera !== 'starting' && 'hidden',
        )}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
          aria-label="Camera preview for scanning ticket QR codes"
        />
        <div
          className="pointer-events-none absolute inset-[15%] rounded-lg border-4 border-white/80"
          aria-hidden="true"
        />
      </div>

      {disabled && camera === 'idle' && (
        <p className="text-sm text-muted-foreground">Choose an event to start scanning.</p>
      )}
      {CAMERA_MESSAGES[camera] && (
        <p role="alert" className="text-sm text-muted-foreground">
          {CAMERA_MESSAGES[camera]}
        </p>
      )}
    </section>
  );
}
