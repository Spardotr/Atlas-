import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarClock, MessageCircle, Users } from 'lucide-react'
import { useStore } from '../store'
import { convocatoriaAbierta, cuposDisponibles, enlaceWhatsApp, fmtFecha } from '../lib/utils'
import { Alerta, HU } from '../components/UI'
import { BadgeConvocatoria, SelloFicha, TarjetaSemillero } from '../components/Semillero'
import NoPermiso from '../components/NoPermiso'

function Dato({ etiqueta, children, hu }: { etiqueta: string; children: React.ReactNode; hu?: string }) {
  return (
    <div className="border-b border-unal-gris-claro/50 py-3 sm:grid sm:grid-cols-[14rem_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-unal-gris-oscuro">
        {etiqueta}
        {hu && <HU id={hu} />}
      </dt>
      <dd className="mt-1 text-sm sm:mt-0">{children}</dd>
    </div>
  )
}

const SinInfo = () => <span className="italic text-unal-gris-oscuro">Sin información</span>

export default function Ficha() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { semilleros, role, sesion } = useStore()
  const s = semilleros.find((x) => x.id === id)

  if (!s) return <NoPermiso mensaje="No encontramos este semillero" />

  const abierta = convocatoriaAbierta(s)
  // Si se llegó desde una búsqueda, se vuelve a ella con sus filtros y página
  const volverA = (location.state as { desde?: string } | null)?.desde ?? '/'
  const esDirectorPropio = role === 'director' && sesion?.semilleroId === s.id
  const puedePostular = role === 'visitante' || role === 'estudiante'
  const relacionados = semilleros.filter((x) => x.area === s.area && x.id !== s.id).slice(0, 4)

  const unirme = () => {
    navigate(role === 'visitante' ? `/ingresar?next=${encodeURIComponent(`/postular/${s.id}`)}` : `/postular/${s.id}`)
  }

  const publico = s.contacto
  const tel = publico?.publicarTelefono && publico.telefono
  const wa = publico?.publicarWhatsapp && publico.whatsapp

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to={volverA} className="btn-outline mb-4">
        <ArrowLeft size={18} aria-hidden /> {volverA === '/' ? 'Volver a explorar' : 'Volver a los resultados'}
      </Link>
      <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-unal-gris-oscuro">
        <Link to={volverA} className="hover:underline">Explorar</Link> <span aria-hidden>›</span> <span className="font-semibold text-unal-texto">{s.nombre}</span>
      </nav>

      {(location.state as { aviso?: string } | null)?.aviso === 'cerrada' && (
        <div className="mb-4"><Alerta tono="error">Este semillero no tiene convocatoria abierta</Alerta></div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-4">
          {s.logo && <img src={s.logo} alt={`Logo de ${s.nombre}`} className="h-16 w-16 shrink-0 rounded border bg-white object-contain p-1" />}
          <h1 className="text-3xl font-bold leading-tight">{s.nombre}</h1>
        </div>
        <div className="mt-2 h-1 w-14 bg-unal-verde" />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <SelloFicha s={s} />
          <HU id="HU-04" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="datos" className="card">
          <h2 id="datos" className="section-title mb-2">Ficha del semillero</h2>
          <dl>
            <Dato etiqueta="Nombre">{s.nombre}</Dato>
            <Dato etiqueta="Descripción">{s.descripcion || <SinInfo />}</Dato>
            <Dato etiqueta="Línea de investigación">{s.linea || <SinInfo />}</Dato>
            <Dato etiqueta="Director">{s.director.nombre || <SinInfo />}</Dato>
            <Dato etiqueta="Correo del director">
              {s.director.correo ? <a className="font-semibold text-unal-verde-oscuro underline" href={`mailto:${s.director.correo}`}>{s.director.correo}</a> : <SinInfo />}
            </Dato>
            {/* P06: distinguir «no hay requisitos» de «el director no ha cargado la información» */}
            <Dato etiqueta="Requisitos">
              {s.requisitos || (
                <span className="italic text-unal-gris-oscuro">
                  {s.estadoFicha === 'Verificada' ? 'Sin requisitos previos: entrada libre' : 'El director aún no ha cargado esta información'}
                </span>
              )}
            </Dato>
            <Dato etiqueta="Página web">
              {s.sitioWeb ? (
                <a className="break-all font-semibold text-unal-verde-oscuro underline" href={s.sitioWeb} target="_blank" rel="noopener noreferrer">
                  {s.sitioWeb.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              ) : (
                <span className="italic text-unal-gris-oscuro">Este semillero no tiene página web registrada</span>
              )}
            </Dato>
            <Dato etiqueta="Estado de convocatoria"><BadgeConvocatoria s={s} /></Dato>
          </dl>

          {(tel || wa) && (
            <div className="mt-5 rounded bg-unal-fondo p-4 text-sm">
              <p className="mb-1 text-lg font-semibold">Contacto confirmado por el director</p>
              {tel && <p>Teléfono: <span className="font-semibold">{tel}</span></p>}
              {wa && <p>WhatsApp: <span className="font-semibold">{wa}</span></p>}
              {wa && enlaceWhatsApp(wa, `Hola, vi el semillero «${s.nombre}» en Atlas y quisiera más información.`) && (
                <a
                  href={enlaceWhatsApp(wa, `Hola, vi el semillero «${s.nombre}» en Atlas y quisiera más información.`)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-3"
                >
                  <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              )}
            </div>
          )}

          {s.estadoFicha === 'Precargada' && (
            <p className="mt-5 text-sm text-unal-gris-oscuro">
              ¿Eres el director de este semillero?{' '}
              <Link to={`/director/ficha?semillero=${s.id}`} className="font-semibold text-unal-verde-oscuro underline">
                Reclama esta ficha
              </Link>{' '}
              para confirmar la información.
            </p>
          )}
        </section>

        <aside aria-labelledby="conv" className="card h-fit">
          <h2 id="conv" className="section-title mb-3">Convocatoria<HU id="HU-12" /></h2>
          {abierta ? (
            <div className="space-y-3">
              <BadgeConvocatoria s={s} />
              <p className="flex items-start gap-2 text-sm"><CalendarClock size={16} className="mt-0.5 shrink-0" /> Cierra el {fmtFecha(s.convocatoria.cierre)} a las 23:59</p>
              <p className="flex items-start gap-2 text-sm"><Users size={16} className="mt-0.5 shrink-0" /> Cupos disponibles: <strong>{cuposDisponibles(s)}</strong></p>
              {puedePostular && (
                <button onClick={unirme} className="btn-primary w-full">Quiero unirme</button>
              )}
              {esDirectorPropio && (
                <Link to="/director/convocatoria" className="btn-outline w-full">Administrar convocatoria</Link>
              )}
              {!puedePostular && !esDirectorPropio && (
                <p className="text-xs text-unal-gris-oscuro">Solo los estudiantes pueden postularse.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <BadgeConvocatoria s={s} />
              <Alerta>Este semillero no tiene convocatoria abierta</Alerta>
              {esDirectorPropio && (
                <Link to="/director/convocatoria" className="btn-outline w-full">Administrar convocatoria</Link>
              )}
            </div>
          )}
        </aside>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-10" aria-labelledby="otros">
          <h2 id="otros" className="section-title mb-3">Otros semilleros en {s.area}</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relacionados.map((r) => (
              <li key={r.id}><TarjetaSemillero s={r} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
