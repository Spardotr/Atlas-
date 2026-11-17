import { Link } from 'react-router-dom'
import { PageTitle } from '../components/UI'

const PASOS = [
  ['Explora', 'Revisa el catálogo de semilleros de Ingeniería sin iniciar sesión y busca por tema o palabra clave.'],
  ['Revisa la ficha', 'Mira la línea de investigación, los requisitos y si el semillero tiene convocatoria abierta.'],
  ['Postúlate', 'Inicia sesión con tu correo @unal.edu.co, autoriza el uso de tus datos y envía el formulario.'],
  ['Recibe respuesta', 'El director acepta o rechaza desde Atlas y te avisamos por correo.'],
]

export default function ComoFunciona() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageTitle sub="Atlas complementa a Hermes: te ayuda a encontrar semilleros y a postularte con menos fricción.">Cómo funciona</PageTitle>
      <ol className="space-y-4">
        {PASOS.map(([t, d], i) => (
          <li key={t} className="card flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-unal-verde text-lg font-bold">{i + 1}</span>
            <div><h2 className="text-lg font-semibold">{t}</h2><p className="text-sm text-unal-gris-oscuro">{d}</p></div>
          </li>
        ))}
      </ol>
      <Link to="/" className="btn-primary mt-6">Explorar semilleros</Link>
    </div>
  )
}
