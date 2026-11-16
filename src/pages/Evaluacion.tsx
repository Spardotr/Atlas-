import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { PageTitle } from '../components/UI'
import { ID_SEMILLERO_DEMO } from '../data/seed'

type Cuenta = 'visitante' | 'estudiante' | 'director' | 'vicedecanatura'
const CORREO: Record<Exclude<Cuenta, 'visitante'>, string> = {
  estudiante: 'estudiante.demo@unal.edu.co',
  director: 'director.demo@unal.edu.co',
  vicedecanatura: 'vicedecanatura.demo@unal.edu.co',
}

const FILAS: { hu: string; epica: string; rol: string; pantalla: string; ruta: string; cuenta: Cuenta }[] = [
  { hu: 'HU-01', epica: 'E1', rol: 'Visitante', pantalla: 'Catálogo paginado', ruta: '/', cuenta: 'visitante' },
  { hu: 'HU-02', epica: 'E1', rol: 'Visitante', pantalla: 'Búsqueda por palabra clave', ruta: '/?q=robotica', cuenta: 'visitante' },
  { hu: 'HU-04', epica: 'E1', rol: 'Visitante', pantalla: 'Ficha completa', ruta: `/semilleros/${ID_SEMILLERO_DEMO}`, cuenta: 'visitante' },
  { hu: 'HU-08', epica: 'E2', rol: 'Estudiante', pantalla: 'Aviso de privacidad e inicio de sesión', ruta: '/ingresar', cuenta: 'visitante' },
  { hu: 'HU-09', epica: 'E2', rol: 'Director', pantalla: 'Panel del director', ruta: '/director', cuenta: 'director' },
  { hu: 'HU-12', epica: 'E3', rol: 'Estudiante', pantalla: 'Bloque de convocatoria en la ficha', ruta: `/semilleros/${ID_SEMILLERO_DEMO}`, cuenta: 'estudiante' },
  { hu: 'HU-15', epica: 'E4', rol: 'Estudiante', pantalla: 'Postulación, paso 1: mayoría de edad', ruta: `/postular/${ID_SEMILLERO_DEMO}`, cuenta: 'estudiante' },
  { hu: 'HU-16', epica: 'E4', rol: 'Estudiante', pantalla: 'Postulación, paso 2: autorización de datos', ruta: `/postular/${ID_SEMILLERO_DEMO}`, cuenta: 'estudiante' },
  { hu: 'HU-17', epica: 'E4', rol: 'Estudiante', pantalla: 'Postulación, paso 3: formulario', ruta: `/postular/${ID_SEMILLERO_DEMO}`, cuenta: 'estudiante' },
  { hu: 'HU-18', epica: 'E4', rol: 'Director', pantalla: 'Lista de postulaciones y correo simulado', ruta: '/director/postulaciones', cuenta: 'director' },
  { hu: 'HU-19', epica: 'E4', rol: 'Director', pantalla: 'Revisión y decisión de una postulación', ruta: '/director/postulaciones', cuenta: 'director' },
  { hu: 'HU-21', epica: 'E4', rol: 'Estudiante', pantalla: 'Resultado en Mis postulaciones', ruta: '/mi-cuenta?tab=postulaciones', cuenta: 'estudiante' },
  { hu: 'HU-24', epica: 'E5', rol: 'Vicedecanatura', pantalla: 'Tablero: crecimiento de postulaciones', ruta: '/vicedecanatura/tablero', cuenta: 'vicedecanatura' },
  { hu: 'HU-25', epica: 'E5', rol: 'Vicedecanatura', pantalla: 'Tablero: fichas verificadas', ruta: '/vicedecanatura/tablero', cuenta: 'vicedecanatura' },
  { hu: 'HU-26', epica: 'E5', rol: 'Vicedecanatura', pantalla: 'Tablero: postulaciones con autorización', ruta: '/vicedecanatura/tablero', cuenta: 'vicedecanatura' },
  { hu: 'HU-29', epica: 'E6', rol: 'Director', pantalla: 'Reclamar ficha precargada', ruta: '/director/ficha', cuenta: 'director' },
  { hu: 'HU-30', epica: 'E6', rol: 'Director', pantalla: 'Editar ficha', ruta: '/director/ficha', cuenta: 'director' },
  { hu: 'HU-32', epica: 'E6', rol: 'Director', pantalla: 'Abrir y cerrar convocatoria', ruta: '/director/convocatoria', cuenta: 'director' },
  { hu: 'HU-33', epica: 'E7', rol: 'Estudiante', pantalla: 'Mis datos y autorizaciones', ruta: '/mi-cuenta?tab=autorizaciones', cuenta: 'estudiante' },
  { hu: 'HU-34', epica: 'E7', rol: 'Estudiante', pantalla: 'Corregir mis datos', ruta: '/mi-cuenta?tab=datos', cuenta: 'estudiante' },
  { hu: 'HU-35', epica: 'E7', rol: 'Estudiante', pantalla: 'Eliminar mi perfil', ruta: '/mi-cuenta?tab=eliminar', cuenta: 'estudiante' },
  { hu: 'HU-36', epica: 'E7', rol: 'Estudiante', pantalla: 'Revocar una autorización', ruta: '/mi-cuenta?tab=autorizaciones', cuenta: 'estudiante' },
]

export default function Evaluacion() {
  const navigate = useNavigate()
  const { sesion, loginAs, logout } = useStore()

  const abrir = (cuenta: Cuenta, ruta: string) => {
    if (cuenta === 'visitante') {
      if (sesion) logout()
    } else if (sesion?.correo !== CORREO[cuenta]) {
      loginAs(CORREO[cuenta])
    }
    navigate(ruta)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageTitle sub="Cobertura del MVP priorizado en el Hito 1: las 22 historias de usuario Must. Cada enlace cambia a la cuenta de demostración adecuada y abre la pantalla correspondiente.">
        Mapa de historias de usuario
      </PageTitle>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <caption className="sr-only">Historias de usuario del MVP y su pantalla</caption>
          <thead className="bg-unal-fondo text-left text-xs font-bold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3">Historia</th>
              <th scope="col" className="px-4 py-3">Épica</th>
              <th scope="col" className="px-4 py-3">Rol</th>
              <th scope="col" className="px-4 py-3">Pantalla</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Abrir</span></th>
            </tr>
          </thead>
          <tbody>
            {FILAS.map((f) => (
              <tr key={f.hu} className="border-t">
                <td className="px-4 py-2 font-bold">{f.hu}</td>
                <td className="px-4 py-2">{f.epica}</td>
                <td className="px-4 py-2">{f.rol}</td>
                <td className="px-4 py-2">{f.pantalla}</td>
                <td className="px-4 py-2 text-right">
                  <button className="font-semibold text-unal-verde-oscuro underline" onClick={() => abrir(f.cuenta, f.ruta)}>Abrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-unal-gris-oscuro">{FILAS.length} historias cubiertas. Quedan fuera del prototipo las historias Should y Could, el spike SP-01 y las tareas habilitadoras no visibles para el usuario.</p>
    </div>
  )
}
