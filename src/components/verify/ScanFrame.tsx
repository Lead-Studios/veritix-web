"use client";
import { HiArrowLeft, HiCheck, HiX, HiTicket, HiRefresh, HiSearch } from "react-icons/hi";
import { HiQrCode } from "react-icons/hi2";

interface Props { onBack?: () => void; scanning?: boolean; }

export default function ScanFrame({ onBack, scanning = false }: Props) {
  return (
    <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-white/30 bg-black/40 flex items-center justify-center">
      <HiQrCode className="absolute inset-0 m-auto w-20 h-20 text-white/10" />
      {scanning && <div className="absolute inset-x-0 top-0 h-1 bg-primary/60 animate-scan" />}
      <div className="absolute top-2 left-2 flex gap-1">
        <span className="w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-sm" />
      </div>
      <div className="absolute bottom-2 right-2 flex gap-1">
        <span className="w-5 h-5 border-b-2 border-r-2 border-white rounded-br-sm" />
      </div>
      {onBack && (
        <button onClick={onBack} className="absolute top-2 right-2 text-white">
          <HiArrowLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
