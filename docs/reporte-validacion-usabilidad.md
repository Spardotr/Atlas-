# REPORTE DE VALIDACIÓN DE USABILIDAD

## 1. Diseño de la prueba

| Aspecto | Detalle |
|---|---|
| Participantes | 11 usuarios reales: 10 estudiantes de pregrado (U1 a U11; el código U8 no se asignó) y 1 docente director de semillero (D1). Los estudiantes cursaban octavo semestre, salvo uno de décimo, y 6 de los 10 habían participado antes en un semillero. El mínimo exigido era de 2 usuarios. |
| Fechas | 12 y 15 de noviembre de 2026 |
| Modalidad | Mixta: sesiones presenciales y remotas, sobre el prototipo desplegado en atlas-sisinfo.vercel.app |
| Consentimiento | Cada participante dio su consentimiento verbal, al inicio de la grabación, para ser grabado y para el uso de sus respuestas. Los participantes se identifican solo por código. |
| Protocolo | Tareas sin pistas. Por cada tarea se registraron el tiempo, los clics y si el usuario necesitó ayuda; la ficha RITE recoge las frases literales. Al final, cada estudiante respondió un cuestionario Likert de 1 a 5. |
| Regla RITE | Un hallazgo de gravedad 4 se corrige antes del siguiente usuario; los de gravedad 1 a 3 se priorizan para la siguiente iteración. |

## 2. Tareas de los estudiantes

| Tarea | Instrucción al usuario (sin pistas) | Se considera completada cuando… | Historias |
|---|---|---|---|
| T1. Buscar | Encuentra un semillero relacionado con un tema que te interese (por ejemplo, robótica). | El usuario abre la ficha de un semillero desde el catálogo o el buscador. | HU-01, HU-02 |
| T2. Informarse | Averigua quién dirige ese semillero, cómo contactarlo y qué requisitos pide. | El usuario identifica en la ficha al director, su correo y los requisitos. | HU-04 |
| T3. Convocatoria | Averigua si el semillero tiene convocatoria abierta, hasta cuándo puedes aplicar y cuántos cupos hay. | El usuario dice la fecha de cierre y los cupos correctos, o reconoce que la convocatoria está cerrada. | HU-12 |
| T4. Postularse | Postúlate al semillero. | El usuario pasa por el inicio de sesión con correo @unal.edu.co, la declaración de mayoría de edad y la autorización de datos, envía el formulario y ve «Postulación enviada» con un número. | HU-08, HU-15, HU-16, HU-17 |

## 3. Tareas del docente director

| Tarea | Instrucción al usuario (sin pistas) | Se considera completada cuando… | Historias |
|---|---|---|---|
| TD1. Verificar ficha | Entra a Atlas como director y confirma que la ficha de tu semillero es correcta. | El usuario inicia sesión, ve el panel de su semillero y la ficha pasa a «Verificada» con fecha. | HU-09, HU-29 |
| TD2. Editar | Actualiza la descripción y los requisitos de tu semillero. | El usuario guarda el cambio y lo ve reflejado de inmediato en la ficha. | HU-30 |
| TD3. Convocatoria | Abre una convocatoria para recibir postulaciones durante dos semanas, con 5 cupos. | La convocatoria queda abierta con la fecha de cierre y los cupos correctos. | HU-32 |
| TD4. Decidir | Revisa la postulación que llegó a tu semillero y responde al estudiante. | El usuario abre la postulación, ve solo los datos del formulario y registra aceptar o rechazar. | HU-19 |

## 4. Registros

