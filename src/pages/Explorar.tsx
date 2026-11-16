import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
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
  const [pagina, setPagina] = useState(1)

  useEffect(() => setTexto(q), [q])
  useEffect(() => setPagina(1), [q, area])

  const actualizar = (nuevo: { q?: string; area?: string }) => {
    const p = new URLSearchParams(params)
    if (nuevo.q !== undefined) nuevo.q ? p.set('q', nuevo.q) : p.delete('q')
    if (nuevo.area !== undefined) nuevo.area ? p.set('area', nuevo.area) : p.delete('area')
    setParams(p, { replace: true })
  }

  const ordenados = useMemo(() => [...semilleros].sort((a, b) => comparaAlfabetico(a.nombre, b.nombre)), [semilleros])

  const filtrados = useMemo(() => {
    const nq = normalizar(q)
    return ordenados.filter((s) => {
      if (area && s.area !== area) return false
      if (!nq) return true
      return normalizar(`${s.nombre} ${s.descripcion} ${s.linea}`).includes(nq)
    })
  }, [ordenados, q, area])

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
              type="search"
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value)
                actualizar({ q: e.target.value })
              }}
              placeholder="Ej.: robótica, energía, datos…"
              className="input pl-10 py-3 text-base"
            />
          </div>
          <button className="btn-primary px-6" type="submit">
            Buscar
          </button>
        </div>
        <p className="section-title mt-5 mb-2 text-xs">Áreas temáticas</p>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={area === a}
              onClick={() => actualizar({ area: area === a ? '' : a })}
              className={`rounded border px-3 py-1 text-sm ${area === a ? 'border-unal-verde-oscuro bg-unal-verde-oscuro text-white' : 'border-unal-gris-claro bg-white hover:bg-gray-50'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-unal-gris-oscuro" aria-live="polite">
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
          <button className="btn-outline" disabled={pag === 1} onClick={() => setPagina(pag - 1)}>
            Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              aria-current={n === pag ? 'page' : undefined}
              aria-label={`Página ${n}`}
              onClick={() => setPagina(n)}
              className={`h-9 w-9 rounded border text-sm font-semibold ${n === pag ? 'border-unal-verde-oscuro bg-unal-verde-oscuro text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              {n}
            </button>
          ))}
          <button className="btn-outline" disabled={pag === totalPaginas} onClick={() => setPagina(pag + 1)}>
            Siguiente
          </button>
        </nav>
      )}
    </div>
  )
}
