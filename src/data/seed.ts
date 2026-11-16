import type { Area, Postulacion, Semillero } from '../types'
import { addDias, normalizar } from '../lib/utils'

export const CORREO_DIRECTOR_DEMO = 'director.demo@unal.edu.co'
export const CORREO_DIRECTOR2_DEMO = 'director2.demo@unal.edu.co'
export const ID_SEMILLERO_DEMO = 'robotica-y-control-movil'
export const ID_SEMILLERO_DEMO2 = 'aprendizaje-automatico-aplicado'

export function slug(s: string): string {
  return normalizar(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface Raw {
  nombre: string
  area: Area
  linea: string
  descripcion: string
  requisitos: string
  director: string
  verificada: boolean
  dias: number // días desde la última actualización
  conv: { abierta: boolean; offset: number; cupos: number; aceptados: number }
  contacto?: { telefono?: string; whatsapp?: string }
  correo?: string
}

const RAW: Raw[] = [
  { nombre: 'Robótica y Control Móvil', area: 'Robótica y control', linea: 'Navegación autónoma de robots móviles', descripcion: 'Diseño, simulación y construcción de robots móviles terrestres con navegación autónoma, fusión sensorial y control predictivo para entornos interiores.', requisitos: 'Haber aprobado Programación Orientada a Objetos y manejar Python o C++. Disponibilidad de 6 horas semanales.', director: 'Martín Salcedo Prieto (demo)', verificada: false, dias: 95, conv: { abierta: true, offset: 20, cupos: 5, aceptados: 0 }, correo: 'director.demo@unal.edu.co' },
  { nombre: 'Aprendizaje Automático Aplicado', area: 'Inteligencia artificial', linea: 'Modelos de aprendizaje supervisado para problemas de ingeniería', descripcion: 'Aplicación de aprendizaje automático a series de tiempo industriales, detección de anomalías y modelos interpretables.', requisitos: 'Cálculo multivariado, álgebra lineal y Python. Deseable estadística.', director: 'Lucía Fernanda Ospina (demo 2)', verificada: true, dias: 20, conv: { abierta: true, offset: 12, cupos: 4, aceptados: 1 }, contacto: { telefono: '601 555 0142', whatsapp: '300 555 0142' }, correo: 'director2.demo@unal.edu.co' },
  { nombre: 'Visión por Computador y Percepción', area: 'Inteligencia artificial', linea: 'Reconocimiento de imágenes y percepción 3D', descripcion: 'Investigación en detección de objetos, segmentación y reconstrucción 3D con aplicaciones en agricultura de precisión.', requisitos: 'Programación en Python y nociones de álgebra lineal.', director: 'Camila Ortega Ruiz', verificada: true, dias: 34, conv: { abierta: true, offset: 30, cupos: 6, aceptados: 2 } },
  { nombre: 'Procesamiento de Lenguaje Natural en Español', area: 'Inteligencia artificial', linea: 'Modelos de lenguaje para variantes del español colombiano', descripcion: 'Construcción de corpus y modelos de lenguaje para el español de Colombia, con énfasis en búsqueda semántica y resumen automático.', requisitos: 'Python, estructuras de datos y disposición para lectura de artículos científicos.', director: 'Andrés Felipe Quintero Gil', verificada: false, dias: 120, conv: { abierta: true, offset: 15, cupos: 3, aceptados: 3 } },
  { nombre: 'Control de Sistemas No Lineales', area: 'Robótica y control', linea: 'Control robusto y adaptativo', descripcion: 'Análisis y síntesis de controladores para sistemas no lineales con validación en banco de pruebas de péndulos y quadrotores.', requisitos: 'Haber cursado Señales y Sistemas o Control Clásico.', director: 'Héctor Julián Mora Báez', verificada: true, dias: 60, conv: { abierta: false, offset: -25, cupos: 4, aceptados: 4 } },
  { nombre: 'Drones y Sistemas Autónomos', area: 'Robótica y control', linea: '', descripcion: 'Plataformas aéreas no tripuladas para inspección de infraestructura y monitoreo ambiental.', requisitos: 'Interés en electrónica y programación embebida.', director: 'Sandra Milena Cuervo Rojas', verificada: false, dias: 75, conv: { abierta: false, offset: -30, cupos: 3, aceptados: 3 } },
  { nombre: 'Arquitecturas de Software Escalables', area: 'Ingeniería de software', linea: 'Microservicios y observabilidad', descripcion: 'Estudio de patrones arquitectónicos para sistemas de alta disponibilidad, con prácticas de integración y despliegue continuos.', requisitos: 'Ingeniería de Software I aprobada y experiencia básica con Git.', director: 'Julián David Ramírez Pinto', verificada: true, dias: 14, conv: { abierta: true, offset: 8, cupos: 3, aceptados: 0 } },
  { nombre: 'Ingeniería de Software Educativo', area: 'Ingeniería de software', linea: 'Herramientas digitales para aprendizaje de programación', descripcion: 'Desarrollo y evaluación de plataformas de aprendizaje de programación con retroalimentación automática.', requisitos: 'Programación web básica.', director: 'Paola Andrea Vargas Soto', verificada: false, dias: 110, conv: { abierta: false, offset: -40, cupos: 4, aceptados: 2 } },
  { nombre: 'Calidad y Pruebas de Software', area: 'Ingeniería de software', linea: 'Pruebas automatizadas y mejora de procesos', descripcion: 'Técnicas de pruebas basadas en propiedades, análisis estático y métricas de calidad en proyectos de código abierto.', requisitos: 'Cualquier lenguaje de programación a nivel intermedio.', director: 'Ricardo Alonso Peña Duarte', verificada: true, dias: 50, conv: { abierta: false, offset: -18, cupos: 3, aceptados: 3 } },
  { nombre: 'Sistemas Distribuidos y Computación en la Nube', area: 'Ingeniería de software', linea: 'Consenso, tolerancia a fallos y orquestación', descripcion: 'Implementación y análisis de protocolos de consenso y despliegues en contenedores sobre infraestructura en la nube.', requisitos: 'Sistemas Operativos y Redes aprobadas.', director: 'Gloria Inés Beltrán Carrillo', verificada: false, dias: 80, conv: { abierta: true, offset: -3, cupos: 4, aceptados: 1 } },
  { nombre: 'Internet de las Cosas y Redes Inalámbricas', area: 'Redes y telecomunicaciones', linea: 'Redes de sensores de bajo consumo', descripcion: 'Diseño de redes LoRa y Zigbee para monitoreo ambiental en campus, con análisis de consumo energético.', requisitos: 'Redes de Computadores aprobada o en curso.', director: 'Esteban Camilo Navarro León', verificada: true, dias: 28, conv: { abierta: true, offset: 25, cupos: 5, aceptados: 1 } },
  { nombre: 'Seguridad en Redes y Criptografía', area: 'Redes y telecomunicaciones', linea: 'Criptografía aplicada y detección de intrusiones', descripcion: 'Análisis de protocolos criptográficos y construcción de sistemas de detección de intrusiones con datos reales anonimizados.', requisitos: 'Matemáticas Discretas y Redes. Interés en seguridad informática.', director: 'Natalia Rocío Zambrano Aya', verificada: true, dias: 42, conv: { abierta: true, offset: 28, cupos: 5, aceptados: 0 } },
  { nombre: 'Energías Renovables y Microrredes', area: 'Energía y sostenibilidad', linea: 'Integración de generación solar y almacenamiento', descripcion: 'Modelado y operación de microrredes con generación solar y baterías para comunidades rurales.', requisitos: 'Circuitos Eléctricos aprobado. Manejo de MATLAB o Python.', director: 'Óscar Iván Montoya Salas', verificada: true, dias: 25, conv: { abierta: true, offset: 40, cupos: 4, aceptados: 0 } },
  { nombre: 'Eficiencia Energética en Edificaciones', area: 'Energía y sostenibilidad', linea: 'Simulación energética de edificios', descripcion: 'Evaluación del desempeño energético de edificaciones del campus y propuestas de mejora.', requisitos: 'Termodinámica o Fenómenos de Transporte.', director: 'Diana Marcela Hurtado Lara', verificada: false, dias: 100, conv: { abierta: false, offset: -50, cupos: 3, aceptados: 1 } },
  { nombre: 'Hidrógeno Verde y Almacenamiento', area: 'Energía y sostenibilidad', linea: 'Electrólisis y celdas de combustible', descripcion: 'Estudio experimental de electrolizadores y celdas de combustible tipo PEM para almacenamiento de energía.', requisitos: 'Química General y disposición para trabajo de laboratorio.', director: 'Fabián Leonardo Cárdenas Mesa', verificada: false, dias: 210, conv: { abierta: false, offset: -90, cupos: 2, aceptados: 2 } },
  { nombre: 'Instrumentación Biomédica', area: 'Bioingeniería', linea: 'Sensores y adquisición de señales fisiológicas', descripcion: 'Diseño de instrumentación de bajo costo para señales ECG, EMG y respiración, con procesamiento digital.', requisitos: 'Electrónica Análoga y Procesamiento de Señales.', director: 'Mónica Patricia Villamizar Cruz', verificada: true, dias: 18, conv: { abierta: true, offset: 15, cupos: 3, aceptados: 0 }, contacto: { telefono: '601 555 0177' } },
  { nombre: 'Biomecánica y Rehabilitación', area: 'Bioingeniería', linea: 'Prótesis y exoesqueletos de bajo costo', descripcion: 'Modelado biomecánico y prototipado de dispositivos de rehabilitación de miembro superior.', requisitos: 'Mecánica de Sólidos o Dinámica.', director: 'Iván Darío Cortés Ardila', verificada: true, dias: 70, conv: { abierta: false, offset: -12, cupos: 3, aceptados: 3 } },
  { nombre: 'Analítica de Datos para Movilidad Urbana', area: 'Ciencia de datos', linea: 'Análisis de transporte público y tráfico', descripcion: 'Uso de datos abiertos de transporte de Bogotá para estimar demanda, tiempos de viaje y equidad de acceso.', requisitos: 'Estadística y Python (pandas). Deseable SQL.', director: 'Adriana Lucía Roa Montaña', verificada: true, dias: 22, conv: { abierta: true, offset: 35, cupos: 6, aceptados: 2 } },
  { nombre: 'Minería de Datos Educativos', area: 'Ciencia de datos', linea: 'Analítica del aprendizaje', descripcion: 'Análisis de trayectorias académicas agregadas y anónimas para identificar factores de permanencia estudiantil.', requisitos: 'Estadística y Python.', director: 'Jorge Enrique Linares Pardo', verificada: false, dias: 130, conv: { abierta: false, offset: -35, cupos: 3, aceptados: 3 } },
  { nombre: 'Sistemas de Información Geográfica', area: 'Ciencia de datos', linea: 'Análisis espacial y teledetección', descripcion: 'Procesamiento de imágenes satelitales y modelado espacial para gestión del riesgo en la Sabana de Bogotá.', requisitos: 'Interés en cartografía y programación.', director: 'Ximena Alejandra Bustos Neira', verificada: false, dias: 195, conv: { abierta: false, offset: -60, cupos: 3, aceptados: 3 } },
  { nombre: 'Diseño de Sistemas Embebidos', area: 'Electrónica', linea: 'Microcontroladores y sistemas en tiempo real', descripcion: 'Desarrollo de firmware y hardware para sistemas embebidos con sistemas operativos de tiempo real.', requisitos: 'Electrónica Digital y programación en C.', director: 'Wilson Andrés Prada Sierra', verificada: true, dias: 30, conv: { abierta: true, offset: 18, cupos: 4, aceptados: 1 } },
  { nombre: 'Electrónica de Potencia', area: 'Electrónica', linea: 'Convertidores y accionamientos', descripcion: 'Diseño de convertidores CC-CC y cargadores para vehículos eléctricos ligeros.', requisitos: 'Electrónica Análoga aprobada.', director: 'Liliana Esperanza Gaitán Rey', verificada: true, dias: 58, conv: { abierta: false, offset: -22, cupos: 3, aceptados: 2 } },
  { nombre: 'Materiales Compuestos Sostenibles', area: 'Materiales', linea: 'Compuestos con fibras naturales', descripcion: 'Caracterización mecánica de compuestos reforzados con fibras naturales colombianas.', requisitos: 'Ciencia de Materiales o similar. Trabajo de laboratorio.', director: 'Camilo Ernesto Rivera Torres', verificada: false, dias: 90, conv: { abierta: true, offset: 45, cupos: 3, aceptados: 0 } },
  { nombre: 'Nanomateriales y Superficies', area: 'Materiales', linea: 'Recubrimientos funcionales', descripcion: 'Síntesis y caracterización de recubrimientos a escala nanométrica para protección contra la corrosión.', requisitos: '', director: 'Teresa Isabel Londoño Páez', verificada: false, dias: 230, conv: { abierta: false, offset: -100, cupos: 2, aceptados: 2 } },
  { nombre: 'Estructuras Sismorresistentes', area: 'Estructuras y construcción', linea: 'Comportamiento sísmico de edificaciones', descripcion: 'Análisis dinámico y ensayos de mesa vibratoria en modelos a escala de estructuras en concreto.', requisitos: 'Análisis Estructural aprobado.', director: 'Gustavo Adolfo Mendoza Cely', verificada: true, dias: 16, conv: { abierta: true, offset: 10, cupos: 2, aceptados: 1 } },
  { nombre: 'Construcción Sostenible con Guadua', area: 'Estructuras y construcción', linea: 'Diseño estructural con guadua', descripcion: 'Estudio de uniones y elementos estructurales en guadua para vivienda de bajo impacto ambiental.', requisitos: 'Mecánica de Materiales y gusto por el trabajo de campo.', director: 'Rosa Elena Acosta Mejía', verificada: false, dias: 85, conv: { abierta: false, offset: -45, cupos: 3, aceptados: 2 } },
]

function correoDe(nombre: string, i: number): string {
  const partes = normalizar(nombre).replace(/[^a-z ]/g, '').split(' ').filter(Boolean)
  const inicial = partes[0]?.[0] ?? 'x'
  const apellido = partes[partes.length - 2] ?? partes[partes.length - 1] ?? 'doc'
  return `${inicial}${apellido}${i}@unal.edu.co`
}

export function makeSemilleros(base: Date = new Date()): Semillero[] {
  return RAW.map((r, i) => ({
    id: slug(r.nombre),
    nombre: r.nombre,
    descripcion: r.descripcion,
    linea: r.linea,
    area: r.area,
    director: { nombre: r.director.startsWith('Dr') ? r.director : `Prof. ${r.director}`, correo: r.correo ?? correoDe(r.director, i) },
    requisitos: r.requisitos,
    convocatoria: {
      abierta: r.conv.abierta,
      cierre: addDias(base, r.conv.offset),
      cupos: r.conv.cupos,
      aceptados: r.conv.aceptados,
    },
    estadoFicha: r.verificada ? 'Verificada' : 'Precargada',
    actualizadoEn: addDias(base, -r.dias),
    contacto: r.contacto
      ? {
          telefono: r.contacto.telefono,
          whatsapp: r.contacto.whatsapp,
          publicarTelefono: !!r.contacto.telefono,
          publicarWhatsapp: !!r.contacto.whatsapp,
        }
      : undefined,
  }))
}

const ESTUDIANTES = [
  'Valentina Rojas', 'Samuel Pardo', 'Laura Camacho', 'Daniel Herrera', 'Mariana Ruiz', 'Sebastián Gómez',
  'Isabela Cortés', 'Nicolás Vega', 'Juliana Peña', 'Tomás Acevedo', 'Sara Montoya', 'Felipe Duarte',
  'Camila Beltrán', 'Mateo Salazar', 'Daniela Ortiz', 'Emilio Castaño', 'Paula Mejía', 'Gabriel Ardila',
  'Luciana Rincón', 'Santiago Lozano', 'Manuela Prieto', 'Joaquín Ferrer', 'Antonia Quiroga', 'Alejandro Soto',
  'Renata Villa', 'Maximiliano Cano', 'Salomé Barrera', 'Diego Hernández', 'Ximena Parra', 'Lorenzo Medina',
  'Catalina Rey', 'Andrés Cifuentes',
]

const PROGRAMAS_SEED = [
  'Ingeniería de Sistemas y Computación', 'Ingeniería Electrónica', 'Ingeniería Mecatrónica', 'Ingeniería Civil',
  'Ingeniería Industrial', 'Ingeniería Eléctrica', 'Ingeniería Química', 'Ingeniería Mecánica',
]

export function makePostulaciones(semilleros: Semillero[], base: Date = new Date()): Postulacion[] {
  const ids = semilleros.map((s) => s.id)
  const out: Postulacion[] = []
  // Periodo actual (17): 3 nuevas para el semillero demo, 14 en otros semilleros
  const actuales: { sem: string; estado: Postulacion['estado']; dias: number; sinAut?: boolean }[] = [
    { sem: ID_SEMILLERO_DEMO, estado: 'Enviada', dias: 2 },
    { sem: ID_SEMILLERO_DEMO, estado: 'Enviada', dias: 4 },
    { sem: ID_SEMILLERO_DEMO, estado: 'Enviada', dias: 6 },
    { sem: 'vision-por-computador-y-percepcion', estado: 'Aceptada', dias: 14 },
    { sem: ids[2], estado: 'Aceptada', dias: 20 },
    { sem: ids[2], estado: 'Aceptada', dias: 22 },
    { sem: ID_SEMILLERO_DEMO2, estado: 'Aceptada', dias: 18 },
    { sem: ids[6], estado: 'Enviada', dias: 5 },
    { sem: ids[11], estado: 'Aceptada', dias: 30 },
    { sem: ids[15], estado: 'Rechazada', dias: 25 },
    { sem: ids[16], estado: 'Enviada', dias: 7, sinAut: true },
    { sem: ids[17], estado: 'Rechazada', dias: 33 },
    { sem: ids[18], estado: 'Aceptada', dias: 12 },
    { sem: ids[18], estado: 'Aceptada', dias: 15 },
    { sem: ids[20], estado: 'Aceptada', dias: 40 },
    { sem: ids[24], estado: 'Rechazada', dias: 28 },
    { sem: ids[24], estado: 'Aceptada', dias: 35 },
  ]
  const anteriores: { sem: string; estado: Postulacion['estado'] }[] = Array.from({ length: 15 }, (_, i) => ({
    sem: ids[(i * 3 + 1) % ids.length],
    estado: i % 3 === 0 ? 'Rechazada' : 'Aceptada',
  }))

  let n = 0
  const mk = (sem: string, estado: Postulacion['estado'], diasAtras: number, periodo: Postulacion['periodo'], sinAut = false) => {
    n += 1
    const fecha = new Date(base)
    fecha.setDate(fecha.getDate() - diasAtras)
    fecha.setHours(10, 15, 0, 0)
    const sId = ids.includes(sem) ? sem : ids[2]
    const nombre = ESTUDIANTES[(n - 1) % ESTUDIANTES.length]
    out.push({
      id: `p-seed-${String(n).padStart(3, '0')}`,
      numero: `ATL-${periodo === '2026-2' ? '2026' : '2025'}-${String(n).padStart(4, '0')}`,
      semilleroId: sId,
      correo: `${normalizar(nombre).replace(/ /g, '.')}@unal.edu.co`,
      nombre,
      programa: PROGRAMAS_SEED[n % PROGRAMAS_SEED.length],
      semestre: String(3 + (n % 6)),
      disponibilidad: ['Menos de 5 h por semana', 'Entre 5 y 10 h por semana', 'Más de 10 h por semana'][n % 3],
      mensaje: 'Me interesa aprender y aportar a los proyectos del semillero. (Mensaje de ejemplo)',
      fechaEnvio: fecha.toISOString(),
      periodo,
      estado,
      decisionAt: estado === 'Enviada' ? undefined : new Date(fecha.getTime() + 2 * 86400000).toISOString(),
      autorizacionId: sinAut ? null : `aut-seed-${n}`,
      revisada: estado !== 'Enviada',
    })
  }
  actuales.forEach((a) => mk(a.sem, a.estado, a.dias, '2026-2', a.sinAut))
  anteriores.forEach((a, i) => mk(a.sem, a.estado, 120 + i * 6, '2026-1'))
  return out
}
