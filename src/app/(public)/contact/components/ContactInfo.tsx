import { Phone, Mail, MapPin, Linkedin, Twitter, Github } from "lucide-react";

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
          value="+1 (555) 123-4567"
        />
        <InfoItem
          icon={<Mail size={18} />}
          title="Email"
          value="support@veritix.io"
        />
        <InfoItem
          icon={<MapPin size={18} />}
          title="Location"
          value="123 Blockchain Avenue, San Francisco, CA 94105"
        />
      </div>

      <div className="flex gap-4 mt-10">
        <SocialIcon icon={<Linkedin size={18} />} />
        <SocialIcon icon={<Twitter size={18} />} />
        <SocialIcon icon={<Github size={18} />} />
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

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition cursor-pointer">
      {icon}
    </div>
  );
}
