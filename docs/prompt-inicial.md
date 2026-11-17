[← Volver al Módulo I](modulo-1-prototipo.md#prompt-inicial)

# Prompt inicial del prototipo

Primer mensaje enviado a Claude para generar el prototipo de Atlas (Módulo I). Las pantallas reales se pidieron en mensajes posteriores.

> Construye "Atlas", un prototipo web interactivo de alta fidelidad (React 18 con Vite, TypeScript, React Router, Tailwind CSS, shadcn/ui, lucide-react y recharts; NO uses Next.js). Atlas es el sistema de información de semilleros de investigación de la Facultad de Ingeniería de la Universidad Nacional de Colombia (UNAL): catálogo de semilleros, convocatorias y postulación en línea. Es complementario a Hermes (el sistema oficial de la universidad) y no lo reemplaza.
>
> Es un PROTOTIPO NAVEGABLE, no una imagen: no hay backend. Todo el comportamiento se simula con estado en el cliente (React Context) y datos de ejemplo. Toda la interfaz está en español de Colombia.
>
> **=== 1. IDENTIDAD VISUAL UNAL (obligatoria) ===**
> Tokens de color (variables CSS + extensión de Tailwind):
> - unal-verde (institucional): #94B43B (RGB 148,180,59 / Pantone 376 C)
> - unal-rojo (alterno): #A61C31 (RGB 166,28,49 / Pantone 187 C)
> - unal-verde-oscuro: #466B3F (RGB 70,107,63 / Pantone 7743 C)
> - unal-vino: #76232F (RGB 118,35,47 / Pantone 188 C)
> - unal-gris-oscuro: #565A5C (RGB 86,90,92 / Pantone 425 C)
> - unal-gris-claro: #B1B2B0 (RGB 177,178,176 / Pantone 421 C)
> - Texto: casi negro (#1F2224) y blanco. Fondo de página: blanco y gris muy claro (#F4F4F3).
>
> Reglas de uso:
> - Verde institucional = color de acción (botones primarios, indicadores positivos, estado "Abierta"). Para TEXTO verde sobre fondo claro usa unal-verde-oscuro (contraste AA).
> - Rojo alterno solo para errores, alertas, estados críticos y acciones destructivas.
> - Vino y grises para jerarquía secundaria, bordes y estados neutros ("Cerrada", "Precargada").
> - NO inventes otros colores de marca ni degradados.
>
> Tipografía: Ancízar Sans (tipografía institucional UNAL, disponible en Google Fonts como "Ancizar Sans"); si no carga, usa sans-serif del sistema. Títulos en semibold. Encabezados de sección en MAYÚSCULAS con tracking amplio y peso bold, como "COLOR INSTITUCIONAL" en la guía.
> Estilo: sobrio e institucional; esquinas poco redondeadas (4 px), sombras mínimas, iconos de línea, mucho espacio en blanco, contraste WCAG AA, foco de teclado visible.
>
> **=== 2. HEADER (replica el de unal.edu.co; ver imagen adjunta) ===**
> - Barra superior delgada en gris. Alineados a la derecha: Aspirantes | Estudiantes | Egresados | Docentes | Administrativos (separados por divisores finos) y selector "ESP" con flecha.
> - Barra principal en gris oscuro (#4D4D4D). A la izquierda, un bloque más oscuro y alto que sobresale hacia abajo con el escudo UNAL (usa la imagen adjunta; si no la hay, un placeholder circular claramente marcado) y el texto "UNIVERSIDAD NACIONAL DE COLOMBIA". A su derecha: icono de ubicación y el nombre "Atlas · Semilleros de Ingeniería" en tamaño grande.
> - Menú principal en MAYÚSCULAS, blanco, con flechita donde haya submenú. Cambia según el rol (ver sección 4).
> - A la derecha: campo "Buscar semilleros" con lupa (fondo gris claro; al enviar lleva al catálogo con la búsqueda) y el control de sesión ("Iniciar sesión" o menú de usuario).
> - Botón "Panel de Accesibilidad" flotante bajo el header, a la derecha (como en unal.edu.co), que abre un panel simple: aumentar/disminuir texto y alto contraste.
> - Header fijo al hacer scroll; en móvil, menú hamburguesa.
>
> **=== 3. FOOTER (replica el de unal.edu.co; ver imagen adjunta) ===**
> Fondo gris (#5F5F5F), texto blanco pequeño, enlaces sin subrayado (subrayan al pasar el cursor). Distribución en una fila:
> - Columna 1: Régimen Legal, Contratación, Rendición de cuentas, Pago virtual, Calidad
> - Columna 2: Talento humano, Ofertas de empleo, Concurso docente, Control interno, Buzón de notificaciones
> - Columna 3: Correo institucional, Redes sociales, Quejas y reclamos, Encuesta, Estadísticas
> - Columna 4: Mapa del sitio, Preguntas frecuentes, Servicios en línea, Contáctenos, Glosario
> - Separador vertical y bloque "Contacto página web:" Carrera 45 # 26-85, Edif. Uriel Gutiérrez - Bogotá D.C., Colombia / PBX: (+57) 601 4068888 - (+57) 601 3165000 / Línea Gratuita Nacional: 01 8000 912 597
> - Bloque derecho alineado a la derecha: "© Copyright 2021 Algunos derechos reservados." / Contáctenos / Acerca de este sitio web / "Actualización: 04/11/2026"
> - Al extremo derecho: badges "Orgullo UNAL" y "Agencia UNAL" (usa las imágenes adjuntas o placeholders marcados) y el sello gov.co.
>
> Los enlaces del footer pueden apuntar a "#". En móvil, las columnas se apilan.
>
> **=== 4. ROLES Y SESIÓN SIMULADA ===**
> Roles: visitante (sin sesión), estudiante, director de semillero, Vicedecanatura.
> - NUNCA muestres campos de contraseña: Atlas no almacena contraseñas. El inicio de sesión simula "Iniciar sesión con Google": un modal "Elige una cuenta" con estas cuentas de demostración y la opción "Usar otra cuenta" (campo de correo):
>   - estudiante.demo@unal.edu.co (estudiante)
>   - director.demo@unal.edu.co (director del semillero "Robótica y Control Móvil")
>   - director2.demo@unal.edu.co (director de otro semillero)
>   - vicedecanatura.demo@unal.edu.co (Vicedecanatura)
>   - externo.demo@gmail.com (dominio no institucional, para probar el rechazo)
> - El rol se deduce del correo: si coincide con el correo de director de alguna ficha es director; si es el correo de Vicedecanatura, ese rol; cualquier otro @unal.edu.co es estudiante; cualquier otro dominio se rechaza.
> - Menú del header por rol:
>   - visitante/estudiante: EXPLORAR · CÓMO FUNCIONA
>   - director: EXPLORAR · MI SEMILLERO · POSTULACIONES · CONVOCATORIA
>   - Vicedecanatura: TABLERO · EXPLORAR
> - Menú de usuario (avatar con correo y chip del rol): "Mis datos y privacidad" (solo estudiante), "Cerrar sesión".
>
> **=== 5. DATOS DE EJEMPLO (ficticios; nada de personas reales) ===**
> Crea /data/semilleros.ts con 26 semilleros de Ingeniería, ordenables alfabéticamente (tildes bien manejadas), para que el catálogo muestre 20 en la página 1 y 6 en la página 2. Cada uno:
> `{ id, nombre, descripcion, linea, area, director: { nombre (ficticio), correo (@unal.edu.co) }, requisitos, convocatoria: { abierta, cierre (fecha), cupos, aceptados }, estadoFicha: "Verificada" | "Precargada", actualizadoEn, contactoPublico?: { telefono?, whatsapp?, autorizadoPublicar } }`
> Lista cerrada de áreas: Inteligencia artificial, Robótica y control, Ingeniería de software, Redes y telecomunicaciones, Energía y sostenibilidad, Bioingeniería, Ciencia de datos, Electrónica, Materiales, Estructuras y construcción.
> Mezcla: ~12 con convocatoria abierta y ~14 cerrada; ~14 "Verificada" y ~12 "Precargada"; 2 fichas con campos vacíos (requisitos y línea); 3 fichas con actualizadoEn de más de 6 meses; solo 2 fichas Verificadas con contactoPublico autorizado; las demás sin teléfono ni WhatsApp. "Robótica y Control Móvil" pertenece a director.demo (convocatoria abierta, 5 cupos) y otro semillero a director2.demo.
> También crea postulaciones semilla (17 en el semestre actual 2026-2 y 15 en el anterior 2026-1, de estudiantes ficticios), autorizaciones registradas y 1 postulación semilla sin autorización registrada (para el tablero).
>
> **=== 6. ESTADO Y REGLAS TRANSVERSALES ===**
> - Un AppContext (sesión, perfil del estudiante, declaraciones de edad, registro de autorizaciones y revocaciones { usuario, finalidad, versionAviso, fechaHora, estado }, postulaciones, semilleros, bandeja de correos simulados, bitácora de accesos). Se reinicia al recargar.
> - "Correos": cuando una historia diga que se envía un correo, muestra un toast "Correo enviado a …" y guarda el correo en la bandeja simulada.
> - Todas las pantallas tienen estados de carga (skeleton máximo 300 ms), vacío y error.
> - Los dos textos de privacidad (aviso y autorización) tienen versión "v1.0".
> - Nunca muestres, pidas ni guardes datos sensibles (edad, género, origen, promedio, estrato, salud, religión).
> - Responsive (móvil, tablet, escritorio), navegación por teclado y etiquetas ARIA.
>
> **=== 7. PANEL DE DEMOSTRACIÓN (solo para evaluar el prototipo) ===**
> Botón flotante discreto abajo a la izquierda, con rótulo "Modo evaluación", que abre un panel con: (a) cambiar de cuenta de demostración en un clic, (b) bandeja de correos simulados, (c) interruptor "Mostrar etiquetas de historias de usuario" que dibuja chips pequeños (por ejemplo "HU-04") sobre los componentes que cumplen cada historia, (d) "Reiniciar datos".
>
> **=== 8. RUTAS ===**
> / (Explorar) · /semilleros/[id] · /ingresar · /postular/[id] · /postulacion/[numero] · /mi-cuenta · /director · /director/ficha · /director/convocatoria · /director/postulaciones · /director/postulaciones/[id] · /vicedecanatura/tablero · /como-funciona · /evaluacion (se completa al final)
> Una ruta sin permiso muestra una pantalla "No tienes permiso para ver esta página" con botón para volver al catálogo.
>
> **=== ENTREGA DE ESTE PRIMER MENSAJE ===**
> Construye SOLO: tokens, layout con header y footer, AppContext, datos de ejemplo, panel de demostración, inicio de sesión simulado (selector de cuenta, sin reglas de rechazo todavía) y las rutas con pantallas "En construcción". Las pantallas reales se construirán en los siguientes mensajes; no las anticipes.
