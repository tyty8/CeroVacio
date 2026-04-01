"use client";

import { useState, useEffect, useRef } from "react";
import AddressInput from "@/components/AddressInput";
import { trackEvent } from "@/lib/analytics";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const { ref, visible } = useInView();
  const isNumeric = /^\d+/.test(value);
  const numericPart = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/^\d+/, "");
  const [display, setDisplay] = useState(isNumeric ? "0" : value);

  useEffect(() => {
    if (!visible || !isNumeric) return;
    const duration = 1200;
    const steps = 30;
    const increment = numericPart / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numericPart);
      setDisplay(String(current));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, isNumeric, numericPart]);

  return (
    <div ref={ref}>
      <div className="text-4xl font-bold mb-1">
        {isNumeric ? `${display}${suffix}` : value}
      </div>
      <div className="text-blue-200">{label}</div>
    </div>
  );
}

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── #4 Social Proof Toast ─── */
function SocialProofToast() {
  const messages = [
    "Un transportista en Rancagua publico una ruta hace 12 min",
    "3 enviadores buscaron Santiago \u2192 Valparaiso hoy",
    "Nuevo match: Santiago \u2192 Concepcion hace 5 min",
    "Transportista verificado se unio desde Temuco",
    "Carga publicada: Valparaiso \u2192 Santiago hace 8 min",
  ];
  const [current, setCurrent] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showToast = () => {
      setShow(true);
      setTimeout(() => setShow(false), 4000);
    };
    const timeout = setTimeout(showToast, 3000);
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
      showToast();
    }, 8000);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 max-w-xs bg-white rounded-xl shadow-lg border border-gray-200 p-3 transition-all duration-500 ${
        show ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-1 w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse" />
        <p className="text-xs text-gray-700 leading-snug">{messages[current]}</p>
      </div>
    </div>
  );
}

/* ─── #10 Exit Intent Popup ─── */
function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const shown = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("exit_popup_shown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !shown.current) {
        shown.current = true;
        sessionStorage.setItem("exit_popup_shown", "1");
        setShow(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    const mobileTimer = setTimeout(() => {
      if (!shown.current && window.innerWidth < 768) {
        shown.current = true;
        sessionStorage.setItem("exit_popup_shown", "1");
        setShow(true);
      }
    }, 45000);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Hay camiones disponibles en tu zona esta semana
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Deja tu email y te avisamos cuando haya un match perfecto para tu ruta.
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => {
              trackEvent("exit_intent_submit", { email });
              setShow(false);
            }}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Avisarme
          </button>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          No gracias
        </button>
      </div>
    </div>
  );
}

