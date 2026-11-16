import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../store'
import { fmtFechaHora } from '../lib/utils'
import { Alerta, Dialog, HU, PageTitle } from '../components/UI'
import NoPermiso from '../components/NoPermiso'
import { BadgeEstado } from './DirectorPostulaciones'

export default function DirectorPostulacionDetalle() {
  const { id } = useParams()
  const { semilleros, sesion, postulaciones, abrirPostulacion, decidir } = useStore()
  const [confirmar, setConfirmar] = useState<null | 'Aceptada' | 'Rechazada'>(null)
  const p = postulaciones.find((x) => x.id === id)
  const s = semilleros.find((x) => x.id === sesion?.semilleroId)
  const permitido = !!p && !!s && p.semilleroId === s.id

  useEffect(() => {
    if (permitido && id) abrirPostulacion(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permitido, id])

  if (!permitido || !p || !s) return <NoPermiso mensaje="No tienes permiso para ver esta postulación" />

  const retirada = p.estado === 'Retirada'
  const sinCupos = s.convocatoria.aceptados >= s.convocatoria.cupos

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm"><Link to="/director/postulaciones" className="text-unal-verde-oscuro underline">← Volver a postulaciones</Link></nav>
      <PageTitle hu={['HU-19']}>Postulación {p.numero}</PageTitle>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <BadgeEstado e={p.estado} />
        <span className="text-unal-gris-oscuro">Recibida el {fmtFechaHora(p.fechaEnvio)}</span>
      </div>

      {retirada ? (
        <Alerta>
          <p className="font-semibold">Postulación retirada</p>
          <p className="mt-1">La persona retiró su postulación o revocó su autorización. Atlas no conserva sus datos.</p>
        </Alerta>
      ) : (
        <section className="card" aria-labelledby="datos-p">
          <h2 id="datos-p" className="section-title mb-2">Datos del formulario</h2>
          <dl className="text-sm">
            {[
              ['Nombre completo', p.nombre],
              ['Programa curricular', p.programa],
              ['Semestre', p.semestre],
              ['Disponibilidad semanal', p.disponibilidad],
              ['Mensaje', p.mensaje || 'Sin mensaje'],
            ].map(([k, v]) => (
              <div key={k} className="border-b py-3 sm:grid sm:grid-cols-[13rem_1fr]">
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-unal-gris-oscuro">{k}</dt>
                <dd className="mt-1 whitespace-pre-wrap sm:mt-0">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {p.estado === 'Enviada' && (
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button className="btn-danger" onClick={() => setConfirmar('Rechazada')}>Rechazar</button>
          <button className="btn-primary" disabled={sinCupos} onClick={() => setConfirmar('Aceptada')}>Aceptar</button>
        </div>
      )}
      {p.estado === 'Enviada' && sinCupos && (
        <p className="mt-2 text-right text-sm text-unal-gris-oscuro" role="note">
          No puedes aceptar: los cupos están llenos. Aumenta los cupos en <Link to="/director/convocatoria" className="font-semibold text-unal-verde-oscuro underline">Convocatoria</Link> para aceptar más postulaciones.
        </p>
      )}
      {(p.estado === 'Aceptada' || p.estado === 'Rechazada') && p.decisionAt && (
        <div className="mt-6"><Alerta tono="ok">Decisión registrada el {fmtFechaHora(p.decisionAt)}</Alerta></div>
      )}
      <HU id="HU-19" />

      {confirmar && (
        <Dialog
          titulo={confirmar === 'Aceptada' ? 'Aceptar postulación' : 'Rechazar postulación'}
          onClose={() => setConfirmar(null)}
          acciones={
            <>
              <button className="btn-outline" onClick={() => setConfirmar(null)}>Cancelar</button>
              <button className={confirmar === 'Aceptada' ? 'btn-primary' : 'btn-danger'} onClick={() => { decidir(p.id, confirmar); setConfirmar(null) }}>
                Confirmar
              </button>
            </>
          }
        >
          <p>
            {confirmar === 'Aceptada' ? 'Aceptarás' : 'Rechazarás'} la postulación {p.numero}. Se le notificará a la persona por correo y la decisión quedará registrada con fecha y hora.
          </p>
        </Dialog>
      )}
    </div>
  )
}
