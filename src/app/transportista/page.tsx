import RouteForm from "@/components/RouteForm";

export default function TransportistaPage() {
  return (
    <RouteForm
      userType="transportista"
      title="Publica tu Ruta de Retorno"
      routeQuestion="¿Hacia dónde vuelves?"
    >
      {/* ─── Pain Point Hero ─── */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
            ¿Vuelves con el camión vacío?<br />
            <span className="text-red-400">Eso es plata que estás perdiendo.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Cada viaje de vuelta vacío te cuesta combustible, peaje y desgaste sin generar un peso. Con LuxuTech, conviertes ese viaje muerto en ingresos reales.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-red-400 mb-1">$0</div>
              <div className="text-sm text-gray-300">Ganas volviendo vacío</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-1">$200k-$500k</div>
              <div className="text-sm text-gray-300">Ganas con LuxuTech</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-blue-400 mb-1">2 min</div>
              <div className="text-sm text-gray-300">Publicar tu ruta</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The Problem ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            El problema que todos conocen
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-3xl mx-auto text-lg">
            Llevas carga de Santiago a Antofagasta y vuelves vacío. Pagas bencina, peaje y mantenimiento sin recuperar un peso en el retorno. <strong className="text-gray-900">Eso se acabó.</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sin LuxuTech:</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Vuelves con el camión vacío pagando bencina y peaje de tu bolsillo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Pierdes horas llamando contactos buscando carga para el retorno</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="text-gray-600">El desgaste del camión corre igual, con o sin carga</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Con LuxuTech:</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Ganas entre <strong>$200.000 y $500.000 CLP</strong> por cada viaje de retorno</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Nosotros te encontramos carga automáticamente, sin llamar a nadie</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Publicas en 2 minutos y el match es gratis, sin comisiones</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            ¿Cómo funciona?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Deja la carga</h3>
              <p className="text-sm text-gray-500">Terminas tu entrega normalmente en destino.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Publica tu retorno</h3>
              <p className="text-sm text-gray-500">En 2 minutos indica desde dónde vuelves y hacia dónde.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Te encontramos carga</h3>
              <p className="text-sm text-gray-500">Nuestro algoritmo busca enviadores que necesitan tu ruta.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">$</div>
              <h3 className="font-bold text-gray-900 mb-2">Ganas dinero</h3>
              <p className="text-sm text-gray-500">Coordinan directo, acuerdan precio y monetizas tu viaje de vuelta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Transportistas que ya ganan con LuxuTech
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                &ldquo;Antes volvía vacío de Antofagasta a Santiago. Ahora gano entre $300.000 y $400.000 por cada retorno. Es plata que antes simplemente se perdía.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">CR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Carlos R.</div>
                  <div className="text-xs text-gray-500">Ruta Santiago-Antofagasta</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                &ldquo;Llevo 3 meses usando la plataforma y ya es parte de mi rutina. Publico mi ruta de vuelta apenas dejo la carga y casi siempre encuentro algo para el retorno.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">JL</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">José L.</div>
                  <div className="text-xs text-gray-500">Ruta 5 Sur</div>
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
            <div className="text-4xl font-bold mb-1">$0</div>
            <div className="text-blue-200">Costo por publicar</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">$500k</div>
            <div className="text-blue-200">Potencial por retorno</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">2 min</div>
            <div className="text-blue-200">Publicar tu ruta</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">24/7</div>
            <div className="text-blue-200">Plataforma disponible</div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cada viaje vacío es dinero que pierdes
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Publica tu ruta de retorno en 2 minutos. Es gratis, sin comisiones, sin letra chica.
          </p>
          <a href="#formulario" className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
            Publicar mi ruta gratis
          </a>
          <p className="mt-4 text-sm text-gray-400">
            Sin comisiones ocultas. Tus datos solo se comparten con enviadores que hacen match con tu ruta.
          </p>
          <a href="/faq" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
            ¿Tienes dudas? Lee nuestras preguntas frecuentes &rarr;
          </a>
        </div>
      </section>
    </RouteForm>
  );
}
