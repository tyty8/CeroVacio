import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { routes } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";

export async function PATCH(request: Request) {
  try {
    const { routeIds, status } = await request.json();

    if (!routeIds || !Array.isArray(routeIds) || routeIds.length === 0) {
      return NextResponse.json({ error: "routeIds requeridos" }, { status: 400 });
    }

    const validStatuses = ["active", "inactive", "archived", "matched"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    await db
      .update(routes)
      .set({ status })
      .where(inArray(routes.id, routeIds));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating routes:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
