import { Phone, Mail, MapPin, Linkedin, Twitter, Github } from "lucide-react";
import { contactDetails, socialLinks } from "@/lib/contactConfig";

export default function ContactInfo() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>

      <p className="text-white/70 max-w-md mb-10">
        Have questions about Veritix or need assistance with our
        blockchain-powered ticketing platform? Our team is here to help you
        revolutionize your event experience.
      </p>

      <div className="space-y-6">
        <InfoItem
          icon={<Phone size={18} />}
          title="Phone"
          value={contactDetails.phone}
        />
        <InfoItem
          icon={<Mail size={18} />}
          title="Email"
          value={contactDetails.email}
        />
        <InfoItem
          icon={<MapPin size={18} />}
          title="Location"
          value={contactDetails.address}
        />
      </div>

      <div className="flex gap-4 mt-10">
        <SocialIcon
          icon={<Linkedin size={18} />}
          href={socialLinks.linkedin}
          label="LinkedIn"
        />
        <SocialIcon
          icon={<Twitter size={18} />}
          href={socialLinks.twitter}
          label="Twitter"
        />
        <SocialIcon
          icon={<Github size={18} />}
          href={socialLinks.github}
          label="GitHub"
        />
      </div>
    </>
  );
}

function InfoItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-white/60">{value}</p>
      </div>
    </div>
  );
}

function SocialIcon({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition"
    >
      {icon}
    </a>
  );
}
