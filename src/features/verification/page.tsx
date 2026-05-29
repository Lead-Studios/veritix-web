'use client';

import { useEffect, useRef, useState } from 'react';

type ScanResult = { status: 'valid' | 'invalid' | 'used'; message: string } | null;
type CsvSummary = { succeeded: number; failed: number; errors: string[] } | null;

function parseCsv(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

export default function VerificationPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const [result, setResult] = useState<ScanResult>(null);
  const [loading, setLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // CSV bulk check-in state
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvSummary, setCsvSummary] = useState<CsvSummary>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const verify = async (ticketId: string) => {
    if (!ticketId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(ticketId.trim())}`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      setResult({ status: data.status ?? (res.ok ? 'valid' : 'invalid'), message: data.message ?? (res.ok ? 'Ticket is valid.' : 'Invalid ticket.') });
    } catch {
      setResult({ status: 'invalid', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setCsvSummary({ succeeded: 0, failed: 0, errors: ['File must be a .csv'] });
      return;
    }

    const text = await file.text();
    const codes = parseCsv(text);
    if (codes.length === 0) {
      setCsvSummary({ succeeded: 0, failed: 0, errors: ['CSV is empty or has no valid rows.'] });
      return;
    }

    setCsvLoading(true);
    setCsvSummary(null);

    let succeeded = 0;
    const errors: string[] = [];

    await Promise.all(
      codes.map(async (code) => {
        try {
          const res = await fetch('/api/tickets/check-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          if (res.ok) {
            succeeded++;
          } else {
            const data = await res.json().catch(() => ({}));
            errors.push(`${code}: ${data.message ?? 'Failed'}`);
          }
        } catch {
          errors.push(`${code}: Network error`);
        }
      })
    );

    setCsvSummary({ succeeded, failed: errors.length, errors });
    setCsvLoading(false);
    // reset input so same file can be re-uploaded
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      const msg = err instanceof Error && err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access and try again.'
        : 'Camera not available on this device.';
      setCameraError(msg);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify(manualId);
    setManualId('');
  };

  const resultColors = { valid: 'text-green-400 border-green-500/30 bg-green-500/10', invalid: 'text-red-400 border-red-500/30 bg-red-500/10', used: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' };

  return (
    <div className="min-h-screen bg-[#0b1025] text-white flex flex-col items-center px-4 py-10 gap-6">
      <h1 className="text-2xl font-bold">Ticket Verification</h1>

      {/* Camera scanner */}
      <div className="w-full max-w-sm space-y-3">
        {!cameraActive ? (
          <button
            onClick={startCamera}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] font-semibold text-sm"
          >
            Start Camera Scanner
          </button>
        ) : (
          <div className="space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-[#21d4ff] rounded-lg opacity-70" />
              </div>
            </div>
            <button onClick={stopCamera} className="w-full py-2 rounded-xl border border-white/20 text-sm text-white/70 hover:text-white">
              Stop Camera
            </button>
          </div>
        )}
        {cameraError && <p role="alert" className="text-sm text-red-400 text-center">{cameraError}</p>}
      </div>

      {/* Manual entry fallback */}
      <form onSubmit={handleManualSubmit} className="w-full max-w-sm space-y-2">
        <label className="text-sm text-white/60">Manual Ticket ID Entry</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="Enter ticket ID"
            autoFocus
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#21d4ff]"
          />
          <button
            type="submit"
            disabled={loading || !manualId.trim()}
            className="px-4 py-2 rounded-lg bg-[#4d21ff] text-sm font-semibold disabled:opacity-50"
          >
            {loading ? '…' : 'Verify'}
          </button>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className={`w-full max-w-sm rounded-xl border p-4 text-center text-sm font-medium ${resultColors[result.status]}`}>
          {result.message}
        </div>
      )}

      {/* Bulk CSV check-in */}
      <div className="w-full max-w-sm space-y-3 border-t border-white/10 pt-6">
        <p className="text-sm text-white/60">Bulk Check-in via CSV</p>
        <p className="text-xs text-white/40">Upload a CSV file with one ticket code per row.</p>
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          disabled={csvLoading}
          className="hidden"
          id="csv-upload"
          aria-label="Upload check-ins CSV"
        />
        <label
          htmlFor="csv-upload"
          className={`flex items-center justify-center w-full py-3 rounded-xl border border-dashed border-white/20 text-sm font-semibold cursor-pointer transition hover:border-[#21d4ff] hover:text-[#21d4ff] ${csvLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {csvLoading ? 'Processing…' : 'Upload CSV'}
        </label>

        {csvSummary && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm">
            <p className="text-green-400 font-medium">✓ {csvSummary.succeeded} check-in{csvSummary.succeeded !== 1 ? 's' : ''} succeeded</p>
            {csvSummary.failed > 0 && (
              <>
                <p className="text-red-400 font-medium">✗ {csvSummary.failed} failed</p>
                <ul className="text-xs text-red-300/80 space-y-1 max-h-32 overflow-y-auto">
                  {csvSummary.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
