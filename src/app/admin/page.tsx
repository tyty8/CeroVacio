import { db } from "@/lib/db";
import { routes, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { haversineKm } from "@/lib/haversine";

interface RouteWithUser {
  route: typeof routes.$inferSelect;
  user: typeof users.$inferSelect;
}

interface Match {
  routeA: RouteWithUser;
  routeB: RouteWithUser;
  originDistanceKm: number;
  destinationDistanceKm: number;
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Fetch all active routes with user data
  const allRoutes = await db
    .select({
      route: routes,
      user: users,
    })
    .from(routes)
    .innerJoin(users, eq(routes.userId, users.id))
    .where(eq(routes.status, "active"));

  // Compute matches (O(n²) — fine for small dataset)
  const matches: Match[] = [];
  for (let i = 0; i < allRoutes.length; i++) {
    for (let j = i + 1; j < allRoutes.length; j++) {
      const a = allRoutes[i];
      const b = allRoutes[j];

      // Skip same user
      if (a.route.userId === b.route.userId) continue;

      const originDist = haversineKm(
        a.route.originLat,
        a.route.originLng,
        b.route.originLat,
        b.route.originLng
      );
      const destDist = haversineKm(
        a.route.destinationLat,
        a.route.destinationLng,
        b.route.destinationLat,
        b.route.destinationLng
      );

      if (originDist <= 2 && destDist <= 2) {
        matches.push({
          routeA: a,
          routeB: b,
          originDistanceKm: Math.round(originDist * 100) / 100,
          destinationDistanceKm: Math.round(destDist * 100) / 100,
        });
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">
            BackhaulMatch — Admin
          </h1>
          <span className="text-sm text-gray-500">
            {allRoutes.length} rutas activas
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Matches Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Matches encontrados ({matches.length})
          </h2>

          {matches.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border">
              No hay matches dentro de 2 km todavía.
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      MATCH
                    </span>
                    <span className="text-xs text-gray-400">
                      Origen: {match.originDistanceKm} km | Destino:{" "}
                      {match.destinationDistanceKm} km
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Route A */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {match.routeA.route.userType === "transportista"
                            ? "🚛"
                            : "📦"}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {match.routeA.user.name || "Sin nombre"}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {match.routeA.route.userType}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Origen:</strong>{" "}
                          {match.routeA.route.originAddress}
                        </p>
                        <p>
                          <strong>Destino:</strong>{" "}
                          {match.routeA.route.destinationAddress}
                        </p>
                        {match.routeA.route.cargoType && (
                          <p>
                            <strong>Carga:</strong>{" "}
                            {match.routeA.route.cargoType === "refrigerated"
                              ? "Refrigerado"
                              : "General"}
                            {match.routeA.route.palletCount &&
                              ` — ${match.routeA.route.palletCount} pallets`}
                            {match.routeA.route.weightKg &&
                              ` — ${match.routeA.route.weightKg} kg`}
                          </p>
                        )}
                        {match.routeA.route.cargoDescription && (
                          <p>
                            <strong>Detalle:</strong>{" "}
                            {match.routeA.route.cargoDescription}
                          </p>
                        )}
                      </div>
                      <div className="text-sm border-t pt-2 mt-2 text-gray-700">
                        <p>
                          📧 {match.routeA.user.email}
                        </p>
                        <p>
                          📞 {match.routeA.user.phone || "Sin teléfono"}
                        </p>
                      </div>
                    </div>

                    {/* Route B */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {match.routeB.route.userType === "transportista"
                            ? "🚛"
                            : "📦"}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {match.routeB.user.name || "Sin nombre"}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {match.routeB.route.userType}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Origen:</strong>{" "}
                          {match.routeB.route.originAddress}
                        </p>
                        <p>
                          <strong>Destino:</strong>{" "}
                          {match.routeB.route.destinationAddress}
                        </p>
                        {match.routeB.route.cargoType && (
                          <p>
                            <strong>Carga:</strong>{" "}
                            {match.routeB.route.cargoType === "refrigerated"
                              ? "Refrigerado"
                              : "General"}
                            {match.routeB.route.palletCount &&
                              ` — ${match.routeB.route.palletCount} pallets`}
                            {match.routeB.route.weightKg &&
                              ` — ${match.routeB.route.weightKg} kg`}
                          </p>
                        )}
                        {match.routeB.route.cargoDescription && (
                          <p>
                            <strong>Detalle:</strong>{" "}
                            {match.routeB.route.cargoDescription}
                          </p>
                        )}
                      </div>
                      <div className="text-sm border-t pt-2 mt-2 text-gray-700">
                        <p>
                          📧 {match.routeB.user.email}
                        </p>
                        <p>
                          📞 {match.routeB.user.phone || "Sin teléfono"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Routes Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Todas las rutas ({allRoutes.length})
          </h2>

          {allRoutes.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border">
              No hay rutas registradas todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl border text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      Tipo
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      Usuario
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      Origen
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      Destino
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      Carga
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      Contacto
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allRoutes.map(({ route, user }) => (
                    <tr key={route.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            route.userType === "transportista"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {route.userType === "transportista" ? "🚛" : "📦"}{" "}
                          {route.userType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {user.name || "—"}
                      </td>
                      <td className="px-4 py-3 max-w-[200px] truncate">
                        {route.originAddress}
                      </td>
                      <td className="px-4 py-3 max-w-[200px] truncate">
                        {route.destinationAddress}
                      </td>
                      <td className="px-4 py-3">
                        {route.cargoType
                          ? `${route.cargoType === "refrigerated" ? "Refrig." : "General"}${route.palletCount ? ` ${route.palletCount}p` : ""}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div>{user.email}</div>
                        <div>{user.phone || "—"}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {route.createdAt.toLocaleDateString("es-CL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
