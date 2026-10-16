import { QRCodeSVG } from 'qrcode.react';

interface TicketQrProps {
  signedPayload: string;
  size?: number;
  /** Used to name the code for assistive tech, e.g. "Ticket 7f3a for Neon Nights". */
  label?: string;
}

/** Renders the signed ticket payload as a scannable, high-contrast QR code. */
export function TicketQr({
  signedPayload,
  size = 220,
  label = 'Ticket QR code',
}: TicketQrProps) {
  return (
    <div className="inline-block rounded-lg bg-white p-4">
      {/* The SVG had no accessible name at all, so a screen-reader user heard
          nothing where a gate scanner would see a valid ticket. The payload
          itself is never used as the name: it is a signed blob, and reading it
          aloud would be both useless and a small information leak. */}
      <QRCodeSVG
        value={signedPayload}
        size={size}
        level="H"
        bgColor="#ffffff"
        fgColor="#000000"
        role="img"
        aria-label={label}
      />
    </div>
  );
}
