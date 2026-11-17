# Auditoría de accesibilidad (WCAG 2.2) — Atlas

Informe básico de contrastes de color, tamaños de fuente y navegación por teclado.
Contribuye al **ABET Student Outcome 2**: diseñar soluciones que tengan en cuenta factores de bienestar y de contexto social; aquí, que el sistema de información pueda ser usado por personas con baja visión, daltonismo o que no usan mouse.

- **Fecha:** 16 de noviembre de 2026 (hallazgos y correcciones del mismo día)
- **Alcance:** aplicación Atlas (frontend), rutas públicas y de los roles estudiante, director y vicedecanatura.
- **Criterio de referencia:** WCAG 2.2, nivel AA.

## 1. Método y límites

| Frente | Cómo se evaluó |
|---|---|
| Contraste de color | Cálculo de la razón de contraste (fórmula WCAG) para 35 combinaciones de texto/fondo y componente/fondo que usa la interfaz. Umbrales: 4,5:1 texto normal, 3:1 componentes de interfaz y anillo de foco. |
| Tamaño de fuente | Revisión de la escala tipográfica en `tailwind.config.js` y búsqueda de tamaños fijos en el código. |
| Teclado y semántica | Revisión del código de cada patrón interactivo (diálogos, menús, pestañas, formularios, enlaces de salto, foco) y ejecución de **axe-core 4.10** sobre 10 pantallas (5 públicas y 5 con sesión de director o vicedecanatura). |

**Límites.** No se recorrió la aplicación con teclado ni con lector de pantalla reales, no se probó zoom al 200 % ni reflow a 320 px, y axe-core en un entorno simulado (jsdom) no mide contraste ni maquetación. Por eso la sección 6 deja una lista de pruebas manuales por completar. Los resultados de este informe son una línea base, no una certificación.

## 2. Resumen

| Resultado | Antes | Después de corregir |
|---|---|---|
| Violaciones automáticas (axe-core) | 1 en 10 pantallas | **0 en 11 pantallas** |
| Fallos reales de contraste | 7 | **0** (2 ya estaban resueltos antes de la auditoría y 5 se corrigieron) |
| Hallazgos de prioridad alta (H1 a H4) | 4 abiertos | **0** |
| Hallazgos de prioridad media (M1 a M4) | 4 abiertos | **0** |
| Prioridad baja | 2 | 1 corregido (B1) y 1 pendiente de decisión (B2) |

Se midieron 35 combinaciones de contraste y se excluyeron 3 por no aplicar (decorativas o no usadas como texto; ver 3.2).

Lo esencial está bien: todo el texto de lectura supera 4,5:1 (el menor es 4,83:1), el cuerpo mide 16 px y el mínimo es 14 px, hay enlace de salto, puntos de referencia, un `h1` por página y todos los campos tienen etiqueta. Los problemas encontrados se concentraban en **indicadores visuales de foco sobre fondos oscuros, bordes de campos y el comportamiento de teclado de diálogos, menús y pestañas**, y quedaron corregidos (secciones 3.2 y 5.2).

## 3. Contraste de color

### 3.1 Pares que cumplen

| Par | Razón | Mínimo |
|---|---|---|
| Texto principal / fondo de página | 14,54:1 | 4,5 |
| Texto principal / blanco | 16,00:1 | 4,5 |
| Gris secundario / blanco | 6,97:1 | 4,5 |
| Gris secundario / fondo de página | 6,33:1 | 4,5 |
| Verde oscuro (enlaces) / blanco | 6,11:1 | 4,5 |
| Verde oscuro (enlaces) / fondo de página | 5,55:1 | 4,5 |
| Rojo (errores) / blanco | 7,42:1 | 4,5 |
| Rojo / fondo de página | 6,74:1 | 4,5 |
| Vino / fondo de página | 9,30:1 | 4,5 |
| Botón primario: blanco / verde oscuro | 6,11:1 | 4,5 |
| Botón de peligro: blanco / rojo | 7,42:1 | 4,5 |
| Botón verde: texto / verde | 6,74:1 | 4,5 |
| Header: blanco / gris `#4D4D4D` | 8,45:1 | 4,5 |
| Barra superior: blanco / `#6B6B6B` | 5,33:1 | 4,5 |
| Footer: blanco / `#5F5F5F` | 6,39:1 | 4,5 |
| Footer: blanco 90 % / `#5F5F5F` | 5,55:1 | 4,5 |
| Placeholder (ahora `gray-500`) / blanco | 4,83:1 | 4,5 |
| Foco sobre contenido: verde oscuro / blanco y fondo | 6,11 y 5,55:1 | 3 |

