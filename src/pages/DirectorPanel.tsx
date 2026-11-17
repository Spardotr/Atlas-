import { Link } from 'react-router-dom'
import { CalendarClock, FileEdit, Inbox } from 'lucide-react'
import { useStore } from '../store'
import { convocatoriaAbierta, cuposDisponibles, fmtFecha } from '../lib/utils'
import { HU, PageTitle } from '../components/UI'
import { BadgeConvocatoria, SelloFicha } from '../components/Semillero'
import NoPermiso from '../components/NoPermiso'

export default function DirectorPanel() {
  const { semilleros, sesion, postulaciones } = useStore()
  const s = semilleros.find((x) => x.id === sesion?.semilleroId)
  if (!s) return <NoPermiso />
  const propias = postulaciones.filter((p) => p.semilleroId === s.id)
  const nuevas = propias.filter((p) => p.estado === 'Enviada' && !p.revisada).length
  const pendientes = propias.filter((p) => p.estado === 'Enviada').length

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageTitle hu={['HU-09']} sub={`Panel del semillero «${s.nombre}». Solo ves la información de tu semillero.`}>
        Mi semillero
      </PageTitle>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="card" aria-labelledby="c-ficha">
          <h2 id="c-ficha" className="section-title mb-3 flex items-center gap-2"><FileEdit size={16} /> Mi ficha</h2>
          <SelloFicha s={s} />
          <p className="mt-3 text-sm text-unal-gris-oscuro">
            {s.estadoFicha === 'Precargada' ? 'Tu ficha fue precargada desde Hermes. Revísala y verifícala.' : 'Tu ficha está verificada.'}
          </p>
          <Link to="/director/ficha" className="btn-primary mt-4 w-full">{s.estadoFicha === 'Precargada' ? 'Revisar mi ficha' : 'Editar ficha'}</Link>
        </section>

        <section className="card" aria-labelledby="c-conv">
          <h2 id="c-conv" className="section-title mb-3 flex items-center gap-2"><CalendarClock size={16} /> Convocatoria</h2>
          <BadgeConvocatoria s={s} />
          <p className="mt-3 text-sm text-unal-gris-oscuro">
            {convocatoriaAbierta(s) ? `Cierra el ${fmtFecha(s.convocatoria.cierre)} a las 23:59. Cupos disponibles: ${cuposDisponibles(s)}.` : 'No recibes postulaciones en este momento.'}
          </p>
          <Link to="/director/convocatoria" className="btn-outline mt-4 w-full">Administrar convocatoria</Link>
        </section>

        <section className="card" aria-labelledby="c-post">
          <h2 id="c-post" className="section-title mb-3 flex items-center gap-2"><Inbox size={16} /> Postulaciones</h2>
          <p className="text-3xl font-bold" data-testid="nuevas">{nuevas}</p>
          <p className="text-sm text-unal-gris-oscuro">nuevas sin revisar · {pendientes} pendientes de decisión</p>
          <Link to="/director/postulaciones" className="btn-outline mt-4 w-full">Ver postulaciones</Link>
        </section>
      </div>
      <p className="mt-6 text-xs text-unal-gris-oscuro">Director: {s.director.nombre} · {s.director.correo}</p>
      <div className="mt-1"><HU id="HU-09" /></div>
    </div>
  )
}
