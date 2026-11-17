[← Índice](../README.md) · [← Módulo IV](modulo-4-persistencia.md)

# Informe de uso de IA

El equipo usó inteligencia artificial en todas las etapas del hito, siempre con la misma división del trabajo: **la IA propuso, generó o implementó; el equipo decidió qué se aceptaba y verificó el resultado** con pruebas automáticas, mediciones, revisión de código y pruebas con usuarios. Este informe resume ese uso; cada módulo tiene además su propia declaración.

## Herramientas

| Herramienta | Para qué se usó | Módulos |
| --- | --- | --- |
| **Claude (Anthropic)** en el editor de código (Claude Code) | Generar el prototipo, implementar las correcciones decididas por el equipo (accesibilidad, hallazgos RITE, mejoras de navegación), revisar la documentación contra el código, tomar las capturas y correr las pruebas | I, II, III, IV |
| **Claude** conectado a **Jira** (MCP de Atlassian) | Crear el proyecto, las épicas, las historias, los vínculos de dependencia y las fechas | Planeación |
| **Claude** conectado a **Figma** (MCP oficial) | Leer el mockup, reutilizar sus variables de color y crear vistas y componentes | Diseño |
| **Documentos de Claude** | Redactar e iterar la arquitectura y la persistencia | IV |
| **Antigravity** (Google DeepMind · Gemini) | Análisis del código para el inventario de componentes, el diseño responsivo y las heurísticas de Nielsen; lo usó un integrante del equipo | II |

## Resumen por etapa

