import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useStore } from '../store'
import { AREAS } from '../types'
import { comparaAlfabetico, normalizar } from '../lib/utils'
import { PageTitle } from '../components/UI'
import { TarjetaSemillero } from '../components/Semillero'

const POR_PAGINA = 20

export default function Explorar() {
  const { semilleros, role, sesion } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const area = params.get('area') ?? ''
  const [texto, setTexto] = useState(q)
  // La página vive en la URL (?pagina=2) para poder volver a ella desde una ficha
  const pagina = Math.max(1, parseInt(params.get('pagina') ?? '1', 10) || 1)
  const setPagina = (n: number) => {
    const p = new URLSearchParams(params)
    n > 1 ? p.set('pagina', String(n)) : p.delete('pagina')
    setParams(p, { replace: true })
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const resultadosRef = useRef<HTMLHeadingElement>(null)

  // Los resultados quedan debajo de la caja de búsqueda y las áreas: tras buscar, filtrar o paginar se lleva la vista
  // hasta ellos y se mueve el foco al encabezado para que también lo anuncien los lectores de pantalla.
  const irAResultados = () => {
    const el = resultadosRef.current
    if (!el) return
    const sinMovimiento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView?.({ behavior: sinMovimiento ? 'auto' : 'smooth', block: 'start' })
    el.focus({ preventScroll: true })
  }
  const cambiarPagina = (n: number) => {
    setPagina(n)
    irAResultados()
  }

  useEffect(() => setTexto(q), [q])

  const actualizar = (nuevo: { q?: string; area?: string }) => {
    const p = new URLSearchParams(params)
    if (nuevo.q !== undefined) nuevo.q ? p.set('q', nuevo.q) : p.delete('q')
    if (nuevo.area !== undefined) nuevo.area ? p.set('area', nuevo.area) : p.delete('area')
    p.delete('pagina') // al cambiar la búsqueda o el filtro se vuelve a la primera página
    setParams(p, { replace: true })
  }

  const ordenados = useMemo(() => [...semilleros].sort((a, b) => comparaAlfabetico(a.nombre, b.nombre)), [semilleros])

  const filtrados = useMemo(() => {
    const nq = normalizar(q)
    return ordenados.filter((s) => {
      if (area && s.area !== area) return false
      if (!nq) return true
      // P08: el área temática también cuenta como texto de búsqueda («bioingeniería» encuentra los semilleros del área).
      return normalizar(`${s.nombre} ${s.descripcion} ${s.linea} ${s.area}`).includes(nq)
    })
  }, [ordenados, q, area])

  // P08: si no hay coincidencias exactas, sugerir semilleros afines por coincidencia parcial de cada palabra (primeras 5 letras).
  const sugeridos = useMemo(() => {
    if (filtrados.length > 0) return []
    const tokens = normalizar(q).split(/\s+/).filter((t) => t.length >= 4).map((t) => t.slice(0, 5))
    if (tokens.length === 0) return []
    return ordenados.filter((s) => tokens.some((t) => normalizar(`${s.nombre} ${s.area} ${s.linea}`).includes(t))).slice(0, 4)
  }, [filtrados.length, ordenados, q])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const pag = Math.min(pagina, totalPaginas)
  const desde = (pag - 1) * POR_PAGINA
  const visibles = filtrados.slice(desde, desde + POR_PAGINA)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageTitle
        hu={['HU-01', 'HU-02']}
        sub="Encuentra los semilleros de investigación de la Facultad de Ingeniería, revisa sus convocatorias y postúlate en línea. No necesitas iniciar sesión para explorar."
      >
        Explorar semilleros
      </PageTitle>

      {role === 'estudiante' && (
        <div className="mb-6 rounded border-l-4 border-unal-gris-oscuro bg-white p-4 text-sm">
          <p className="font-semibold">¿Eres director de un semillero?</p>
          <p className="mt-1">
            Tu correo ({sesion?.correo}) no coincide con ninguna ficha. Para asociarlo, escribe a la Vicedecanatura de Investigación y Extensión:{' '}
            <a className="font-semibold text-unal-verde-oscuro underline" href="mailto:vicedecanatura.demo@unal.edu.co?subject=Asociar%20mi%20correo%20a%20un%20semillero">
              vicedecanatura.demo@unal.edu.co
            </a>
          </p>
        </div>
      )}

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          actualizar({ q: texto.trim() })
          irAResultados()
        }}
        className="card"
      >
        <label htmlFor="buscador" className="label">
          Buscar por palabra clave
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-unal-gris-oscuro" />
            <input
              id="buscador"
              ref={inputRef}
              type="search"
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value)
                actualizar({ q: e.target.value })
              }}
              placeholder="Ej.: robótica, energía, datos…"
              className="input pl-10 pr-10 py-3 text-base"
            />
            {/* P01: botón para borrar la búsqueda anterior y empezar de nuevo */}
            {texto !== '' && (
              <button
                type="button"
                aria-label="Borrar búsqueda"
                onClick={() => {
                  setTexto('')
                  actualizar({ q: '' })
                  inputRef.current?.focus()
                }}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-unal-gris-oscuro hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button className="btn-primary px-6" type="submit">
            Buscar
          </button>
        </div>
        <p className="mt-5 mb-2 text-lg font-semibold">Áreas temáticas</p>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={area === a}
              onClick={() => {
                actualizar({ area: area === a ? '' : a })
                irAResultados()
              }}
              className={`rounded border px-3 py-1 text-sm ${area === a ? 'border-unal-verde-oscuro bg-unal-verde-oscuro text-white' : 'border-unal-gris-claro bg-white hover:bg-gray-50'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </form>

      {/* Orden de encabezados: h1 (título) → h2 (resultados) → h3 (cada tarjeta) */}
      <h2 ref={resultadosRef} tabIndex={-1} className="section-title mt-8 scroll-mt-40 outline-none">
        {q || area
          ? `${filtrados.length} ${filtrados.length === 1 ? 'resultado' : 'resultados'}${q ? ` para «${q}»` : ''}${area ? ` en ${area}` : ''}`
          : 'Todos los semilleros'}
      </h2>
      {/* P03: los filtros se combinan; esta fila lo hace visible y permite quitar cada uno por separado */}
      {(q || area) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm" aria-label="Filtros activos">
          <span className="font-semibold">Filtros activos:</span>
          {q && (
            <button type="button" onClick={() => { setTexto(''); actualizar({ q: '' }) }} aria-label={`Quitar palabra clave «${q}»`} className="inline-flex items-center gap-1 rounded border border-unal-verde-oscuro bg-white px-2 py-0.5">
              «{q}» <X size={14} aria-hidden />
            </button>
          )}
          {area && (
            <button type="button" onClick={() => actualizar({ area: '' })} aria-label={`Quitar área «${area}»`} className="inline-flex items-center gap-1 rounded border border-unal-verde-oscuro bg-white px-2 py-0.5">
              {area} <X size={14} aria-hidden />
            </button>
          )}
          {q && area && <span className="text-unal-gris-oscuro">(se aplican los dos a la vez)</span>}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-sm text-unal-gris-oscuro" aria-live="polite">
        <p data-testid="contador">
          {filtrados.length === 0
            ? '0 semilleros'
            : `Mostrando ${desde + 1}–${desde + visibles.length} de ${filtrados.length} semilleros`}
        </p>
        <p className="hidden sm:block">Orden alfabético</p>
      </div>

      {filtrados.length === 0 ? (
        <div className="card mt-3 text-center" role="status">
          <p className="text-lg font-semibold">
            No encontramos semilleros para «{q || area}»
          </p>
          {/* P08: sugerencias afines y áreas disponibles en lugar de una pantalla vacía */}
          {sugeridos.length > 0 && (
            <div className="mt-4 text-left">
              <p className="text-sm font-semibold">Quizás te interesen estos semilleros relacionados:</p>
              <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                {sugeridos.map((s) => (
                  <li key={s.id}><TarjetaSemillero s={s} q="" /></li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-sm">O explora por área temática:</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {AREAS.map((a) => (
              <button key={a} type="button" onClick={() => { setTexto(''); actualizar({ q: '', area: a }) }} className="rounded border border-unal-gris-claro bg-white px-3 py-1 text-sm hover:bg-gray-50">
                {a}
              </button>
            ))}
          </div>
          <button
            className="btn-primary mt-4"
            onClick={() => {
              setTexto('')
              setParams({}, { replace: true })
            }}
          >
            Ver todos los semilleros
          </button>
        </div>
      ) : (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((s) => (
            <li key={s.id}>
              <TarjetaSemillero s={s} q={q} />
            </li>
          ))}
        </ul>
      )}

      {totalPaginas > 1 && (
        <nav aria-label="Paginación" className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button className="btn-outline" disabled={pag === 1} onClick={() => cambiarPagina(pag - 1)}>
            Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              aria-current={n === pag ? 'page' : undefined}
              aria-label={`Página ${n}`}
              onClick={() => cambiarPagina(n)}
              className={`h-9 w-9 rounded border text-sm font-semibold ${n === pag ? 'border-unal-verde-oscuro bg-unal-verde-oscuro text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              {n}
            </button>
          ))}
          <button className="btn-outline" disabled={pag === totalPaginas} onClick={() => cambiarPagina(pag + 1)}>
            Siguiente
          </button>
        </nav>
      )}
    </div>
  )
}
