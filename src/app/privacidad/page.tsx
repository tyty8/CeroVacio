export default function PrivacidadPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: 26 de marzo de 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Responsable del tratamiento</h2>
            <p>
              LuxuTech SpA (&quot;LuxuTech&quot;, &quot;nosotros&quot;) es responsable del tratamiento de los datos personales
              recopilados a través de la plataforma disponible en luxutech.cl y sus subdominios. Domicilio: Santiago, Chile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Datos que recopilamos</h2>
            <p>Recopilamos los siguientes datos personales cuando utilizas nuestra plataforma:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Datos de identificación:</strong> nombre completo, correo electrónico y número de teléfono.</li>
              <li><strong>Datos de ruta:</strong> direcciones de origen y destino, coordenadas geográficas y fecha del viaje o envío.</li>
              <li><strong>Datos de carga (enviadores):</strong> tipo de carga, cantidad de pallets, peso estimado y descripción.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador y datos de uso de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Finalidad del tratamiento</h2>
            <p>Utilizamos tus datos para las siguientes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Crear y gestionar tu cuenta de usuario.</li>
              <li>Verificar tu identidad mediante código de verificación por email.</li>
              <li>Encontrar matches entre transportistas y enviadores con rutas compatibles.</li>
              <li>Facilitar la comunicación entre usuarios que han sido conectados.</li>
              <li>Mejorar nuestros servicios y la experiencia de usuario.</li>
              <li>Cumplir con obligaciones legales aplicables.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Base legal</h2>
            <p>
              El tratamiento de tus datos se basa en tu consentimiento al registrarte y publicar una ruta,
              así como en nuestro interés legítimo de operar la plataforma y en el cumplimiento de obligaciones
              legales, conforme a la Ley N° 19.628 sobre Protección de la Vida Privada de Chile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Compartición de datos</h2>
            <p>Tus datos personales podrán ser compartidos en los siguientes casos:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Con tu match:</strong> cuando se confirma un match, compartimos nombre, email y teléfono entre las partes para que puedan coordinar.</li>
              <li><strong>Proveedores de servicios:</strong> utilizamos servicios de terceros para alojamiento (Vercel), base de datos (Neon), envío de emails (AWS SES) y geocodificación (OpenStreetMap/Nominatim).</li>
              <li><strong>Requerimientos legales:</strong> cuando sea exigido por ley, orden judicial o autoridad competente.</li>
            </ul>
            <p className="mt-2">No vendemos ni compartimos tus datos con terceros para fines publicitarios.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Seguridad de los datos</h2>
            <p>
              Implementamos medidas técnicas y organizativas razonables para proteger tus datos personales
              contra acceso no autorizado, pérdida o alteración. La verificación de email es obligatoria
              para todos los usuarios antes de publicar una ruta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Conservación de datos</h2>
            <p>
              Conservamos tus datos mientras tu cuenta esté activa o mientras sea necesario para cumplir
              con las finalidades descritas. Las rutas archivadas se conservan por un período razonable
              para fines estadísticos y de mejora del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Tus derechos</h2>
            <p>De acuerdo con la legislación chilena, tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Acceso:</strong> solicitar información sobre los datos personales que tenemos sobre ti.</li>
              <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
              <li><strong>Cancelación:</strong> solicitar la eliminación de tus datos personales.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
            </ul>
            <p className="mt-2">
              Para ejercer estos derechos, contáctanos a <strong>contacto@luxutech.cl</strong>.
              Responderemos en un plazo máximo de 15 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Cookies</h2>
            <p>
              Nuestra plataforma utiliza cookies técnicas esenciales para su funcionamiento. No utilizamos
              cookies de seguimiento ni de publicidad de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política en cualquier momento. Los cambios
              serán publicados en esta página con la fecha de última actualización. Te recomendamos
              revisarla periódicamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:<br />
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
