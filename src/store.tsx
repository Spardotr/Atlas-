import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  VERSION_AVISO,
  VICEDECANATURA_CORREO,
  type AccesoBitacora,
  type Autorizacion,
  type CorreoSimulado,
  type FinalidadAut,
  type Perfil,
  type Postulacion,
  type Role,
  type Semillero,
  type Sesion,
} from './types'
import { makePostulaciones, makeSemilleros } from './data/seed'
import { hoyISO, nombreDesdeCorreo, uid } from './lib/utils'

export interface DatosPostulacion {
  nombre: string
  programa: string
  semestre: string
  disponibilidad: string
  mensaje: string
}

export interface Toast {
  id: string
  texto: string
}

export interface Store {
  role: Role
  sesion: Sesion | null
  perfil: Perfil | null
  semilleros: Semillero[]
  postulaciones: Postulacion[]
  autorizaciones: Autorizacion[]
  correos: CorreoSimulado[]
  bitacora: AccesoBitacora[]
  toasts: Toast[]
  showHU: boolean
  setShowHU: (v: boolean) => void
  privacidadOk: boolean
  aceptarPrivacidad: () => void
  toast: (texto: string) => void
  loginAs: (correo: string) => { ok: boolean; error?: 'dominio' | 'vacio'; role?: Role }
  logout: () => void
  declararMayorEdad: () => void
  autorizar: (finalidad: FinalidadAut) => Autorizacion | null
  autorizacionVigente: (finalidad: FinalidadAut) => Autorizacion | undefined
  revocar: (autId: string) => void
  enviarPostulacion: (semilleroId: string, datos: DatosPostulacion) => Postulacion | null
  abrirPostulacion: (id: string) => void
  decidir: (id: string, estado: 'Aceptada' | 'Rechazada') => void
  retirarPostulacion: (id: string) => void
  actualizarSemillero: (id: string, patch: Partial<Semillero>) => void
  actualizarConvocatoria: (id: string, patch: Partial<Semillero['convocatoria']>) => void
  reclamarFicha: (id: string) => void
  actualizarPerfil: (patch: Partial<Pick<Perfil, 'nombre' | 'programa' | 'semestre'>>) => void
  eliminarPerfil: () => void
  resetear: () => void
}

const Ctx = createContext<Store | null>(null)

