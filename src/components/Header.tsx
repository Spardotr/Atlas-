import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Facebook, Instagram, LogOut, MapPin, Menu, Search, ShieldCheck, X, Youtube } from 'lucide-react'
import clsx from 'clsx'
import { useStore } from '../store'

const ENLACES_SUPERIORES = ['Aspirantes', 'Estudiantes', 'Egresados', 'Docentes', 'Administrativos']
const SITIO_UNAL = 'https://unal.edu.co'

/** Redes oficiales: círculos grises como en unal.edu.co (enlazan a la portada de la Universidad). */
function Redes() {
  const items = [
    { n: 'Facebook', I: Facebook },
    { n: 'X (Twitter)', I: XIcon },
    { n: 'YouTube', I: Youtube },
    { n: 'Instagram', I: Instagram },
  ]
  return (
    <ul className="ml-3 flex items-center gap-1.5" aria-label="Redes sociales">
      {items.map(({ n, I }) => (
        <li key={n}>
          <a href={SITIO_UNAL} target="_blank" rel="noopener noreferrer" aria-label={`${n} de la Universidad Nacional (abre unal.edu.co)`} className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9a9a9a] text-[#5c5c5c] hover:bg-white">
            <I size={11} strokeWidth={2.4} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
function XIcon({ size = 12 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.2 2h3.3l-7.2 8.3L22.8 22h-6.7l-5.2-6.8L4.900 22H1.600l7.700-8.800L1.200 2H8l4.700 6.200L18.200 2zm-1.200 18h1.800L7.100 3.900H5.200L17 20z" />
    </svg>
  )
}

/** Escudo oficial + nombre de la Universidad, igual al bloque del encabezado de unal.edu.co. */
function Marca({ compacto = false }: { compacto?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img src="/img/escudo-blanco.png" alt="" aria-hidden className={compacto ? 'h-12 w-auto' : 'h-[76px] w-auto'} />
      <span className="flex flex-col leading-none text-white" aria-hidden>
        <span className={compacto ? 'text-[9px] tracking-[0.2em]' : 'text-[11px] tracking-[0.22em]'}>UNIVERSIDAD</span>
        <span className={compacto ? 'my-0.5 text-lg font-semibold tracking-[0.06em]' : 'my-1 text-[26px] font-semibold tracking-[0.06em]'}>NACIONAL</span>
        <span className={compacto ? 'text-[9px] tracking-[0.2em]' : 'text-[11px] tracking-[0.22em]'}>DE COLOMBIA</span>
      </span>
    </span>
  )
}

export default function Header() {
  const { role, sesion, logout } = useStore()
  const navigate = useNavigate()
  const loc = useLocation()
  const [q, setQ] = useState('')
  const [menuUsuario, setMenuUsuario] = useState(false)
  const [menuMovil, setMenuMovil] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // El menú de usuario se cierra con Escape o al hacer clic fuera.
  useEffect(() => {
    if (!menuUsuario) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuUsuario(false)
    const onClick = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenuUsuario(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [menuUsuario])

  const nav: { to: string; label: string; end?: boolean }[] =
    role === 'director'
      ? [
          { to: '/', label: 'Explorar', end: true },
          { to: '/director', label: 'Mi semillero', end: true },
          { to: '/director/postulaciones', label: 'Postulaciones' },
          { to: '/director/convocatoria', label: 'Convocatoria' },
        ]
      : role === 'vicedecanatura'
        ? [
            { to: '/vicedecanatura/tablero', label: 'Tablero' },
            { to: '/', label: 'Explorar', end: true },
          ]
        : [
            { to: '/', label: 'Explorar', end: true },
            { to: '/como-funciona', label: 'Cómo funciona' },
          ]

  const buscar = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : '/')
    setMenuMovil(false)
  }

  const iniciales = (sesion?.nombre ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  const rolEtiqueta = role === 'director' ? 'Director' : role === 'vicedecanatura' ? 'Vicedecanatura' : 'Estudiante'

  return (
    <header className="sticky top-0 z-50" aria-label="Encabezado institucional">
      {/* Barra superior */}
      <div className="hidden h-8 border-b border-black/10 bg-[#6b6b6b] text-xs text-white md:block">
        <div className="flex h-full items-center justify-end pr-4">
          <ul className="flex h-full items-stretch">
            {ENLACES_SUPERIORES.map((t) => (
              <li key={t} className="flex items-center border-l border-white/30 first:border-l-0">
                <a href={SITIO_UNAL} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 font-semibold hover:underline">
                  {t}
                  <span className="sr-only"> (abre unal.edu.co en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
          <Redes />
          <span className="ml-3 inline-flex items-center gap-1 border-l border-white/30 pl-4 font-semibold" aria-label="Idioma: español">
            ESP <ChevronDown size={12} aria-hidden />
          </span>
        </div>
      </div>

      {/* Barra principal */}
      <div className="relative bg-unal-header text-white">
        <Link
          to="/"
          aria-label="Universidad Nacional de Colombia — Atlas, ir al inicio"
          className="absolute left-0 top-0 z-10 hidden h-[116px] w-[236px] items-center justify-center bg-unal-header-oscuro shadow-[2px_2px_6px_rgba(0,0,0,0.25)] md:flex md:-translate-y-8"
        >
          <Marca />
        </Link>

        <div className="flex min-h-[84px] items-center gap-3 px-3 py-2 md:pl-[260px] md:pr-4">
          <Link to="/" className="shrink-0 md:hidden" aria-label="Universidad Nacional de Colombia — Atlas, ir al inicio">
            <Marca compacto />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="hidden items-center gap-2 md:flex">
              <MapPin size={16} className="text-unal-gris-claro" aria-hidden />
              <Link to="/" className="text-xl font-semibold tracking-wide">
                Atlas · Semilleros de Ingeniería
              </Link>
            </div>
            <div className="truncate text-sm font-semibold md:hidden">Atlas · Semilleros</div>
            <nav aria-label="Principal" className="mt-2 hidden md:block">
              <ul className="flex flex-wrap gap-x-7 gap-y-1">
                {nav.map((n) => (
                  <li key={n.to}>
                    <NavLink
                      to={n.to}
                      end={n.end}
                      className={({ isActive }) =>
                        clsx(
                          'inline-block border-b-2 pb-0.5 text-sm font-semibold uppercase tracking-wide hover:text-unal-verde',
                          isActive ? 'border-unal-verde' : 'border-transparent',
                        )
                      }
                    >
                      {n.label}
                      <ChevronDown size={11} className="ml-1 inline opacity-0" aria-hidden />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <form onSubmit={buscar} role="search" className="hidden items-center rounded bg-[#676767] focus-within:ring-2 focus-within:ring-white lg:flex">
            <label htmlFor="busca-header" className="sr-only">
              Buscar semilleros
            </label>
            <Search size={16} className="ml-3 text-white/80" aria-hidden />
            <input
              id="busca-header"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar semilleros"
              className="w-56 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/80 focus:outline-none"
            />
          </form>

          {sesion ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuUsuario((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuUsuario}
                className="flex items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-unal-verde text-sm font-bold text-unal-texto">{iniciales}</span>
                <span className="sr-only">Menú de la cuenta</span>
                <ChevronDown size={14} aria-hidden />
              </button>
              {menuUsuario && (
                <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-72 rounded bg-white p-3 text-unal-texto shadow-xl">
                  <p className="truncate text-sm font-semibold">{sesion.correo}</p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded bg-unal-verde-oscuro px-2 py-0.5 text-xs font-semibold text-white">
                    <ShieldCheck size={12} /> {rolEtiqueta}
                  </span>
                  <div className="mt-3 border-t pt-2">
                    {role === 'estudiante' && (
                      <Link role="menuitem" to="/mi-cuenta" onClick={() => setMenuUsuario(false)} className="block rounded px-2 py-2 text-sm hover:bg-gray-100">
                        Mis datos y privacidad
                      </Link>
                    )}
                    <button
                      role="menuitem"
                      onClick={() => {
                        logout()
                        setMenuUsuario(false)
                        navigate('/')
                      }}
                      className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      <LogOut size={14} /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to={`/ingresar?next=${encodeURIComponent(loc.pathname + loc.search)}`} className="btn-verde whitespace-nowrap">
              Iniciar sesión
            </Link>
          )}

          <a href={SITIO_UNAL} target="_blank" rel="noopener noreferrer" className="hidden shrink-0 md:block" aria-label="Escudo de la República de Colombia (abre unal.edu.co)">
            <img src="/img/sello-colombia.png" alt="" aria-hidden className="h-[66px] w-[66px]" />
          </a>

          <button className="rounded p-2 hover:bg-white/10 md:hidden" aria-label="Menú" onClick={() => setMenuMovil((v) => !v)}>
            {menuMovil ? <X /> : <Menu />}
          </button>
        </div>

        {menuMovil && (
          <div className="border-t border-white/20 px-4 pb-4 md:hidden">
            <form onSubmit={buscar} role="search" className="my-3 flex items-center rounded bg-[#676767] focus-within:ring-2 focus-within:ring-white">
              <Search size={16} className="ml-3 text-white/80" aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar semilleros" aria-label="Buscar semilleros" className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/80 focus:outline-none" />
            </form>
            <ul>
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end} onClick={() => setMenuMovil(false)} className="block py-2 text-sm font-semibold uppercase tracking-wide">
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}
