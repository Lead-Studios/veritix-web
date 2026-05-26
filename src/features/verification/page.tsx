'use client';

import { useEffect, useRef, useState } from 'react';

type ScanResult = { status: 'valid' | 'invalid' | 'used'; message: string } | null;

export default function VerificationPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const [result, setResult] = useState<ScanResult>(null);
  const [loading, setLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

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
    </div>
  );
}
