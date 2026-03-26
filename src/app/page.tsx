"use client";

import { useState } from "react";
import AddressInput from "@/components/AddressInput";

export default function Home() {
  // Check matches state
  const [checkOriginAddress, setCheckOriginAddress] = useState("");
  const [checkOriginLat, setCheckOriginLat] = useState<number | undefined>();
  const [checkOriginLng, setCheckOriginLng] = useState<number | undefined>();
  const [checkDestAddress, setCheckDestAddress] = useState("");
  const [checkDestLat, setCheckDestLat] = useState<number | undefined>();
  const [checkDestLng, setCheckDestLng] = useState<number | undefined>();
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckMatches = async () => {
    if (!checkOriginLat || !checkDestLat) return;
    setIsChecking(true);
    setMatchCount(null);
    try {
      const res = await fetch("/api/check-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originLat: checkOriginLat,
          originLng: checkOriginLng,
          destinationLat: checkDestLat,
          destinationLng: checkDestLng,
        }),
      });
      const data = await res.json();
      if (res.ok) setMatchCount(data.matchCount);
    } catch {
      // ignore
    } finally {
      setIsChecking(false);
    }
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
            <a href="#buscar" className="hover:text-blue-600 transition-colors">Buscar matches</a>
          </div>
        </div>
      </nav>

      {/* ─── Hero with CTA Buttons ─── */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Cero Viajes<br />Vacíos
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
              Conectamos transportistas que vuelven con espacio disponible con
              quienes necesitan enviar carga en la misma dirección.
            </p>
          </div>

          {/* ─── Prominent CTA Buttons ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <a
              href="/transportista"
              className="bg-white rounded-2xl p-8 text-left group hover:scale-[1.02] transition-all shadow-xl"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                <span className="text-3xl group-hover:brightness-0 group-hover:invert transition-all">🚛</span>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">Soy Transportista</div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tengo espacio disponible en mi camión de vuelta y quiero ganar dinero extra.
              </p>
              <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:underline">
                Publicar mi ruta →
              </div>
            </a>
            <a
              href="/enviador"
              className="bg-white rounded-2xl p-8 text-left group hover:scale-[1.02] transition-all shadow-xl"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                <span className="text-3xl group-hover:brightness-0 group-hover:invert transition-all">📦</span>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">Necesito Enviar</div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tengo carga que necesito mover de un punto a otro de forma económica.
              </p>
              <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:underline">
                Publicar mi envío →
              </div>
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl">
            <div>
              <div className="text-3xl font-bold">2 km</div>
              <div className="text-blue-200 text-sm mt-1">Radio de match</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$0</div>
              <div className="text-blue-200 text-sm mt-1">Costo por publicar</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-200 text-sm mt-1">Disponible siempre</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cómo Funciona ─── */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Cómo funciona
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            En tres simples pasos conectamos tu carga con un camión que ya va en esa dirección.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📍</span>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Publica tu ruta</h3>
              <p className="text-gray-500">
                Indica tu origen y destino. Si eres enviador, agrega los detalles de tu carga.
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

      {/* ─── Check Matches Section ─── */}
      <section id="buscar" className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Consulta matches disponibles
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Ingresa tu origen y destino para ver cuántas rutas compatibles existen. No se muestran detalles de las rutas.
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            <AddressInput
              label="Origen"
              placeholder="Escribe la dirección de origen..."
              value={checkOriginAddress}
              onSelect={(addr, lat, lng) => {
                setCheckOriginAddress(addr);
                setCheckOriginLat(lat);
                setCheckOriginLng(lng);
                setMatchCount(null);
              }}
            />
            <AddressInput
              label="Destino"
              placeholder="Escribe la dirección de destino..."
              value={checkDestAddress}
              onSelect={(addr, lat, lng) => {
                setCheckDestAddress(addr);
                setCheckDestLat(lat);
                setCheckDestLng(lng);
                setMatchCount(null);
              }}
            />

            <button
              onClick={handleCheckMatches}
              disabled={!checkOriginLat || !checkDestLat || isChecking}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {isChecking ? "Buscando..." : "Ver matches disponibles"}
            </button>

            {matchCount !== null && (
              <div className={`text-center p-6 rounded-xl ${matchCount > 0 ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
                <div className={`text-4xl font-bold mb-2 ${matchCount > 0 ? "text-green-600" : "text-gray-400"}`}>
                  {matchCount}
                </div>
                <p className={`text-sm ${matchCount > 0 ? "text-green-700" : "text-gray-500"}`}>
                  {matchCount === 0
                    ? "No hay rutas compatibles por ahora. Publica tu ruta y te avisaremos cuando haya un match."
                    : matchCount === 1
                      ? "ruta compatible encontrada dentro de 2 km"
                      : "rutas compatibles encontradas dentro de 2 km"}
                </p>
                {matchCount > 0 && (
                  <div className="mt-4 flex gap-3 justify-center">
                    <a href="/transportista" className="text-sm bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                      Soy transportista
                    </a>
                    <a href="/enviador" className="text-sm bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                      Necesito enviar
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Beneficios ─── */}
      <section id="beneficios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Tu aliado de transporte 24/7
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Precios accesibles</h3>
              <p className="text-sm text-gray-500">Aprovecha camiones que ya van en tu dirección a una fracción del costo.</p>
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
              <h3 className="font-bold text-gray-900 mb-2">Sustentable</h3>
              <p className="text-sm text-gray-500">Menos viajes vacíos = menos emisiones de CO2.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para eliminar los viajes vacíos?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Publica tu ruta gratis y encuentra un match hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/transportista"
              className="inline-flex items-center justify-center bg-white text-blue-700 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
              Soy Transportista
            </a>
            <a href="/enviador"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-colors">
              Necesito Enviar
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
                Conectamos transportistas con enviadores para eliminar los viajes vacíos en Chile.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a></li>
                <li><a href="#buscar" className="hover:text-white transition-colors">Buscar matches</a></li>
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
                <li>contacto@luxutech.cl</li>
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
