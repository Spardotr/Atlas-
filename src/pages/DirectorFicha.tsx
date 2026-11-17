import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../store'
import { fmtFecha, normalizarUrl, numeroWhatsApp, reducirImagen } from '../lib/utils'
import { Alerta, Campo, Dialog, HU, PageTitle } from '../components/UI'
import { BadgeConvocatoria, SelloFicha } from '../components/Semillero'
import NoPermiso from '../components/NoPermiso'
import { useCambiosSinGuardar } from '../components/CambiosSinGuardar'
import type { Semillero } from '../types'

const CORREO_VICE = 'vicedecanatura.demo@unal.edu.co'

function FormularioFicha({ s }: { s: Semillero }) {
  const { actualizarSemillero } = useStore()
  const [f, setF] = useState({
    descripcion: s.descripcion,
    linea: s.linea,
    requisitos: s.requisitos,
    directorNombre: s.director.nombre,
    telefono: s.contacto?.telefono ?? '',
    whatsapp: s.contacto?.whatsapp ?? '',
    publicarTelefono: s.contacto?.publicarTelefono ?? false,
    publicarWhatsapp: s.contacto?.publicarWhatsapp ?? false,
    sitioWeb: s.sitioWeb ?? '',
    logo: s.logo ?? '',
  })
  const [errores, setErrores] = useState<{ sitioWeb?: string; logo?: string; whatsapp?: string }>({})

  const elegirLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(archivo.type)) {
      setErrores((x) => ({ ...x, logo: 'El logo debe ser una imagen PNG, JPG o WebP' }))
      return
    }
    if (archivo.size > 2 * 1024 * 1024) {
      setErrores((x) => ({ ...x, logo: 'La imagen pesa más de 2 MB. Elige una más liviana' }))
      return
    }
    try {
      const logo = await reducirImagen(archivo)
      setF((x) => ({ ...x, logo }))
      setErrores((x) => ({ ...x, logo: undefined }))
    } catch {
      setErrores((x) => ({ ...x, logo: 'No pudimos leer la imagen. Prueba con otra' }))
    }
  }

  // P05: aviso explícito cuando se guarda un contacto que aún no se publica
  const [avisoContacto, setAvisoContacto] = useState('')

  // Control y libertad: avisar si se intenta salir con cambios sin guardar
  const [guardado, setGuardado] = useState(JSON.stringify(f))
  const { aviso } = useCambiosSinGuardar(JSON.stringify(f) !== guardado)

  const guardar = (e: React.FormEvent) => {
    e.preventDefault()
    const sitio = f.sitioWeb.trim() ? normalizarUrl(f.sitioWeb) : ''
    if (sitio === null) {
      setErrores((x) => ({ ...x, sitioWeb: 'Escribe una dirección válida, por ejemplo https://mi-semillero.unal.edu.co' }))
      return
    }
    if (f.whatsapp.trim() && !numeroWhatsApp(f.whatsapp)) {
      setErrores((x) => ({ ...x, whatsapp: 'Escribe un número de celular válido, por ejemplo 300 123 4567' }))
      return
    }
    setErrores((x) => ({ ...x, sitioWeb: undefined, whatsapp: undefined }))
    setF((x) => ({ ...x, sitioWeb: sitio }))
    setGuardado(JSON.stringify({ ...f, sitioWeb: sitio }))
    const hayContacto = f.telefono.trim() || f.whatsapp.trim()
    const sinPublicar = [f.telefono.trim() && !f.publicarTelefono ? 'teléfono' : '', f.whatsapp.trim() && !f.publicarWhatsapp ? 'WhatsApp' : ''].filter(Boolean)
    setAvisoContacto(
      sinPublicar.length
        ? `Cambios guardados. El ${sinPublicar.join(' y el ')} quedó registrado pero no se muestra en la ficha pública: marca «Autorizo publicar este dato» si quieres que aparezca.`
        : '',
    )
    actualizarSemillero(s.id, {
      descripcion: f.descripcion.trim(),
      linea: f.linea.trim(),
      requisitos: f.requisitos.trim(),
      sitioWeb: sitio || undefined,
      logo: f.logo || undefined,
      director: { ...s.director, nombre: f.directorNombre.trim() },
      contacto: hayContacto
        ? {
            telefono: f.telefono.trim() || undefined,
            whatsapp: f.whatsapp.trim() || undefined,
            publicarTelefono: !!f.telefono.trim() && f.publicarTelefono,
            publicarWhatsapp: !!f.whatsapp.trim() && f.publicarWhatsapp,
          }
        : undefined,
    })
  }

  return (
    <form onSubmit={guardar} className="card space-y-4" aria-labelledby="ed">
      <h2 id="ed" className="section-title">Editar ficha<HU id="HU-30" /></h2>
      <p className="text-sm text-unal-gris-oscuro">Los cambios se publican de inmediato. No requieren aprobación central.</p>
      <Campo label="Nombre del semillero" htmlFor="e-nombre"><input id="e-nombre" value={s.nombre} readOnly className="input bg-gray-100" /></Campo>
      <Campo label="Descripción" htmlFor="e-desc"><textarea id="e-desc" rows={4} className="input" value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} /></Campo>
      <Campo label="Línea de investigación" htmlFor="e-linea"><input id="e-linea" className="input" value={f.linea} onChange={(e) => setF({ ...f, linea: e.target.value })} /></Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Director" htmlFor="e-dir"><input id="e-dir" className="input" value={f.directorNombre} onChange={(e) => setF({ ...f, directorNombre: e.target.value })} /></Campo>
        <Campo label="Correo del director" htmlFor="e-cor" hint="No editable: identifica tu cuenta."><input id="e-cor" value={s.director.correo} readOnly className="input bg-gray-100" /></Campo>
      </div>
      <Campo label="Requisitos" htmlFor="e-req"><textarea id="e-req" rows={3} className="input" value={f.requisitos} onChange={(e) => setF({ ...f, requisitos: e.target.value })} /></Campo>
      <Campo label="Estado de convocatoria">
        <div className="flex items-center gap-3 text-sm"><BadgeConvocatoria s={s} /><Link to="/director/convocatoria" className="font-semibold text-unal-verde-oscuro underline">Administrar convocatoria</Link></div>
      </Campo>

      <fieldset className="rounded border p-4">
        <legend className="px-1 text-lg font-semibold">Identidad y página web (opcional)</legend>
        <div className="space-y-4">
          <Campo label="Página web del semillero" htmlFor="e-web" error={errores.sitioWeb} hint="Si el semillero tiene sitio propio, escribe su dirección. Ej.: https://mi-semillero.unal.edu.co">
            <input id="e-web" type="text" inputMode="url" autoComplete="url" className="input" value={f.sitioWeb} onChange={(e) => setF({ ...f, sitioWeb: e.target.value })} />
          </Campo>
          <Campo label="Logo del semillero" htmlFor="e-logo" error={errores.logo} hint="PNG, JPG o WebP de hasta 2 MB. Se ajusta automáticamente a un tamaño pequeño.">
            <div className="flex flex-wrap items-center gap-4">
              {f.logo ? (
                <img src={f.logo} alt={`Logo actual de ${s.nombre}`} className="h-20 w-20 rounded border bg-white object-contain p-1" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded border border-dashed text-center text-xs text-unal-gris-oscuro">Sin logo</div>
              )}
              <div className="flex flex-wrap gap-2">
                <input id="e-logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={elegirLogo} className="text-sm" />
                {f.logo && <button type="button" className="btn-outline" onClick={() => setF({ ...f, logo: '' })}>Quitar logo</button>}
              </div>
            </div>
          </Campo>
        </div>
      </fieldset>

      <fieldset className="rounded border p-4">
        <legend className="px-1 text-lg font-semibold">Contacto opcional</legend>
        <p className="mb-3 text-xs text-unal-gris-oscuro">Teléfono y WhatsApp solo se publican si lo autorizas expresamente para cada dato.</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="e-tel" className="label">Teléfono</label>
            <input id="e-tel" className="input" value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value, publicarTelefono: false })} />
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-unal-verde-oscuro" checked={f.publicarTelefono} disabled={!f.telefono.trim()} onChange={(e) => setF({ ...f, publicarTelefono: e.target.checked })} />
              Autorizo publicar este dato
            </label>
          </div>
          <div>
            <label htmlFor="e-wa" className="label">WhatsApp</label>
            <p className="mb-1 text-sm text-unal-gris-oscuro">Si lo publicas, en la ficha aparecerá un botón «Escribir por WhatsApp» que abre la conversación con este número.</p>
            <input id="e-wa" inputMode="tel" aria-invalid={errores.whatsapp ? true : undefined} aria-describedby={errores.whatsapp ? 'e-wa-error' : undefined} className="input" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value, publicarWhatsapp: false })} />
            {errores.whatsapp && <p id="e-wa-error" role="alert" className="mt-1 text-sm font-semibold text-unal-rojo">{errores.whatsapp}</p>}
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-unal-verde-oscuro" checked={f.publicarWhatsapp} disabled={!f.whatsapp.trim()} onChange={(e) => setF({ ...f, publicarWhatsapp: e.target.checked })} />
              Autorizo publicar este dato
            </label>
          </div>
        </div>
      </fieldset>
      {avisoContacto && <Alerta tono="info">{avisoContacto}</Alerta>}
      <div className="flex justify-end gap-2">
        <Link to={`/semilleros/${s.id}`} className="btn-outline">Cancelar</Link>
        <button type="submit" className="btn-primary">Guardar cambios</button>
      </div>
      {aviso}
    </form>
  )
}

