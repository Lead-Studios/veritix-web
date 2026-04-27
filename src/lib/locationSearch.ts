// FE-075: Location search and geocoding helpers for create-event flow

export interface LocationResult {
  displayName: string;
  lat: number;
  lng: number;
  address: {
    street?: string;
    city?: string;
    country?: string;
  };
}

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.length < 3) return [];
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((item: Record<string, unknown>) => ({
    displayName: item.display_name as string,
    lat: parseFloat(item.lat as string),
    lng: parseFloat(item.lon as string),
    address: {
      street: (item.address as Record<string, string>)?.road,
      city:   (item.address as Record<string, string>)?.city,
      country:(item.address as Record<string, string>)?.country,
    },
  }));
}