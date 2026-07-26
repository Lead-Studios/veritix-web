"use client";

import { useCallback, useRef } from "react";

type ScanResult = "valid" | "invalid";

export function useScanFeedback() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return audioContextRef.current;
  }, []);

  const playBeep = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + duration,
        );
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch (e: unknown) {
        console.error("Audio playback failed", e);
      }
    },
    [getAudioContext],
  );

  const playValidSound = useCallback(() => {
    playBeep(880, 0.15, "sine");
    setTimeout(() => playBeep(1320, 0.2, "sine"), 120);
  }, [playBeep]);

  const playInvalidSound = useCallback(() => {
    playBeep(220, 0.3, "square");
  }, [playBeep]);

  const triggerHaptic = useCallback((type: "valid" | "invalid") => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(type === "valid" ? [50, 30, 50] : [100, 50, 100]);
      }
    } catch (e: unknown) {
      console.error("Haptic feedback failed", e);
    }
  }, []);

  const playFeedback = useCallback(
    (result: ScanResult) => {
      if (result === "valid") {
        playValidSound();
      } else {
        playInvalidSound();
      }
      triggerHaptic(result);
    },
    [playValidSound, playInvalidSound, triggerHaptic],
  );

  return { playFeedback, playValidSound, playInvalidSound, triggerHaptic };
}
