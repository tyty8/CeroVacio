"use client";

import { useState, useEffect, useRef } from "react";
import AddressInput from "@/components/AddressInput";

type UserType = "transportista" | "enviador";

export default function Home() {
  const [userType, setUserType] = useState<UserType>("enviador");
  const [originAddress, setOriginAddress] = useState("");
  const [originLat, setOriginLat] = useState<number | undefined>();
  const [originLng, setOriginLng] = useState<number | undefined>();
  const [destAddress, setDestAddress] = useState("");
  const [destLat, setDestLat] = useState<number | undefined>();
  const [destLng, setDestLng] = useState<number | undefined>();
  const [pickupDate, setPickupDate] = useState("");
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [tomorrowCount, setTomorrowCount] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const canSearch = !!originLat && !!destLat;
  const lastCheckedRef = useRef("");

  // Auto-check matches when both addresses are selected
  useEffect(() => {
    if (!originLat || !originLng || !destLat || !destLng) {
      setMatchCount(null);
      setTomorrowCount(null);
      return;
    }
    const key = `${originLat},${originLng},${destLat},${destLng}`;
    if (key === lastCheckedRef.current) return;
    lastCheckedRef.current = key;

    setIsChecking(true);
    setMatchCount(null);
    setTomorrowCount(null);
    fetch("/api/check-matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originLat, originLng,
        destinationLat: destLat, destinationLng: destLng,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMatchCount(data.matchCount);
        setTomorrowCount(data.tomorrowCount ?? null);
      })
      .catch(() => {})
      .finally(() => setIsChecking(false));
  }, [originLat, originLng, destLat, destLng]);

  const handlePublish = () => {
    const params = new URLSearchParams();
    if (originAddress) params.set("origin", originAddress);
    if (originLat) params.set("olat", String(originLat));
    if (originLng) params.set("olng", String(originLng));
    if (destAddress) params.set("dest", destAddress);
    if (destLat) params.set("dlat", String(destLat));
    if (destLng) params.set("dlng", String(destLng));
    if (pickupDate) params.set("date", pickupDate);
    window.location.href = `/${userType}?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LT</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LuxuTech</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#como-funciona" className="hover:text-blue-600 transition-colors">Cómo funciona</a>
            <a href="#beneficios" className="hover:text-blue-600 transition-colors">Beneficios</a>
          </div>
        </div>
      </nav>

      {/* ─── Hero + Search Bar ─── */}
      <section className="pt-28 pb-40 md:pb-44 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Gana Más con Cada Viaje
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-2 max-w-2xl mx-auto">
            Transportistas: llena tu camión de vuelta y gana más. Enviadores: consigue las mejores tarifas aprovechando camiones que ya van en tu dirección.
          </p>
        </div>
      </section>

      {/* ─── Floating Search Card (overlaps hero) ─── */}
      <div className="max-w-5xl mx-auto px-6 -mt-28 md:-mt-32 relative z-10 mb-12">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          {/* User type toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setUserType("enviador")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                userType === "enviador"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>📦</span> Necesito Enviar
            </button>
            <button
              onClick={() => setUserType("transportista")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                userType === "transportista"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>🚛</span> Soy Transportista
            </button>
          </div>

          {/* Search fields */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Origin */}
            <div className="md:col-span-4">
              <AddressInput
                label="Origen"
                placeholder="¿Desde dónde?"
                value={originAddress}
                onSelect={(addr, lat, lng) => {
                  setOriginAddress(addr); setOriginLat(lat); setOriginLng(lng);
                  setMatchCount(null);
                }}
              />
            </div>

            {/* Destination */}
            <div className="md:col-span-4">
              <AddressInput
                label="Destino"
                placeholder="¿Hacia dónde?"
                value={destAddress}
                onSelect={(addr, lat, lng) => {
                  setDestAddress(addr); setDestLat(lat); setDestLng(lng);
                  setMatchCount(null);
                }}
              />
            </div>

            {/* Date */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action button */}
            <div className="md:col-span-2">
              <button
                onClick={handlePublish}
                disabled={!canSearch}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Publicar ruta
              </button>
            </div>
          </div>

          {/* Match result (auto) */}
          {isChecking && (
            <div className="mt-6 text-center p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500">
              Buscando rutas compatibles...
            </div>
          )}
          {!isChecking && matchCount !== null && (
            <div className={`mt-6 text-center p-5 rounded-xl ${matchCount > 0 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              {matchCount > 0 ? (
                <>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold text-green-600">
                      {matchCount}
                    </span>
                    <p className="text-sm text-left text-green-700">
                      {matchCount === 1
                        ? "ruta compatible encontrada dentro de 2 km de tu origen y destino."
                        : "rutas compatibles encontradas dentro de 2 km de tu origen y destino."}
                    </p>
                  </div>
                  <button
                    onClick={handlePublish}
                    className="mt-4 bg-blue-600 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Publicar y conectar ahora
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-amber-800 font-medium">
                    0 rutas disponibles hoy.
                  </p>
                  {tomorrowCount != null && tomorrowCount > 0 && (
                    <p className="text-sm text-amber-700 mt-1">
                      Mañana hay <strong>{tomorrowCount} rutas</strong> disponibles en esta dirección.
                    </p>
                  )}
                  <p className="text-xs text-amber-600 mt-2">
                    Publica tu ruta ahora y te avisaremos apenas haya un match.
                  </p>
                  <button
                    onClick={handlePublish}
                    className="mt-4 bg-amber-500 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-amber-600 transition-colors"
                  >
                    Publicar mi ruta
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Cómo Funciona ─── */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Cómo funciona
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            En tres simples pasos monetiza tu viaje de retorno o consigue tarifas que no encontrarás en otro lado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📍</span>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Publica tu ruta</h3>
              <p className="text-gray-500">
                Indica tu origen, destino y fecha. Si eres enviador, agrega los detalles de tu carga.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔗</span>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Te encontramos un match</h3>
              <p className="text-gray-500">
                Buscamos rutas compatibles dentro de 2 km de tu origen y destino.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Se conectan</h3>
              <p className="text-gray-500">
                Te enviamos los datos de contacto para que coordinen directamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Beneficios ─── */}
      <section id="beneficios" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Más ingresos, mejores tarifas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tarifas imbatibles</h3>
              <p className="text-sm text-gray-500">Envía a una fracción del precio de mercado usando camiones que ya van en tu dirección.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Match rápido</h3>
              <p className="text-sm text-gray-500">Nuestro algoritmo encuentra coincidencias en segundos.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Verificado</h3>
              <p className="text-sm text-gray-500">Todos los usuarios verifican su email antes de publicar.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Rentabiliza tu retorno</h3>
              <p className="text-sm text-gray-500">Transportistas: convierte cada viaje de vuelta en una oportunidad de ingreso extra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-1">$0</div>
            <div className="text-blue-200">Costo por publicar</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">2 km</div>
            <div className="text-blue-200">Radio de match</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">24/7</div>
            <div className="text-blue-200">Disponible siempre</div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Listo para ganar más o pagar menos?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Publica tu ruta gratis y empieza a ahorrar o generar ingresos hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/enviador"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
              Necesito Enviar
            </a>
            <a href="/transportista"
              className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-colors">
              Soy Transportista
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LT</span>
                </div>
                <span className="text-lg font-bold text-white">LuxuTech</span>
              </div>
              <p className="text-sm leading-relaxed">
                Más ingresos para transportistas, mejores tarifas para enviadores. Conectamos oferta y demanda en las rutas de Chile.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>contacto@luxutech.com</li>
                <li>Santiago, Chile</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} LuxuTech. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