### 3.2 Pares que fallan

| Par | Razón (antes → después) | Criterio | Estado |
|---|---|---|---|
| Placeholder (antes `gray-400`) / blanco | 2,54:1 → 4,83:1 | 1.4.3 | **Corregido** |
| Buscador del header, placeholder blanco 80 % / `#676767` | 4,33:1 | 1.4.3 | **Eliminado** (se quitó la búsqueda del header) |
| Anillo de foco sobre el header `#4D4D4D` | 1,38:1 → 8,45:1 (anillo blanco) | 1.4.11, 2.4.7 | **Corregido** (H1) |
| Anillo de foco sobre el footer `#5F5F5F` | 1,04:1 → 6,39:1 (anillo blanco) | 1.4.11, 2.4.7 | **Corregido** (H1) |
| Borde de campos de formulario / blanco | 2,13:1 → 6,97:1 | 1.4.11 | **Corregido** (H3) |
| Iconos de redes / círculo | 2,38:1 → 6,69:1 (icono blanco sobre `#5C5C5C`) | 1.4.11 | **Corregido** (M3) |
| Texto del menú al pasar el cursor: verde `#94B43B` / header | 3,56:1 → el texto ya no cambia de color (se subraya) | 1.4.3 (estado hover) | **Corregido** (B1) |

Se excluyen tres combinaciones que midieron bajo pero no aplican: los bordes de las tarjetas (1,56:1, decorativos; el contenido se identifica sin ellos), el icono de ubicación del header (3,97:1, decorativo y oculto a lectores de pantalla) y el verde claro `#94B43B` sobre blanco (2,37:1), que no se usa como color de texto sobre fondo claro.

## 4. Tamaños de fuente

| Nivel | Tamaño actual | Antes |
|---|---|---|
| Título de página (`h1`) | 30 px, negrita | 20 px, mayúsculas |
| Sección (`h2`) | 20 px | 16 px, mayúsculas |
| Subsección y tarjeta (`h3`) | 18 px | 16 px |
| Cuerpo, botones, campos (`text-sm`) | **16 px**, peso 500 | 14 px, peso 400 |
| Texto secundario (`text-xs`) | **14 px** | 12 px |

