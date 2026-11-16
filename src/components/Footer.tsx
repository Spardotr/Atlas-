import { Link } from 'react-router-dom'
import { fmtFecha, hoyISO } from '../lib/utils'

const SITIO_UNAL = 'https://unal.edu.co'

const COLUMNAS: string[][] = [
  ['Régimen Legal', 'Contratación', 'Rendición de cuentas', 'Pago virtual', 'Calidad'],
  ['Talento humano', 'Ofertas de empleo', 'Concurso docente', 'Control interno', 'Buzón de notificaciones'],
  ['Correo institucional', 'Redes sociales', 'Quejas y reclamos', 'Encuesta', 'Estadísticas'],
  ['Mapa del sitio', 'Preguntas frecuentes', 'Servicios en línea', 'Contáctenos', 'Glosario'],
]

const enlace = 'inline-block py-[1px] hover:underline focus-visible:underline'

export default function Footer() {
  return (
    <footer className="mt-16 bg-unal-footer text-white" aria-label="Pie de página institucional">
      <div className="mx-auto grid max-w-[1500px] gap-x-8 gap-y-6 px-6 py-7 text-[12px] leading-[17px] sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.6fr_1.1fr_auto]">
        {COLUMNAS.map((col, i) => (
          <ul key={i}>
            {col.map((t) => (
              <li key={t}>
                {t === 'Mapa del sitio' ? (
                  <Link to="/evaluacion" className={enlace}>{t}</Link>
                ) : (
                  <a href={SITIO_UNAL} target="_blank" rel="noopener noreferrer" className={enlace}>
                    {t}
                    <span className="sr-only"> (abre unal.edu.co en una pestaña nueva)</span>
                  </a>
                )}
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
          <p>© Copyright 2021</p>
          <p>Algunos derechos reservados.</p>
          <p><a href={SITIO_UNAL} target="_blank" rel="noopener noreferrer" className={enlace}>Contáctenos</a></p>
          <p><a href={SITIO_UNAL} target="_blank" rel="noopener noreferrer" className={enlace}>Acerca de este sitio web</a></p>
          <p>Actualización: {fmtFecha(hoyISO())}</p>
        </div>

        <div className="flex items-center gap-5 lg:justify-end lg:border-l lg:border-white/30 lg:pl-6">
          <div className="flex flex-col gap-3">
            <img src="/img/orgullo-unal.png" alt="Orgullo UNAL" className="h-8 w-auto" />
            <img src="/img/agencia-unal.png" alt="Agencia UNAL" className="h-8 w-auto" />
          </div>
          <img src="/img/gov-co.png" alt="gov.co — Colombia" className="h-12 w-auto" />
        </div>
      </div>
    </footer>
  )
}
