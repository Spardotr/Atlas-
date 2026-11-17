import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { diasDesde, fmtFecha, hoyISO } from '../lib/utils'
import { Badge, HU, PageTitle } from '../components/UI'
import { PERIODO_ACTUAL, PERIODO_ANTERIOR } from '../types'

const META_CRECIMIENTO = 30
const META_VERIFICADAS = 85
const META_AUTORIZACION = 100

function Progreso({ valor, meta, rojo }: { valor: number; meta: number; rojo?: boolean }) {
  return (
    <div className="relative mt-3 h-4 w-full rounded bg-unal-gris-claro/50" role="img" aria-label={`${valor.toFixed(0)} por ciento, meta ${meta} por ciento`}>
      <div className={`h-full rounded ${rojo ? 'bg-unal-rojo' : 'bg-unal-verde-oscuro'}`} style={{ width: `${Math.min(100, valor)}%` }} />
      <div className="absolute -top-1 h-6 w-0.5 bg-unal-texto" style={{ left: `${meta}%` }} title={`Meta ${meta}%`} />
    </div>
  )
}

export default function Tablero() {
  const { postulaciones, semilleros } = useStore()

  const actual = postulaciones.filter((p) => p.periodo === PERIODO_ACTUAL).length
  const anterior = postulaciones.filter((p) => p.periodo === PERIODO_ANTERIOR).length
  const variacion = anterior > 0 ? ((actual - anterior) / anterior) * 100 : 0
  const bajoMeta = variacion < META_CRECIMIENTO

  const verificadas = semilleros.filter((s) => s.estadoFicha === 'Verificada').length
  const pctVerif = semilleros.length ? (verificadas / semilleros.length) * 100 : 0
  const viejas = semilleros.filter((s) => diasDesde(s.actualizadoEn) > 182).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  const delActual = postulaciones.filter((p) => p.periodo === PERIODO_ACTUAL)
  const sinAut = delActual.filter((p) => p.autorizacionId === null).length
  const pctAut = delActual.length ? ((delActual.length - sinAut) / delActual.length) * 100 : 100
  const autRoja = pctAut < META_AUTORIZACION

  const datos = [
    { periodo: `Semestre anterior (${PERIODO_ANTERIOR})`, total: anterior },
    { periodo: `Semestre actual (${PERIODO_ACTUAL})`, total: actual },
  ]
  const corte = fmtFecha(hoyISO())

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageTitle hu={['HU-24', 'HU-25', 'HU-26']} sub="Vicedecanatura de Investigación y Extensión · Facultad de Ingeniería">Tablero de seguimiento</PageTitle>
      <p className="mb-6 rounded border-l-4 border-unal-gris-oscuro bg-white p-3 text-sm">Reportes agregados: no muestran nombres ni correos de personas.</p>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="card" aria-labelledby="k1">
          <h2 id="k1" className="section-title mb-1">Crecimiento de postulaciones<HU id="HU-24" /></h2>
          <p className="text-xs text-unal-gris-oscuro">Datos al {corte} · Meta: +{META_CRECIMIENTO} %</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="flex items-center text-4xl font-bold" data-testid="variacion">
              {variacion >= 0 ? <ArrowUpRight className="mr-1" /> : <ArrowDownRight className="mr-1" />}
              {variacion >= 0 ? '+' : ''}{variacion.toFixed(0)} %
            </span>
            {bajoMeta ? <Badge tone="rojo">Bajo la meta</Badge> : <Badge tone="verde">Meta alcanzada</Badge>}
          </div>
          <p className="mt-2 text-sm">{actual} postulaciones este semestre frente a {anterior} del anterior.</p>
          <div className="mt-3 h-40" role="img" aria-label="Gráfico de postulaciones por semestre">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datos} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="periodo" tick={{ fontSize: 12 }} interval={0} tickFormatter={(v: string) => v.replace('Semestre ', '').replace(' (', '\n(')} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" name="Postulaciones" radius={[2, 2, 0, 0]}>
                  <Cell fill="#565A5C" />
                  <Cell fill="#94B43B" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card" aria-labelledby="k2">
          <h2 id="k2" className="section-title mb-1">Fichas verificadas por su director<HU id="HU-25" /></h2>
          <p className="text-xs text-unal-gris-oscuro">Datos al {corte} · Meta: {META_VERIFICADAS} %</p>
          <p className="mt-3 text-4xl font-bold" data-testid="pct-verificadas">{pctVerif.toFixed(0)} %</p>
          <p className="text-sm">{verificadas} de {semilleros.length} fichas verificadas</p>
          <Progreso valor={pctVerif} meta={META_VERIFICADAS} rojo={pctVerif < META_VERIFICADAS} />
          <p className="mt-4 text-sm font-semibold" data-testid="viejas">{viejas.length} fichas llevan más de 6 meses sin actualizar</p>
          <ul className="mt-2 max-h-32 space-y-1 overflow-auto text-sm">
            {viejas.map((s) => (
              <li key={s.id}><Link to={`/semilleros/${s.id}`} className="text-unal-verde-oscuro underline">{s.nombre}</Link></li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="k3">
          <h2 id="k3" className="section-title mb-1">Postulaciones con autorización registrada<HU id="HU-26" /></h2>
          <p className="text-xs text-unal-gris-oscuro">Datos al {corte} · Meta: {META_AUTORIZACION} %</p>
          <p className={`mt-3 text-4xl font-bold ${autRoja ? 'text-unal-rojo' : 'text-unal-verde-oscuro'}`} data-testid="pct-autorizacion">{pctAut.toFixed(0)} %</p>
          <p className="text-sm">{delActual.length - sinAut} de {delActual.length} postulaciones del semestre actual</p>
          <Progreso valor={pctAut} meta={META_AUTORIZACION} rojo={autRoja} />
          {autRoja ? (
            <p className="mt-4 rounded bg-unal-rojo p-3 text-sm font-semibold text-white" role="alert" data-testid="casos-sin-aut">
              {sinAut} {sinAut === 1 ? 'caso' : 'casos'} sin autorización registrada
            </p>
          ) : (
            <p className="mt-4 text-sm font-semibold text-unal-verde-oscuro">Todas las postulaciones tienen autorización registrada.</p>
          )}
        </section>
      </div>
    </div>
  )
}