| Etapa | Qué hizo la IA | Qué decidió, corrigió o verificó el equipo | Detalle |
| --- | --- | --- | --- |
| Planeación (Jira) | Sincronizó el backlog: 7 épicas, historias renombradas, 45 vínculos «bloquea» y fechas | Corrigió el cronograma, revirtió un cambio que la IA aplicó al revés y unificó las etiquetas de entrega | Caso 1 |
| Diseño (Figma) | Creó 7 vistas y un encabezado institucional reutilizable | Rehízo vistas genéricas con el estilo real del equipo; el escudo y el pie de página quedaron como trabajo manual | Caso 2 |
| Módulo I: prototipo | Generó el prototipo navegable a partir de un prompt de ocho secciones: 14 pantallas, estado global, datos de ejemplo y 12 pruebas | Detectó con auditoría, pruebas con usuarios y revisión del negocio lo que la IA no cumplía (contraste, foco, teclado, terminología) y decidió cada corrección, que Claude implementó | [1.2](modulo-1-prototipo.md#12-uso-de-ia-en-el-diseño) |
| Módulo II: arquitectura frontend | Antigravity analizó el código; después Claude actualizó el análisis cuando el código cambió | Revisó que inventario, fragmentos y capturas correspondieran a la versión vigente | [Declaración del Módulo II](modulo-2-frontend.md#23-heurísticas-de-usabilidad-de-jakob-nielsen) |
| Módulo III: usabilidad y accesibilidad | Claude implementó los 7 cambios aplicados de la ficha RITE y las correcciones de accesibilidad, contrastó el reporte con el Excel y redactó la sección | Condujo las pruebas con 11 usuarios, clasificó los hallazgos, decidió qué cambiar y qué descartar (P07), y confirmó los datos de la prueba (consentimiento, modalidad, códigos) | [3.2](modulo-3-calidad.md#32-problema-detectado-vs-cambio-aplicado-en-el-prototipo) |
| Módulo IV: persistencia | Propuso la arquitectura, el esquema y el mapa de API; después Claude los cruzó con las pantallas del prototipo | Descartó los supuestos de la IA (AWS, enlace por correo, identificadores en español), fijó Google Workspace y PostgreSQL, y aprobó los campos y endpoints que faltaban | Caso 3 |

## Lo que la IA hizo mal y cómo se detectó

| Tipo de error | Ejemplo | Cómo se detectó |
| --- | --- | --- |
| Dar por cumplido lo que exige medición | El prompt del prototipo pedía contraste AA y foco visible; la primera versión tenía 7 fallos de contraste y diálogos sin trampa de foco | Cálculo de contraste y axe-core (Módulo III) |
| Supuestos propios sin respaldo del negocio | Despliegue en AWS, inicio de sesión por enlace al correo, fechas del cronograma | Revisión del equipo contra sus decisiones previas |
| Patrones a medias | Roles ARIA (`dialog`, `menu`, `tab`) sin el comportamiento de teclado que prometen | Revisión de código en la auditoría |
| Instrucciones entendidas al revés | Modificó el documento del backlog para igualarlo a Jira, cuando la fuente de verdad era el documento | Revisión del resultado en Jira |
| Documentación que queda desactualizada | El análisis del Módulo II describía un buscador y unos estilos que ya no existían | Comparación de la documentación con el código vigente |
| Datos que no coinciden entre fuentes | El reporte RITE decía p = 0,019; el Excel da p = 0,014 | Cotejo con la hoja de cálculo |

## Límites de las herramientas

- **Figma:** el plan Starter agotó la cuota de llamadas dos veces y parte del trabajo quedó sin aplicar.
- **Jira:** la conexión no permite borrar vínculos ni renombrar el proyecto; esas acciones se hicieron a mano.
- **Documentos de Claude:** los diagramas no se exportan a Markdown; se pasaron a imágenes y el diagrama entidad-relación se rehízo en Mermaid dentro del Módulo IV.

## Conclusiones

1. La IA acelera lo que es volumen y estructura: un prototipo de 14 pantallas, un backlog completo o un primer borrador de arquitectura en horas.
2. La calidad depende de la verificación del equipo: los errores más importantes solo aparecieron al medir (contraste, estadística), al comparar con el código o al observar a personas usando el prototipo (terminología, búsqueda).
3. Las decisiones de negocio fueron siempre del equipo: qué historias priorizar, qué hallazgo corregir o descartar, qué tecnología usar y qué supuestos rechazar.

## Casos detallados

### Caso 1. Sincronización de Jira por MCP

**Prompt inicial.** "Aplica estos cambios: renombra el proyecto a Atlas, sincroniza el ambiente de Jira con lo que tenemos ahora en el documento del backlog y agrega las dependencias. Ajusta los vínculos 'bloquea' y reprograma las fechas según el nuevo cronograma."

**Resultado de la IA.** El proyecto quedó con 7 épicas, las historias renombradas con sus identificadores definitivos, 45 vínculos "bloquea" y fechas por historia del MVP.

**Refactorización humana.**

- Jira no admitió las features como nivel padre de las historias; el equipo aceptó representarlas como etiquetas.
- Se corrigió el cronograma: la IA había interpretado mal las fechas; el equipo fijó el inicio el 19 de octubre y el cierre en la primera semana de diciembre.
- La IA entendió al revés una instrucción y modificó el documento para igualarlo a Jira. El equipo aclaró que el documento es la fuente de verdad; la IA revirtió el cambio y ajustó Jira.
- Las etiquetas de entrega (R1, R2, R3) se reemplazaron por una sola etiqueta MVP, que es la clasificación que usa el documento.

### Caso 2. Mockup en Figma

**Prompt inicial.** "Usa el MCP de Figma para agregar más vistas al mockup de Atlas, basadas en las historias de usuario obligatorias, y aplica el estilo institucional de la universidad que aparece en esta captura." Se adjuntó la captura del encabezado del sitio de la universidad.

**Resultado de la IA.** Siete vistas nuevas en el archivo de Figma, una por cada grupo de historias obligatorias, enlazadas a las variables de color del archivo, y un componente reutilizable con el encabezado institucional.

**Refactorización humana.**

- En un intento anterior Figma bloqueó el acceso por cuota y la IA produjo vistas genéricas, en formato móvil, sin haber visto el avance del equipo. El equipo compartió una captura del mockup real, de escritorio y con la paleta verde institucional, y las vistas se rehicieron en ese estilo.
- El escudo de la universidad quedó como marcador: lo inserta el equipo desde el manual de marca.
- Se pidió un pie de página y ajustar las vistas al sistema de diseño de Google (Material 3). No se aplicó porque la cuota se agotó de nuevo; queda como trabajo manual.

### Caso 3. Arquitectura y persistencia (Módulo IV)

**Prompt inicial.** "Para el Módulo IV, que pide el esquema de datos mínimo y el mapa de API, pensamos en un backend dividido por capas de dominio. No creemos necesaria por ahora una arquitectura de microservicios ni hexagonal: no se estiman más de 100 usuarios concurrentes, que caben en una sola máquina, y si el sistema escala debe poder separarse fácilmente en microservicios. La base de datos sería relacional, en PostgreSQL, normalizada y con algunos campos JSON para lo no estructurado. Habría dos ambientes, uno de pruebas y otro de UAT. Ayúdanos a formalizar de manera robusta esta arquitectura, justificando las decisiones, con base en las historias de usuario."

**Resultado de la IA.** Un documento de ocho secciones con monolito modular, diagrama entidad-relación y mapa de API. Incluía supuestos propios de la IA: despliegue en AWS, inicio de sesión por enlace al correo e identificadores en español.

**Refactorización humana.**

- Código, tablas y rutas en inglés; el texto en español.
- Diseño independiente de la nube, porque no hay garantía de una cuenta de AWS institucional.
- Inicio de sesión con la cuenta de Google de la universidad, que el equipo validó con una prueba de concepto, en lugar del enlace por correo.
- Sin conexión directa a Hermes: las fichas se cargan por archivo. Las tablas sí incorporan los campos que Hermes registra, para extender el sistema sin migraciones.
- Interoperabilidad con fuentes oficiales como lógica de servicio y no como columnas en las tablas, y fuera del MVP.
- Se pidió agregar los principios SOLID, la estructura de carpetas, el esquema estrella con historial de cambios y la justificación de PATCH frente a PUT.
- Redacción: la primera versión era demasiado extensa y la segunda demasiado coloquial; se ajustó a un registro formal y breve.

---

[← Índice](../README.md) · [← Módulo IV](modulo-4-persistencia.md)
