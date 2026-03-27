"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const generalFAQs: FAQItem[] = [
  {
    question: "¿Qué es LuxuTech?",
    answer:
      "LuxuTech es una plataforma que conecta personas que necesitan enviar carga con transportistas que ya van en esa dirección. Como el camión ya hace el viaje, las tarifas son mucho más bajas que un flete tradicional.",
  },
  {
    question: "¿Cuánto cuesta usar LuxuTech?",
    answer:
      "Publicar tu envío o tu ruta es 100% gratis. No cobramos comisiones, suscripciones ni tarifas ocultas. El precio del transporte lo acuerdan directamente entre enviador y transportista.",
  },
  {
    question: "¿Cómo funciona el match?",
    answer:
      "Cuando publicas tu envío o tu ruta, nuestro algoritmo busca coincidencias dentro de 2 km de tu origen y destino. Si hay un match, te enviamos los datos de contacto para que coordinen directamente.",
  },
  {
    question: "¿Qué pasa si no hay match disponible?",
    answer:
      "Tu publicación queda activa y te notificamos por email apenas aparezca un match compatible. También puedes ver si hay rutas disponibles para el día siguiente.",
  },
  {
    question: "¿Es seguro usar LuxuTech?",
    answer:
      "Todos los usuarios deben verificar su email antes de publicar. Tus datos de contacto solo se comparten con usuarios que hagan match con tu ruta. Nunca vendemos ni compartimos tu información con terceros.",
  },
  {
    question: "¿En qué zonas de Chile funciona?",
    answer:
      "LuxuTech funciona en todo Chile. Puedes publicar rutas entre cualquier ciudad o localidad del país.",
  },
];

const enviadorFAQs: FAQItem[] = [
  {
    question: "¿Cuánto puedo ahorrar en mi envío?",
    answer:
      "En promedio, nuestros usuarios ahorran un 24% comparado con un flete tradicional. El ahorro depende de la ruta y la disponibilidad de camiones.",
  },
  {
    question: "¿Qué tipo de carga puedo enviar?",
    answer:
      "Puedes enviar carga general, pallets, maquinaria, productos agrícolas, materiales de construcción y más. Al publicar tu envío, indicas el tipo de carga, peso y dimensiones para que el transportista sepa si tiene capacidad.",
  },
  {
    question: "¿Cómo sé que el transportista es confiable?",
    answer:
      "Todos los transportistas verifican su email antes de poder publicar. Además, puedes coordinar directamente con ellos por teléfono o WhatsApp antes de confirmar el envío.",
  },
  {
    question: "¿Quién es responsable de la carga durante el transporte?",
    answer:
      "LuxuTech es una plataforma de conexión. Los términos del transporte (seguro, responsabilidad, condiciones) se acuerdan directamente entre enviador y transportista. Recomendamos siempre acordar estos detalles antes del envío.",
  },
];

const transportistaFAQs: FAQItem[] = [
  {
    question: "¿Cuánto puedo ganar por viaje de retorno?",
    answer:
      "Depende de la ruta y el tipo de carga, pero nuestros transportistas ganan entre $200.000 y $500.000 CLP por viaje de retorno. Es dinero que antes se perdía volviendo vacío.",
  },
  {
    question: "¿Tengo que aceptar toda la carga que me ofrecen?",
    answer:
      "No. Tú decides qué carga aceptar. Cuando hay un match, recibes los datos del enviador y los detalles de la carga. Si no te conviene, simplemente no la tomas.",
  },
  {
    question: "¿Cómo se acuerda el precio?",
    answer:
      "El precio lo negocian directamente entre tú y el enviador. LuxuTech no interviene en la negociación ni cobra comisión sobre el monto acordado.",
  },
  {
    question: "¿Necesito algún tipo de documentación especial?",
    answer:
      "Solo necesitas un email verificado para publicar tu ruta. Para el transporte en sí, debes cumplir con la normativa vigente de transporte de carga en Chile.",
  },
];

function FAQSection({ title, items }: { title: string; items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 pr-4">
                {item.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
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
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            &larr; Volver al inicio
          </a>
        </div>
      </nav>

      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Preguntas Frecuentes
        </h1>
        <p className="text-gray-500 mb-12">
          Todo lo que necesitas saber sobre LuxuTech.
        </p>

        <FAQSection title="General" items={generalFAQs} />
        <FAQSection title="Para Enviadores" items={enviadorFAQs} />
        <FAQSection title="Para Transportistas" items={transportistaFAQs} />

        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¿Tienes otra pregunta?
          </h3>
          <p className="text-gray-500 mb-6">
            Escríbenos y te respondemos lo antes posible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/56996119028?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20LuxuTech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:contacto@luxutech.com"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              contacto@luxutech.com
            </a>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          &copy; {new Date().getFullYear()} LuxuTech. Todos los derechos
          reservados.
        </div>
      </footer>
    </main>
  );
}
