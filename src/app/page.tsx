"use client";

import { useState } from "react";
import AddressInput from "@/components/AddressInput";
import MapPreviewDynamic from "@/components/MapPreviewDynamic";

type UserType = "transportista" | "enviador" | null;
type Step = "role" | "route" | "email" | "verify" | "contact" | "done";

export default function Home() {
  const [step, setStep] = useState<Step>("role");
  const [userType, setUserType] = useState<UserType>(null);

  const [originAddress, setOriginAddress] = useState("");
  const [originLat, setOriginLat] = useState<number | undefined>();
  const [originLng, setOriginLng] = useState<number | undefined>();
  const [destinationAddress, setDestinationAddress] = useState("");
  const [destinationLat, setDestinationLat] = useState<number | undefined>();
  const [destinationLng, setDestinationLng] = useState<number | undefined>();

  const [cargoType, setCargoType] = useState<"general" | "refrigerated">("general");
  const [palletCount, setPalletCount] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [cargoDescription, setCargoDescription] = useState("");

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRole = (type: UserType) => {
    setUserType(type);
    setStep("route");
  };

  const handleRouteSubmit = () => {
    if (!originLat || !destinationLat) return;
    setStep("email");
  };

  const handleSendVerification = async () => {
    if (!email || !email.includes("@")) {
      setEmailError("Ingresa un email válido");
      return;
    }
    setEmailError("");
    setIsSending(true);
    try {
      const res = await fetch("/api/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error || "Error al enviar el código");
        return;
      }
      setStep("verify");
    } catch {
      setEmailError("Error de conexión");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setCodeError("El código debe tener 6 dígitos");
      return;
    }
    setCodeError("");
    setIsSending(true);
    try {
      const res = await fetch("/api/verify/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.error || "Código inválido");
        return;
      }
      setStep("contact");
    } catch {
      setCodeError("Error de conexión");
    } finally {
      setIsSending(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, name, phone, userType,
          originAddress, originLat, originLng,
          destinationAddress, destinationLat, destinationLng,
          cargoType: userType === "enviador" ? cargoType : null,
          palletCount: userType === "enviador" ? Number(palletCount) || null : null,
          weightKg: userType === "enviador" ? Number(weightKg) || null : null,
          cargoDescription: userType === "enviador" ? cargoDescription : null,
        }),
      });
      if (res.ok) setStep("done");
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("role");
    setUserType(null);
    setOriginAddress(""); setOriginLat(undefined); setOriginLng(undefined);
    setDestinationAddress(""); setDestinationLat(undefined); setDestinationLng(undefined);
    setCargoType("general"); setPalletCount(""); setWeightKg(""); setCargoDescription("");
    setEmail(""); setVerificationCode(""); setName(""); setPhone("");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CeroVacío</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#como-funciona" className="hover:text-blue-600 transition-colors">Cómo funciona</a>
            <a href="#beneficios" className="hover:text-blue-600 transition-colors">Beneficios</a>
            <a href="#publicar" className="hover:text-blue-600 transition-colors">Publicar ruta</a>
          </div>
          <a
            href="#publicar"
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Empezar
          </a>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Cero Viajes<br />Vacíos
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              Conectamos transportistas que vuelven con espacio disponible con
              quienes necesitan enviar carga en la misma dirección.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#publicar"
                className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Publicar mi ruta
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Cómo funciona
              </a>
            </div>
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

      {/* ─── Beneficios ─── */}
      <section id="beneficios" className="py-20">
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

      {/* ─── Role Selection & Form Widget ─── */}
      <section id="publicar" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          {/* Step 1: Role */}
          {step === "role" && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                Publica tu ruta
              </h2>
              <p className="text-center text-gray-500 mb-10">
                Elige tu perfil para comenzar
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => handleSelectRole("transportista")}
                  className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                    <span className="text-2xl group-hover:brightness-0 group-hover:invert transition-all">🚛</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-2">Soy Transportista</div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Tengo espacio disponible en mi camión de vuelta y quiero ganar dinero extra.
                  </p>
                </button>
                <button
                  onClick={() => handleSelectRole("enviador")}
                  className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                    <span className="text-2xl group-hover:brightness-0 group-hover:invert transition-all">📦</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-2">Necesito Enviar</div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Tengo carga que necesito mover de un punto a otro de forma económica.
                  </p>
                </button>
              </div>
            </>
          )}

          {/* Step 2: Route & Cargo */}
          {step === "route" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {userType === "transportista"
                    ? "¿Cuál es tu ruta de retorno?"
                    : "¿De dónde a dónde necesitas enviar?"}
                </h3>
                <button onClick={() => { setStep("role"); setUserType(null); }}
                  className="text-sm text-blue-600 hover:underline font-medium">
                  Volver
                </button>
              </div>

              <div className="space-y-5">
                <AddressInput label="Origen" placeholder="Escribe la dirección de origen..."
                  value={originAddress}
                  onSelect={(addr, lat, lng) => { setOriginAddress(addr); setOriginLat(lat); setOriginLng(lng); }} />

                <AddressInput label="Destino" placeholder="Escribe la dirección de destino..."
                  value={destinationAddress}
                  onSelect={(addr, lat, lng) => { setDestinationAddress(addr); setDestinationLat(lat); setDestinationLng(lng); }} />

                {(originLat || destinationLat) && (
                  <MapPreviewDynamic originLat={originLat} originLng={originLng}
                    destinationLat={destinationLat} destinationLng={destinationLng} />
                )}

                {userType === "enviador" && (
                  <div className="space-y-4 p-5 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800">Detalles de la carga</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de carga</label>
                      <select value={cargoType} onChange={(e) => setCargoType(e.target.value as "general" | "refrigerated")}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="general">General (palletizado)</option>
                        <option value="refrigerated">Refrigerado</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de pallets</label>
                        <input type="number" min="1" value={palletCount} onChange={(e) => setPalletCount(e.target.value)}
                          placeholder="Ej: 4" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Peso estimado (kg)</label>
                        <input type="number" min="1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
                          placeholder="Ej: 500" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la carga</label>
                      <textarea value={cargoDescription} onChange={(e) => setCargoDescription(e.target.value)}
                        placeholder="Ej: Cajas de frutas, pallets envueltos..." rows={2}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                )}

                <button onClick={handleRouteSubmit} disabled={!originLat || !destinationLat}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg">
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Email */}
          {step === "email" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Verifica tu email</h3>
                <button onClick={() => setStep("route")} className="text-sm text-blue-600 hover:underline font-medium">Volver</button>
              </div>
              <p className="text-gray-500 text-sm mb-6">Te enviaremos un código de 6 dígitos para verificar tu identidad.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSendVerification()} />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
                <button onClick={handleSendVerification} disabled={isSending}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-lg">
                  {isSending ? "Enviando..." : "Enviar código"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Verify */}
          {step === "verify" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ingresa el código</h3>
              <p className="text-gray-500 text-sm mb-6">
                Enviamos un código de 6 dígitos a <strong className="text-gray-700">{email}</strong>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de verificación</label>
                  <input type="text" value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456" maxLength={6}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.3em] focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()} />
                  {codeError && <p className="text-red-500 text-sm mt-1">{codeError}</p>}
                </div>
                <button onClick={handleVerifyCode} disabled={isSending}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-lg">
                  {isSending ? "Verificando..." : "Verificar"}
                </button>
                <button onClick={() => setStep("email")} className="w-full text-sm text-blue-600 hover:underline font-medium">
                  Cambiar email
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Contact */}
          {step === "contact" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tus datos de contacto</h3>
              <p className="text-gray-500 text-sm mb-6">Esta información se usará para conectarte con tu match.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Pérez" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 1234 5678" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={email} disabled
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
                </div>
                <button onClick={handleFinalSubmit} disabled={!name.trim() || !phone.trim() || isSubmitting}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors text-lg">
                  {isSubmitting ? "Publicando..." : "Publicar mi ruta"}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Done */}
          {step === "done" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Ruta publicada!</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Tu ruta ha sido registrada. Te contactaremos cuando encontremos un match compatible dentro de 2 km.
              </p>
              <button onClick={resetForm}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors text-lg">
                Publicar otra ruta
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      {step === "role" && (
        <section className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para eliminar los viajes vacíos?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Publica tu ruta gratis y encuentra un match hoy mismo.
            </p>
            <a href="#publicar"
              className="inline-flex items-center justify-center bg-white text-blue-700 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
              Empezar ahora
            </a>
          </div>
        </section>
      )}

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <span className="text-lg font-bold text-white">CeroVacío</span>
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
                <li><a href="#publicar" className="hover:text-white transition-colors">Publicar ruta</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>contacto@cerovacio.cl</li>
                <li>Santiago, Chile</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} CeroVacío. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
