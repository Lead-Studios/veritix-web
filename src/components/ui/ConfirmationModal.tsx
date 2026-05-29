"use client";

import { useEffect, useRef } from "react";
import { Modal } from "./Modal";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Renders the confirm button in a destructive (red) style */
  destructive?: boolean;
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmationModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <p className="mb-6 text-sm text-white/70">{message}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
            destructive
              ? "border border-red-500 bg-red-600 hover:bg-red-700"
              : "bg-[#4D21FF] hover:bg-[#3d18e0]"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
