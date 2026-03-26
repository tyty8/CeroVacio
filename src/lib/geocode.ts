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

/** Extract a number from the user query that might be a house number */
function extractNumberFromQuery(query: string): string | null {
  const match = query.match(/\b(\d{2,6})\b/);
  return match ? match[1] : null;
}

/** Build a street-address-first label from structured address parts */
function formatAddress(s: GeocodeSuggestion, query: string): string {
  const a = s.address;
  if (!a) return s.display_name;

  const parts: string[] = [];

  // Street address (number + road)
  if (a.road) {
    let street = a.road;
    // If Nominatim returned a house number, use it
    if (a.house_number) {
      street = `${a.house_number} ${a.road}`;
    } else {
      // Try to extract number from user's original query
      const num = extractNumberFromQuery(query);
      if (num) {
        street = `${num} ${a.road}`;
      }
    }
    parts.push(street);
  }

  // Neighbourhood / suburb
  const area = a.neighbourhood || a.suburb || a.city_district;
  if (area) parts.push(area);

  // City
  const city = a.city || a.town || a.village;
  if (city) parts.push(city);

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

  // Replace display_name with street-address-first format and deduplicate
  for (const r of results) {
    r.display_name = formatAddress(r, query);
  }

  const seen = new Set<string>();
  const unique: GeocodeSuggestion[] = [];
  for (const r of results) {
    if (!seen.has(r.display_name)) {
      seen.add(r.display_name);
      unique.push(r);
    }
  }

  return unique;
}
