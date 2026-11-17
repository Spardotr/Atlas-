import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, FileClock } from 'lucide-react'
import type { Semillero } from '../types'
import { convocatoriaAbierta, fmtFecha } from '../lib/utils'
import { Badge } from './UI'

export function BadgeConvocatoria({ s }: { s: Semillero }) {
  return convocatoriaAbierta(s) ? <Badge tone="verde">Convocatoria abierta</Badge> : <Badge tone="gris">Convocatoria cerrada</Badge>
}

export function SelloFicha({ s }: { s: Semillero }) {
  return s.estadoFicha === 'Verificada' ? (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm">
      <Badge tone="verde" punto={false}>
        <CheckCircle2 size={14} aria-hidden /> Verificada
      </Badge>
      <span className="text-unal-gris-oscuro">Actualizada el {fmtFecha(s.actualizadoEn)}</span>
    </span>
  ) : (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm">
      <Badge tone="gris" punto={false} title="Información tomada de fuentes públicas de Hermes; aún no confirmada por el director">
        <FileClock size={14} aria-hidden /> Precargada
      </Badge>
      <span className="text-unal-gris-oscuro">Actualizada el {fmtFecha(s.actualizadoEn)}</span>
    </span>
  )
}

export function Resaltar({ texto, q }: { texto: string; q: string }) {
  const nq = q
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
  if (!nq) return <>{texto}</>
  const nt = texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
  const i = nt.indexOf(nq)
  if (i < 0 || nt.length !== texto.length) return <>{texto}</>
  return (
    <>
      {texto.slice(0, i)}
      <mark className="bg-unal-verde/40 px-0.5">{texto.slice(i, i + nq.length)}</mark>
      {texto.slice(i + nq.length)}
    </>
  )
}

export function TarjetaSemillero({ s, q = '' }: { s: Semillero; q?: string }) {
  const loc = useLocation()
  // Recuerda desde dónde se llegó (búsqueda, filtros y página) para poder volver ahí. Desde otra ficha se conserva el origen.
  const desdeFicha = loc.pathname.startsWith('/semilleros/')
  const desde = desdeFicha ? (loc.state as { desde?: string } | null)?.desde : loc.pathname + loc.search
  return (
    <Link
      to={`/semilleros/${s.id}`}
      state={desde ? { desde } : undefined}
      className="card block transition-shadow hover:border-unal-verde-oscuro hover:shadow-md focus-visible:ring-2"
      aria-label={`${s.nombre}, ${s.area}`}
    >
      <div className="flex items-start gap-3">
        {s.logo && <img src={s.logo} alt="" aria-hidden className="h-12 w-12 shrink-0 rounded border bg-white object-contain p-0.5" />}
        <h3 className="text-lg font-semibold leading-snug">
          <Resaltar texto={s.nombre} q={q} />
        </h3>
      </div>
      <p className="mt-1 text-sm text-unal-gris-oscuro">{s.area}</p>
      <div className="mt-3">
        <BadgeConvocatoria s={s} />
      </div>
    </Link>
  )
}
