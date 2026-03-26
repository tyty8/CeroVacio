import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { routes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { haversineKm } from "@/lib/haversine";

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

    return NextResponse.json({ matchCount });
  } catch (error) {
    console.error("Error checking matches:", error);
    return NextResponse.json(
      { error: "Error al buscar matches" },
      { status: 500 }
    );
  }
}
