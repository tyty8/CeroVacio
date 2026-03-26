import RouteForm from "@/components/RouteForm";

export default function TransportistaPage() {
  return (
    <RouteForm
      userType="transportista"
      title="Soy Transportista"
      routeQuestion="¿Cuál es tu ruta de retorno?"
    >
      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            ¿Por qué publicar tu ruta?
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            Deja de volver vacío. Monetiza cada kilómetro de tu retorno sin costo y sin compromisos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ingresos extra</h3>
              <p className="text-gray-500">
                Gana dinero con el espacio que ya tienes disponible en tu camión de vuelta. Cero inversión adicional.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Publica en 2 minutos</h3>
              <p className="text-gray-500">
                Indica tu ruta de retorno y fecha. Nosotros nos encargamos de encontrar carga compatible automáticamente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% gratuito</h3>
              <p className="text-gray-500">
                Publicar tu ruta no tiene costo. Sin comisiones ocultas, sin suscripciones, sin letra chica.
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
              <h3 className="font-bold text-gray-900 mb-2">Publica tu ruta</h3>
              <p className="text-sm text-gray-500">Indica origen, destino y fecha de tu viaje de retorno.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Buscamos match</h3>
              <p className="text-sm text-gray-500">Nuestro algoritmo encuentra enviadores con carga en tu misma ruta.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Te conectamos</h3>
              <p className="text-sm text-gray-500">Recibe los datos de contacto del enviador para coordinar.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">$</div>
              <h3 className="font-bold text-gray-900 mb-2">Ganas dinero</h3>
              <p className="text-sm text-gray-500">Acuerdan el precio directamente y monetizas tu viaje de vuelta.</p>
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
            <div className="text-4xl font-bold mb-1">2 km</div>
            <div className="text-blue-200">Radio de match</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">24/7</div>
            <div className="text-blue-200">Plataforma disponible</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No dejes espacio vacío en tu camión
          </h2>
          <p className="text-gray-500 mb-8">
            Cada viaje de vuelta vacío es dinero que pierdes. Publica tu ruta ahora y empieza a ganar.
          </p>
          <a href="#formulario" className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
            Publicar mi ruta gratis
          </a>
        </div>
      </section>
    </RouteForm>
  );
}
