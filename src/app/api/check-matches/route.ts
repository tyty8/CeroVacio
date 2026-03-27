import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { routes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { haversineKm } from "@/lib/haversine";

/** Check if coordinates are within the Santiago metropolitan area */
function isInSantiago(lat: number, lng: number): boolean {
  return lat >= -33.7 && lat <= -33.2 && lng >= -70.9 && lng <= -70.4;
}

/** Deterministic pseudo-random number from coordinates (consistent for same input) */
function seededRandom(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const seed = Math.abs(
    Math.sin(lat1 * 1000) * 10000 +
    Math.cos(lng1 * 1000) * 10000 +
    Math.sin(lat2 * 1000) * 10000 +
    Math.cos(lng2 * 1000) * 10000
  );
  return seed - Math.floor(seed); // 0-1
}

export async function POST(request: Request) {
  try {
    const { originLat, originLng, destinationLat, destinationLng } =
      await request.json();

    if (
      originLat == null ||
      originLng == null ||
      destinationLat == null ||
      destinationLng == null
    ) {
      return NextResponse.json(
        { error: "Se requieren coordenadas de origen y destino" },
        { status: 400 }
      );
    }

    const radiusKm = 2;

    const activeRoutes = await db
      .select({
        originLat: routes.originLat,
        originLng: routes.originLng,
        destinationLat: routes.destinationLat,
        destinationLng: routes.destinationLng,
      })
      .from(routes)
      .where(eq(routes.status, "active"));

    let matchCount = 0;
    for (const route of activeRoutes) {
      const originDist = haversineKm(
        originLat,
        originLng,
        route.originLat,
        route.originLng
      );
      const destDist = haversineKm(
        destinationLat,
        destinationLng,
        route.destinationLat,
        route.destinationLng
      );
      if (originDist <= radiusKm && destDist <= radiusKm) {
        matchCount++;
      }
    }

    // For Santiago routes: ensure a minimum appearance of activity
    const bothInSantiago =
      isInSantiago(originLat, originLng) &&
      isInSantiago(destinationLat, destinationLng);

    let tomorrowCount: number | null = null;

    if (bothInSantiago && matchCount < 3) {
      const rand = seededRandom(originLat, originLng, destinationLat, destinationLng);

      if (rand < 0.3) {
        // ~30% chance: 0 today, but show tomorrow availability
        matchCount = 0;
        tomorrowCount = 3 + Math.floor(rand * 30) % 9; // 3-11
      } else {
        // ~70% chance: show 3-11 routes
        matchCount = 3 + Math.floor(rand * 100) % 9; // 3-11
      }
    }

    return NextResponse.json({ matchCount, tomorrowCount });
  } catch (error) {
    console.error("Error checking matches:", error);
    return NextResponse.json(
      { error: "Error al buscar matches" },
      { status: 500 }
    );
  }
}
