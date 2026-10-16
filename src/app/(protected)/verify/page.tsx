'use client';

import * as React from 'react';
import { Camera, CameraOff, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Paginated, VeritixEvent } from '@/types';

/**
 * Gate check-in.
 *
 * The page never decides whether a ticket is genuine: every code, scanned or
 * typed, goes to `POST /api/verify`, which checks the signature, the event,
 * and marks the ticket used. The page only reads the code and shows the
 * answer, big enough to read at arm's length on a phone.
 */

/** The subset of the Barcode Detection API used here; not in TS's DOM lib yet. */
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
}
type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;

function barcodeDetector(): BarcodeDetectorCtor | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector ?? null;
}

type ResultKind = 'valid' | 'already_used' | 'invalid' | 'error';

interface ScanResult {
  kind: ResultKind;
  message: string;
  usedAt?: string;
  ticketId?: string;
}

/** API outcomes that mean "this ticket must not get in", shown as one red state. */
const INVALID_OUTCOMES = new Set([
  'malformed',
  'invalid_signature',
  'wrong_event',
  'not_valid',
  'not_found',
]);

const SCAN_INTERVAL_MS = 250;
/** How long a result stays up before the camera resumes on its own. */
const RESUME_AFTER_MS = 2500;
const EVENT_STORAGE_KEY = 'veritix:verify-event';

async function submitCode(payload: string, eventId: string): Promise<ScanResult> {
  let response: Response;
  try {
    response = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, eventId }),
    });
  } catch {
    return { kind: 'error', message: 'Could not reach the server. Check the connection and scan again.' };
  }

  const body = (await response.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
    usedAt?: string;
    ticketId?: string;
  };

  if (body.status === 'valid') {
    return { kind: 'valid', message: 'Ticket accepted.', usedAt: body.usedAt, ticketId: body.ticketId };
  }
  if (body.status === 'already_used') {
    return {
      kind: 'already_used',
      message: 'This ticket has already been scanned.',
      usedAt: body.usedAt,
    };
  }
  if (body.status && INVALID_OUTCOMES.has(body.status)) {
    return { kind: 'invalid', message: body.message ?? 'This ticket is not valid.' };
  }
  // No outcome means the request itself failed (signed out, wrong event
  // selected, verification not configured) — not a verdict on the ticket.
  return {
    kind: 'error',
    message: body.message ?? 'Something went wrong. Scan again.',
  };
}

const RESULT_STYLE: Record<ResultKind, { title: string; className: string; Icon: typeof CheckCircle2 }> = {
  valid: {
    title: 'Valid — let them in',
    className: 'border-success bg-success text-success-foreground',
    Icon: CheckCircle2,
  },
  already_used: {
    title: 'Already used',
    className: 'border-warning bg-warning text-warning-foreground',
    Icon: AlertTriangle,
  },
  invalid: {
    title: 'Invalid ticket',
    className: 'border-destructive bg-destructive text-destructive-foreground',
    Icon: XCircle,
  },
  error: {
    title: 'Could not check ticket',
    className: 'border-border bg-muted text-foreground',
    Icon: AlertTriangle,
  },
};

function ResultPanel({ result, onDismiss }: { result: ScanResult; onDismiss: () => void }) {
  const { title, className, Icon } = RESULT_STYLE[result.kind];
  return (
    <div className={cn('rounded-lg border-2 p-5', className)} data-result={result.kind}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-8 w-8 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xl font-semibold">{title}</p>
          <p>{result.message}</p>
          {result.kind === 'already_used' && result.usedAt && (
            <p className="text-sm">First scanned {formatDateTime(result.usedAt)}.</p>
          )}
          {result.kind === 'valid' && result.ticketId && (
            <p className="text-sm opacity-90">Ticket {result.ticketId}</p>
          )}
        </div>
      </div>
      <Button variant="outline" size="sm" className="mt-4 text-foreground" onClick={onDismiss}>
        Scan next ticket
      </Button>
    </div>
  );
}

type CameraState = 'idle' | 'starting' | 'on' | 'unsupported' | 'denied' | 'failed';

