import { useState } from 'react'
import { useStore } from '../store'
import { cuposDisponibles, fmtFecha, hoyISO } from '../lib/utils'
import { Alerta, Campo, Dialog, HU, PageTitle } from '../components/UI'
import { BadgeConvocatoria } from '../components/Semillero'
import NoPermiso from '../components/NoPermiso'
import type { Semillero } from '../types'

function Formulario({ s }: { s: Semillero }) {
  const { actualizarConvocatoria } = useStore()
  const [abierta, setAbierta] = useState(s.convocatoria.abierta)
  const [cierre, setCierre] = useState(s.convocatoria.cierre)
  const [cupos, setCupos] = useState(String(s.convocatoria.cupos))
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [cerrarAhora, setCerrarAhora] = useState(false)

  const llenos = s.convocatoria.aceptados >= s.convocatoria.cupos

  const guardar = (e: React.FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    const n = Number(cupos)
    if (!Number.isInteger(n) || n < 1) err.cupos = 'Ingresa un número de cupos mayor o igual a 1'
    if (abierta && cierre < hoyISO()) err.cierre = 'La fecha de cierre debe ser hoy o posterior'
    if (!cierre) err.cierre = 'Elige una fecha de cierre'
    setErrores(err)
    if (Object.keys(err).length) return
    actualizarConvocatoria(s.id, { abierta, cierre, cupos: n })
  }

  return (
    <>
      <form onSubmit={guardar} className="card space-y-5" aria-labelledby="cv">
        <h2 id="cv" className="section-title">Estado de la convocatoria<HU id="HU-32" /></h2>
        <div className="flex items-center justify-between gap-4 rounded border p-4">
          <div>
            <p className="font-semibold">Convocatoria {abierta ? 'abierta' : 'cerrada'}</p>
            <p className="text-sm text-unal-gris-oscuro">{abierta ? 'Los estudiantes pueden postularse.' : 'No recibes postulaciones.'}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={abierta}
            aria-label="Convocatoria abierta"
            onClick={() => setAbierta((v) => !v)}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${abierta ? 'bg-unal-verde-oscuro' : 'bg-unal-gris-claro'}`}
          >
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${abierta ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Fecha de cierre" error={errores.cierre} htmlFor="c-cierre">
            <input id="c-cierre" type="date" value={cierre} onChange={(e) => setCierre(e.target.value)} className="input" />
          </Campo>
          <Campo label="Cupos" error={errores.cupos} htmlFor="c-cupos">
            <input id="c-cupos" type="number" min={1} value={cupos} onChange={(e) => setCupos(e.target.value)} className="input" />
          </Campo>
        </div>
        {cierre && <p className="text-sm">La convocatoria se cierra sola el {fmtFecha(cierre)} a las 23:59.</p>}
        <div className="flex justify-end"><button type="submit" className="btn-primary">Guardar convocatoria</button></div>
      </form>

      {llenos && s.convocatoria.abierta && (
        <div className="mt-4">
          <Alerta>
            <p className="font-semibold">Cupos llenos: puedes cerrar la convocatoria antes</p>
            <button className="btn-danger mt-3" onClick={() => setCerrarAhora(true)}>Cerrar convocatoria ahora</button>
          </Alerta>
        </div>
      )}
      {cerrarAhora && (
        <Dialog
          titulo="Cerrar convocatoria"
          onClose={() => setCerrarAhora(false)}
          acciones={
            <>
              <button className="btn-outline" onClick={() => setCerrarAhora(false)}>Cancelar</button>
              <button className="btn-danger" onClick={() => { actualizarConvocatoria(s.id, { abierta: false }); setAbierta(false); setCerrarAhora(false) }}>Cerrar ahora</button>
            </>
          }
        >
          Los estudiantes dejarán de ver el botón «Quiero unirme» de inmediato.
        </Dialog>
      )}
    </>
  )
}

export default function DirectorConvocatoria() {
  const { semilleros, sesion } = useStore()
  const s = semilleros.find((x) => x.id === sesion?.semilleroId)
  if (!s) return <NoPermiso />
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageTitle hu={['HU-32']} sub={`Convocatoria de «${s.nombre}».`}>Convocatoria</PageTitle>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <BadgeConvocatoria s={s} />
        <span>Cupos disponibles: <strong>{cuposDisponibles(s)}</strong> de {s.convocatoria.cupos}</span>
      </div>
      <Formulario key={`${s.convocatoria.abierta}-${s.convocatoria.cierre}-${s.convocatoria.cupos}`} s={s} />
    </div>
  )
}