- **Mínimo actual: 14 px** en todo el texto de lectura.
- **Excepción pendiente (B3):** los ejes del gráfico del Tablero, a 10 y 11 px.
- **Excepción:** el texto «UNIVERSIDAD / DE COLOMBIA» del logotipo del header (9 y 11 px, [Header.tsx:51-53](../src/components/Header.tsx#L51-L53)). Es un logotipo y WCAG exime a los logotipos del requisito de contraste; se deja como está salvo decisión del equipo.
- El viewport permite zoom (no hay `user-scalable=no`). El panel de accesibilidad ofrece escala de texto del 85 % al 150 % y un modo de alto contraste.
- **Pendiente de probar:** reflow a 320 px y zoom al 200 % (criterios 1.4.4 y 1.4.10).

## 5. Navegación por teclado y semántica

### 5.1 Lo que funciona

| Aspecto | Evidencia |
|---|---|
| Enlace «Saltar al contenido» | [Layout.tsx:20](../src/components/Layout.tsx#L20), visible al recibir foco. |
| Puntos de referencia | `header`, `nav` («Principal», «Ruta de navegación», «Paginación»), `main`, `footer`. |
| Orden de encabezados | `h1` → `h2` → `h3` sin saltos (se corrigió en Explorar durante este ciclo). |
| Indicador de foco global | 3 px, desplazado 2 px, en enlaces, botones y campos ([index.css:10](../src/index.css#L10)). |
| Sin trampas ni tabindex positivos | Solo hay `tabIndex={-1}` (para mover el foco por código). |
| Controles nativos | No hay `div` o `span` con `onClick`; todo es `button`, `a` o `input`. |
| Diálogos | Escape cierra y devuelve el foco al elemento anterior. |
| Etiquetas | Todos los campos tienen `label` o `aria-label`. |
| Tablas | `caption` y `th scope="col"`. |
| Imágenes | Todas con `alt`; las decorativas con `alt=""` y `aria-hidden`. |
| Idioma | `<html lang="es-CO">`. |
| Anuncios | Resultados de búsqueda en región `aria-live`; errores con `role="alert"`. |
| axe-core | 0 violaciones en 9 de 10 pantallas. |

### 5.2 Hallazgos y correcciones

**Prioridad alta**

| # | Hallazgo | Criterio | Corrección aplicada |
|---|---|---|---|
| **H1** | El anillo de foco verde oscuro era casi invisible sobre el header y el footer (1,38:1 y 1,04:1). | 2.4.7, 1.4.11 | En [index.css](../src/index.css), el anillo es blanco dentro de `header` y `footer`, y verde oscuro dentro de los menús blancos. **Corregido.** |
| **H2** | `Dialog` declaraba `aria-modal="true"` pero no atrapaba el foco: Tab salía hacia la página de fondo. | 2.4.3, 4.1.2 | [UI.tsx](../src/components/UI.tsx): Tab y Shift+Tab ciclan dentro del diálogo. Prueba automática en [accesibilidad.test.tsx](../src/__tests__/accesibilidad.test.tsx). **Corregido.** |
| **H3** | El borde de los campos tenía 2,13:1 contra el blanco. | 1.4.11 | `.input` usa ahora el gris oscuro (6,97:1). **Corregido.** |
| **H4** | Los errores no estaban vinculados al campo (faltaban `aria-invalid` y `aria-describedby`). Era el hallazgo A4 del README. | 3.3.1, 4.1.2 | `Campo` ([UI.tsx](../src/components/UI.tsx)) vincula automáticamente el error o la ayuda con el control; los dos errores sueltos (Ingresar y WhatsApp) se vincularon a mano. Con pruebas automáticas. **Corregido.** |

**Prioridad media**

| # | Hallazgo | Criterio | Corrección aplicada |
|---|---|---|---|
| M1 | El menú de usuario declaraba `role="menu"` sin las flechas ni la gestión de foco de ese patrón. | 4.1.2, 2.1.1 | [Header.tsx](../src/components/Header.tsx): al abrir, el foco va al primer elemento; flechas, Inicio y Fin se mueven; Escape cierra y devuelve el foco al botón; la flecha abajo abre el menú. **Corregido.** |
| M2 | Las pestañas de «Mis datos y privacidad» usaban `role="tab"` sin flechas, sin `tabindex` rotativo ni `aria-controls`. | 4.1.2, 2.1.1 | [MiCuenta.tsx](../src/pages/MiCuenta.tsx): flechas, Inicio y Fin cambian de pestaña y mueven el foco; solo la pestaña activa está en el orden de Tab; cada pestaña controla un `tabpanel`. **Corregido.** |
| M3 | Los iconos de redes tenían 2,38:1. | 1.4.11 | Icono blanco sobre círculo `#5C5C5C` (6,69:1). **Corregido.** |
| M4 | El gráfico del Tablero ponía `aria-label` en un `div` sin rol (violación de axe). | 4.1.2 | `role="img"`. **Corregido.** |

**Prioridad baja**

| # | Hallazgo | Estado |
|---|---|---|
| B1 | Al pasar el cursor, el texto del menú pasaba a verde claro (3,56:1). | **Corregido:** ahora se subraya y el texto no cambia de color. |
| B2 | Navegación y pestañas en mayúsculas sostenidas, que cuestan más de leer. No es un criterio WCAG. | Pendiente de decisión del equipo. |

**Detectados en la revisión del 17 de noviembre**

| # | Hallazgo | Criterio | Estado |
|---|---|---|---|
| M5 | Al pasar de un paso a otro en la postulación, el foco vuelve al inicio de la página en lugar de ir al título del nuevo paso ([Postular.tsx](../src/pages/Postular.tsx)). | 2.4.3 | Pendiente: dar `tabIndex={-1}` al título del paso y enfocarlo al cambiar de paso. |
| B3 | Los ejes del gráfico del Tablero miden 10 y 11 px ([Tablero.tsx](../src/pages/Tablero.tsx)). | 1.4.4 (práctica) | Pendiente: subirlos a 12 px o más. |

## 6. Pruebas manuales pendientes

Las correcciones de las secciones 3 y 5 se verificaron con cálculo de contraste, axe-core y pruebas automáticas, pero no con una persona usando el teclado ni un lector de pantalla. Para cerrar la auditoría:

1. **Teclado:** recorrer con Tab y Shift+Tab Explorar, ficha, postulación (3 pasos) y edición de ficha; comprobar orden lógico, foco siempre visible (incluido el anillo blanco en header y footer) y salida de todos los diálogos con Escape. Probar también el menú de usuario y las pestañas de Mis datos con las flechas.
2. **Lector de pantalla** (VoiceOver en macOS): anuncio de resultados al buscar, de errores de formulario y de los diálogos.
3. **Zoom al 200 % y ventana de 320 px:** sin pérdida de contenido ni desplazamiento horizontal.
4. **Contraste en estados** `hover`, `disabled` y modo de alto contraste, con una herramienta como el selector de color de las herramientas de desarrollo.
5. **Repetir axe o Lighthouse en el navegador** sobre la versión desplegada, que sí mide contraste.

## 7. Cambios de accesibilidad ya aplicados en este ciclo

| Cambio | Antes | Después |
|---|---|---|
| Placeholder de los campos | 2,54:1 | 4,83:1 |
| Tamaño de texto de cuerpo y secundario | 14 y 12 px | 16 y 14 px |
| Peso del texto | 400 con suavizado en grises | 500 |
| Jerarquía tipográfica | Títulos en mayúsculas de 16 a 20 px | Tres niveles de 30, 20 y 18 px |
| Orden de encabezados en Explorar | `h1` → `h3` | `h1` → `h2` → `h3` |
| Indicadores de estado | Cajas con aspecto de botón | Texto de color con punto |
| Salida de formularios | Sin cancelar ni aviso | Botón «Cancelar» y aviso de cambios sin guardar |
| Resultados de búsqueda | Sin aviso de actualización | Encabezado visible, desplazamiento y foco |
| Imágenes | Sin dimensiones | Con ancho y alto (evita saltos de diseño) |
| Foco visible en header y footer | 1,38:1 y 1,04:1 | Anillo blanco (8,45:1 y 6,39:1) |
| Borde de campos | 2,13:1 | 6,97:1 |
| Diálogos | El foco podía salir | Foco atrapado dentro del diálogo |
| Errores de formulario | Sin vínculo al campo | `aria-invalid` y `aria-describedby` |
| Menú de usuario y pestañas de Mis datos | Roles ARIA sin teclado | Patrón ARIA completo con flechas |

## 8. Pendiente

1. Pruebas manuales de la sección 6 (teclado, lector de pantalla, zoom al 200 %).
2. Decidir B2 (mayúsculas en la navegación) y corregir M5 (foco al cambiar de paso) y B3 (ejes del gráfico).
3. Repetir Lighthouse o axe en el navegador sobre la versión desplegada, que sí mide contraste en estados reales.
