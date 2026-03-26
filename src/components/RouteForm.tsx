"use client";

import { useState } from "react";
import AddressInput from "@/components/AddressInput";
import MapPreviewDynamic from "@/components/MapPreviewDynamic";

type Step = "route" | "email" | "verify" | "contact" | "done";

interface RouteFormProps {
  userType: "transportista" | "enviador";
  title: string;
  routeQuestion: string;
  children?: React.ReactNode;
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

  const handleRouteSubmit = () => {
    if (!originLat || !destinationLat || !pickupDate) return;
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
          pickupDate,
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
    setStep("route");
    setOriginAddress(""); setOriginLat(undefined); setOriginLng(undefined);
    setDestinationAddress(""); setDestinationLat(undefined); setDestinationLng(undefined);
    setPickupDate("");
    setCargoType("general"); setPalletCount(""); setWeightKg(""); setCargoDescription("");
    setEmail(""); setVerificationCode(""); setName(""); setPhone("");
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
          <a href="/" className="text-sm text-blue-600 hover:underline font-medium">
            ← Volver al inicio
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
              ? "Publica tu ruta de retorno y gana dinero con el espacio disponible en tu camión."
              : "Encuentra transporte económico aprovechando camiones que ya van en tu dirección."}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          {/* Step 1: Route */}
          {step === "route" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{routeQuestion}</h3>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {userType === "transportista" ? "Fecha del viaje" : "Fecha de envío"}
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

                <button onClick={handleRouteSubmit} disabled={!originLat || !destinationLat || !pickupDate}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg">
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Email */}
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

          {/* Step 3: Verify */}
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

          {/* Step 4: Contact */}
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

          {/* Step 5: Done */}
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={resetForm}
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors text-lg">
                  Publicar otra ruta
                </button>
                <a href="/"
                  className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors text-lg">
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
          <p className="text-sm mb-6">Conectamos transportistas con enviadores para eliminar los viajes vacíos en Chile.</p>
          <div className="border-t border-gray-800 pt-6 text-sm">
            &copy; {new Date().getFullYear()} LuxuTech. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