| Usuario | Tarea | Resultado | Tiempo (s) | Clics |
|---|---|---|---|---|
| U1 | T1 | Sin ayuda | 30 | 2 |
| | T2 | Sin ayuda | 10 | 0 |
| | T3 | Sin ayuda | 3 | 0 |
| | T4 | Sin ayuda | 55 | 15 |
| U2 | T1 | Sin ayuda | 70 | 8 |
| | T2 | Sin ayuda | 1 | 0 |
| | T3 | Sin ayuda | 3 | 0 |
| | T4 | Sin ayuda | 25 | 15 |
| U3 | T1 | Sin ayuda | 10 | 2 |
| | T2 | Sin ayuda | 5 | 0 |
| | T3 | Sin ayuda | 3 | 0 |
| | T4 | Sin ayuda | 35 | 17 |
| U4 | T1 | Sin ayuda | 60 | 8 |
| | T2 | Sin ayuda | 5 | 1 |
| | T3 | Sin ayuda | 3 | 0 |
| | T4 | Sin ayuda | 60 | 16 |
| U5 | T1 | Sin ayuda | 10 | 2 |
| | T2 | Sin ayuda | 3 | 0 |
| | T3 | Sin ayuda | 4 | 0 |
| | T4 | Sin ayuda | 41 | 16 |
| U6 | T1 | Sin ayuda | 47 | 5 |
| | T2 | Sin ayuda | 2 | 0 |
| | T3 | Sin ayuda | 2 | 0 |
| | T4 | Sin ayuda | 45 | 16 |
| U7 | T1 | Sin ayuda | 30 | 2 |
| | T2 | Sin ayuda | 5 | 0 |
| | T3 | Sin ayuda | 3 | 0 |
| | T4 | Sin ayuda | 73 | 17 |
| U9 | T1 | Sin ayuda | 20 | 1 |
| | T2 | Sin ayuda | 5 | 0 |
| | T3 | Sin ayuda | 5 | 0 |
| | T4 | Sin ayuda | 55 | 16 |
| U10 | T1 | Sin ayuda | 61 | 21 |
| | T2 | Sin ayuda | 12 | 0 |
| | T3 | Sin ayuda | 10 | 0 |
| | T4 | Sin ayuda | 82 | 16 |
| U11 | T1 | Sin ayuda | 98 | 7 |
| | T2 | Sin ayuda | 4 | 0 |
| | T3 | Sin ayuda | 5 | 0 |
| | T4 | Sin ayuda | 78 | 20 |
| D1 | TD1 | Con ayuda | 120 | 7 |
| | TD2 | Con ayuda | 40 | 4 |
| | TD3 | Sin ayuda | 50 | 12 |
| | TD4 | Sin ayuda | 30 | 5 |

## 5. Ficha RITE

| ID | Usuario · Tarea | Hallazgo | Gravedad (1-4) | Hipótesis de solución | ¿Corregido antes del siguiente usuario? |
|---|---|---|---|---|---|
| P01 | U2 · T1: Buscar semillero de interés | Dificultad en el manejo de búsquedas anteriores: incomodidad por la persistencia de consultas previas al intentar hacer una nueva búsqueda. Manifiesta literalmente: «Es que si busco algo acá, de pronto que se eliminen las anteriores o que aparezcan lo que estoy buscando». | 2 | Incorporar un botón de limpieza rápida («×») en el campo de texto y asegurar que el listado de resultados se actualice limpiamente al ingresar un nuevo término. | No |
| P02 | U4 · T1: Buscar semillero de interés | Desorientación inicial sobre las categorías disponibles: no sabe si buscar por tema o por nombre («¿puedo buscar por tema… o tengo que buscar el nombre?») y la búsqueda no arroja resultados («no carga, no hay semilleros para mi área de interés»). Comenta literalmente: «al principio no es tan intuitivo los campos que están disponibles para los semilleros, sería como que dejen más claro o que la barra de búsqueda sea algo secundario y no lo principal». | 3 | Hacer visibles y destacadas las áreas temáticas en la pantalla inicial para dar contexto antes de la búsqueda, o reducir el protagonismo visual de la barra de búsqueda. | No |
| P03 | U6 · T1: Buscar y filtrar semilleros | Percepción de que los filtros se anulan entre sí y de que están mal ubicados: los filtros quedan al final y cree que, al seleccionar un área temática, se anula la palabra clave ingresada. Señala literalmente: «que no salgan como ahí abajo, sino en un lateral… que cuando uno selecciona por área no invalide el filtro por palabra, dar la opción de manejar ambas». | 3 | Mover los filtros a un panel lateral fijo y permitir el filtrado combinado (palabra clave y área temática, por separado o juntas). | No |
| P04 | U7 · T1: Buscar semillero de interés | Falta de asistencia predictiva en la búsqueda: sensación de buscar «a ciegas» cuando no conoce los términos exactos («a veces uno llega así en blanco»). Sugiere literalmente: «una sugerencia para el buscador es que puedan hacer el autocompletado, que con solo escribir algunas palabras, él ya empiece a mostrar como Google, uno ya se hace una idea de qué es lo que hay». | 2 | Implementar autocompletado que despliegue sugerencias a medida que el usuario escribe. | No |
| P05 | D1 · TD1: Verificar y editar la ficha del semillero | Ambigüedad en el nombre de la acción principal para tomar control de la ficha. Comenta literalmente: «La primera vez no entendía, creo que es crear ficha, no reclamar ficha… la palabra suya fue verificar, no confirmar». Además, los datos de contacto ingresados (como el teléfono) no se reflejaban de inmediato en la ficha. | 2 | Cambiar el nombre del botón por uno más claro (por ejemplo, «Administrar ficha» o «Vincular semillero») y garantizar que la ficha refleje los cambios de contacto al guardar. | No |
| P06 | U10 · T2: Verificar requisitos | En el apartado de requisitos aparece «Sin información», lo que genera ambigüedad: no se sabe si la convocatoria no tiene requisitos o si existen y no se cargaron en la plataforma. | 2 | Especificar si el semillero no tiene la información cargada o, de ser el caso, que es de entrada libre (sin requisitos previos). | No |
| P07 | U10 · T1: Buscar y filtrar semilleros | Las áreas temáticas ocupan mucho espacio y le restan visibilidad a los semilleros; sugiere ocultarlas tras un botón. Frase literal: «se ve muy abierto y pues te pierdes lo que es los semilleros». También percibe el diseño como poco personal: «entiendo que el diseño es el de la página de la universidad, pero parece muy sobrio, parece un plato de pechuga con arroz». | 2 | Validar con los demás usuarios si el espacio de las áreas es un problema. La sobriedad visual responde a la identidad institucional. Se clasifica como 2 y no como 1 (estético) porque afecta la visibilidad de los resultados. | No |
| P08 | U11 · T1: Buscar semillero por área específica | Pantalla vacía y sin sugerencias ante búsquedas sin coincidencia exacta: al ingresar términos como «bioingeniería» o «ingeniería» no obtiene resultados ni alternativas («Tampoco hay. ¿Qué hago?»). Recomienda literalmente: «que cuando uno realiza la búsqueda del interés y uno no encuentra, que sí haga sugerencias de los que están, pero relacionados como con ese tema». | 3 | Incorporar búsqueda aproximada y mostrar áreas o semilleros afines cuando una consulta no devuelva resultados. | No |

