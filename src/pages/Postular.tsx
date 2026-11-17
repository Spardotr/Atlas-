import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import clsx from 'clsx'
import { useStore } from '../store'
import { DISPONIBILIDADES, PROGRAMAS, VERSION_AVISO } from '../types'
import { convocatoriaAbierta, fmtFechaHora } from '../lib/utils'
import { Alerta, Campo, HU, PageTitle } from '../components/UI'
import NoPermiso from '../components/NoPermiso'
import { useCambiosSinGuardar } from '../components/CambiosSinGuardar'

const MAX_MENSAJE = 500

/** M5 (WCAG 2.4.3): al pasar a un paso nuevo, el foco va a su título para que el teclado y el lector de pantalla sigan el flujo. */
function TituloPaso({ id, enfocar, className, children }: { id: string; enfocar: boolean; className: string; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (enfocar) ref.current?.focus()
  }, [enfocar])
  return (
    <h2 id={id} ref={ref} tabIndex={-1} className={className}>
      {children}
    </h2>
  )
}

function Pasos({ actual }: { actual: 1 | 2 | 3 }) {
  const items = ['Mayoría de edad', 'Autorización de datos', 'Formulario']
  return (
    <ol className="mb-6 flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold" aria-label="Progreso de la postulación">
      {items.map((t, i) => {
        const n = (i + 1) as 1 | 2 | 3
        const hecho = n < actual
        return (
          <li
            key={t}
            aria-current={n === actual ? 'step' : undefined}
            className={clsx('flex items-center gap-2 border-b-4 pb-1', n === actual ? 'border-unal-verde-oscuro text-unal-verde-oscuro' : hecho ? 'border-unal-verde text-unal-texto' : 'border-transparent text-unal-gris-oscuro')}
          >
            {hecho ? <Check size={14} /> : <span>{n}.</span>} {t}
          </li>
        )
      })}
    </ol>
  )
}

