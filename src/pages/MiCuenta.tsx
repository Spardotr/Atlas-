import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import clsx from 'clsx'
import { useStore } from '../store'
import { PROGRAMAS, type Autorizacion } from '../types'
import { fmtFechaHora } from '../lib/utils'
import { Alerta, Dialog, HU, PageTitle } from '../components/UI'
import { BadgeEstado } from './DirectorPostulaciones'

type Tab = 'datos' | 'postulaciones' | 'autorizaciones' | 'eliminar'
const TABS: { id: Tab; label: string }[] = [
  { id: 'datos', label: 'Mis datos' },
  { id: 'postulaciones', label: 'Mis postulaciones' },
  { id: 'autorizaciones', label: 'Autorizaciones' },
  { id: 'eliminar', label: 'Eliminar perfil' },
]

const FINALIDAD: Record<Autorizacion['finalidad'], string> = {
  postulacion: 'Tratamiento de mis datos para gestionar mis postulaciones a semilleros',
  avisos: 'Avisos por correo sobre convocatorias',
}

export default function MiCuenta() {
  const [params, setParams] = useSearchParams()
  const tab = (TABS.find((t) => t.id === params.get('tab'))?.id ?? 'datos') as Tab
  const navigate = useNavigate()
  const { sesion, perfil, postulaciones, semilleros, autorizaciones, actualizarPerfil, revocar, retirarPostulacion, eliminarPerfil } = useStore()

  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ nombre: '', programa: '', semestre: '' })
  const [revocando, setRevocando] = useState<Autorizacion | null>(null)
  const [retirando, setRetirando] = useState<string | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [confirmacion, setConfirmacion] = useState('')

  if (!sesion) return null
  const misPost = postulaciones
    .filter((p) => p.correo === sesion.correo)
    .sort((a, b) => b.fechaEnvio.localeCompare(a.fechaEnvio))
  const misAut = autorizaciones.filter((a) => a.correo === sesion.correo)
  const eventos = misAut
    .flatMap((a) => [
      { fecha: a.fechaHora, texto: `Autorización otorgada: ${FINALIDAD[a.finalidad]} (aviso ${a.version})` },
      ...(a.revocadaAt ? [{ fecha: a.revocadaAt, texto: `Autorización revocada: ${FINALIDAD[a.finalidad]}` }] : []),
    ])
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  const empezarEdicion = () => {
    setForm({ nombre: perfil?.nombre ?? '', programa: perfil?.programa ?? '', semestre: perfil?.semestre ?? '' })
    setEditando(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageTitle hu={['HU-33', 'HU-34', 'HU-35', 'HU-36']} sub="Consulta, corrige y controla el uso de tu información personal.">Mis datos y privacidad</PageTitle>

      <div role="tablist" aria-label="Secciones" className="mb-6 flex flex-wrap gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setParams({ tab: t.id })}
            className={clsx('px-4 py-2 text-sm font-bold uppercase tracking-wide', tab === t.id ? 'border-b-2 border-unal-verde-oscuro text-unal-texto' : 'text-unal-gris-oscuro hover:text-unal-texto', t.id === 'eliminar' && tab !== t.id && 'text-unal-rojo')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'datos' && (
        <section className="card" aria-labelledby="t-datos">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="t-datos" className="section-title">Datos personales<HU id="HU-33" /></h2>
            {perfil && !editando && <button className="btn-outline" onClick={empezarEdicion}>Editar</button>}
          </div>
          {!perfil ? (
            <Alerta>
              Aún no tienes un perfil. Se crea cuando te postulas a un semillero por primera vez.{' '}
              <Link to="/" className="font-semibold text-unal-verde-oscuro underline">Explorar semilleros</Link>
            </Alerta>
          ) : editando ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                if (!form.nombre.trim()) return
                actualizarPerfil({ nombre: form.nombre.trim(), programa: form.programa, semestre: form.semestre })
                setEditando(false)
              }}
            >
              <div>
                <label htmlFor="m-nombre" className="label">Nombre completo</label>
                <input id="m-nombre" className="input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label htmlFor="m-correo" className="label flex items-center gap-1">Correo institucional <Lock size={12} aria-label="No editable" /></label>
                <input id="m-correo" className="input bg-gray-100" readOnly value={perfil.correo} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="m-prog" className="label">Programa curricular</label>
                  <select id="m-prog" className="input" value={form.programa} onChange={(e) => setForm({ ...form, programa: e.target.value })}>
                    <option value="">Sin información</option>
                    {PROGRAMAS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="m-sem" className="label">Semestre</label>
                  <select id="m-sem" className="input" value={form.semestre} onChange={(e) => setForm({ ...form, semestre: e.target.value })}>
                    <option value="">Sin información</option>
                    {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((n) => <option key={n}>{n}</option>)}
                    <option>10 o más</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-outline" onClick={() => setEditando(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar cambios</button>
              </div>
            </form>
          ) : (
            <dl className="text-sm">
              {[
                ['Nombre', perfil.nombre],
                ['Correo institucional', perfil.correo],
                ['Programa curricular', perfil.programa || 'Sin información'],
                ['Semestre', perfil.semestre || 'Sin información'],
                ['Declaración de mayoría de edad', fmtFechaHora(perfil.mayorEdadAt)],
              ].map(([k, v]) => (
                <div key={k} className="border-b py-3 sm:grid sm:grid-cols-[14rem_1fr]">
                  <dt className="text-sm font-semibold text-unal-gris-oscuro">{k}</dt>
                  <dd data-testid={`dato-${k}`}>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {editando && <p className="mt-3 text-xs text-unal-gris-oscuro">Tu correo institucional no es editable.<HU id="HU-34" /></p>}
        </section>
      )}

      {tab === 'postulaciones' && (
        <section aria-labelledby="t-post">
          <h2 id="t-post" className="section-title mb-3">Mis postulaciones<HU id="HU-21" /></h2>
          {misPost.length === 0 ? (
            <div className="card text-sm">Todavía no te has postulado a ningún semillero. <Link to="/" className="font-semibold text-unal-verde-oscuro underline">Explorar semilleros</Link></div>
          ) : (
            <ul className="space-y-3">
              {misPost.map((p) => {
                const s = semilleros.find((x) => x.id === p.semilleroId)
                return (
                  <li key={p.id} className="card flex flex-wrap items-center justify-between gap-3" data-testid="mi-postulacion">
                    <div>
                      <Link to={`/semilleros/${p.semilleroId}`} className="font-semibold hover:underline">{s?.nombre}</Link>
                      <p className="text-xs text-unal-gris-oscuro">{p.numero} · enviada el {fmtFechaHora(p.fechaEnvio)}</p>
                      {p.decisionAt && <p className="text-xs text-unal-gris-oscuro">Último cambio: {fmtFechaHora(p.decisionAt)}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <BadgeEstado e={p.estado} />
                      {p.estado === 'Enviada' && <button className="btn-outline" onClick={() => setRetirando(p.id)}>Retirar postulación</button>}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      {tab === 'autorizaciones' && (
        <section aria-labelledby="t-aut">
          <h2 id="t-aut" className="section-title mb-3">Autorizaciones<HU id="HU-33" /><HU id="HU-36" /></h2>
          {misAut.length === 0 ? (
            <div className="card text-sm">No has otorgado autorizaciones todavía.</div>
          ) : (
            <ul className="space-y-3">
              {misAut.map((a) => (
                <li key={a.id} className="card flex flex-wrap items-start justify-between gap-3" data-testid="autorizacion">
                  <div className="max-w-xl text-sm">
                    <p className="font-semibold">{FINALIDAD[a.finalidad]}</p>
                    <p className="mt-1 text-unal-gris-oscuro">Finalidad: {a.finalidad === 'postulacion' ? 'gestionar mis postulaciones' : 'enviarme avisos de convocatorias'}</p>
                    <p className="text-unal-gris-oscuro">Otorgada el {fmtFechaHora(a.fechaHora)} · aviso {a.version}</p>
                    {a.revocadaAt && <p className="font-semibold text-unal-rojo">Revocada el {fmtFechaHora(a.revocadaAt)}</p>}
                  </div>
                  {a.estado === 'Vigente' ? (
                    <button className="btn-outline" onClick={() => setRevocando(a)}>Revocar</button>
                  ) : (
                    <span className="text-xs font-bold uppercase text-unal-gris-oscuro">Revocada</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {eventos.length > 0 && (
            <div className="card mt-5">
              <h3 className="mb-2 text-lg font-semibold">Historial</h3>
              <ul className="space-y-2 text-sm">
                {eventos.map((e, i) => (
                  <li key={i} className="border-b pb-2 last:border-0"><span className="text-xs text-unal-gris-oscuro">{fmtFechaHora(e.fecha)}</span><br />{e.texto}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {tab === 'eliminar' && (
        <section className="card border-unal-rojo" aria-labelledby="t-del">
          <h2 id="t-del" className="section-title mb-2 text-unal-rojo">Zona de peligro<HU id="HU-35" /></h2>
          <p className="text-sm">Eliminar tu perfil borra tus datos personales de Atlas. Esta acción no se puede deshacer.</p>
          <button className="btn-danger mt-4" onClick={() => { setConfirmacion(''); setEliminando(true) }}>Eliminar mi perfil</button>
        </section>
      )}

      {retirando && (
        <Dialog
          titulo="Retirar postulación"
          onClose={() => setRetirando(null)}
          acciones={
            <>
              <button className="btn-outline" onClick={() => setRetirando(null)}>Cancelar</button>
              <button className="btn-danger" onClick={() => { retirarPostulacion(retirando); setRetirando(null) }}>Retirar postulación</button>
            </>
          }
        >
          <p>El director verá «Postulación retirada» y no podrá decidir sobre ella. Podrás volver a postularte mientras la convocatoria siga abierta.</p>
        </Dialog>
      )}

      {revocando && (
        <Dialog
          titulo="Revocar autorización"
          onClose={() => setRevocando(null)}
          acciones={
            <>
              <button className="btn-outline" onClick={() => setRevocando(null)}>Cancelar</button>
              <button className="btn-danger" onClick={() => { revocar(revocando.id); setRevocando(null) }}>Revocar autorización</button>
            </>
          }
        >
          <p className="font-semibold">{FINALIDAD[revocando.finalidad]}</p>
          <p className="mt-2">
            {revocando.finalidad === 'avisos'
              ? 'Dejarás de recibir esos correos.'
              : 'Tus postulaciones abiertas se retirarán y el director verá «Postulación retirada». Para volver a postularte tendrás que autorizar de nuevo.'}
          </p>
          <p className="mt-2 text-xs text-unal-gris-oscuro">La revocación quedará registrada con fecha y hora.</p>
        </Dialog>
      )}

      {eliminando && (
        <Dialog
          titulo="Eliminar mi perfil"
          onClose={() => setEliminando(false)}
          acciones={
            <>
              <button className="btn-outline" onClick={() => setEliminando(false)}>Cancelar</button>
              <button
                className="btn-danger"
                disabled={confirmacion !== 'ELIMINAR'}
                onClick={() => { setEliminando(false); navigate('/'); eliminarPerfil() }}
              >
                Eliminar definitivamente
              </button>
            </>
          }
        >
          <p className="font-semibold">Se borra:</p>
          <ul className="mb-3 list-disc pl-5"><li>Tu nombre, programa y semestre</li><li>Los mensajes de tus postulaciones</li><li>Tus postulaciones abiertas, que el director verá como «Postulación retirada»</li></ul>
          <p className="font-semibold">Queda como registro legal:</p>
          <ul className="mb-3 list-disc pl-5"><li>El registro de autorizaciones y revocaciones</li><li>La fecha y hora de la eliminación, sin datos de contacto</li></ul>
          <p className="text-xs">Tus datos se eliminarán en menos de 24 horas.</p>
          <label htmlFor="conf-del" className="label mt-3">Para confirmar, escribe ELIMINAR</label>
          <input id="conf-del" className="input" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} autoComplete="off" />
        </Dialog>
      )}
    </div>
  )
}
