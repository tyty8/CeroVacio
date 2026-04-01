"use client";

import { useState, useEffect } from "react";
import AddressInput from "@/components/AddressInput";
import MapPreviewDynamic from "@/components/MapPreviewDynamic";

type Step = "route" | "date" | "email" | "verify" | "contact" | "done";

interface RouteFormProps {
  userType: "transportista" | "enviador";
  title: string;
  routeQuestion: string;
  children?: React.ReactNode;
}

const STEP_NUMBER: Record<Exclude<Step, "done">, number> = {
  route: 2,
  date: 3,
  email: 4,
  verify: 5,
  contact: 6,
};

function ProgressBar({ step }: { step: Step }) {
  if (step === "done") return null;
  const current = STEP_NUMBER[step];
  const pct = Math.round((current / 6) * 100);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Paso {current} de 6</span>
        <span className="text-sm text-gray-400">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function RouteForm({ userType, title, routeQuestion, children }: RouteFormProps) {
  const [step, setStep] = useState<Step>("route");

  const [originAddress, setOriginAddress] = useState("");
  const [originLat, setOriginLat] = useState<number | undefined>();
  const [originLng, setOriginLng] = useState<number | undefined>();
  const [destinationAddress, setDestinationAddress] = useState("");
  const [destinationLat, setDestinationLat] = useState<number | undefined>();
  const [destinationLng, setDestinationLng] = useState<number | undefined>();

  const [pickupDate, setPickupDate] = useState("");

  // Pre-fill from query params (passed from homepage search bar)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("origin")) setOriginAddress(params.get("origin")!);
    if (params.get("olat")) setOriginLat(Number(params.get("olat")));
    if (params.get("olng")) setOriginLng(Number(params.get("olng")));
    if (params.get("dest")) setDestinationAddress(params.get("dest")!);
    if (params.get("dlat")) setDestinationLat(Number(params.get("dlat")));
    if (params.get("dlng")) setDestinationLng(Number(params.get("dlng")));
    if (params.get("date")) setPickupDate(params.get("date")!);

    // Skip ahead if route data came from homepage
    if (params.get("olat") && params.get("dlat")) {
      if (params.get("date")) {
        setStep("email");
      } else {
        setStep("date");
      }
    }
  }, []);

  const [cargoType, setCargoType] = useState<"general" | "refrigerated" | "">("");
  const [palletCount, setPalletCount] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [cargoDescription, setCargoDescription] = useState("");
  const [showCargoDescription, setShowCargoDescription] = useState(false);

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRouteSubmit = () => {
    if (!originLat || !destinationLat || !pickupDate) return;
    setStep("email");
  };

  const handleSendVerification = async () => {
    if (!email || !email.includes("@")) {
      setEmailError("Ingresa un email como nombre@empresa.cl");
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
        setEmailError(data.error || "No pudimos enviar el codigo. Revisa tu email e intenta de nuevo.");
        return;
      }
      setStep("verify");
    } catch {
      setEmailError("Sin conexion a internet. Revisa tu WiFi o datos moviles e intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setCodeError("El codigo tiene 6 numeros. Revisa tu email para encontrarlo.");
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
        setCodeError(data.error || "Codigo invalido");
        return;
      }
      setStep("contact");
    } catch {
      setCodeError("Sin conexion a internet. Revisa tu WiFi o datos moviles e intenta de nuevo.");
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
          email, name, phone, userType, whatsappEnabled,
          originAddress, originLat, originLng,
          destinationAddress, destinationLat, destinationLng,
          pickupDate,
          cargoType: userType === "enviador" ? (cargoType || "general") : null,
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
    setStep("route");
    setOriginAddress(""); setOriginLat(undefined); setOriginLng(undefined);
    setDestinationAddress(""); setDestinationLat(undefined); setDestinationLng(undefined);
    setPickupDate("");
    setCargoType(""); setPalletCount(""); setWeightKg(""); setCargoDescription("");
    setShowCargoDescription(false);
    setEmail(""); setVerificationCode(""); setName(""); setPhone("");
    setWhatsappEnabled(true);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LT</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LuxuTech</span>
          </a>
          <a
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Volver al inicio"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-14 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto">
            {userType === "transportista"
              ? "Cada viaje de vuelta vacio te cuesta hasta $350.000 CLP en ingresos perdidos. Recupera esa plata en 2 minutos."
              : "Encuentra transporte economico aprovechando camiones que ya van en tu direccion."}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="py-16 bg-gray-50 pb-24 md:pb-0">
        <div className="max-w-2xl mx-auto px-6">
          {/* Step 1: Route */}
          {step === "route" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ProgressBar step={step} />
              <h3 className="text-xl font-bold text-gray-900 mb-6">{routeQuestion}</h3>

              <div className="space-y-5">
                <AddressInput label="Origen" placeholder="Escribe la direccion de origen..."
                  value={originAddress}
                  onSelect={(addr, lat, lng) => { setOriginAddress(addr); setOriginLat(lat); setOriginLng(lng); }} />

                <AddressInput label="Destino" placeholder="Escribe la direccion de destino..."
                  value={destinationAddress}
                  onSelect={(addr, lat, lng) => { setDestinationAddress(addr); setDestinationLat(lat); setDestinationLng(lng); }} />

                {(originLat || destinationLat) && (
                  <MapPreviewDynamic originLat={originLat} originLng={originLng}
                    destinationLat={destinationLat} destinationLng={destinationLng} />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {userType === "transportista" ? "Fecha del viaje" : "Fecha de envio"}
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={today}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {userType === "enviador" && (
                  <div className="space-y-4 p-5 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800">Detalles de la carga</h4>

                    {/* Cargo type as visual cards */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de carga</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setCargoType("general")}
                          className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${
                            cargoType === "general"
                              ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <svg className={`w-10 h-10 mb-2 ${cargoType === "general" ? "text-blue-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className={`font-semibold text-sm ${cargoType === "general" ? "text-blue-700" : "text-gray-700"}`}>General</span>
                          <span className="text-xs text-gray-400 mt-0.5">Palletizado</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCargoType("refrigerated")}
                          className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${
                            cargoType === "refrigerated"
                              ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <svg className={`w-10 h-10 mb-2 ${cargoType === "refrigerated" ? "text-blue-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20m0-20l4 4m-4-4L8 6m4 14l4-4m-4 4l-4-4m-6-4h20M2 12l4-4M2 12l4 4m14-4l-4-4m4 4l-4 4" />
                          </svg>
                          <span className={`font-semibold text-sm ${cargoType === "refrigerated" ? "text-blue-700" : "text-gray-700"}`}>Refrigerado</span>
                          <span className="text-xs text-gray-400 mt-0.5">Temperatura controlada</span>
                        </button>
                      </div>
                    </div>

                    {/* Progressive disclosure: show pallet/weight only after selecting cargo type */}
                    {cargoType && (
                      <>
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

                        {/* Expandable cargo description */}
                        {!showCargoDescription ? (
                          <button
                            type="button"
                            onClick={() => setShowCargoDescription(true)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar descripcion
                          </button>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion de la carga (opcional)</label>
                            <textarea value={cargoDescription} onChange={(e) => setCargoDescription(e.target.value)}
                              placeholder="Ej: Cajas de frutas, pallets envueltos..." rows={2}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                <button onClick={handleRouteSubmit} disabled={!originLat || !destinationLat || !pickupDate}
                  className="w-full h-12 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg flex items-center justify-center">
                  {userType === "transportista" ? "Ver carga disponible en mi ruta" : "Buscar camiones en mi ruta"}
                </button>
              </div>
            </div>
          )}

          {/* Step: Date only (when coming from homepage without date) */}
          {step === "date" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ProgressBar step={step} />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {userType === "transportista" ? "Cuando es tu viaje?" : "Cuando necesitas enviar?"}
                </h3>
                <button onClick={() => setStep("route")} className="text-sm text-blue-600 hover:underline font-medium">Volver</button>
              </div>
              <div className="space-y-5">
                <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 space-y-1">
                  <p><strong>Origen:</strong> {originAddress}</p>
                  <p><strong>Destino:</strong> {destinationAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {userType === "transportista" ? "Fecha del viaje" : "Fecha de envio"}
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={today}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => { if (pickupDate) setStep("email"); }}
                  disabled={!pickupDate}
                  className="w-full h-12 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg flex items-center justify-center"
                >
                  Siguiente paso
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Email */}
          {step === "email" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ProgressBar step={step} />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Verifica tu email</h3>
                <button onClick={() => setStep("route")} className="text-sm text-blue-600 hover:underline font-medium">Volver</button>
              </div>
              <p className="text-gray-500 text-sm mb-6">Te enviaremos un codigo de 6 digitos para verificar tu identidad.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSendVerification()} />
                  <p className="text-xs text-gray-400 mt-1.5">Solo usamos tu email para enviarte el codigo. No spam, nunca.</p>
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
                <button onClick={handleSendVerification} disabled={isSending}
                  className="w-full h-12 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-lg flex items-center justify-center">
                  {isSending ? "Enviando..." : "Verificar mi email"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Verify */}
          {step === "verify" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ProgressBar step={step} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ingresa el codigo</h3>
              <p className="text-gray-500 text-sm mb-6">
                Enviamos un codigo de 6 digitos a <strong className="text-gray-700">{email}</strong>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codigo de verificacion</label>
                  <input type="text" value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456" maxLength={6}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.3em] focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()} />
                  {codeError && <p className="text-red-500 text-sm mt-1">{codeError}</p>}
                </div>
                <button onClick={handleVerifyCode} disabled={isSending}
                  className="w-full h-12 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-lg flex items-center justify-center">
                  {isSending ? "Verificando..." : "Confirmar codigo"}
                </button>
                <button onClick={() => setStep("email")} className="w-full text-sm text-blue-600 hover:underline font-medium">
                  Cambiar email
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === "contact" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ProgressBar step={step} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tus datos de contacto</h3>
              <p className="text-gray-500 text-sm mb-6">Esta informacion se usara para conectarte con tu match.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Perez" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 1234 5678" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-gray-400 mt-1.5">Tu telefono solo se comparte cuando hay un match confirmado.</p>
                </div>

                {/* WhatsApp toggle */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={whatsappEnabled}
                    onChange={(e) => setWhatsappEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  <div className="flex items-center gap-2 flex-1">
                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Contactar por WhatsApp</span>
                      <p className="text-xs text-gray-400">Te notificamos por WhatsApp cuando haya un match</p>
                    </div>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={email} disabled
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Email verificado
                  </p>
                </div>
                <button onClick={handleFinalSubmit} disabled={!name.trim() || !phone.trim() || isSubmitting}
                  className="w-full h-12 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors text-lg flex items-center justify-center">
                  {isSubmitting
                    ? "Publicando..."
                    : userType === "transportista"
                      ? "Publicar y empezar a ganar"
                      : "Publicar y encontrar camion"}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Done */}
          {step === "done" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ruta publicada con exito!</h3>

              {/* What happens next timeline */}
              <div className="max-w-md mx-auto text-left mb-8 mt-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Que pasa ahora</h4>
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {userType === "transportista"
                          ? "Buscamos carga compatible en tu ruta"
                          : "Buscamos camiones compatibles en tu ruta"}
                      </p>
                      <p className="text-xs text-gray-400">Menos de 24 hrs</p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      {whatsappEnabled ? (
                        <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {whatsappEnabled
                          ? "Te avisamos por WhatsApp cuando hay un match"
                          : "Te avisamos por email cuando hay un match"}
                      </p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0 0v2.5m0-2.5h2.5m-2.5 0H4.5m11-4.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm5 10a7.5 7.5 0 00-15 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {userType === "transportista"
                          ? "Coordinas directamente con el enviador"
                          : "Coordinas directamente con el transportista"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                {userType === "transportista"
                  ? "Tu ruta esta activa y visible para enviadores en tu zona."
                  : "Tu ruta esta activa y visible para transportistas en tu zona."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={resetForm}
                  className="bg-blue-600 text-white px-8 h-12 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors text-lg flex items-center justify-center">
                  Publicar otra ruta
                </button>
                <a href="/"
                  className="bg-gray-100 text-gray-700 px-8 h-12 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors text-lg flex items-center justify-center">
                  Volver al inicio
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Landing page content passed from parent */}
      {children}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LT</span>
            </div>
            <span className="text-lg font-bold text-white">LuxuTech</span>
          </div>
          <p className="text-sm mb-6">Conectamos transportistas con enviadores para eliminar los viajes vacios en Chile.</p>
          <div className="flex gap-6 mb-6 text-sm">
            <a href="/privacidad" className="hover:text-white transition-colors">Politica de Privacidad</a>
            <a href="/terminos" className="hover:text-white transition-colors">Terminos y Condiciones</a>
          </div>
          <div className="border-t border-gray-800 pt-6 text-sm">
            &copy; {new Date().getFullYear()} LuxuTech. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
