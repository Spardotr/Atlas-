import { Link } from 'react-router-dom'
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
      <Badge tone="verde">
        <CheckCircle2 size={12} /> Verificada
      </Badge>
      <span className="text-unal-gris-oscuro">Actualizada el {fmtFecha(s.actualizadoEn)}</span>
    </span>
  ) : (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm">
      <Badge tone="gris" title="Información tomada de fuentes públicas de Hermes; aún no confirmada por el director">
        <FileClock size={12} /> Precargada
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
  return (
    <Link
      to={`/semilleros/${s.id}`}
      className="card block transition-shadow hover:border-unal-verde-oscuro hover:shadow-md focus-visible:ring-2"
      aria-label={`${s.nombre}, ${s.area}`}
    >
      <h3 className="text-base font-semibold leading-snug">
        <Resaltar texto={s.nombre} q={q} />
      </h3>
      <p className="mt-1 text-sm text-unal-gris-oscuro">{s.area}</p>
      <div className="mt-3">
        <BadgeConvocatoria s={s} />
      </div>
    </Link>
  )
}
