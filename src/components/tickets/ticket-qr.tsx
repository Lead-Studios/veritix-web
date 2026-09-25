import { QRCodeSVG } from 'qrcode.react';

interface TicketQrProps {
  signedPayload: string;
  size?: number;
}

/** Renders the signed ticket payload as a scannable, high-contrast QR code. */
export function TicketQr({ signedPayload, size = 220 }: TicketQrProps) {
  return (
    <div className="inline-block rounded-lg bg-white p-4">
      <QRCodeSVG value={signedPayload} size={size} level="H" bgColor="#ffffff" fgColor="#000000" />
    </div>
  );
}
