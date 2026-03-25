import { db } from "@/lib/db";
import { routes, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { haversineKm } from "@/lib/haversine";
import Link from "next/link";
import { RouteActions } from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function MatchedPage() {
  let matchedRoutes: { route: typeof routes.$inferSelect; user: typeof users.$inferSelect }[] = [];
  let error: string | null = null;

  try {
    matchedRoutes = await db
      .select({ route: routes, user: users })
      .from(routes)
      .innerJoin(users, eq(routes.userId, users.id))
      .where(eq(routes.status, "matched"));
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border-2 border-red-200 p-8 max-w-2xl w-full">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
          <pre className="bg-red-50 p-4 rounded-lg text-sm text-red-800 whitespace-pre-wrap break-all">{error}</pre>
        </div>
      </main>
    );
  }

  // Group matched routes into pairs by proximity
  const paired: { a: typeof matchedRoutes[0]; b: typeof matchedRoutes[0]; originDist: number; destDist: number }[] = [];
  const used = new Set<string>();

  for (let i = 0; i < matchedRoutes.length; i++) {
    if (used.has(matchedRoutes[i].route.id)) continue;
    for (let j = i + 1; j < matchedRoutes.length; j++) {
      if (used.has(matchedRoutes[j].route.id)) continue;
      if (matchedRoutes[i].route.userId === matchedRoutes[j].route.userId) continue;

      const originDist = haversineKm(
        matchedRoutes[i].route.originLat, matchedRoutes[i].route.originLng,
        matchedRoutes[j].route.originLat, matchedRoutes[j].route.originLng
      );
      const destDist = haversineKm(
        matchedRoutes[i].route.destinationLat, matchedRoutes[i].route.destinationLng,
        matchedRoutes[j].route.destinationLat, matchedRoutes[j].route.destinationLng
      );

      if (originDist <= 2 && destDist <= 2) {
        paired.push({
          a: matchedRoutes[i], b: matchedRoutes[j],
          originDist: Math.round(originDist * 100) / 100,
          destDist: Math.round(destDist * 100) / 100,
        });
        used.add(matchedRoutes[i].route.id);
        used.add(matchedRoutes[j].route.id);
        break;
      }
    }
  }

  // Routes that are matched but couldn't be paired (orphaned)
  const unpaired = matchedRoutes.filter(r => !used.has(r.route.id));

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-blue-600 hover:underline font-medium">
              ← Volver
            </Link>
            <h1 className="text-xl font-bold text-green-700">Matched</h1>
          </div>
          <span className="text-sm text-gray-500">{matchedRoutes.length} rutas matched</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Paired matches */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Parejas confirmadas ({paired.length})
          </h2>

          {paired.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border">
              No hay matches confirmados todavía.
            </div>
          ) : (
            <div className="space-y-4">
              {paired.map((pair, idx) => (
                <div key={idx} className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      MATCHED
                    </span>
                    <span className="text-xs text-gray-400">
                      Origen: {pair.originDist} km | Destino: {pair.destDist} km
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[pair.a, pair.b].map((item, i) => (
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

        {/* Unpaired matched routes */}
        {unpaired.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Rutas matched sin pareja ({unpaired.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl border text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Usuario</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Origen</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Destino</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Contacto</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaired.map(({ route, user }) => (
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
                      <td className="px-4 py-3 text-xs">
                        <div>{user.email}</div>
                        <div>{user.phone || "—"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <RouteActions routeId={route.id} currentStatus="matched" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
