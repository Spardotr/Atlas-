import { fmtFecha, hoyISO } from '../lib/utils'

// URLs oficiales tomadas del pie de página de unal.edu.co
const COLUMNAS: [string, string][][] = [
  [
    ['Régimen Legal', 'http://www.legal.unal.edu.co/'],
    ['Contratación', 'https://portaladquisiciones.unal.edu.co/'],
    ['Rendición de cuentas', 'http://launalcuenta.unal.edu.co/'],
    ['Pago virtual', 'http://www.pagovirtual.unal.edu.co/'],
    ['Calidad', 'http://siga.unal.edu.co/'],
  ],
  [
    ['Talento humano', 'http://personal.unal.edu.co/'],
    ['Ofertas de empleo', 'http://personal.unal.edu.co/'],
    ['Concurso docente', 'http://docentes.unal.edu.co/concurso-profesoral/'],
    ['Control interno', 'http://controlinterno.unal.edu.co/'],
    ['Buzón de notificaciones', 'https://unal.edu.co/buzon-de-notificaciones/'],
  ],
  [
    ['Correo institucional', 'https://smartkey.xertica.com/cloudkey/a/unal.edu.co/user/login'],
    ['Redes sociales', 'https://redessociales.unal.edu.co/'],
    ['Quejas y reclamos', 'http://quejasyreclamos.unal.edu.co/'],
    ['Encuesta', 'https://unal.edu.co/egresados'],
    ['Estadísticas', 'http://estadisticas.unal.edu.co/'],
  ],
  [
    ['Preguntas frecuentes', 'https://unal.edu.co/faq'],
    ['Servicios en línea', 'https://unal.edu.co/atencion-en-linea/'],
    ['Contáctenos', 'https://unal.edu.co/contactenos'],
    ['Glosario', 'https://unal.edu.co/glosario'],
  ],
]

const enlace = 'inline-block py-[1px] hover:underline focus-visible:underline'

export default function Footer() {
  return (
    <footer className="mt-16 bg-unal-footer text-white" aria-label="Pie de página institucional">
      <div className="mx-auto grid max-w-[1500px] gap-x-8 gap-y-6 px-6 py-7 text-xs leading-5 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.6fr_1.1fr_auto]">
        {COLUMNAS.map((col, i) => (
          <ul key={i}>
            {col.map(([t, href]) => (
              <li key={t}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={enlace}>
                  {t}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        ))}

        <address className="not-italic sm:col-span-2 lg:col-span-1 lg:border-l lg:border-white/30 lg:pl-6">
          <p className="font-bold">Contacto página web:</p>
          <p className="text-white/90">Carrera 45 # 26-85</p>
          <p className="text-white/90">Edif. Uriel Gutiérrez - Bogotá D.C., Colombia</p>
          <p className="text-white/90">PBX: (+57) 601 4068888 - (+57) 601 3165000</p>
          <p className="text-white/90">Línea Gratuita Nacional: 01 8000 912 597</p>
        </address>

        <div className="text-white/90 lg:border-l lg:border-white/30 lg:pl-6 lg:text-right">
          <p><a href="http://unal.edu.co/archivos/user_upload/docs/legal.pdf" target="_blank" rel="noopener noreferrer" className={enlace}>© Copyright 2021<span className="sr-only"> (se abre en una pestaña nueva)</span></a></p>
          <p>Algunos derechos reservados.</p>
          <p><a href="https://unal.edu.co/contactenos" target="_blank" rel="noopener noreferrer" className={enlace}>Contáctenos</a></p>
          <p><a href="https://unal.edu.co/acerca-de-este-sitio-web" target="_blank" rel="noopener noreferrer" className={enlace}>Acerca de este sitio web</a></p>
          <p>Actualización: {fmtFecha(hoyISO())}</p>
        </div>

        <div className="flex items-center gap-5 lg:justify-end lg:border-l lg:border-white/30 lg:pl-6">
          <div className="flex flex-col gap-3">
            <a href="http://orgullo.unal.edu.co/" target="_blank" rel="noopener noreferrer"><img src="/img/orgullo-unal.png" width={240} height={60} alt="Orgullo UNAL (se abre en una pestaña nueva)" className="h-8 w-auto" /></a>
            <a href="http://agenciadenoticias.unal.edu.co/" target="_blank" rel="noopener noreferrer"><img src="/img/agencia-unal.png" width={240} height={60} alt="Agencia de Noticias UNAL (se abre en una pestaña nueva)" className="h-8 w-auto" /></a>
          </div>
          <a href="https://www.gov.co/" target="_blank" rel="noopener noreferrer"><img src="/img/gov-co.png" width={120} height={80} alt="gov.co — Colombia (se abre en una pestaña nueva)" className="h-12 w-auto" /></a>
        </div>
      </div>
    </footer>
  )
}