Ningún hallazgo fue de gravedad 4; por eso, según la regla RITE, no fue necesario modificar el prototipo entre un usuario y el siguiente. Los cambios aplicados después de la ronda de pruebas se documentan en la sección 3.2 del [Módulo III](modulo-3-calidad.md#32-problema-detectado-vs-cambio-aplicado-en-el-prototipo).

## 6. Rúbrica de gravedad

| Nivel | Significado | Acción |
|---|---|---|
| 1 | Problema estético | No se arregla, a menos que sobre tiempo en el proyecto. |
| 2 | Pequeño problema de usabilidad | Se arregla con baja prioridad. |
| 3 | Problema importante de usabilidad | Se arregla con alta prioridad. |
| 4 | Catástrofe de usabilidad | Se arregla antes del siguiente usuario (regla RITE). |

## 7. Resultados

Los datos completos están en el archivo de Excel adjunto.

**Estudiantes (n = 10).** Todos completaron las 4 tareas sin ayuda.

| Tarea | Tiempo: mediana (mín.–máx.) | Clics: mediana | Clics: mínimo observado |
|---|---|---|---|
| T1. Buscar | 38,5 s (10–98) | 3,5 | 1 |
| T2. Informarse | 5 s (1–12) | 0 | 0 |
| T3. Convocatoria | 3 s (2–10) | 0 | 0 |
| T4. Postularse | 55 s (25–82) | 16 | 15 |

**Director (n = 1).** Completó las 4 tareas y necesitó ayuda en 2 (TD1 y TD2). Como hubo un solo director, sus clics observados son: TD1, 7; TD2, 4; TD3, 12; TD4, 5.

**Cuestionario (estudiantes, escala de 1 a 5).** Mide cuatro constructos: la facilidad de uso y la utilidad percibidas, del modelo de aceptación tecnológica (TAM), y la calidad y la satisfacción, del modelo de éxito de sistemas de información de DeLone y McLean, siguiendo la integración de ambos modelos propuesta por Legramante et al. (2023).

| Constructo | Media |
|---|---|
| Facilidad de uso percibida | 4,50 |
| Utilidad percibida | 4,57 |
| Calidad percibida | 4,33 |
| Satisfacción | 4,50 |

## 8. Análisis

Se analizaron los resultados de cada instrumento por separado y luego se cruzaron, para contrastar lo que ambos dicen sobre la percepción de los usuarios.

Los 10 estudiantes completaron las 4 tareas sin ayuda y ningún hallazgo fue de gravedad 4, de modo que no fue necesario modificar el prototipo antes de probarlo con el siguiente usuario.

Los cuatro constructos del cuestionario puntuaron entre 4,33 y 4,57 sobre 5, lo que indica, en general, un desempeño positivo del prototipo.

Se identificaron 8 hallazgos; 6 de ellos (P01, P02, P03, P04, P07 y P08) se refieren a la tarea de búsqueda (T1). La mitad de los estudiantes tardó más de 45 segundos en esa tarea, y cada uno de ellos reportó un problema de búsqueda. La facilidad de uso percibida de esos 5 estudiantes promedió 4,23, frente a 4,77 de los otros cinco.

Se calculó el coeficiente de correlación de Spearman, adecuado para muestras pequeñas y respuestas ordinales, entre el número total de clics y la facilidad de uso percibida (n = 10 estudiantes). Se obtuvo ρ = −0,74 con un valor p de 0,014: con un nivel de significancia de 0,05, el resultado es estadísticamente significativo y existe una correlación negativa entre las dos variables. A mayor cantidad de clics, menor facilidad de uso percibida. Este resultado es valioso porque muestra que ambos instrumentos apuntan en la misma dirección: los usuarios que necesitaron más clics para completar las tareas también percibieron el prototipo como algo más difícil de usar.

También se midió la correlación de los clics con los otros constructos y la del tiempo con la facilidad de uso, pero ninguna fue estadísticamente significativa: clics y calidad (ρ = −0,42; p = 0,23), clics y utilidad (ρ = −0,39; p = 0,26), clics y satisfacción (ρ = 0,06; p = 0,88), y tiempo y facilidad (ρ = 0,11; p = 0,76). Por eso no se afirma que existan otras relaciones. La razón principal es el tamaño de la muestra: al tratarse de una prueba piloto, la prioridad era identificar las fallas críticas antes de escalar el prototipo.

La ficha RITE registra las frases literales y las hipótesis de solución de todos los hallazgos, orientadas a mejorar la experiencia de uso de la plataforma.

Por limitaciones de tiempo y recursos, solo participó un docente director. Cuantitativamente, sus datos son solo exploratorios; cualitativamente, sus aportes fueron muy valiosos desde la perspectiva del director. Necesitó ayuda en 2 de las 4 tareas. Sus respuestas al cuestionario no se incluyeron en el análisis estadístico.

## 9. Limitaciones

Se reconocen las limitaciones propias del alcance del estudio: es una prueba piloto con 10 estudiantes y un solo director, por lo que los resultados cuantitativos no se pueden generalizar. Aun así, los resultados son aplicables al prototipo y sirven de línea base para futuras evaluaciones que permitan medir la mejora de la plataforma.

## 10. Evidencia

Videos de las sesiones: https://drive.google.com/drive/folders/1zzHP633ZDwt_1zEWPy7KW0j9YW8DsSB1?usp=sharing

Los videos se grabaron con el consentimiento verbal de cada participante, registrado al inicio de cada grabación.

## Referencias

Abuhlfaia, K. (s. f.). *Tesis sobre medidas subjetivas y objetivas de usabilidad* [Tesis doctoral, Keele University]. https://eprints.keele.ac.uk/8721/

Hornbæk, K., & Law, E. L.-C. (2007). Meta-analysis of correlations among usability measures. En *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '07)*. ACM. https://www.kasperhornbaek.dk/papers/CHI2007_MetaAnalysis.pdf

Legramante, D., Azevedo, A., & Azevedo, J. M. (2023). Integration of the technology acceptance model and the information systems success model in the analysis of Moodle's satisfaction and continuity of use. *The International Journal of Information and Learning Technology, 40*(5), 467–484. https://doi.org/10.1108/IJILT-12-2022-0231

Lewis, J. R., & Sauro, J. (2006). When 100% really isn't 100%: Improving the accuracy of small-sample estimates of completion rates. *Journal of Usability Studies, 1*(3). https://uxpajournal.org/wp-content/uploads/sites/7/pdf/JUS_Lewis_May2006.pdf

Medlock, M. C., Wixon, D., Terrano, M., Romero, R., & Fulton, B. (2002). *Using the RITE method to improve products: A definition and a case study*. Usability Professionals' Association. https://jpattonassociates.com/wp-content/uploads/2015/04/rite_method.pdf

Rummel, B. (2017). Predicting post-task user satisfaction. *Journal of Usability Studies*. https://uxpajournal.org/?p=3814