export default function Postular() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { semilleros, perfil, sesion, declararMayorEdad, autorizar, autorizacionVigente, enviarPostulacion, postulaciones } = useStore()
  const s = semilleros.find((x) => x.id === id)

  const [mayor, setMayor] = useState(false)
  const [autDatos, setAutDatos] = useState(false)
  const [autAvisos, setAutAvisos] = useState(false)
  const [form, setForm] = useState({
    nombre: perfil?.nombre ?? sesion?.nombre ?? '',
    programa: perfil?.programa ?? '',
    semestre: perfil?.semestre ?? '',
    disponibilidad: '',
    mensaje: '',
  })
  const [errores, setErrores] = useState<Record<string, string>>({})

  // Control y libertad: avisar si se intenta salir con el formulario modificado y sin enviar
  const [inicial] = useState(JSON.stringify(form))
  const { aviso, permitirSalida } = useCambiosSinGuardar(JSON.stringify(form) !== inicial)
  // Paso con el que se abrió la página: ese no recibe el foco; los siguientes sí.
  const pasoInicial = useRef<number | null>(null)

  if (!s) return <NoPermiso mensaje="No encontramos este semillero" />
  if (!convocatoriaAbierta(s)) return <Navigate to={`/semilleros/${s.id}`} state={{ aviso: 'cerrada' }} replace />

  const autVigente = autorizacionVigente('postulacion')
  const paso: 1 | 2 | 3 = !perfil ? 1 : !autVigente ? 2 : 3
  if (pasoInicial.current === null) pasoInicial.current = paso
  const enfocarPaso = paso !== pasoInicial.current
  const previa = postulaciones.find((p) => p.correo === sesion?.correo && p.semilleroId === s.id && (p.estado === 'Enviada' || p.estado === 'Aceptada'))

  const validar = () => {
    const e: Record<string, string> = {}
    if (!form.nombre.trim()) e.nombre = 'Escribe tu nombre completo'
    if (!form.programa) e.programa = 'Selecciona tu programa curricular'
    if (!form.semestre) e.semestre = 'Selecciona tu semestre'
    if (!form.disponibilidad) e.disponibilidad = 'Selecciona tu disponibilidad semanal'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validar()) return
    const p = enviarPostulacion(s.id, form)
    if (p) {
      permitirSalida()
      navigate(`/postulacion/${p.numero}`)
    }
  }

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const inputCls = (k: string) => clsx('input', errores[k] && 'border-unal-rojo ring-1 ring-unal-rojo')

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-unal-gris-oscuro">
        <Link to="/" className="hover:underline">Explorar</Link> › <Link to={`/semilleros/${s.id}`} className="hover:underline">{s.nombre}</Link> › <span className="font-semibold text-unal-texto">Postulación</span>
      </nav>
      <PageTitle sub={`Postulación al semillero «${s.nombre}».`}>Quiero unirme</PageTitle>

      {previa ? (
        <Alerta>
          Ya tienes una postulación {previa.estado === 'Aceptada' ? 'aceptada' : 'enviada'} a este semillero ({previa.numero}).{' '}
          <Link to="/mi-cuenta?tab=postulaciones" className="font-semibold text-unal-verde-oscuro underline">Ver mis postulaciones</Link>
        </Alerta>
      ) : (
        <>
          <Pasos actual={paso} />

          {perfil && (
            <p className="mb-4 text-xs text-unal-gris-oscuro">Declaración de mayoría de edad registrada el {fmtFechaHora(perfil.mayorEdadAt)}.</p>
          )}

          {paso === 1 && (
            <section className="card" aria-labelledby="p1">
              <TituloPaso id="p1" enfocar={enfocarPaso} className="section-title mb-3">Mayoría de edad<HU id="HU-15" /></TituloPaso>
              <p className="mb-4 text-sm">La universidad necesita esta declaración para tratar tus datos conforme a la ley.</p>
              <label className="flex cursor-pointer items-start gap-3 text-sm font-semibold">
                <input type="checkbox" checked={mayor} onChange={(e) => setMayor(e.target.checked)} className="mt-0.5 h-5 w-5 accent-unal-verde-oscuro" />
                Declaro que soy mayor de edad
              </label>
              {!mayor && (
                <p className="mt-4 text-sm text-unal-gris-oscuro" role="note">
                  Sin esta declaración no puedes crear tu perfil ni postularte. Puedes seguir explorando.{' '}
                  <Link to="/" className="font-semibold text-unal-verde-oscuro underline">Volver al catálogo</Link>
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/semilleros/${s.id}`} className="btn-outline">Cancelar</Link>
                <button className="btn-primary" disabled={!mayor} onClick={declararMayorEdad}>Continuar</button>
              </div>
            </section>
          )}

          {paso === 2 && (
            <section className="card" aria-labelledby="p2">
              <TituloPaso id="p2" enfocar={enfocarPaso} className="section-title mb-3">Autorización de tratamiento de datos<HU id="HU-16" /></TituloPaso>
              <p className="mb-1 text-xs text-unal-gris-oscuro">Versión del aviso: {VERSION_AVISO}</p>
              <label className="mt-2 flex cursor-pointer items-start gap-3 text-sm">
                <input type="checkbox" checked={autDatos} onChange={(e) => setAutDatos(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-unal-verde-oscuro" />
                <span>
                  <strong>Autorizo tratar mis datos personales únicamente para gestionar mi postulación a este semillero.</strong>
                  <span className="mt-1 block text-unal-gris-oscuro">Puedes revocar esta autorización en cualquier momento desde «Mis datos y privacidad».</span>
                </span>
              </label>
              <label className="mt-4 flex cursor-pointer items-start gap-3 border-t pt-4 text-sm">
                <input type="checkbox" checked={autAvisos} onChange={(e) => setAutAvisos(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-unal-verde-oscuro" />
                <span>
                  <strong>Opcional:</strong> quiero recibir avisos por correo sobre convocatorias.
                  <span className="mt-1 block text-unal-gris-oscuro">Es una autorización independiente; no es necesaria para postularte.</span>
                </span>
              </label>
              {!autDatos && <p className="mt-4 text-sm text-unal-gris-oscuro" role="note">Sin esta autorización no verás el formulario ni se guardará ningún dato.</p>}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/semilleros/${s.id}`} className="btn-outline">Cancelar</Link>
                <button
                  className="btn-primary"
                  disabled={!autDatos}
                  onClick={() => {
                    autorizar('postulacion')
                    if (autAvisos) autorizar('avisos')
                  }}
                >
                  Continuar
                </button>
              </div>
            </section>
          )}

          {paso === 3 && (
            <form onSubmit={enviar} noValidate className="card space-y-4" aria-labelledby="p3">
              <TituloPaso id="p3" enfocar={enfocarPaso} className="section-title">Formulario de postulación<HU id="HU-17" /></TituloPaso>
              <Campo label="Nombre completo *" error={errores.nombre} htmlFor="f-nombre">
                <input id="f-nombre" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} className={inputCls('nombre')} />
              </Campo>
              <Campo label="Correo institucional *" htmlFor="f-correo">
                <input id="f-correo" value={sesion?.correo ?? ''} readOnly className="input bg-gray-100" />
              </Campo>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Programa curricular *" error={errores.programa} htmlFor="f-prog">
                  <select id="f-prog" value={form.programa} onChange={(e) => set('programa', e.target.value)} className={inputCls('programa')}>
                    <option value="">Selecciona…</option>
                    {PROGRAMAS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Campo>
                <Campo label="Semestre *" error={errores.semestre} htmlFor="f-sem">
                  <select id="f-sem" value={form.semestre} onChange={(e) => set('semestre', e.target.value)} className={inputCls('semestre')}>
                    <option value="">Selecciona…</option>
                    {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((n) => <option key={n}>{n}</option>)}
                    <option>10 o más</option>
                  </select>
                </Campo>
              </div>
              <Campo label="Disponibilidad semanal *" error={errores.disponibilidad} htmlFor="f-disp">
                <select id="f-disp" value={form.disponibilidad} onChange={(e) => set('disponibilidad', e.target.value)} className={inputCls('disponibilidad')}>
                  <option value="">Selecciona…</option>
                  {DISPONIBILIDADES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Campo>
              <Campo label="Mensaje al director (opcional)" htmlFor="f-msg">
                <textarea
                  id="f-msg"
                  rows={5}
                  maxLength={MAX_MENSAJE}
                  value={form.mensaje}
                  onChange={(e) => set('mensaje', e.target.value.slice(0, MAX_MENSAJE))}
                  className="input"
                  aria-describedby="msg-ayuda"
                />
                <div id="msg-ayuda" className="mt-1 flex flex-wrap justify-between gap-2 text-xs">
                  <span className="text-unal-gris-oscuro">No incluyas datos sensibles (salud, religión, origen étnico, orientación sexual, situación económica).</span>
                  <span data-testid="contador-mensaje" className="font-semibold">{form.mensaje.length}/{MAX_MENSAJE}</span>
                </div>
              </Campo>
              {Object.keys(errores).length > 0 && <Alerta tono="error">Revisa los campos señalados antes de enviar.</Alerta>}
              <div className="flex justify-end gap-2">
                <Link to={`/semilleros/${s.id}`} className="btn-outline">Cancelar</Link>
                <button type="submit" className="btn-primary">Enviar postulación</button>
              </div>
              {aviso}
            </form>
          )}
        </>
      )}
    </div>
  )
}
