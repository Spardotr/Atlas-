import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FlaskConical, Mail, RotateCcw, X } from 'lucide-react'
import { useStore } from '../store'
import { fmtFechaHora } from '../lib/utils'
import { VICEDECANATURA_CORREO } from '../types'

const CUENTAS = [
  { correo: 'estudiante.demo@unal.edu.co', etiqueta: 'Estudiante' },
  { correo: 'director.demo@unal.edu.co', etiqueta: 'Director (Robótica y Control Móvil)' },
  { correo: 'director2.demo@unal.edu.co', etiqueta: 'Director (Aprendizaje Automático)' },
  { correo: VICEDECANATURA_CORREO, etiqueta: 'Vicedecanatura' },
]

export default function DemoPanel() {
  const { sesion, loginAs, logout, correos, showHU, setShowHU, resetear, semilleros } = useStore()
  const [abierto, setAbierto] = useState(false)
  const [tab, setTab] = useState<'cuentas' | 'correos'>('cuentas')
  const navigate = useNavigate()

  const entrar = (correo: string) => {
    const r = loginAs(correo)
    if (r.ok) {
      navigate(r.role === 'director' ? '/director' : r.role === 'vicedecanatura' ? '/vicedecanatura/tablero' : '/')
    }
  }
  const precargadaAjena = semilleros.find((s) => s.estadoFicha === 'Precargada' && s.director.correo !== 'director.demo@unal.edu.co')

  return (
    <>
      <button
        onClick={() => setAbierto((v) => !v)}
        className="fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-full bg-unal-vino px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-[#611c27]"
        aria-expanded={abierto}
      >
        <FlaskConical size={14} /> Modo evaluación
        {correos.length > 0 && <span className="rounded-full bg-white px-1.5 text-unal-vino">{correos.length}</span>}
      </button>
      {abierto && (
        <div role="dialog" aria-label="Modo evaluación" className="fixed bottom-16 left-4 z-[60] max-h-[75vh] w-[22rem] max-w-[calc(100vw-2rem)] overflow-auto rounded bg-white p-4 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider">Modo evaluación</h2>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar"><X size={16} /></button>
          </div>
          <p className="mb-3 text-xs text-unal-gris-oscuro">Solo para evaluar el prototipo. No forma parte del producto.</p>
          <div className="mb-3 flex gap-1 border-b">
            {(['cuentas', 'correos'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${tab === t ? 'border-b-2 border-unal-verde-oscuro' : 'text-unal-gris-oscuro'}`}>
                {t === 'cuentas' ? 'Cuentas y opciones' : `Correos simulados (${correos.length})`}
              </button>
            ))}
          </div>

          {tab === 'cuentas' && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider">Cambiar de cuenta</p>
                <p className="mb-2 text-xs text-unal-gris-oscuro">Sesión actual: {sesion ? sesion.correo : 'visitante (sin sesión)'}</p>
                <ul className="space-y-1">
                  {CUENTAS.map((c) => (
                    <li key={c.correo}>
                      <button onClick={() => entrar(c.correo)} className="w-full rounded border px-3 py-2 text-left hover:bg-gray-50">
                        <span className="block font-semibold">{c.etiqueta}</span>
                        <span className="text-xs text-unal-gris-oscuro">{c.correo}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button onClick={() => { logout(); navigate('/') }} className="w-full rounded border px-3 py-2 text-left hover:bg-gray-50">
                      <span className="font-semibold">Visitante (cerrar sesión)</span>
                    </button>
                  </li>
                </ul>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={showHU} onChange={(e) => setShowHU(e.target.checked)} className="h-4 w-4 accent-unal-verde-oscuro" />
                Mostrar etiquetas de historias de usuario
              </label>
              <div className="flex flex-col gap-1 text-sm">
                <Link to="/evaluacion" onClick={() => setAbierto(false)} className="font-semibold text-unal-verde-oscuro underline">Ver mapa de historias de usuario</Link>
                {precargadaAjena && (
                  <Link to={`/semilleros/${precargadaAjena.id}`} onClick={() => setAbierto(false)} className="font-semibold text-unal-verde-oscuro underline">
                    Abrir una ficha precargada ajena (probar HU-29, correo no coincide)
                  </Link>
                )}
              </div>
              <button onClick={() => { resetear(); navigate('/') }} className="btn-outline w-full">
                <RotateCcw size={14} /> Reiniciar datos
              </button>
            </div>
          )}

          {tab === 'correos' && (
            <div className="text-sm">
              {correos.length === 0 && <p className="text-xs text-unal-gris-oscuro">Aún no hay correos. Se generan al enviar una postulación o tomar una decisión.</p>}
              <ul className="space-y-2">
                {correos.map((c) => (
                  <li key={c.id} className="rounded border p-3">
                    <p className="flex items-center gap-1 text-xs text-unal-gris-oscuro"><Mail size={12} /> Para: {c.para}</p>
                    <p className="mt-1 font-semibold">{c.asunto}</p>
                    <p className="mt-1 text-xs">{c.cuerpo}</p>
                    {c.enlace && (
                      <Link to={c.enlace.to} onClick={() => setAbierto(false)} className="mt-2 inline-block text-xs font-bold text-unal-verde-oscuro underline">
                        {c.enlace.texto}
                      </Link>
                    )}
                    <p className="mt-1 text-xs text-unal-gris-oscuro">{fmtFechaHora(c.fechaHora)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  )
}
