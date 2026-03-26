export default function TerminosPage() {
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
          <a href="/" className="text-sm text-blue-600 hover:underline font-medium">
            ← Volver al inicio
          </a>
        </div>
      </nav>

      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: 26 de marzo de 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar la plataforma LuxuTech (en adelante, &quot;la Plataforma&quot;), operada por
              LuxuTech SpA, aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo
              con alguno de estos términos, no debes utilizar la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descripción del servicio</h2>
            <p>
              LuxuTech es una plataforma de intermediación que conecta transportistas con espacio disponible
              en sus vehículos de retorno con enviadores que necesitan transportar carga en rutas compatibles.
              LuxuTech actúa exclusivamente como intermediario tecnológico y no es parte del acuerdo de
              transporte entre transportistas y enviadores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Registro y cuenta de usuario</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Para publicar una ruta es necesario verificar tu correo electrónico.</li>
              <li>Debes proporcionar información veraz, completa y actualizada.</li>
              <li>Eres responsable de mantener la confidencialidad de tu cuenta.</li>
              <li>Debes ser mayor de 18 años para utilizar la Plataforma.</li>
              <li>Nos reservamos el derecho de suspender o eliminar cuentas que infrinjan estos términos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Publicación de rutas</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>La publicación de rutas es gratuita tanto para transportistas como para enviadores.</li>
              <li>Las rutas publicadas deben corresponder a viajes o envíos reales y legítimos.</li>
              <li>Está prohibido publicar rutas falsas, engañosas o con información incorrecta.</li>
              <li>LuxuTech se reserva el derecho de archivar o eliminar rutas que no cumplan con estos términos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Proceso de match</h2>
            <p>
              El sistema de match de LuxuTech identifica rutas compatibles basándose en la proximidad geográfica
              del origen y destino (dentro de un radio de 2 km por defecto). El match es una sugerencia de
              compatibilidad y no constituye un acuerdo vinculante entre las partes.
            </p>
            <p className="mt-2">
              Una vez confirmado un match, se compartirán los datos de contacto entre las partes para que
              puedan coordinar directamente los términos del transporte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Responsabilidad de los usuarios</h2>
            <p>Los usuarios son responsables de:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Cumplir con toda la normativa de transporte vigente en Chile.</li>
              <li>Contar con los permisos, seguros y documentación necesarios para transportar carga.</li>
              <li>Acordar directamente los términos del servicio de transporte (precio, condiciones, seguros, plazos).</li>
              <li>Verificar la identidad y confiabilidad de la contraparte antes de concretar un acuerdo.</li>
              <li>Declarar correctamente el tipo de carga a transportar. Queda prohibido el transporte de mercancías ilegales, peligrosas no declaradas o restringidas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitación de responsabilidad</h2>
            <p>
              LuxuTech actúa como intermediario tecnológico y <strong>no es responsable</strong> de:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>La calidad, puntualidad o cumplimiento del servicio de transporte acordado entre usuarios.</li>
              <li>Daños, pérdidas o deterioro de la carga durante el transporte.</li>
              <li>Incumplimientos contractuales entre transportistas y enviadores.</li>
              <li>Accidentes, robos o cualquier incidente durante el transporte.</li>
              <li>La veracidad de la información proporcionada por los usuarios.</li>
            </ul>
            <p className="mt-2">
              En ningún caso la responsabilidad total de LuxuTech superará el monto pagado por el usuario
              a LuxuTech por el uso de la Plataforma (actualmente $0 CLP).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Propiedad intelectual</h2>
            <p>
              Todo el contenido de la Plataforma, incluyendo pero no limitado a textos, diseños, logotipos,
              código fuente y algoritmos, es propiedad de LuxuTech o de sus licenciantes y está protegido
              por las leyes de propiedad intelectual aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Uso prohibido</h2>
            <p>Queda prohibido:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Utilizar la Plataforma para fines ilegales o no autorizados.</li>
              <li>Intentar acceder a cuentas de otros usuarios o a sistemas internos de LuxuTech.</li>
              <li>Publicar contenido ofensivo, difamatorio o que viole derechos de terceros.</li>
              <li>Utilizar bots, scrapers u otros medios automatizados para extraer datos de la Plataforma.</li>
              <li>Interferir con el funcionamiento normal de la Plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Modificaciones del servicio</h2>
            <p>
              LuxuTech se reserva el derecho de modificar, suspender o descontinuar la Plataforma o cualquiera
              de sus funcionalidades en cualquier momento, con o sin previo aviso. No seremos responsables
              ante ti ni ante terceros por cualquier modificación, suspensión o interrupción del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Modificaciones de los términos</h2>
            <p>
              Podemos actualizar estos Términos y Condiciones en cualquier momento. Los cambios serán publicados
              en esta página con la fecha de última actualización. El uso continuado de la Plataforma después
              de publicados los cambios constituye tu aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Legislación aplicable y jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se rigen por las leyes de la República de Chile. Cualquier
              controversia derivada del uso de la Plataforma será sometida a la jurisdicción de los
              tribunales ordinarios de justicia de Santiago de Chile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en:<br />
              <strong>Email:</strong> contacto@luxutech.cl<br />
              <strong>Ubicación:</strong> Santiago, Chile
            </p>
          </section>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          &copy; {new Date().getFullYear()} LuxuTech. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}
