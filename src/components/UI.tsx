import { Children, cloneElement, isValidElement, useEffect, useRef, type ReactElement, type ReactNode } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { useStore } from '../store'

export function HU({ id }: { id: string }) {
  const { showHU } = useStore()
  if (!showHU) return null
  return (
    <span
      title={`Historia de usuario ${id}`}
      className="ml-1 inline-flex items-center rounded bg-unal-vino px-1.5 py-0.5 align-middle text-xs font-bold leading-none text-white"
    >
      {id}
    </span>
  )
}

type BadgeTone = 'verde' | 'gris' | 'rojo' | 'vino' | 'outline'
/** Indicador de estado: texto de color con un punto, sin caja ni borde, para que no parezca un botón. */
export function Badge({ tone = 'gris', children, title, punto = true }: { tone?: BadgeTone; children: ReactNode; title?: string; punto?: boolean }) {
  const tones: Record<BadgeTone, string> = {
    verde: 'text-unal-verde-oscuro',
    gris: 'text-unal-gris-oscuro',
    rojo: 'text-unal-rojo',
    vino: 'text-unal-vino',
    outline: 'text-unal-texto',
  }
  return (
    <span title={title} className={clsx('inline-flex cursor-default select-none items-center gap-1.5 text-xs font-semibold', tones[tone])}>
      {punto && <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function PageTitle({ children, sub, hu }: { children: ReactNode; sub?: ReactNode; hu?: string[] }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold leading-tight text-unal-texto">
        {children}
        {hu?.map((h) => <HU key={h} id={h} />)}
      </h1>
      <div className="mt-2 h-1 w-14 bg-unal-verde" />
      {sub && <p className="mt-3 max-w-3xl text-base text-unal-gris-oscuro">{sub}</p>}
    </div>
  )
}

export function Dialog({
  titulo,
  children,
  onClose,
  acciones,
}: {
  titulo: string
  children: ReactNode
  onClose: () => void
  acciones: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const cerrarRef = useRef(onClose)
  cerrarRef.current = onClose
  useEffect(() => {
    // Se ejecuta una sola vez al abrir: el foco va al diálogo y se devuelve al cerrar.
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return cerrarRef.current()
      if (e.key !== 'Tab' || !ref.current) return
      // Trampa de foco: Tab y Shift+Tab ciclan dentro del diálogo (WCAG 2.4.3)
      const f = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      if (f.length === 0) return e.preventDefault()
      const primero = f[0]
      const ultimo = f[f.length - 1]
      const activo = document.activeElement
      if (e.shiftKey && (activo === primero || activo === ref.current)) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && activo === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [])
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className="max-h-[90vh] w-full max-w-lg overflow-auto rounded bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold">{titulo}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="text-sm">{children}</div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">{acciones}</div>
      </div>
    </div>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} role="status" className="pointer-events-auto rounded border-l-4 border-unal-verde bg-unal-gris-oscuro px-4 py-3 text-sm text-white shadow-lg">
          {t.texto}
        </div>
      ))}
    </div>
  )
}

export function Campo({
  label,
  error,
  children,
  hint,
  htmlFor,
}: {
  label: string
  error?: string
  children: ReactNode
  hint?: string
  htmlFor?: string
}) {
  const idAyuda = htmlFor ? `${htmlFor}-ayuda` : undefined
  // H4: el control asociado recibe aria-invalid y aria-describedby apuntando al error o a la ayuda
  const convincular = (nodo: ReactNode): ReactNode => {
    if (!htmlFor || !isValidElement(nodo)) return nodo
    const props = nodo.props as { id?: string; children?: ReactNode }
    if (props.id === htmlFor) {
      return cloneElement(nodo as ReactElement<Record<string, unknown>>, {
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error || hint ? idAyuda : undefined,
      })
    }
    return props.children ? cloneElement(nodo as ReactElement<{ children?: ReactNode }>, undefined, Children.map(props.children, convincular)) : nodo
  }
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {Children.map(children, convincular)}
      {hint && !error && <p id={idAyuda} className="mt-1 text-sm text-unal-gris-oscuro">{hint}</p>}
      {error && (
        <p id={idAyuda} role="alert" className="mt-1 text-sm font-semibold text-unal-rojo">
          {error}
        </p>
      )}
    </div>
  )
}

export function Alerta({ tono = 'info', children }: { tono?: 'info' | 'error' | 'ok'; children: ReactNode }) {
  const t = {
    info: 'border-unal-gris-oscuro bg-white',
    error: 'border-unal-rojo bg-white text-unal-rojo',
    ok: 'border-unal-verde-oscuro bg-white',
  }[tono]
  return (
    <div role={tono === 'error' ? 'alert' : 'status'} className={clsx('rounded border-l-4 p-4 text-sm', t)}>
      {children}
    </div>
  )
}
