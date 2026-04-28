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
