export interface GeocodeSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  address?: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    [key: string]: string | undefined;
  };
}

/** Build a street-address-first label from structured address parts */
function formatAddress(s: GeocodeSuggestion): string {
  const a = s.address;
  if (!a) return s.display_name;

  const parts: string[] = [];

  // Street address (number + road)
  if (a.road) {
    parts.push(a.house_number ? `${a.house_number} ${a.road}` : a.road);
  }

  // Neighbourhood / suburb
  const area = a.neighbourhood || a.suburb || a.city_district;
  if (area) parts.push(area);

  // City
  const city = a.city || a.town || a.village;
  if (city) parts.push(city);

  // State / region
  if (a.state) parts.push(a.state);

  // If we couldn't build anything useful, fall back to display_name
  if (parts.length === 0) return s.display_name;

  return parts.join(", ");
}

/** Search addresses using Nominatim (OSM). Must be called client-side. */
export async function searchAddress(
  query: string
): Promise<GeocodeSuggestion[]> {
  if (query.length < 3) return [];

  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: "5",
    countrycodes: "cl",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        "User-Agent": "LuxuTech/0.1 (contacto@luxutech.com)",
      },
    }
  );

  if (!res.ok) return [];

  const results: GeocodeSuggestion[] = await res.json();

  // Replace display_name with street-address-first format
  for (const r of results) {
    r.display_name = formatAddress(r);
  }

  return results;
}
