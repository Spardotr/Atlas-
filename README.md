<div align="center">

<img src="./docs/img/escudo-unal-color.png" alt="Escudo de la Universidad Nacional de Colombia" width="160" />

# INFORME – HITO 2

## Atlas

*Tu mapa hacia la investigación*

<br />

Diego Alberto Romero Olmos · Diego Enrique Molina Sánchez · Juan Pablo Zuluaga Galindo · Diego Fernando Fandiño Quintero · Jhonny Santiago Huerta Meicuaco · Samuel Ricardo Pardo Trujillo · Santiago Serrano González

<br />

**Presentado a:** Docente Jhon Alexander García Camargo

**Institución:** Universidad Nacional de Colombia – Sede Bogotá

**Fecha:** 17 de noviembre de 2026

Bogotá, Colombia

</div>

---

## Resumen de la entrega

| Módulo | Qué contiene | Resultado principal |
| --- | --- | --- |
| [I. Prototipo de alta fidelidad](docs/modulo-1-prototipo.md) | Prototipo navegable, cobertura de historias y uso de IA en el diseño (prompt → resultado → refactorización humana) | Cubre el **100 % de las 22 historias Must** priorizadas en el Hito 1 |
| [II. Arquitectura de frontend](docs/modulo-2-frontend.md) | Estructura en React, inventario de componentes, diseño responsivo y heurísticas de Nielsen | 19 piezas reutilizables y 14 páginas; escritorio y móvil; **8 de 10 heurísticas** |
| [III. Usabilidad y accesibilidad](docs/modulo-3-calidad.md) | Validación RITE, tabla de problema y cambio aplicado, y auditoría WCAG 2.2 | 11 usuarios reales; **7 de 8 hallazgos aplicados**; 0 violaciones de axe-core |
| [IV. Persistencia de soporte](docs/modulo-4-persistencia.md) | Esquema de datos mínimo, mapa de API y arquitectura | **6 tablas** y **28 endpoints**, cada uno ligado a una pantalla |
| [Informe de uso de IA](docs/informe-uso-ia.md) | Herramientas, uso por etapa, errores de la IA y cómo se detectaron | Claude y Antigravity; la IA propuso o implementó y el equipo decidió y verificó |

## Prototipo

**[https://atlas-sisinfo.vercel.app](https://atlas-sisinfo.vercel.app)**

- **Modo evaluación** (botón abajo a la izquierda): cambia de cuenta de demostración en un clic, muestra los correos simulados, reinicia los datos y marca sobre la pantalla qué historia de usuario cumple cada componente.
- **/evaluacion**: lista las 22 historias Must con su pantalla; «Abrir» entra con la cuenta adecuada.
- **En local:** `npm install` y `npm run dev` (http://localhost:5173). `npm test` ejecuta las 26 pruebas automáticas.

## Anexos

- [Reporte de validación de usabilidad](docs/reporte-validacion-usabilidad.md): tareas, registros, ficha RITE, análisis y referencias.
- [Prueba de prototipo - Atlas .xlsx](Prueba%20de%20prototipo%20-%20Atlas%20.xlsx): registros, cuestionario y cálculos estadísticos.
- [Videos de las sesiones con usuarios](https://drive.google.com/drive/folders/1zzHP633ZDwt_1zEWPy7KW0j9YW8DsSB1?usp=sharing).
- [Prompt inicial del prototipo](docs/prompt-inicial.md).
