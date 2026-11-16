import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'

export default function NoPermiso({ mensaje = 'No tienes permiso para ver esta página' }: { mensaje?: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <Lock className="mx-auto mb-4 text-unal-rojo" size={40} />
      <h1 className="text-xl font-bold">{mensaje}</h1>
      <p className="mt-2 text-sm text-unal-gris-oscuro">Tu cuenta no tiene acceso a este contenido.</p>
      <Link to="/" className="btn-primary mt-6">
        Volver al catálogo
      </Link>
    </div>
  )
}
