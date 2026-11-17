import { Link, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useStore } from '../store'
import { fmtFechaHora } from '../lib/utils'
import NoPermiso from '../components/NoPermiso'

export default function Confirmacion() {
  const { numero } = useParams()
  const { postulaciones, semilleros, sesion } = useStore()
  const p = postulaciones.find((x) => x.numero === numero && x.correo === sesion?.correo)
  if (!p) return <NoPermiso mensaje="No encontramos esta postulación" />
  const s = semilleros.find((x) => x.id === p.semilleroId)
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <CheckCircle2 size={56} className="mx-auto text-unal-verde-oscuro" />
      <h1 className="mt-4 text-3xl font-bold leading-tight">Postulación enviada</h1>
      <p className="mt-2 text-sm text-unal-gris-oscuro">Guarda tu número de postulación.</p>
      <p className="mt-4 text-3xl font-bold tracking-wider text-unal-verde-oscuro" data-testid="numero-postulacion">{p.numero}</p>
      <dl className="card mx-auto mt-6 max-w-md text-left text-sm">
        <div className="flex justify-between gap-4 border-b py-2"><dt className="font-semibold">Semillero</dt><dd>{s?.nombre}</dd></div>
        <div className="flex justify-between gap-4 border-b py-2"><dt className="font-semibold">Fecha y hora</dt><dd>{fmtFechaHora(p.fechaEnvio)}</dd></div>
        <div className="flex justify-between gap-4 py-2"><dt className="font-semibold">Estado</dt><dd>{p.estado}</dd></div>
      </dl>
      <p className="mt-4 text-sm">El director fue notificado. Recibirás el resultado por correo y lo verás también en Atlas.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/mi-cuenta?tab=postulaciones" className="btn-primary">Ver mis postulaciones</Link>
        <Link to="/" className="btn-outline">Volver al catálogo</Link>
      </div>
    </div>
  )
}
