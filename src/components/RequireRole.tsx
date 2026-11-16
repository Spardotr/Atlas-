import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../store'
import type { Role } from '../types'
import NoPermiso from './NoPermiso'

export default function RequireRole({ roles, children, mensaje }: { roles: Role[]; children: ReactNode; mensaje?: string }) {
  const { role } = useStore()
  const loc = useLocation()
  if (role === 'visitante') {
    return <Navigate to={`/ingresar?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  }
  if (!roles.includes(role)) return <NoPermiso mensaje={mensaje} />
  return <>{children}</>
}