export default function DirectorFicha() {
  const [params] = useSearchParams()
  const { semilleros, sesion, role, reclamarFicha } = useStore()
  const [reclamando, setReclamando] = useState(false)
  const [confirmo, setConfirmo] = useState(false)

  const id = params.get('semillero') ?? sesion?.semilleroId
  const s = semilleros.find((x) => x.id === id)
  if (!s || !sesion) return <NoPermiso mensaje="No encontramos este semillero" />

  const esPropio = role === 'director' && sesion.semilleroId === s.id

  if (!esPropio) {
    if (s.estadoFicha === 'Precargada' && role !== 'vicedecanatura') {
      return (
        <div className="mx-auto max-w-2xl px-4 py-10">
          <PageTitle hu={['HU-29']}>Verificar ficha</PageTitle>
          <Alerta tono="error">
            <p className="font-semibold">Tu correo no coincide con el del director de esta ficha.</p>
            <p className="mt-2 text-unal-texto">
              Solo el director registrado puede verificarla. Si crees que hay un error, pide la corrección a la Vicedecanatura de Investigación y Extensión indicando el semillero «{s.nombre}» y tu correo institucional ({sesion.correo}).
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a className="btn-primary" href={`mailto:${CORREO_VICE}?subject=${encodeURIComponent(`Corrección de ficha: ${s.nombre}`)}`}>Escribir a la Vicedecanatura</a>
              <Link to={`/semilleros/${s.id}`} className="btn-outline">Volver a la ficha</Link>
            </div>
          </Alerta>
        </div>
      )
    }
    return <NoPermiso mensaje="No tienes permiso para ver este semillero" />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageTitle hu={['HU-29', 'HU-30']} sub={`Ficha de «${s.nombre}».`}>Mi ficha</PageTitle>
      <div className="mb-5"><SelloFicha s={s} /></div>

      {s.estadoFicha === 'Precargada' && (
        <div className="mb-6">
          <Alerta>
            <p className="font-semibold">Esta ficha fue precargada desde Hermes. Revísala y verifícala para que aparezca como «Verificada» en el catálogo.</p>
            <button className="btn-primary mt-3" onClick={() => { setConfirmo(false); setReclamando(true) }}>Verificar mi ficha</button>
          </Alerta>
        </div>
      )}

      <FormularioFicha key={`${s.id}-${s.actualizadoEn}-${s.estadoFicha}`} s={s} />

      {reclamando && (
        <Dialog
          titulo="Verificar mi ficha"
          onClose={() => setReclamando(false)}
          acciones={
            <>
              <button className="btn-outline" onClick={() => setReclamando(false)}>Cancelar</button>
              <button className="btn-primary" disabled={!confirmo} onClick={() => { reclamarFicha(s.id); setReclamando(false) }}>Confirmar y verificar</button>
            </>
          }
        >
          <p className="mb-3">Revisa los 7 campos de tu ficha antes de confirmar:</p>
          <dl className="space-y-1 rounded bg-unal-fondo p-3 text-sm">
            {[
              ['Nombre', s.nombre], ['Descripción', s.descripcion], ['Línea', s.linea], ['Director', s.director.nombre],
              ['Correo del director', s.director.correo], ['Requisitos', s.requisitos], ['Estado de convocatoria', s.convocatoria.abierta ? `Abierta (cierra ${fmtFecha(s.convocatoria.cierre)})` : 'Cerrada'],
            ].map(([k, v]) => (
              <div key={k}><dt className="inline font-bold">{k}: </dt><dd className="inline">{v || <em>Sin información</em>}</dd></div>
            ))}
          </dl>
          <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm font-semibold">
            <input type="checkbox" className="mt-0.5 h-5 w-5 accent-unal-verde-oscuro" checked={confirmo} onChange={(e) => setConfirmo(e.target.checked)} />
            Confirmo que la información es correcta
          </label>
        </Dialog>
      )}
    </div>
  )
}
