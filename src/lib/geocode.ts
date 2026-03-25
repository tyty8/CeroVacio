export interface GeocodeSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
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
        "User-Agent": "BackhaulMatch/0.1 (contact@backhaulMatch.cl)",
      },
    }
  );

  if (!res.ok) return [];
  return res.json();
}
