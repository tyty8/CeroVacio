import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, routes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      phone,
      userType,
      originAddress,
      originLat,
      originLng,
      destinationAddress,
      destinationLat,
      destinationLng,
      cargoType,
      palletCount,
      weightKg,
      cargoDescription,
    } = body;

    // Validate required fields
    if (!email || !name || !userType || !originAddress || !destinationAddress) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Find the verified user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.emailVerified) {
      return NextResponse.json(
        { error: "Email no verificado" },
        { status: 403 }
      );
    }

    // Update user name and phone
    await db
      .update(users)
      .set({ name, phone })
      .where(eq(users.email, email));

    // Create the route
    const [route] = await db
      .insert(routes)
      .values({
        userId: user.id,
        userType,
        originAddress,
        originLat,
        originLng,
        destinationAddress,
        destinationLat,
        destinationLng,
        cargoType: cargoType || null,
        palletCount: palletCount || null,
        weightKg: weightKg || null,
        cargoDescription: cargoDescription || null,
      })
      .returning();

    return NextResponse.json({ success: true, routeId: route.id });
  } catch (error) {
    console.error("Error creating route:", error);
    return NextResponse.json(
      { error: "Error al crear la ruta" },
      { status: 500 }
    );
  }
}