/* ─── #31 FAQ Accordion ─── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40" : "max-h-0"}`}>
        <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

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

  /* #15 Price Calculator state */
  const [calcDistance, setCalcDistance] = useState(300);
  const [calcWeight, setCalcWeight] = useState(1000);

  /* #16 One-Click Re-Publish */
  const [lastRoute, setLastRoute] = useState<{ origin: string; destination: string; olat: string; olng: string; dlat: string; dlng: string } | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("lastRoute");
    if (stored) {
      try { setLastRoute(JSON.parse(stored)); } catch {}
    }
  }, []);

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

    /* #16 Save route to localStorage */
    if (originAddress && destAddress) {
      localStorage.setItem("lastRoute", JSON.stringify({
        origin: originAddress,
        destination: destAddress,
        olat: String(originLat),
        olng: String(originLng),
        dlat: String(destLat),
        dlng: String(destLng),
      }));
    }

    window.location.href = `/enviador?${params.toString()}`;
  };

  /* #15 Price calculator derived values */
  const traditionalPrice = Math.round(calcDistance * 1.8 * (calcWeight / 500));
  const luxutechPrice = Math.round(traditionalPrice * 0.76);
  const savings = traditionalPrice - luxutechPrice;
  const savingsPercent = Math.round((savings / traditionalPrice) * 100);

  const formatCLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

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
            <a href="#como-funciona" className="hidden md:inline hover:text-blue-600 transition-colors">Como funciona</a>
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

      {/* ─── #16 One-Click Re-Publish Banner ─── */}
      {lastRoute && (
        <div className="fixed top-16 w-full bg-blue-50 border-b border-blue-200 z-40">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
            <p className="text-sm text-blue-800">
              Publicar de nuevo: <strong>{lastRoute.origin} &rarr; {lastRoute.destination}</strong>?
            </p>
            <button
              onClick={() => {
                trackEvent("republish_click", { origin: lastRoute.origin, destination: lastRoute.destination });
                const params = new URLSearchParams({
                  origin: lastRoute.origin,
                  dest: lastRoute.destination,
                  olat: lastRoute.olat,
                  olng: lastRoute.olng,
                  dlat: lastRoute.dlat,
                  dlng: lastRoute.dlng,
                });
                window.location.href = `/enviador?${params.toString()}`;
              }}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Un click
            </button>
          </div>
        </div>
      )}

      {/* ─── #21 Problem-First Hero ─── */}
      <section className={`${lastRoute ? "pt-36" : "pt-28"} pb-40 md:pb-44 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            &iquest;Est&aacute;s pagando de m&aacute;s por tus env&iacute;os?
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-4 max-w-2xl mx-auto">
            Conecta tu carga con camiones que ya van en tu direcci&oacute;n. Ahorra hasta un 24% porque el cami&oacute;n ya hace el viaje.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-200">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Match en menos de 24 hrs
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Publica en 2 min
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Coordina directo, sin intermediarios
            </span>
          </div>
        </div>
      </section>

      {/* ─── #34 Search Card with updated microcopy + #29 Better Placeholders ─── */}
      <div className="max-w-5xl mx-auto px-6 -mt-28 md:-mt-32 relative z-10 mb-6">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Busca tu ruta y ve cu&aacute;ntos camiones hay ahora</h2>
          <p className="text-sm text-gray-500 mb-6">Resultados en 3 segundos. Sin crear cuenta, sin compromiso.</p>

          {/* Search fields */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <AddressInput
                label="Origen"
                placeholder="Ej: Bodega Central, Av. Matta 1234, Santiago"
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
                placeholder="Ej: Puerto de Valparaiso, Valparaiso"
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
                Buscar camion
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

          {/* #13 Skeleton Loading */}
          {isChecking && (
            <div className="mt-6 p-5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse mt-1" />
              </div>
            </div>
          )}

          {/* #25 Urgency copy in match results */}
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
                        ? "camion va en tu direccion \u2014 los cupos se llenan rapido"
                        : "camiones van en tu direccion \u2014 los cupos se llenan rapido"}
                    </p>
                  </div>
                  <button
                    onClick={handlePublish}
                    className="mt-4 bg-blue-600 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Asegurar mi cupo ahora
                  </button>
                </>
              ) : (
                <>
                  {tomorrowCount != null && tomorrowCount > 0 ? (
                    <p className="text-sm text-amber-800 font-medium">
                      Ma&ntilde;ana hay <strong>{tomorrowCount} camiones</strong> disponibles en esta direcci&oacute;n. Publica ahora para reservar tu lugar.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-amber-800 font-medium">
                        No hay camiones disponibles hoy en esta ruta.
                      </p>
                      <p className="text-xs text-amber-600 mt-2">
                        Publica tu env&iacute;o ahora y te avisaremos apenas haya un cami&oacute;n disponible.
                      </p>
                    </>
                  )}
                  <button
                    onClick={handlePublish}
                    className="mt-4 bg-amber-500 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-amber-600 transition-colors"
                  >
                    Publicar mi envio
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── #8 Two Distinct Landing Paths ─── */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/enviador"
            onClick={() => trackEvent("path_click", { path: "enviador" })}
            className="block bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-400 p-6 transition-all hover:shadow-lg group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Tengo Carga para Enviar</h3>
                <p className="text-sm text-gray-500 mb-3">Ahorra hasta 24% en tu envio</p>
                <span className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:text-blue-700">
                  Cotizar envio mas barato &rarr;
                </span>
              </div>
            </div>
          </a>

          <a
            href="/transportista"
            onClick={() => trackEvent("path_click", { path: "transportista" })}
            className="block bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-400 p-6 transition-all hover:shadow-lg group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Tengo un Camion Disponible</h3>
                <p className="text-sm text-gray-500 mb-3">Gana $200k-$500k por viaje de vuelta</p>
                <span className="inline-flex items-center text-sm font-bold text-gray-900 group-hover:text-gray-700">
                  Ganar plata en mi viaje de vuelta &rarr;
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* ─── #26 Rewritten "Como Funciona" ─── */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <FadeIn>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Como funciona
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            En tres simples pasos tu carga viaja por una fraccion del precio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ingresa tu ruta</h3>
              <p className="text-gray-500">
                Indica origen, destino y fecha. Toma menos de 2 minutos.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Te conectamos con camiones</h3>
              <p className="text-gray-500">
                Nuestro algoritmo encuentra camiones disponibles que ya van en tu direccion.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">PASO 3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Coordinas directo y ahorras</h3>
              <p className="text-gray-500">
                Acuerda precio directamente con el transportista. Sin intermediarios, sin comisiones.
              </p>
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ─── #15 Price Calculator ─── */}
      <section className="py-20">
        <FadeIn>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Calcula tu ahorro
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Ajusta la distancia y el peso para ver cuanto puedes ahorrar con LuxuTech.
          </p>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distancia: {calcDistance} km
                </label>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={10}
                  value={calcDistance}
                  onChange={(e) => setCalcDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50 km</span>
                  <span>2000 km</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso: {calcWeight.toLocaleString("es-CL")} kg
                </label>
                <input
                  type="range"
                  min={100}
                  max={20000}
                  step={100}
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>100 kg</span>
                  <span>20.000 kg</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Envio tradicional:</span>
                <span className="text-lg text-gray-400 line-through">{formatCLP(traditionalPrice)} CLP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Con LuxuTech:</span>
                <span className="text-lg font-bold text-green-600">{formatCLP(luxutechPrice)} CLP</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Ahorras:</span>
                <span className="inline-flex items-center bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                  {formatCLP(savings)} CLP ({savingsPercent}%)
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/enviador"
                onClick={() => trackEvent("cta_click", { location: "price_calculator", user_type: "enviador" })}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Cotizar mi envio ahora
              </a>
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ─── Que puedes enviar ─── */}
      <FadeIn>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
            &iquest;Que puedes enviar?
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Si cabe en un camion, lo puedes enviar por LuxuTech.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "\uD83D\uDCE6", label: "Carga general" },
              { icon: "\uD83D\uDDA8\uFE0F", label: "Impresos y packaging" },
              { icon: "\uD83C\uDF3E", label: "Productos agricolas" },
              { icon: "\u2699\uFE0F", label: "Maquinaria industrial" },
              { icon: "\uD83E\uDDF1", label: "Materiales de construccion" },
              { icon: "\uD83D\uDED2", label: "Productos retail" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* ─── Beneficios ─── */}
      <section id="beneficios" className="py-20">
        <FadeIn>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            &iquest;Por que enviar con LuxuTech?
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            Tarifas que no encontraras en ningun otro lado, porque conectamos tu carga con camiones que ya hacen el viaje.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Ahorra en promedio un 24%</h3>
              <p className="text-sm text-gray-500">Paga una fraccion del precio de mercado porque el camion ya hace el viaje.</p>
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
              <p className="text-sm text-gray-500">Si no hay match hoy, te notificamos apenas aparezca un camion en tu ruta.</p>
            </div>
          </div>
        </div>
        </FadeIn>
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
                &ldquo;Necesitabamos enviar maquinaria a Concepcion y nos cotizaron $800.000. Por LuxuTech encontramos un camion que ya iba para alla y pagamos $350.000. Mas de un 50% de ahorro.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">MV</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Maria V.</div>
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
                &ldquo;Enviamos productos agricolas cada semana desde Rancagua al sur. Antes pagabamos flete completo, ahora usamos LuxuTech y estamos ahorrando casi $400.000 al mes.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">PG</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Pedro G.</div>
                  <div className="text-xs text-gray-500">Exportadora agricola, Rancagua</div>
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
                &ldquo;Enviamos pallets de impresos a clientes en todo Chile. Antes el flete nos comia el margen. Con LuxuTech encontramos camiones que ya van a destino y bajamos los costos de envio casi a la mitad.&rdquo;
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

      {/* ─── #31 Objection-Handling FAQ ─── */}
      <section className="py-20">
        <FadeIn>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Preguntas que siempre nos hacen
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Respuestas directas, sin letra chica.
          </p>

          <div className="space-y-3">
            <FAQItem
              question="&iquest;Es realmente gratis?"
              answer="Si, publicar tu envio es 100% gratis. Sin comisiones, sin tarjeta, sin letra chica."
            />
            <FAQItem
              question="&iquest;Y si el camion no llega?"
              answer="Solo conectamos transportistas verificados con rutas confirmadas. Coordinas directamente para acordar todos los detalles."
            />
            <FAQItem
              question="&iquest;Cuanto me demoro?"
              answer="Publicar tu ruta toma 2 minutos. El match llega en menos de 24 horas."
            />
            <FAQItem
              question="&iquest;Mis datos estan seguros?"
              answer="Tu informacion solo se comparte cuando hay un match confirmado. Nunca vendemos tus datos."
            />
            <FAQItem
              question="&iquest;Que pasa si no hay camiones en mi ruta?"
              answer="Te avisamos por email apenas aparezca un camion compatible. Publica y nosotros hacemos el trabajo."
            />
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ─── #38 Stats with specific numbers ─── */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <AnimatedStat value="24%" label="Ahorro promedio" />
          <AnimatedStat value="847" label="Rutas publicadas este mes" />
          <AnimatedStat value="$0" label="Costo por publicar" />
          <AnimatedStat value="127" label="Transportistas activos" />
        </div>
      </section>

      {/* ─── #17 Split CTA Banner ─── */}
      <FadeIn>
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Prueba gratis, sin compromiso
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Publica tu primer envio y ve como funciona. Sin tarjeta, sin comisiones, sin letra chica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/enviador"
              onClick={() => trackEvent("cta_click", { location: "bottom_banner", user_type: "enviador" })}
              className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
              Cotizar envio mas barato
            </a>
            <a href="/enviador"
              onClick={() => trackEvent("cta_click", { location: "bottom_banner_secondary", user_type: "enviador" })}
              className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-600 px-10 py-4 rounded-full text-lg font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors">
              Ver camiones en mi ruta
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            100% gratis. Sin comisiones ocultas. Tu informacion solo se comparte con tu match confirmado.
          </p>
        </div>
      </section>
      </FadeIn>

      {/* ─── Floating WhatsApp Button ─── */}
      <a
        href="https://wa.me/56996119028?text=Hola%2C%20necesito%20enviar%20una%20carga"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click", { location: "floating_button" })}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors hover:scale-110 transform"
        aria-label="Escribenos por WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* ─── #4 Social Proof Toast ─── */}
      <SocialProofToast />

      {/* ─── #10 Exit Intent Popup ─── */}
      <ExitIntentPopup />

      {/* ─── #5 Sticky Mobile CTA ─── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] p-3 z-40 md:hidden">
        <button
          onClick={() => {
            trackEvent("cta_click", { location: "sticky_mobile", user_type: "enviador" });
            window.location.href = "/enviador";
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Cotizar envio mas barato
          {matchCount !== null && matchCount > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {matchCount}
            </span>
          )}
        </button>
      </div>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400 py-12 pb-24 md:pb-12">
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
                Envia tu carga por menos aprovechando camiones que ya van en tu direccion. La forma mas inteligente de mover carga en Chile.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a></li>
                <li><a href="/transportista" className="hover:text-white transition-colors">Para Transportistas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="/privacidad" className="hover:text-white transition-colors">Politica de Privacidad</a></li>
                <li><a href="/terminos" className="hover:text-white transition-colors">Terminos y Condiciones</a></li>
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