export function resolverSesion(correo: string, semilleros: Semillero[]): Sesion {
  const c = correo.trim().toLowerCase()
  const nombre = nombreDesdeCorreo(c)
  if (c === VICEDECANATURA_CORREO) return { correo: c, nombre, role: 'vicedecanatura' }
  const propio = semilleros.find((s) => s.director.correo.toLowerCase() === c)
  if (propio) return { correo: c, nombre: propio.director.nombre, role: 'director', semilleroId: propio.id }
  return { correo: c, nombre, role: 'estudiante' }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [semilleros, setSemilleros] = useState<Semillero[]>(() => makeSemilleros())
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>(() => makePostulaciones(makeSemilleros()))
  const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([])
  const [perfiles, setPerfiles] = useState<Record<string, Perfil>>({})
  const [correos, setCorreos] = useState<CorreoSimulado[]>([])
  const [bitacora, setBitacora] = useState<AccesoBitacora[]>([])
  const [sesion, setSesion] = useState<Sesion | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [showHU, setShowHU] = useState(false)
  const [privacidadOk, setPrivacidadOk] = useState(false)

  const toast = useCallback((texto: string) => {
    const id = uid('t')
    setToasts((t) => [...t, { id, texto }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500)
  }, [])

  const enviarCorreo = useCallback(
    (c: Omit<CorreoSimulado, 'id' | 'fechaHora'>) => {
      setCorreos((prev) => [{ ...c, id: uid('mail'), fechaHora: new Date().toISOString() }, ...prev])
      toast('Notificamos por correo a la persona destinataria')
    },
    [toast],
  )

  const perfil = sesion ? perfiles[sesion.correo] ?? null : null
  const role: Role = sesion?.role ?? 'visitante'

  const loginAs: Store['loginAs'] = useCallback(
    (correo) => {
      const c = correo.trim().toLowerCase()
      if (!c) return { ok: false, error: 'vacio' }
      if (!c.endsWith('@unal.edu.co')) return { ok: false, error: 'dominio' }
      const s = resolverSesion(c, semilleros)
      setSesion(s)
      toast(`Bienvenido/a, ${s.nombre}`)
      return { ok: true, role: s.role }
    },
    [semilleros, toast],
  )

  const logout = useCallback(() => {
    setSesion(null)
    setPrivacidadOk(false)
  }, [])

  const declararMayorEdad = useCallback(() => {
    if (!sesion) return
    setPerfiles((p) =>
      p[sesion.correo]
        ? p
        : {
            ...p,
            [sesion.correo]: {
              correo: sesion.correo,
              nombre: sesion.nombre,
              programa: '',
              semestre: '',
              mayorEdadAt: new Date().toISOString(),
            },
          },
    )
  }, [sesion])

  const autorizacionVigente = useCallback(
    (finalidad: FinalidadAut) =>
      sesion ? autorizaciones.find((a) => a.correo === sesion.correo && a.finalidad === finalidad && a.estado === 'Vigente') : undefined,
    [autorizaciones, sesion],
  )

  const autorizar = useCallback(
    (finalidad: FinalidadAut) => {
      if (!sesion) return null
      const existente = autorizaciones.find((a) => a.correo === sesion.correo && a.finalidad === finalidad && a.estado === 'Vigente')
      if (existente) return existente
      const nueva: Autorizacion = {
        id: uid('aut'),
        correo: sesion.correo,
        finalidad,
        version: VERSION_AVISO,
        fechaHora: new Date().toISOString(),
        estado: 'Vigente',
      }
      setAutorizaciones((prev) => [...prev, nueva])
      return nueva
    },
    [autorizaciones, sesion],
  )

  const revocar = useCallback(
    (autId: string) => {
      const aut = autorizaciones.find((a) => a.id === autId)
      if (!aut || aut.estado === 'Revocada') return
      const ahora = new Date().toISOString()
      setAutorizaciones((prev) => prev.map((a) => (a.id === autId ? { ...a, estado: 'Revocada', revocadaAt: ahora } : a)))
      if (aut.finalidad === 'postulacion') {
        setPostulaciones((prev) =>
          prev.map((p) => (p.correo === aut.correo && p.estado === 'Enviada' ? { ...p, estado: 'Retirada', decisionAt: ahora } : p)),
        )
        toast('Autorización revocada: tus postulaciones abiertas fueron retiradas')
      } else {
        toast('Autorización revocada: dejarás de recibir avisos por correo')
      }
    },
    [autorizaciones, toast],
  )

  const enviarPostulacion: Store['enviarPostulacion'] = useCallback(
    (semilleroId, datos) => {
      if (!sesion) return null
      const aut = autorizaciones.find((a) => a.correo === sesion.correo && a.finalidad === 'postulacion' && a.estado === 'Vigente')
      if (!aut) return null // TH-02: sin autorización no llega al director
      const sem = semilleros.find((s) => s.id === semilleroId)
      if (!sem) return null
      const n = postulaciones.length + 1
      const nueva: Postulacion = {
        id: uid('p'),
        numero: `ATL-2026-${String(n).padStart(4, '0')}`,
        semilleroId,
        correo: sesion.correo,
        ...datos,
        fechaEnvio: new Date().toISOString(),
        periodo: '2026-2',
        estado: 'Enviada',
        autorizacionId: aut.id,
        revisada: false,
      }
      setPostulaciones((prev) => [...prev, nueva])
      setPerfiles((p) =>
        p[sesion.correo]
          ? { ...p, [sesion.correo]: { ...p[sesion.correo], nombre: datos.nombre, programa: datos.programa, semestre: datos.semestre } }
          : p,
      )
      // HU-18: correo al director sin datos personales del estudiante
      enviarCorreo({
        para: sem.director.correo,
        asunto: `Nueva postulación recibida en ${sem.nombre}`,
        cuerpo: `Recibiste una nueva postulación en tu semillero. Revísala en Atlas para aceptarla o rechazarla.`,
        enlace: { texto: 'Revisar en Atlas', to: `/director/postulaciones/${nueva.id}` },
      })
      return nueva
    },
    [autorizaciones, enviarCorreo, postulaciones.length, semilleros, sesion],
  )

  const abrirPostulacion = useCallback(
    (id: string) => {
      if (!sesion) return
      setPostulaciones((prev) => prev.map((p) => (p.id === id ? { ...p, revisada: true } : p)))
      setBitacora((b) =>
        b.some((x) => x.postulacionId === id && x.quien === sesion.correo)
          ? b
          : [...b, { quien: sesion.correo, cuando: new Date().toISOString(), postulacionId: id }],
      )
    },
    [sesion],
  )

  const decidir: Store['decidir'] = useCallback(
    (id, estado) => {
      const p = postulaciones.find((x) => x.id === id)
      if (!p || p.estado !== 'Enviada') return
      const sem = semilleros.find((s) => s.id === p.semilleroId)
      // F-04: no se aceptan más postulaciones que cupos
      if (estado === 'Aceptada' && sem && sem.convocatoria.aceptados >= sem.convocatoria.cupos) {
        toast('No hay cupos disponibles: aumenta los cupos antes de aceptar')
        return
      }
      const ahora = new Date().toISOString()
      setPostulaciones((prev) => prev.map((x) => (x.id === id ? { ...x, estado, decisionAt: ahora, revisada: true } : x)))
      if (estado === 'Aceptada') {
        setSemilleros((prev) =>
          prev.map((s) => (s.id === p.semilleroId ? { ...s, convocatoria: { ...s.convocatoria, aceptados: s.convocatoria.aceptados + 1 } } : s)),
        )
      }
      enviarCorreo({
        para: p.correo,
        asunto: `Resultado de tu postulación a ${sem?.nombre ?? 'el semillero'}`,
        cuerpo:
          estado === 'Aceptada'
            ? `Tu postulación ${p.numero} a ${sem?.nombre} fue aceptada.`
            : `Tu postulación ${p.numero} a ${sem?.nombre} no fue aceptada.`,
        enlace: { texto: 'Ver en Atlas', to: '/mi-cuenta?tab=postulaciones' },
      })
    },
    [enviarCorreo, postulaciones, semilleros, toast],
  )

  const retirarPostulacion = useCallback(
    (id: string) => {
      if (!sesion) return
      const ahora = new Date().toISOString()
      setPostulaciones((prev) =>
        prev.map((p) => (p.id === id && p.correo === sesion.correo && p.estado === 'Enviada' ? { ...p, estado: 'Retirada', decisionAt: ahora } : p)),
      )
      toast('Postulación retirada')
    },
    [sesion, toast],
  )

  const actualizarSemillero = useCallback(
    (id: string, patch: Partial<Semillero>) => {
      setSemilleros((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch, actualizadoEn: hoyISO() } : s)))
      toast('Cambios publicados')
    },
    [toast],
  )

  const actualizarConvocatoria = useCallback(
    (id: string, patch: Partial<Semillero['convocatoria']>) => {
      setSemilleros((prev) => prev.map((s) => (s.id === id ? { ...s, convocatoria: { ...s.convocatoria, ...patch } } : s)))
      toast('Convocatoria actualizada')
    },
    [toast],
  )

  const reclamarFicha = useCallback(
    (id: string) => {
      setSemilleros((prev) => prev.map((s) => (s.id === id ? { ...s, estadoFicha: 'Verificada', actualizadoEn: hoyISO() } : s)))
      toast('Ficha verificada. ¡Gracias por confirmar la información!')
    },
    [toast],
  )

  const actualizarPerfil: Store['actualizarPerfil'] = useCallback(
    (patch) => {
      if (!sesion) return
      setPerfiles((p) => (p[sesion.correo] ? { ...p, [sesion.correo]: { ...p[sesion.correo], ...patch } } : p))
      setPostulaciones((prev) => prev.map((x) => (x.correo === sesion.correo && x.estado === 'Enviada' ? { ...x, ...patch } : x)))
      toast('Datos actualizados. Actualizamos tus postulaciones abiertas.')
    },
    [sesion, toast],
  )

  const eliminarPerfil = useCallback(() => {
    if (!sesion) return
    const correo = sesion.correo
    const ahora = new Date().toISOString()
    // Se borran datos personales y mensajes; las postulaciones abiertas quedan como "retiradas" sin datos.
    setPostulaciones((prev) =>
      prev.map((p) =>
        p.correo === correo
          ? {
              ...p,
              nombre: '',
              programa: '',
              semestre: '',
              disponibilidad: '',
              mensaje: '',
              estado: p.estado === 'Enviada' ? 'Retirada' : p.estado,
              decisionAt: p.estado === 'Enviada' ? ahora : p.decisionAt,
            }
          : p,
      ),
    )
    setPerfiles((p) => {
      const { [correo]: _quitado, ...resto } = p
      return resto
    })
    // El registro de autorizaciones y revocaciones se conserva como registro legal.
    setAutorizaciones((prev) =>
      prev.map((a) => (a.correo === correo && a.estado === 'Vigente' ? { ...a, estado: 'Revocada', revocadaAt: ahora } : a)),
    )
    setSesion(null)
    setPrivacidadOk(false)
    toast('Tus datos se eliminarán en menos de 24 horas')
  }, [sesion, toast])

  const resetear = useCallback(() => {
    const base = new Date()
    const sems = makeSemilleros(base)
    setSemilleros(sems)
    setPostulaciones(makePostulaciones(sems, base))
    setAutorizaciones([])
    setPerfiles({})
    setCorreos([])
    setBitacora([])
    setSesion(null)
    setPrivacidadOk(false)
    toast('Datos de demostración reiniciados')
  }, [toast])

  const value = useMemo<Store>(
    () => ({
      role,
      sesion,
      perfil,
      semilleros,
      postulaciones,
      autorizaciones,
      correos,
      bitacora,
      toasts,
      showHU,
      setShowHU,
      privacidadOk,
      aceptarPrivacidad: () => setPrivacidadOk(true),
      toast,
      loginAs,
      logout,
      declararMayorEdad,
      autorizar,
      autorizacionVigente,
      revocar,
      enviarPostulacion,
      abrirPostulacion,
      decidir,
      retirarPostulacion,
      actualizarSemillero,
      actualizarConvocatoria,
      reclamarFicha,
      actualizarPerfil,
      eliminarPerfil,
      resetear,
    }),
    [
      role, sesion, perfil, semilleros, postulaciones, autorizaciones, correos, bitacora, toasts, showHU, privacidadOk,
      toast, loginAs, logout, declararMayorEdad, autorizar, autorizacionVigente, revocar, enviarPostulacion,
      abrirPostulacion, decidir, retirarPostulacion, actualizarSemillero, actualizarConvocatoria, reclamarFicha, actualizarPerfil,
      eliminarPerfil, resetear,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore fuera de StoreProvider')
  return s
}
