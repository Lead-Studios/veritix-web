/**
 * Centralised contact details and social links for the contact page.
 * Update this file to change support information without touching component markup.
 */
export const contactDetails = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+1 (555) 123-4567",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@veritix.io",
  address:
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS ??
    "123 Blockchain Avenue, San Francisco, CA 94105",
};

export const socialLinks = {
  linkedin:
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ??
    "https://linkedin.com/company/veritix",
  twitter:
    process.env.NEXT_PUBLIC_SOCIAL_TWITTER ?? "https://twitter.com/veritix",
  github:
    process.env.NEXT_PUBLIC_SOCIAL_GITHUB ?? "https://github.com/veritix",
};

/**
 * Submit the contact form data to the backend API.
 * @param data - The form data (name, email, subject, message)
 * @returns A promise that resolves to the response JSON
 * @throws An error if the submission fails
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to send your message. Please try again.");
  }

  return res.json();
}