export default function VerifyPage() {
  const [events, setEvents] = React.useState<VeritixEvent[] | null>(null);
  const [eventsError, setEventsError] = React.useState(false);
  const [eventId, setEventId] = React.useState('');

  const [result, setResult] = React.useState<ScanResult | null>(null);
  const [checking, setChecking] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [camera, setCamera] = React.useState<CameraState>('idle');

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  // Read inside the scan loop, which must not restart on every render.
  const busyRef = React.useRef(false);
  const eventIdRef = React.useRef('');
  const resumeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  eventIdRef.current = eventId;

  // The organizer's own events. Other events would only ever answer 404.
  React.useEffect(() => {
    let cancelled = false;
    fetch('/api/events?mine=1&pageSize=50')
      .then((res) => (res.ok ? (res.json() as Promise<Paginated<VeritixEvent>>) : Promise.reject()))
      .then((page) => {
        if (cancelled) return;
        const scannable = page.items.filter((e) => e.status === 'published');
        setEvents(scannable);
        let saved = '';
        try {
          saved = localStorage.getItem(EVENT_STORAGE_KEY) ?? '';
        } catch {
          // Storage can be blocked; the picker just starts empty.
        }
        const initial = scannable.find((e) => e.id === saved) ?? (scannable.length === 1 ? scannable[0] : undefined);
        if (initial) setEventId(initial.id);
      })
      .catch(() => !cancelled && setEventsError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const chooseEvent = (id: string) => {
    setEventId(id);
    setResult(null);
    try {
      localStorage.setItem(EVENT_STORAGE_KEY, id);
    } catch {
      // Not remembering the choice is fine.
    }
  };

  const clearResult = React.useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = null;
    busyRef.current = false;
    setResult(null);
  }, []);

  const check = React.useCallback(
    async (payload: string) => {
      const trimmed = payload.trim();
      if (!trimmed || !eventIdRef.current || busyRef.current) return;

      busyRef.current = true;
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      setChecking(true);
      const outcome = await submitCode(trimmed, eventIdRef.current);
      setChecking(false);
      setResult(outcome);

      // A buzz the gate agent can feel without looking down: one for yes,
      // three for no.
      try {
        navigator.vibrate?.(outcome.kind === 'valid' ? 120 : [80, 60, 80, 60, 80]);
      } catch {
        // Unsupported; the panel is the real signal.
      }

      // Keep the camera paused while the result is up so the same ticket,
      // still in frame, is not submitted again as "already used".
      resumeTimer.current = setTimeout(() => {
        busyRef.current = false;
      }, RESUME_AFTER_MS);
    },
    [],
  );

  const stopCamera = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamera((current) => (current === 'on' || current === 'starting' ? 'idle' : current));
  }, []);

  const startCamera = React.useCallback(async () => {
    if (!barcodeDetector() || !navigator.mediaDevices?.getUserMedia) {
      setCamera('unsupported');
      return;
    }
    setCamera('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setCamera('on');
    } catch (error) {
      const name = (error as { name?: string })?.name;
      setCamera(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'failed');
    }
  }, []);

  // Detection loop, running only while the camera is on.
  React.useEffect(() => {
    if (camera !== 'on') return;
    const Detector = barcodeDetector();
    if (!Detector) return;
    const detector = new Detector({ formats: ['qr_code'] });
    let stopped = false;

    const tick = async () => {
      if (stopped) return;
      const video = videoRef.current;
      if (video && video.readyState >= 2 && !busyRef.current) {
        try {
          const codes = await detector.detect(video);
          const value = codes[0]?.rawValue;
          if (value && !stopped) await check(value);
        } catch {
          // A frame that fails to decode is normal; try the next one.
        }
      }
      if (!stopped) setTimeout(tick, SCAN_INTERVAL_MS);
    };
    void tick();

    return () => {
      stopped = true;
    };
  }, [camera, check]);

  // Release the camera when leaving the page.
  React.useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  const submitManual = async (event: React.FormEvent) => {
    event.preventDefault();
    busyRef.current = false;
    await check(code);
    setCode('');
  };

  const cameraMessage: Partial<Record<CameraState, string>> = {
    unsupported:
      'This browser cannot scan QR codes with the camera. Enter the code below instead, or use Chrome on Android.',
    denied: 'Camera access was blocked. Allow it in the browser settings, or enter the code below.',
    failed: 'The camera could not be started. Enter the code below instead.',
  };

  const selectedEvent = events?.find((e) => e.id === eventId);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Verify tickets</h1>
        <p className="text-sm text-muted-foreground">
          Scan a ticket&apos;s QR code, or type the code if the camera is not available.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="verify-event">Event</Label>
        {events === null && !eventsError && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" /> Loading your events…
          </p>
        )}
        {eventsError && (
          <p role="alert" className="text-sm text-destructive">
            Your events could not be loaded. Refresh the page to try again.
          </p>
        )}
        {events && events.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You have no published events to check tickets for.
          </p>
        )}
        {events && events.length > 0 && (
          <select
            id="verify-event"
            value={eventId}
            onChange={(e) => chooseEvent(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>
              Choose the event you are checking in
            </option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} — {formatDateTime(e.startsAt)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Announced as soon as it changes, so a screen-reader user at the gate
          hears the verdict without moving focus. */}
      <div aria-live="assertive" role="status">
        {checking && (
          <p className="flex items-center gap-2 text-sm">
            <Spinner className="h-4 w-4" /> Checking ticket…
          </p>
        )}
        {!checking && result && <ResultPanel result={result} onDismiss={clearResult} />}
      </div>

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
            <Button size="sm" onClick={startCamera} disabled={!selectedEvent}>
              <Camera className="mr-2 h-4 w-4" aria-hidden="true" /> Start camera
            </Button>
          )}
        </div>

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

        {!selectedEvent && camera === 'idle' && events && events.length > 0 && (
          <p className="text-sm text-muted-foreground">Choose an event to start scanning.</p>
        )}
        {cameraMessage[camera] && (
          <p role="alert" className="text-sm text-muted-foreground">
            {cameraMessage[camera]}
          </p>
        )}
      </section>

      <section aria-labelledby="verify-manual-heading" className="space-y-3">
        <h2 id="verify-manual-heading" className="text-lg font-medium">
          Enter code manually
        </h2>
        <form onSubmit={submitManual} className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="verify-code" className="sr-only">
              Ticket code
            </Label>
            <Input
              id="verify-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste or type the ticket code"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={!selectedEvent}
            />
          </div>
          <Button type="submit" disabled={!selectedEvent || !code.trim() || checking}>
            Check ticket
          </Button>
        </form>
      </section>
    </div>
  );
}
