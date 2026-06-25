"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HiCamera, HiX, HiSwitchHorizontal, HiOutlinePause, HiOutlinePlay, HiQrcode } from "react-icons/hi";

interface QRScannerProps {
  onScan: (decoded: string) => void;
  onError: (message: string) => void;
  onModeChange: (mode: "camera" | "manual") => void;
  mode: "camera" | "manual";
}

const hasBarcodeDetector = typeof window !== "undefined" && "BarcodeDetector" in window;

function buildVideoConstraints() {
  return {
    audio: false,
    video: {
      facingMode: "environment",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  };
}

export default function QRScanner({ onScan, onError, onModeChange, mode }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);
  const [permissionState, setPermissionState] = useState<"pending" | "granted" | "denied">("pending");
  const [scanning, setScanning] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);

  const isDesktop = useMemo(() => window?.innerWidth >= 1024, []);

  const stopCamera = () => {
    if (scanLoopRef.current !== null) {
      window.clearInterval(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const captureFrame = async (): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video || video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  };

  const scanFrame = async () => {
    if (!videoRef.current) return;
    if (hasBarcodeDetector) {
      try {
        const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes.length > 0 && barcodes[0].rawValue) {
          onScan(barcodes[0].rawValue);
          stopCamera();
        }
        return;
      } catch (error) {
        // fallback to manual scanning if the API throws
      }
    }

    const frameBlob = await captureFrame();
    if (!frameBlob) return;

    try {
      const imageBitmap = await createImageBitmap(frameBlob);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(imageBitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const barcodeDetector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      const barcodes = await barcodeDetector.detect(imageData);
      if (barcodes.length > 0 && barcodes[0].rawValue) {
        onScan(barcodes[0].rawValue);
        stopCamera();
      }
    } catch (err) {
      onError("Unable to scan from the camera feed. Please use manual entry.");
      stopCamera();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(buildVideoConstraints());
      streamRef.current = stream;
      setPermissionState("granted");
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      scanLoopRef.current = window.setInterval(scanFrame, 900);
    } catch (error) {
      setPermissionState("denied");
      onError("Camera access denied. Please use manual ticket entry instead.");
    }
  };

  useEffect(() => {
    setCameraSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
    if (mode === "camera") {
      startCamera();
    }
    return () => stopCamera();
  }, [mode]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#020718]/80 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-blue-300">QR scanner</p>
            <h2 className="text-2xl font-semibold text-white">Live camera verification</h2>
          </div>
          <button
            type="button"
            onClick={() => onModeChange(mode === "camera" ? "manual" : "camera")}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 px-4 py-2 text-sm text-blue-200 hover:border-blue-300/40"
          >
            <HiSwitchHorizontal className="w-4 h-4" />
            {mode === "camera" ? "Use manual entry" : "Use camera scanning"}
          </button>
        </div>

        {mode === "camera" ? (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-black/40 h-[320px] flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <div className="pointer-events-none absolute inset-0 border-4 border-dashed border-white/10" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-sm text-gray-300 bg-black/40">
                {permissionState === "pending" && "Requesting camera access…"}
                {permissionState === "granted" && scanning && "Scanning for QR codes…"}
                {permissionState === "denied" && "Camera access denied. Manual entry is available."}
              </div>
              {!cameraSupported && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-center text-white">
                  <HiCamera className="w-12 h-12" />
                  <p>Camera scanning is unavailable in this browser.</p>
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!cameraSupported || permissionState === "denied"}
                onClick={startCamera}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] px-4 py-3 text-white font-semibold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HiOutlinePlay className="w-4 h-4" />
                Start Camera
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white hover:border-white/20"
              >
                <HiOutlinePause className="w-4 h-4" />
                Stop Camera
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300">
            <p>Camera scanning is disabled. Use the ticket-code field below to verify the ticket manually.</p>
            <p className="mt-2 text-xs text-gray-500">This mode is recommended on desktop or devices without camera permission.</p>
          </div>
        )}
      </div>
    </div>
  );
}
