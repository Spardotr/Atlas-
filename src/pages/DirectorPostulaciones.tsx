import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { fmtFechaHora } from '../lib/utils'
import { Badge, HU, PageTitle } from '../components/UI'
import NoPermiso from '../components/NoPermiso'
import type { EstadoPostulacion } from '../types'

export function BadgeEstado({ e }: { e: EstadoPostulacion }) {
  const tono = e === 'Aceptada' ? 'verde' : e === 'Rechazada' ? 'rojo' : e === 'Retirada' ? 'outline' : 'gris'
  return <Badge tone={tono}>{e}</Badge>
}

export default function DirectorPostulaciones() {
  const { semilleros, sesion, postulaciones } = useStore()
  const s = semilleros.find((x) => x.id === sesion?.semilleroId)
  if (!s) return <NoPermiso />
  // Orden por fecha de recepción (más antigua primero). Sin puntajes ni ordenamiento automático.
  const propias = postulaciones
    .filter((p) => p.semilleroId === s.id)
    .sort((a, b) => a.fechaEnvio.localeCompare(b.fechaEnvio))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageTitle hu={['HU-18', 'HU-19']} sub={`Postulaciones al semillero «${s.nombre}», en orden de recepción. Atlas no acepta, rechaza ni ordena postulaciones por su cuenta.`}>
        Postulaciones
      </PageTitle>
      {propias.length === 0 ? (
        <div className="card text-center text-sm">Aún no hay postulaciones para tu semillero.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <caption className="sr-only">Postulaciones recibidas</caption>
            <thead className="bg-unal-fondo text-left text-xs font-bold uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">Número</th>
                <th scope="col" className="px-4 py-3">Recibida</th>
                <th scope="col" className="px-4 py-3">Estado</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Acción</span></th>
              </tr>
            </thead>
            <tbody>
              {propias.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3 font-semibold">
                    {p.numero}
                    {p.estado === 'Enviada' && !p.revisada && <span className="ml-2"><Badge tone="vino">Nueva</Badge></span>}
                  </td>
                  <td className="px-4 py-3">{fmtFechaHora(p.fechaEnvio)}</td>
                  <td className="px-4 py-3"><BadgeEstado e={p.estado} /></td>
                  <td className="px-4 py-3 text-right"><Link to={`/director/postulaciones/${p.id}`} className="font-semibold text-unal-verde-oscuro underline">Abrir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-2"><HU id="HU-18" /></div>
    </div>
  )
}
