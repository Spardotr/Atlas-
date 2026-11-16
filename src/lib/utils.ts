import type { Semillero } from '../types'

export function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function hoyISO(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDias(base: Date, dias: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + dias)
  return hoyISO(d)
}

export function fmtFecha(iso: string): string {
  const [datePart] = iso.split('T')
  const [y, m, d] = datePart.split('-')
  return `${d}/${m}/${y}`
}

export function fmtHora(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function fmtFechaHora(iso: string): string {
  return `${fmtFecha(iso.slice(0, 10))} a las ${fmtHora(iso)}`
}

export function diasDesde(iso: string, hoy: Date = new Date()): number {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  const a = new Date(y, m - 1, d).getTime()
  return Math.floor((hoy.getTime() - a) / 86400000)
}

/** Convocatoria efectivamente abierta: bandera + fecha de cierre (23:59) + cupos disponibles. */
export function convocatoriaAbierta(s: Semillero, hoy: Date = new Date()): boolean {
  const c = s.convocatoria
  return c.abierta && hoyISO(hoy) <= c.cierre && c.aceptados < c.cupos
}

export function cuposDisponibles(s: Semillero): number {
  return Math.max(0, s.convocatoria.cupos - s.convocatoria.aceptados)
}

export function nombreDesdeCorreo(correo: string): string {
  const local = correo.split('@')[0]
  return local
    .split(/[._]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

export function comparaAlfabetico(a: string, b: string): number {
  return a.localeCompare(b, 'es', { sensitivity: 'base' })
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
