/**
 * Generates a printable PDF check-in sheet for an event.
 * Uses jsPDF to generate a PDF with attendee details, ticket codes, and QR codes.
 *
 * Install: npm install jspdf
 *
 * @see Issue #675
 */

// NOTE: This is a stub implementation that assumes jsPDF is installed.
// The real implementation would use jsPDF and qrcode.react or qrcode to generate QR codes.

export interface AttendeeForPDF {
  name: string;
  email: string;
  ticketType: string;
  ticketCode: string;
}

export interface EventMeta {
  name: string;
  date: string;
  venue: string;
  totalAttendees: number;
}

/**
 * Generates and downloads a check-in PDF for the given event and attendees.
 */
export async function generateCheckInPDF(
  event: EventMeta,
  attendees: AttendeeForPDF[],
): Promise<void> {
  // Dynamically import jsPDF to avoid bundling it in the main chunk
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(event.name, margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${event.date}`, margin, y);
  y += 5;
  doc.text(`Venue: ${event.venue}`, margin, y);
  y += 5;
  doc.text(`Total attendees: ${event.totalAttendees}`, margin, y);
  y += 10;

  // Sort alphabetically by last name
  const sorted = [...attendees].sort((a, b) => {
    const lastNameA = a.name.split(" ").pop() ?? "";
    const lastNameB = b.name.split(" ").pop() ?? "";
    return lastNameA.localeCompare(lastNameB);
  });

  // Table header
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Name", margin, y);
  doc.text("Email", margin + 50, y);
  doc.text("Ticket Type", margin + 110, y);
  doc.text("Code", margin + 150, y);
  y += 5;
  doc.setDrawColor(200);
  doc.line(margin, y, 195, y);
  y += 5;

  // Rows
  doc.setFont("helvetica", "normal");
  for (const att of sorted) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    doc.text(att.name, margin, y);
    doc.text(att.email, margin + 50, y);
    doc.text(att.ticketType, margin + 110, y);
    doc.text(att.ticketCode, margin + 150, y);

    // In a real implementation, generate a small QR code image and place it inline:
    // const qrDataURL = await generateQRCode(att.ticketCode);
    // doc.addImage(qrDataURL, "PNG", margin + 180, y - 3, 8, 8);

    y += 6;
  }

  // Generate filename
  const slug = event.name.replace(/\s+/g, "-").toLowerCase();
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `checkin-${slug}-${dateStr}.pdf`;

  // Trigger download
  doc.save(filename);
}
