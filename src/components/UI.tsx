import { useEffect, useRef, type ReactNode } from 'react'
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
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cerrarRef.current()
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
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-unal-gris-oscuro">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-semibold text-unal-rojo">
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
