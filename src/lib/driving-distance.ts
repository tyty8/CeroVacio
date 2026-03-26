interface OrsGeoJsonResponse {
  features: {
    properties: {
      summary: { distance: number; duration: number };
    };
  }[];
}

/** Get driving distance (km) and duration (minutes) between two points via OpenRouteService */
export async function getDrivingDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): Promise<{ distanceKm: number; durationMin: number } | null> {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return null;

  try {
    // ORS expects [lng, lat] order
    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?start=${lng1},${lat1}&end=${lng2},${lat2}`,
      {
        headers: { Authorization: apiKey },
      }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as OrsGeoJsonResponse;
    const summary = data.features?.[0]?.properties?.summary;
    if (!summary) return null;

    return {
      distanceKm: Math.round((summary.distance / 1000) * 100) / 100,
      durationMin: Math.round(summary.duration / 60),
    };
  } catch {
    return null;
  }
}
