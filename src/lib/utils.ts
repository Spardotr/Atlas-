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

/** Normaliza una URL escrita por el usuario. Devuelve null si no es válida. Solo admite http/https. */
export function normalizarUrl(texto: string): string | null {
  const t = texto.trim()
  if (!t) return null
  const conEsquema = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`
  try {
    const u = new URL(conEsquema)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    if (!u.hostname.includes('.')) return null
    return u.toString()
  } catch {
    return null
  }
}

/** Lee una imagen y la reduce a un máximo de `max` px por lado (PNG con transparencia). Devuelve un data URL. */
export function reducirImagen(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * k))
      canvas.height = Math.max(1, Math.round(img.height * k))
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('canvas'))
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('imagen'))
    }
    img.src = url
  })
}

/**
 * Convierte un número de WhatsApp escrito por el usuario en el formato que pide wa.me (solo dígitos, con indicativo).
 * Un celular colombiano de 10 dígitos recibe el indicativo 57. Devuelve null si no parece un número válido.
 */
export function numeroWhatsApp(texto: string): string | null {
  let d = texto.replace(/[^\d+]/g, '')
  const conMas = d.startsWith('+')
  d = d.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  else if (!conMas && d.length === 10) d = `57${d}`
  return d.length >= 11 && d.length <= 15 ? d : null
}

export function enlaceWhatsApp(texto: string, mensaje: string): string | null {
  const n = numeroWhatsApp(texto)
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(mensaje)}` : null
}
