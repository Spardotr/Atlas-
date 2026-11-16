import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck, UserCircle2 } from 'lucide-react'
import { useStore } from '../store'
import { VERSION_AVISO } from '../types'
import { Alerta, Dialog, PageTitle } from '../components/UI'

const CUENTAS = [
  { correo: 'estudiante.demo@unal.edu.co', nombre: 'Estudiante Demo' },
  { correo: 'director.demo@unal.edu.co', nombre: 'Director Demo (Robótica y Control Móvil)' },
  { correo: 'director2.demo@unal.edu.co', nombre: 'Director 2 Demo (Aprendizaje Automático)' },
  { correo: 'vicedecanatura.demo@unal.edu.co', nombre: 'Vicedecanatura Demo' },
  { correo: 'externo.demo@gmail.com', nombre: 'Cuenta externa (dominio no institucional)' },
]

function destinoSeguro(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/'
  return next
}

export default function Ingresar() {
  const [params] = useSearchParams()
  const next = destinoSeguro(params.get('next'))
  const navigate = useNavigate()
  const { privacidadOk, aceptarPrivacidad, loginAs, sesion } = useStore()
  const [selector, setSelector] = useState(false)
  const [otro, setOtro] = useState('')
  const [rechazo, setRechazo] = useState(false)
  const [errorOtro, setErrorOtro] = useState('')

  useEffect(() => {
    if (sesion) {
      const base = next === '/' || next.startsWith('/ingresar')
      navigate(
        base ? (sesion.role === 'director' ? '/director' : sesion.role === 'vicedecanatura' ? '/vicedecanatura/tablero' : '/') : next,
        { replace: true },
      )
    }
  }, [sesion, next, navigate])

  const elegir = (correo: string) => {
    const r = loginAs(correo)
    if (!r.ok && r.error === 'vacio') {
      setErrorOtro('Escribe tu correo institucional, por ejemplo nombre@unal.edu.co') // el diálogo sigue abierto
      return
    }
    setSelector(false)
    setErrorOtro('')
    setRechazo(!r.ok && r.error === 'dominio')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageTitle hu={['HU-08', 'HU-09']}>Iniciar sesión</PageTitle>

      <ol className="mb-6 flex gap-3 text-sm font-semibold" aria-label="Pasos">
        <li className={`rounded px-3 py-1 ${!privacidadOk ? 'bg-unal-verde-oscuro text-white' : 'bg-unal-gris-claro/50'}`}>1. Aviso de privacidad</li>
        <li className={`rounded px-3 py-1 ${privacidadOk ? 'bg-unal-verde-oscuro text-white' : 'bg-unal-gris-claro/50'}`}>2. Cuenta institucional</li>
      </ol>

      {!privacidadOk ? (
        <section className="card" aria-labelledby="aviso">
          <h2 id="aviso" className="section-title mb-3 flex items-center gap-2"><ShieldCheck size={18} /> Aviso de privacidad <span className="font-normal normal-case tracking-normal text-unal-gris-oscuro">({VERSION_AVISO})</span></h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Atlas es una herramienta de la Facultad de Ingeniería de la Universidad Nacional de Colombia para conectar estudiantes con semilleros de investigación. El responsable del tratamiento de tus datos personales es la Universidad Nacional de Colombia.
            </p>
            <p>
              <strong>Finalidad:</strong> usaremos tu correo institucional para identificarte y, solo si te postulas y lo autorizas, los datos de tu postulación para que el director del semillero pueda revisarla. No vendemos ni compartimos tus datos con terceros.
            </p>
            <p>
              <strong>Tus derechos</strong> (Ley 1581 de 2012): conocer, actualizar, rectificar y suprimir tus datos y revocar tus autorizaciones en cualquier momento desde «Mis datos y privacidad».
            </p>
            <p>Atlas no almacena contraseñas: el acceso se hace con tu cuenta institucional @unal.edu.co.</p>
          </div>
          <button onClick={aceptarPrivacidad} className="btn-primary mt-5">Entiendo, continuar</button>
        </section>
      ) : (
        <section className="card" aria-labelledby="cuenta">
          <h2 id="cuenta" className="section-title mb-3">Cuenta institucional</h2>
          <p className="mb-4 text-sm">Usa tu correo <strong>@unal.edu.co</strong> para continuar. Atlas no almacena contraseñas.</p>
          {rechazo && (
            <div className="mb-4">
              <Alerta tono="error">
                <p className="font-semibold">Solo puedes entrar con tu correo @unal.edu.co</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-outline" onClick={() => { setRechazo(false); setSelector(true) }}>Intentar con otra cuenta</button>
                  <Link to="/" className="btn-outline">Volver al catálogo</Link>
                </div>
              </Alerta>
            </div>
          )}
          <button onClick={() => { setSelector(true); setErrorOtro('') }} className="btn-outline w-full justify-center py-3 text-base">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#4285F4" d="M45 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.3 6.5v5.4h7c4.1-3.8 6.5-9.4 6.5-15.9z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7-5.4c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.2H4.3v5.6C7.9 41.1 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.6 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.6H4.3C2.8 17.2 2 20.5 2 24s.8 6.8 2.3 9.8l7.3-5.6z"/><path fill="#EA4335" d="M24 10.6c3.3 0 6.2 1.1 8.5 3.3l6.4-6.4C34.9 4.1 29.9 2 24 2 15.4 2 7.9 6.9 4.3 14.2l7.3 5.6C13.3 14.5 18.2 10.6 24 10.6z"/></svg>
            Iniciar sesión con Google (@unal.edu.co)
          </button>
        </section>
      )}

      {selector && (
        <Dialog titulo="Elige una cuenta" onClose={() => setSelector(false)} acciones={<button className="btn-outline" onClick={() => setSelector(false)}>Cancelar</button>}>
          <p className="mb-3 text-xs text-unal-gris-oscuro">Cuentas de demostración. Atlas no almacena contraseñas.</p>
          <ul className="divide-y rounded border">
            {CUENTAS.map((c) => (
              <li key={c.correo}>
                <button onClick={() => elegir(c.correo)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-50">
                  <UserCircle2 size={28} className="text-unal-gris-oscuro" />
                  <span>
                    <span className="block text-sm font-semibold">{c.nombre}</span>
                    <span className="text-xs text-unal-gris-oscuro">{c.correo}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault()
              elegir(otro)
            }}
          >
            <label htmlFor="otro-correo" className="label">Usar otra cuenta</label>
            <div className="flex gap-2">
              <input id="otro-correo" type="email" value={otro} onChange={(e) => setOtro(e.target.value)} placeholder="nombre@unal.edu.co" className="input" />
              <button type="submit" className="btn-primary">Continuar</button>
            </div>
            {errorOtro && <p role="alert" className="mt-1 text-xs font-semibold text-unal-rojo">{errorOtro}</p>}
          </form>
        </Dialog>
      )}
    </div>
  )
}
