import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RequireRole from './components/RequireRole'
import NoPermiso from './components/NoPermiso'
import Explorar from './pages/Explorar'
import Ficha from './pages/Ficha'
import Ingresar from './pages/Ingresar'
import Postular from './pages/Postular'
import Confirmacion from './pages/Confirmacion'
import MiCuenta from './pages/MiCuenta'
import DirectorPanel from './pages/DirectorPanel'
import DirectorFicha from './pages/DirectorFicha'
import DirectorConvocatoria from './pages/DirectorConvocatoria'
import DirectorPostulaciones from './pages/DirectorPostulaciones'
import DirectorPostulacionDetalle from './pages/DirectorPostulacionDetalle'
// Tablero arrastra recharts (~1 MB en desarrollo): se carga solo al visitarlo
const Tablero = lazy(() => import('./pages/Tablero'))
import ComoFunciona from './pages/ComoFunciona'
import Evaluacion from './pages/Evaluacion'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Explorar />} />
        <Route path="/semilleros/:id" element={<Ficha />} />
        <Route path="/ingresar" element={<Ingresar />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/evaluacion" element={<Evaluacion />} />

        <Route path="/postular/:id" element={<RequireRole roles={['estudiante']}><Postular /></RequireRole>} />
        <Route path="/postulacion/:numero" element={<RequireRole roles={['estudiante']}><Confirmacion /></RequireRole>} />
        <Route path="/mi-cuenta" element={<RequireRole roles={['estudiante']}><MiCuenta /></RequireRole>} />

        <Route path="/director" element={<RequireRole roles={['director']}><DirectorPanel /></RequireRole>} />
        <Route path="/director/ficha" element={<RequireRole roles={['director', 'estudiante']}><DirectorFicha /></RequireRole>} />
        <Route path="/director/convocatoria" element={<RequireRole roles={['director']}><DirectorConvocatoria /></RequireRole>} />
        <Route path="/director/postulaciones" element={<RequireRole roles={['director']}><DirectorPostulaciones /></RequireRole>} />
        <Route path="/director/postulaciones/:id" element={<RequireRole roles={['director']}><DirectorPostulacionDetalle /></RequireRole>} />

        <Route path="/vicedecanatura/tablero" element={<RequireRole roles={['vicedecanatura']}><Suspense fallback={<p className="px-4 py-10 text-center" role="status">Cargando tablero…</p>}><Tablero /></Suspense></RequireRole>} />
        <Route path="*" element={<NoPermiso mensaje="No encontramos esta página" />} />
      </Route>
    </Routes>
  )
}
