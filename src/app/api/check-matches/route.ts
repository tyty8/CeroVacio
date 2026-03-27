import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { routes, matchCache } from "@/lib/schema";
import { eq, gt } from "drizzle-orm";
import { haversineKm } from "@/lib/haversine";

/** Check if coordinates are within the Santiago metropolitan area */
function isInSantiago(lat: number, lng: number): boolean {
  return lat >= -33.7 && lat <= -33.2 && lng >= -70.9 && lng <= -70.4;
}

/** Round coords to ~100m precision for cache key consistency */
function coordKey(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const r = (n: number) => n.toFixed(3);
  return `${r(lat1)},${r(lng1)},${r(lat2)},${r(lng2)}`;
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

    const key = coordKey(originLat, originLng, destinationLat, destinationLng);

    // Check cache first
    const [cached] = await db
      .select()
      .from(matchCache)
      .where(eq(matchCache.coordKey, key))
      .limit(1);

    if (cached && cached.expiresAt > new Date()) {
      return NextResponse.json({
        matchCount: cached.matchCount,
        tomorrowCount: cached.tomorrowCount,
      });
    }

    // Compute real matches
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
        originLat, originLng,
        route.originLat, route.originLng
      );
      const destDist = haversineKm(
        destinationLat, destinationLng,
        route.destinationLat, route.destinationLng
      );
      if (originDist <= radiusKm && destDist <= radiusKm) {
        matchCount++;
      }
    }

    // For Santiago: simulate activity if real matches are low
    const bothInSantiago =
      isInSantiago(originLat, originLng) &&
      isInSantiago(destinationLat, destinationLng);

    let tomorrowCount: number | null = null;

    if (bothInSantiago && matchCount < 3) {
      const rand = Math.random();

      if (rand < 0.3) {
        matchCount = 0;
        tomorrowCount = 3 + Math.floor(Math.random() * 9); // 3-11
      } else {
        matchCount = 3 + Math.floor(Math.random() * 9); // 3-11
      }
    }

    // Save to cache (24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (cached) {
      await db
        .update(matchCache)
        .set({ matchCount, tomorrowCount, expiresAt })
        .where(eq(matchCache.coordKey, key));
    } else {
      await db
        .insert(matchCache)
        .values({ coordKey: key, matchCount, tomorrowCount, expiresAt });
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
