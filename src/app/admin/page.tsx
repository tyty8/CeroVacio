import { db } from "@/lib/db";
import { routes, users } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import { haversineKm } from "@/lib/haversine";
import { RouteActions, MatchActions } from "@/components/AdminActions";
import Link from "next/link";

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

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab || "active";

  let allRoutes: RouteWithUser[] = [];
  let matches: Match[] = [];
  let matchedCount = 0;
  let error: string | null = null;

  try {
    const [matchedResult] = await db
      .select({ value: count() })
      .from(routes)
      .where(eq(routes.status, "matched"));
    matchedCount = matchedResult?.value || 0;

    const statusFilter = tab === "archived" ? "archived" : "active";

    allRoutes = await db
      .select({ route: routes, user: users })
      .from(routes)
      .innerJoin(users, eq(routes.userId, users.id))
      .where(eq(routes.status, statusFilter as "active" | "archived"));

    // Only compute matches for active routes
    if (tab === "active") {
      for (let i = 0; i < allRoutes.length; i++) {
        for (let j = i + 1; j < allRoutes.length; j++) {
          const a = allRoutes[i];
          const b = allRoutes[j];
          if (a.route.userId === b.route.userId) continue;

          const originDist = haversineKm(
            a.route.originLat, a.route.originLng,
            b.route.originLat, b.route.originLng
          );
          const destDist = haversineKm(
            a.route.destinationLat, a.route.destinationLng,
            b.route.destinationLat, b.route.destinationLng
          );

          if (originDist <= 2 && destDist <= 2) {
            matches.push({
              routeA: a, routeB: b,
              originDistanceKm: Math.round(originDist * 100) / 100,
              destinationDistanceKm: Math.round(destDist * 100) / 100,
            });
          }
        }
      }
    }
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border-2 border-red-200 p-8 max-w-2xl w-full">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error en Admin</h1>
          <pre className="bg-red-50 p-4 rounded-lg text-sm text-red-800 overflow-x-auto whitespace-pre-wrap break-all">{error}</pre>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">CeroVacío — Admin</h1>
          <Link href="/admin/matched"
            className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors">
            Ver Matched ({matchedCount})
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Tabs */}
        <div className="flex gap-2">
          <Link href="/admin?tab=active"
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === "active" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}>
            Activas ({tab === "active" ? allRoutes.length : "..."})
          </Link>
          <Link href="/admin?tab=archived"
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === "archived" ? "bg-yellow-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}>
            Archivadas ({tab === "archived" ? allRoutes.length : "..."})
          </Link>
        </div>

        {/* Matches Section (only on active tab) */}
        {tab === "active" && (
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
                  <div key={idx} className="bg-white rounded-xl border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        MATCH
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">
                          Origen: {match.originDistanceKm} km | Destino: {match.destinationDistanceKm} km
                        </span>
                        <MatchActions routeAId={match.routeA.route.id} routeBId={match.routeB.route.id} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[match.routeA, match.routeB].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {item.route.userType === "transportista" ? "🚛" : "📦"}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {item.user.name || "Sin nombre"}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {item.route.userType}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Origen:</strong> {item.route.originAddress}</p>
                            <p><strong>Destino:</strong> {item.route.destinationAddress}</p>
                            {item.route.cargoType && (
                              <p>
                                <strong>Carga:</strong>{" "}
                                {item.route.cargoType === "refrigerated" ? "Refrigerado" : "General"}
                                {item.route.palletCount && ` — ${item.route.palletCount} pallets`}
                                {item.route.weightKg && ` — ${item.route.weightKg} kg`}
                              </p>
                            )}
                            {item.route.cargoDescription && (
                              <p><strong>Detalle:</strong> {item.route.cargoDescription}</p>
                            )}
                          </div>
                          <div className="text-sm border-t pt-2 mt-2 text-gray-700">
                            <p>📧 {item.user.email}</p>
                            <p>📞 {item.user.phone || "Sin teléfono"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Routes Table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {tab === "active" ? "Todas las rutas activas" : "Rutas archivadas"} ({allRoutes.length})
          </h2>

          {allRoutes.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border">
              {tab === "active" ? "No hay rutas activas." : "No hay rutas archivadas."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl border text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Usuario</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Origen</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Destino</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Carga</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Contacto</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Fecha</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {allRoutes.map(({ route, user }) => (
                    <tr key={route.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          route.userType === "transportista"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {route.userType === "transportista" ? "🚛" : "📦"} {route.userType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{user.name || "—"}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate">{route.originAddress}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate">{route.destinationAddress}</td>
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
                      <td className="px-4 py-3">
                        <RouteActions routeId={route.id} currentStatus={route.status} />
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
