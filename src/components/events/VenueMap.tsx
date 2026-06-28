"use client";

interface VenueMapProps { venue: string; city: string; }

export default function VenueMap({ venue, city }: VenueMapProps) {
  const query = encodeURIComponent(`${venue}, ${city}`);
  const src = `https://maps.google.com/maps?q=${query}&output=embed`;
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Venue</h2>
      <p className="text-gray-600 mb-3">{venue} · {city}</p>
      <div className="rounded-xl overflow-hidden border border-gray-200 h-64">
        <iframe title="Venue map" src={src} width="100%" height="100%"
          style={{ border: 0 }} allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
  );
}
