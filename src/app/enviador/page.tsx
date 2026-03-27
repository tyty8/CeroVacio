import RouteForm from "@/components/RouteForm";

export default function EnviadorPage() {
  return (
    <RouteForm
      userType="enviador"
      title="Necesito Enviar"
      routeQuestion="¿De dónde a dónde necesitas enviar?"
    >
      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Envía tu carga por menos
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            Aprovecha camiones que ya viajan en tu dirección. Transporte confiable a una fracción del precio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ahorra en promedio un 24%</h3>
              <p className="text-gray-500">
                Comparte el viaje con un transportista que ya va en esa dirección. Pagas solo una fracción del flete completo.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Match en segundos</h3>
              <p className="text-gray-500">
                Nuestro algoritmo encuentra camiones disponibles cerca de tu origen y destino automáticamente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sin costo de publicación</h3>
              <p className="text-gray-500">
                Publicar tu envío es completamente gratis. Solo pagas si decides coordinar con un transportista.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            ¿Cómo funciona?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Publica tu envío</h3>
              <p className="text-sm text-gray-500">Indica origen, destino, fecha y los detalles de tu carga.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Buscamos camiones</h3>
              <p className="text-sm text-gray-500">Encontramos transportistas con espacio disponible que van en tu dirección.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Te conectamos</h3>
              <p className="text-sm text-gray-500">Recibe los datos del transportista para coordinar directamente.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">✓</div>
              <h3 className="font-bold text-gray-900 mb-2">Envío completado</h3>
              <p className="text-sm text-gray-500">Tu carga llega a destino de forma económica y sustentable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What you can send */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Qué puedes enviar?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-bold text-gray-900 mb-1">Carga general</h3>
              <p className="text-sm text-gray-500">Cajas, bultos, pallets envueltos</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="text-3xl mb-3">🧊</div>
              <h3 className="font-bold text-gray-900 mb-1">Refrigerado</h3>
              <p className="text-sm text-gray-500">Alimentos, productos perecibles</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="text-3xl mb-3">🏭</div>
              <h3 className="font-bold text-gray-900 mb-1">Industrial</h3>
              <p className="text-sm text-gray-500">Materiales, insumos, maquinaria</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="text-3xl mb-3">🌾</div>
              <h3 className="font-bold text-gray-900 mb-1">Agrícola</h3>
              <p className="text-sm text-gray-500">Frutas, verduras, productos del campo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-1">$0</div>
            <div className="text-blue-200">Costo por publicar</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">24%</div>
            <div className="text-blue-200">Ahorro vs flete tradicional</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">2 km</div>
            <div className="text-blue-200">Radio de match</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Envía tu carga hoy
          </h2>
          <p className="text-gray-500 mb-8">
            Publica tu envío gratis y encuentra un camión disponible que ya va en tu dirección.
          </p>
          <a href="#formulario" className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
            Publicar mi envío gratis
          </a>
        </div>
      </section>
    </RouteForm>
  );
}
