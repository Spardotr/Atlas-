import { useContext, useEffect, useRef, type MutableRefObject, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { UNSAFE_DataRouterContext, useBlocker } from 'react-router-dom'
import { Dialog } from './UI'

/** Diálogo que aparece cuando el usuario intenta salir de la página con cambios sin guardar. */
function GuardiaNavegacion({ dirtyRef }: { dirtyRef: MutableRefObject<boolean> }) {
  const blocker = useBlocker(() => dirtyRef.current)
  if (blocker.state !== 'blocked') return null
  // Portal: el diálogo se pinta fuera del <form>, para que sus botones no envíen el formulario.
  return createPortal(
    <Dialog
      titulo="Tienes cambios sin guardar"
      onClose={() => blocker.reset()}
      acciones={
        <>
          <button className="btn-outline" onClick={() => blocker.reset()}>Seguir editando</button>
          <button className="btn-danger" onClick={() => blocker.proceed()}>Salir sin guardar</button>
        </>
      }
    >
      <p>Si sales ahora, se perderá lo que escribiste en este formulario.</p>
    </Dialog>,
    document.body,
  )
}

/**
 * Control y libertad del usuario: avisa antes de descartar cambios sin guardar.
 * - Cierre de pestaña o recarga: aviso nativo del navegador (beforeunload).
 * - Navegación dentro de la app: diálogo propio (requiere un data router; sin él, solo beforeunload).
 * Devuelve `aviso` (render en el JSX) y `permitirSalida()` para salir sin aviso tras guardar/enviar.
 */
export function useCambiosSinGuardar(dirty: boolean): { aviso: ReactNode; permitirSalida: () => void } {
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty
  const hayDataRouter = !!useContext(UNSAFE_DataRouterContext)

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  return {
    aviso: hayDataRouter ? <GuardiaNavegacion dirtyRef={dirtyRef} /> : null,
    permitirSalida: () => {
      dirtyRef.current = false
    },
  }
}
