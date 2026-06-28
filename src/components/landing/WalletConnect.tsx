"use client";

declare global { interface Window { freighter?: { isConnected: () => Promise<boolean>; getPublicKey: () => Promise<string> }; } }

interface Props { className?: string; }

export default function WalletConnect({ className = "" }: Props) {
  const connect = async () => {
    if (!window.freighter) {
      alert("Please install the Freighter wallet extension.");
      return;
    }
    await window.freighter.getPublicKey();
  };

  return (
    <button onClick={connect} className={`px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition ${className}`}>
      Connect Wallet
    </button>
  );
}
