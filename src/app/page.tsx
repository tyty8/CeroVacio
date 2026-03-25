"use client";

import { useState } from "react";
import AddressInput from "@/components/AddressInput";
import MapPreviewDynamic from "@/components/MapPreviewDynamic";

type UserType = "transportista" | "enviador" | null;
type Step = "role" | "route" | "email" | "verify" | "contact" | "done";

export default function Home() {
  const [step, setStep] = useState<Step>("role");
  const [userType, setUserType] = useState<UserType>(null);

  // Route fields
  const [originAddress, setOriginAddress] = useState("");
  const [originLat, setOriginLat] = useState<number | undefined>();
  const [originLng, setOriginLng] = useState<number | undefined>();
  const [destinationAddress, setDestinationAddress] = useState("");
  const [destinationLat, setDestinationLat] = useState<number | undefined>();
  const [destinationLng, setDestinationLng] = useState<number | undefined>();

  // Cargo fields (for enviador)
  const [cargoType, setCargoType] = useState<"general" | "refrigerated">(
    "general"
  );
  const [palletCount, setPalletCount] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [cargoDescription, setCargoDescription] = useState("");

  // Email verification
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Contact info
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
          email,
          name,
          phone,
          userType,
          originAddress,
          originLat,
          originLng,
          destinationAddress,
          destinationLat,
          destinationLng,
          cargoType: userType === "enviador" ? cargoType : null,
          palletCount:
            userType === "enviador" ? Number(palletCount) || null : null,
          weightKg: userType === "enviador" ? Number(weightKg) || null : null,
          cargoDescription: userType === "enviador" ? cargoDescription : null,
        }),
      });
      if (res.ok) {
        setStep("done");
      }
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">BackhaulMatch</h1>
          <span className="text-sm text-gray-500">Chile</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero */}
        {step === "role" && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Conecta tus rutas de retorno
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Elimina los viajes vacíos. Conectamos transportistas que vuelven
              con espacio disponible con quienes necesitan enviar carga en la
              misma dirección.
            </p>
            <p className="text-gray-500">
              Publica tu ruta y te avisamos cuando haya un match dentro de 2 km.
            </p>
          </div>
        )}

        {/* Step 1: Role Selection */}
        {step === "role" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-gray-800">
              ¿Qué necesitas?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleSelectRole("transportista")}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="text-2xl mb-2">🚛</div>
                <div className="font-semibold text-gray-900">
                  Soy Transportista
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Tengo espacio disponible en mi camión de vuelta y quiero ganar
                  dinero extra.
                </p>
              </button>
              <button
                onClick={() => handleSelectRole("enviador")}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
              >
                <div className="text-2xl mb-2">📦</div>
                <div className="font-semibold text-gray-900">
                  Necesito Enviar
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Tengo carga que necesito mover de un punto a otro de forma
                  económica.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Route & Cargo */}
        {step === "route" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {userType === "transportista"
                  ? "¿Cuál es tu ruta de retorno?"
                  : "¿De dónde a dónde necesitas enviar?"}
              </h3>
              <button
                onClick={() => {
                  setStep("role");
                  setUserType(null);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Volver
              </button>
            </div>

            <AddressInput
              label="Origen"
              placeholder="Escribe la dirección de origen..."
              value={originAddress}
              onSelect={(addr, lat, lng) => {
                setOriginAddress(addr);
                setOriginLat(lat);
                setOriginLng(lng);
              }}
            />

            <AddressInput
              label="Destino"
              placeholder="Escribe la dirección de destino..."
              value={destinationAddress}
              onSelect={(addr, lat, lng) => {
                setDestinationAddress(addr);
                setDestinationLat(lat);
                setDestinationLng(lng);
              }}
            />

            {/* Map preview */}
            {(originLat || destinationLat) && (
              <MapPreviewDynamic
                originLat={originLat}
                originLng={originLng}
                destinationLat={destinationLat}
                destinationLng={destinationLng}
              />
            )}

            {/* Cargo details (only for enviador) */}
            {userType === "enviador" && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-800">
                  Detalles de la carga
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de carga
                  </label>
                  <select
                    value={cargoType}
                    onChange={(e) =>
                      setCargoType(
                        e.target.value as "general" | "refrigerated"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General (palletizado)</option>
                    <option value="refrigerated">Refrigerado</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad de pallets
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={palletCount}
                      onChange={(e) => setPalletCount(e.target.value)}
                      placeholder="Ej: 4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso estimado (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="Ej: 500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción de la carga
                  </label>
                  <textarea
                    value={cargoDescription}
                    onChange={(e) => setCargoDescription(e.target.value)}
                    placeholder="Ej: Cajas de frutas, pallets envueltos..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleRouteSubmit}
              disabled={!originLat || !destinationLat}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Email */}
        {step === "email" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Verifica tu email
              </h3>
              <button
                onClick={() => setStep("route")}
                className="text-sm text-blue-600 hover:underline"
              >
                Volver
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Te enviaremos un código de 6 dígitos para verificar tu identidad.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSendVerification()
                }
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <button
              onClick={handleSendVerification}
              disabled={isSending}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSending ? "Enviando..." : "Enviar código"}
            </button>
          </div>
        )}

        {/* Step 4: Verify Code */}
        {step === "verify" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Ingresa el código
            </h3>
            <p className="text-gray-600 text-sm">
              Enviamos un código de 6 dígitos a{" "}
              <strong>{email}</strong>. Revisa tu bandeja de entrada.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de verificación
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="123456"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
              />
              {codeError && (
                <p className="text-red-500 text-sm mt-1">{codeError}</p>
              )}
            </div>
            <button
              onClick={handleVerifyCode}
              disabled={isSending}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSending ? "Verificando..." : "Verificar"}
            </button>
            <button
              onClick={() => setStep("email")}
              className="w-full text-sm text-blue-600 hover:underline"
            >
              Cambiar email
            </button>
          </div>
        )}

        {/* Step 5: Contact Info */}
        {step === "contact" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Tus datos de contacto
            </h3>
            <p className="text-gray-600 text-sm">
              Esta información se usará para conectarte con tu match.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
              />
            </div>
            <button
              onClick={handleFinalSubmit}
              disabled={!name.trim() || !phone.trim() || isSubmitting}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Publicando..." : "Publicar mi ruta"}
            </button>
          </div>
        )}

        {/* Step 6: Done */}
        {step === "done" && (
          <div className="text-center space-y-4 py-10">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-900">
              ¡Ruta publicada!
            </h3>
            <p className="text-gray-600">
              Tu ruta ha sido registrada. Te contactaremos cuando encontremos un
              match compatible dentro de 2 km de tu ruta.
            </p>
            <button
              onClick={() => {
                setStep("role");
                setUserType(null);
                setOriginAddress("");
                setOriginLat(undefined);
                setOriginLng(undefined);
                setDestinationAddress("");
                setDestinationLat(undefined);
                setDestinationLng(undefined);
                setCargoType("general");
                setPalletCount("");
                setWeightKg("");
                setCargoDescription("");
                setEmail("");
                setVerificationCode("");
                setName("");
                setPhone("");
              }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publicar otra ruta
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-400">
        BackhaulMatch &copy; {new Date().getFullYear()} — Chile
      </footer>
    </main>
  );
}
