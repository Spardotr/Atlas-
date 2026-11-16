export type Role = 'visitante' | 'estudiante' | 'director' | 'vicedecanatura'

export const AREAS = [
  'Inteligencia artificial',
  'Robótica y control',
  'Ingeniería de software',
  'Redes y telecomunicaciones',
  'Energía y sostenibilidad',
  'Bioingeniería',
  'Ciencia de datos',
  'Electrónica',
  'Materiales',
  'Estructuras y construcción',
] as const
export type Area = (typeof AREAS)[number]

export const PROGRAMAS = [
  'Ingeniería de Sistemas y Computación',
  'Ingeniería Eléctrica',
  'Ingeniería Electrónica',
  'Ingeniería Mecánica',
  'Ingeniería Mecatrónica',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Ingeniería Química',
  'Ingeniería Agrícola',
] as const

export const DISPONIBILIDADES = ['Menos de 5 h por semana', 'Entre 5 y 10 h por semana', 'Más de 10 h por semana'] as const

export interface Contacto {
  telefono?: string
  whatsapp?: string
  publicarTelefono: boolean
  publicarWhatsapp: boolean
}

export interface Convocatoria {
  abierta: boolean
  cierre: string // ISO yyyy-mm-dd; se cierra sola a las 23:59 de ese día
  cupos: number
  aceptados: number
}

export interface Semillero {
  id: string
  nombre: string
  descripcion: string
  linea: string
  area: Area
  director: { nombre: string; correo: string }
  requisitos: string
  convocatoria: Convocatoria
  estadoFicha: 'Verificada' | 'Precargada'
  actualizadoEn: string // ISO yyyy-mm-dd
  contacto?: Contacto
}

export interface Perfil {
  correo: string
  nombre: string
  programa: string
  semestre: string
  mayorEdadAt: string // ISO datetime
}

export type FinalidadAut = 'postulacion' | 'avisos'

export interface Autorizacion {
  id: string
  correo: string
  finalidad: FinalidadAut
  version: string
  fechaHora: string
  estado: 'Vigente' | 'Revocada'
  revocadaAt?: string
}

export type EstadoPostulacion = 'Enviada' | 'Aceptada' | 'Rechazada' | 'Retirada'

export interface Postulacion {
  id: string
  numero: string
  semilleroId: string
  correo: string
  nombre: string
  programa: string
  semestre: string
  disponibilidad: string
  mensaje: string
  fechaEnvio: string
  periodo: '2026-2' | '2026-1'
  estado: EstadoPostulacion
  decisionAt?: string
  autorizacionId: string | null
  revisada: boolean
}

export interface CorreoSimulado {
  id: string
  para: string
  asunto: string
  cuerpo: string
  enlace?: { texto: string; to: string }
  fechaHora: string
}

export interface Sesion {
  correo: string
  nombre: string
  role: Exclude<Role, 'visitante'>
  semilleroId?: string
}

export interface AccesoBitacora {
  quien: string
  cuando: string
  postulacionId: string
}

export const VICEDECANATURA_CORREO = 'vicedecanatura.demo@unal.edu.co'
export const VERSION_AVISO = 'v1.0'
export const PERIODO_ACTUAL = '2026-2'
export const PERIODO_ANTERIOR = '2026-1'
