"use client";

import { useState, useEffect, useRef } from "react";
import AddressInput from "@/components/AddressInput";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
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
    trackEvent("cta_click", { location: "search_card", user_type: "enviador" });
    const params = new URLSearchParams();
    if (originAddress) params.set("origin", originAddress);
    if (originLat) params.set("olat", String(originLat));
    if (originLng) params.set("olng", String(originLng));
    if (destAddress) params.set("dest", destAddress);
    if (destLat) params.set("dlat", String(destLat));
    if (destLng) params.set("dlng", String(destLng));
    if (pickupDate) params.set("date", pickupDate);
    window.location.href = `/enviador?${params.toString()}`;
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
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#como-funciona" className="hidden md:inline hover:text-blue-600 transition-colors">Cómo funciona</a>
            <a href="#beneficios" className="hidden md:inline hover:text-blue-600 transition-colors">Beneficios</a>
            <a
              href="/transportista"
              onClick={() => trackEvent("nav_click", { target: "transportista" })}
              className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Soy Transportista
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-28 pb-40 md:pb-44 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Envía tu Carga por hasta un 24% Menos
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-2 max-w-2xl mx-auto">
            Conectamos tu carga con camiones que ya van en tu dirección. Tarifas más bajas porque el camión ya hace el viaje.
          </p>
        </div>
      </section>

      {/* ─── Floating Search Card ─── */}
      <div className="max-w-5xl mx-auto px-6 -mt-28 md:-mt-32 relative z-10 mb-12">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">¿Qué necesitas enviar?</h2>
          <p className="text-sm text-gray-500 mb-6">Ingresa tu ruta y te encontramos un camión disponible.</p>

          {/* Search fields */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
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

            <div className="md:col-span-2">
              <button
                onClick={handlePublish}
                disabled={!canSearch}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Buscar camión
              </button>
            </div>
          </div>

          {/* Risk reversal */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-gray-400">
            <span>100% gratis, sin comisiones ocultas</span>
            <span className="hidden sm:inline">|</span>
            <span>Tus datos solo se comparten con tu match</span>
            <span className="hidden sm:inline">|</span>
            <span>Publica en menos de 2 minutos</span>
          </div>

          {/* Match result (auto) */}
          {isChecking && (
            <div className="mt-6 text-center p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500">
              Buscando camiones disponibles...
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
                        ? "camión disponible cerca de tu ruta."
                        : "camiones disponibles cerca de tu ruta."}
                    </p>
                  </div>
                  <button
                    onClick={handlePublish}
                    className="mt-4 bg-blue-600 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Cotizar ahora
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-amber-800 font-medium">
                    No hay camiones disponibles hoy en esta ruta.
                  </p>
                  {tomorrowCount != null && tomorrowCount > 0 && (
                    <p className="text-sm text-amber-700 mt-1">
                      Mañana hay <strong>{tomorrowCount} camiones</strong> disponibles en esta dirección.
                    </p>
                  )}
                  <p className="text-xs text-amber-600 mt-2">
                    Publica tu envío ahora y te avisaremos apenas haya un camión disponible.
                  </p>
                  <button
                    onClick={handlePublish}
                    className="mt-4 bg-amber-500 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-amber-600 transition-colors"
                  >
                    Publicar mi envío
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
            En tres simples pasos tu carga viaja por una fracción del precio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Publica tu envío</h3>
              <p className="text-gray-500">
                Indica origen, destino, fecha y los detalles de tu carga.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚛</span>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Te encontramos un camión</h3>
              <p className="text-gray-500">
                Buscamos camiones que ya van en tu dirección y tienen espacio disponible.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Coordinan y ahorras</h3>
              <p className="text-gray-500">
                Te conectamos con el transportista para que acuerden precio y detalles directamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Beneficios ─── */}
      <section id="beneficios" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            ¿Por qué enviar con LuxuTech?
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            Tarifas que no encontrarás en ningún otro lado, porque conectamos tu carga con camiones que ya hacen el viaje.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Ahorra en promedio un 24%</h3>
              <p className="text-sm text-gray-500">Paga una fracción del precio de mercado porque el camión ya hace el viaje.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Match en segundos</h3>
              <p className="text-sm text-gray-500">Nuestro algoritmo busca camiones compatibles con tu ruta al instante.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Transportistas verificados</h3>
              <p className="text-sm text-gray-500">Todos los transportistas verifican su identidad antes de publicar.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Te avisamos</h3>
              <p className="text-sm text-gray-500">Si no hay match hoy, te notificamos apenas aparezca un camión en tu ruta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Empresas y emprendedores que ya ahorran con LuxuTech.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                &ldquo;Necesitábamos enviar maquinaria a Concepción y nos cotizaron $800.000. Por LuxuTech encontramos un camión que ya iba para allá y pagamos $350.000. Más de un 50% de ahorro.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">MV</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">María V.</div>
                  <div className="text-xs text-gray-500">Pyme en Santiago</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                &ldquo;Enviamos productos agrícolas cada semana desde Rancagua al sur. Antes pagábamos flete completo, ahora usamos LuxuTech y estamos ahorrando casi $400.000 al mes.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">PG</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Pedro G.</div>
                  <div className="text-xs text-gray-500">Exportadora agrícola, Rancagua</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                &ldquo;Enviamos pallets de impresos a clientes en todo Chile. Antes el flete nos comía el margen. Con LuxuTech encontramos camiones que ya van a destino y bajamos los costos de envío casi a la mitad.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">RA</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Roberto A.</div>
                  <div className="text-xs text-gray-500">Imprenta, Santiago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-1">24%</div>
            <div className="text-blue-200">Ahorro promedio</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">500+</div>
            <div className="text-blue-200">Envíos realizados</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">$0</div>
            <div className="text-blue-200">Costo por publicar</div>
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
            ¿Listo para ahorrar en tu próximo envío?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Publica tu envío gratis y recibe cotizaciones de camiones que ya van en tu dirección.
          </p>
          <a href="/enviador"
            onClick={() => trackEvent("cta_click", { location: "bottom_banner", user_type: "enviador" })}
            className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
            Publicar mi envío gratis
          </a>
          <p className="mt-6 text-sm text-gray-400">
            100% gratis. Sin comisiones ocultas. Tu información solo se comparte con tu match confirmado.
          </p>
        </div>
      </section>

      {/* ─── Floating WhatsApp Button ─── */}
      <a
        href="https://wa.me/56996119028?text=Hola%2C%20necesito%20enviar%20una%20carga"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click", { location: "floating_button" })}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors hover:scale-110 transform"
        aria-label="Escríbenos por WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

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
                Envía tu carga por menos aprovechando camiones que ya van en tu dirección. La forma más inteligente de mover carga en Chile.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a></li>
                <li><a href="/transportista" className="hover:text-white transition-colors">Para Transportistas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
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
