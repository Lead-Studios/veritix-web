import { useState, useCallback } from "react";

type ScanMode = "camera" | "manual";

export function useVerifyScanner() {
  const [mode, setMode] = useState<ScanMode>("camera");
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);

  const handleScan = useCallback((value: string) => {
    setScannerError(null);
    setLastScan(value);
  }, []);

  return { mode, setMode, scannerError, setScannerError, lastScan, handleScan };
}
