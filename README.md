## Módulo IV: Persistencia de soporte

Este módulo presenta el esquema de datos mínimo y el mapa de API que soportan el prototipo de Atlas, junto con la arquitectura que los sustenta. Atlas se plantea como un monolito modular sobre PostgreSQL, desplegado en contenedores y dimensionado para 100 usuarios concurrentes.

### 4.1 Esquema de datos mínimo

El esquema tiene seis tablas que alimentan el prototipo y cuatro de extensión. Estas últimas almacenan información que la universidad ya registra de cada grupo en Hermes y que el MVP aún no muestra. Atlas no se conecta a Hermes: adopta su estructura como referencia y recibe las fichas por un archivo CSV que carga la Vicedecanatura.

<img width="1520" height="1376" alt="er-diagram" src="https://github.com/user-attachments/assets/df29d57d-7720-45bc-814e-3776755f2274" />

Las tablas de línea continua corresponden al MVP; las de línea punteada, a la extensión.

| Tabla | Contenido | Grupo |
| --- | --- | --- |
| `app_user` | Usuario: correo, nombre, programa y rol | MVP |
| `seedbed` | Ficha del semillero. Incluye código de registro, estados, categoría Minciencias, contacto, enlaces y enfoque | MVP |
| `research_line` | Líneas de investigación | MVP |
| `open_call` | Convocatoria: periodo, fecha de cierre y cupos | MVP |
| `application` | Postulación y su estado | MVP |
| `consent` | Autorización de tratamiento de datos, con finalidad y versión del aviso | MVP |
| `member` | Integrantes y su rol en el grupo | Extensión |
| `project`, `product` | Proyectos y productos académicos | Extensión |
| `classification` | Sede, dependencia, planes de estudio, agenda de conocimiento y áreas OCDE | Extensión |
| `outbox_email`, `audit_event`, `change_log` | Correos pendientes, auditoría de acciones e historial de cambios | Soporte |

Reglas de integridad en la base:

- Una postulación por estudiante y convocatoria, y una sola convocatoria abierta por semillero.
- Ninguna postulación sin una autorización vigente, verificada en la misma transacción.
- Las autorizaciones no se eliminan: la revocación registra `revoked_at`, como evidencia ante la Ley 1581 de 2012.
- JSONB se limita a atributos sin estructura fija: `seedbed.extra` y los valores de `change_log`.

#### 4.1.1 Capa analítica

El modelo transaccional conserva solo el estado actual de cada registro, lo que no basta para analizar tendencias. Se proponen dos mecanismos complementarios.

**Historial de cambios.** Un disparador registra en `change_log` cada modificación de `seedbed`, `open_call` y `application`: entidad, campo, valor anterior, valor nuevo y fecha. La tabla solo admite inserciones. Con ella se reconstruye, por ejemplo, cuánto tiempo permanece una postulación en cada estado o cómo evoluciona una ficha. No se registran cambios de datos personales, para respetar el derecho de supresión.

**Esquema estrella.** Un esquema `analytics`, en la misma base, expone vistas materializadas con una tabla de hechos por postulación y cuatro dimensiones. `dim_seedbed` se construye desde `change_log` como dimensión de cambio lento de tipo 2, de modo que cada postulación se analiza con los atributos que el semillero tenía en ese momento.

<img width="1520" height="672" alt="star-schema" src="https://github.com/user-attachments/assets/4a433f8e-b65a-4c47-9af4-78b3d35fb2d0" />

Los indicadores del cuadro de mando se calculan sobre este esquema: crecimiento de postulaciones, tiempo de respuesta del director y postulaciones con autorización. Las vistas se refrescan cada noche y no contienen nombres ni correos. Al residir en la misma base no requieren un proceso de carga adicional; si el volumen crece, el mismo modelo se traslada a una bodega de datos.

### 4.2 Mapa de API

La API expone 23 puntos de contacto REST bajo `/api/v1`, en formato JSON. La sesión se mantiene en una cookie HttpOnly.

| Método y ruta | Función | Rol |
| --- | --- | --- |
| `GET /auth/login` | Redirige a Google para autenticar | Público |
| `GET /auth/callback` | Valida la respuesta de Google y crea la sesión | Público |
| `GET /me` | Devuelve el perfil y el rol | Autenticado |
| `POST /auth/logout` | Cierra la sesión | Autenticado |
| `GET /seedbeds` | Lista el catálogo con búsqueda y filtros | Público |
| `GET /seedbeds/{id}` | Devuelve la ficha con su convocatoria vigente | Público |
| `POST /seedbeds/{id}/claim` | Registra el reclamo de la ficha | Director |
| `PATCH /seedbeds/{id}` | Actualiza la ficha | Director |
| `POST /seedbeds/{id}/calls` | Abre una convocatoria | Director |
| `PATCH /calls/{id}` | Cierra la convocatoria o modifica fecha y cupos | Director |
| `POST /me/adult-declaration` | Registra la declaración de mayoría de edad | Estudiante |
| `POST /me/consents` | Registra la autorización de datos | Estudiante |
| `POST /calls/{id}/applications` | Crea la postulación | Estudiante |
| `GET /me/applications` | Lista las postulaciones del estudiante | Estudiante |
| `GET /seedbeds/{id}/applications` | Lista las postulaciones recibidas | Director |
| `GET /applications/{id}` | Devuelve el detalle de una postulación | Director |
| `POST /applications/{id}/decision` | Registra la aceptación o el rechazo | Director |
| `GET /me/data` | Devuelve los datos personales y las autorizaciones | Estudiante |
| `PATCH /me/data` | Corrige los datos personales | Estudiante |
| `DELETE /me/consents/{id}` | Revoca una autorización | Estudiante |
| `DELETE /me` | Solicita la eliminación del perfil | Estudiante |
| `GET /metrics` | Devuelve los indicadores agregados | Vicedecanatura |
| `POST /admin/seedbeds/import` | Carga fichas desde un archivo CSV | Vicedecanatura |

#### 4.2.1 Uso de los verbos HTTP

| Verbo | Uso en Atlas | Idempotente |
| --- | --- | --- |
| `GET` | Consulta sin efectos sobre los datos | Sí |
| `POST` | Crea un recurso o registra una acción | No; las restricciones de unicidad impiden duplicados |
| `PATCH` | Actualiza parte de un recurso | Sí en Atlas, porque asigna valores absolutos y no incrementos |
| `DELETE` | Elimina o revoca | Sí |

Se usa `PATCH` y no `PUT` porque las actualizaciones son parciales. `PUT` reemplaza el recurso completo: obligaría al cliente a enviar todos los campos y sobrescribiría los que administra otro actor, como los que provienen de la carga institucional. `PUT` es idempotente por definición y `PATCH` no lo garantiza; Atlas conserva esa propiedad al restringir `PATCH` a asignaciones de valor.

### 4.3 Arquitectura de soporte

El navegador se comunica únicamente con Nginx, que enruta las peticiones bajo `/api` hacia Flask y las demás hacia Next.js. El backend es un solo proceso dividido en ocho módulos de dominio. Cada módulo es dueño de sus tablas y solo accede a los datos de otro a través de su capa de servicio, lo que permite extraerlo como servicio independiente sin reescribirlo.

<img width="1520" height="1328" alt="architecture" src="https://github.com/user-attachments/assets/be7cab72-682a-481e-87d3-f6c8df9b5032" />

#### 4.3.1 Decisiones y compromisos

| Decisión | Alternativa | Justificación | Costo asumido |
| --- | --- | --- | --- |
| Monolito modular | Microservicios | La carga se atiende en una máquina y las operaciones críticas se resuelven en una transacción local. | Los módulos escalan en conjunto. |
| Flask | Django | No impone ORM: permite SQL explícito y un Blueprint por módulo. El equipo domina Python. | Sin panel de administración ni autenticación incluidos. |
| PostgreSQL | Base documental | El dominio es relacional y exige integridad y unicidad. Ofrece JSONB y búsqueda insensible a tildes. | El equipo administra respaldos y actualizaciones. |
| Next.js | Aplicación de página única estática | El catálogo es público; el renderizado en servidor reduce el tiempo de carga. | Un contenedor adicional. |
| Nginx y Docker Compose | Kubernetes | Entrada única con TLS y despliegue reproducible en cualquier nube o en servidores de la universidad. | Una sola máquina es un punto único de falla. |
| Autenticación con Google Workspace | Contraseñas propias | Atlas no almacena credenciales y reutiliza la cuenta institucional. | Dependencia de Google. |

Todos los componentes son software libre y el diseño no asume una nube específica, lo que mantiene bajo el costo de operación y evita la dependencia de un proveedor.

#### 4.3.2 Principios SOLID

| Principio | Aplicación en Atlas |
| --- | --- |
| Responsabilidad única | Cada capa tiene una sola razón de cambio: `routes` traduce HTTP, `service` aplica las reglas del negocio y `repository` ejecuta SQL. |
| Abierto/cerrado | Un nuevo proveedor de identidad o canal de notificación se agrega como una clase que implementa la interfaz, sin modificar las existentes. |
| Sustitución de Liskov | Toda implementación de `IdentityProvider` cumple el mismo contrato: devuelve un correo verificado o un error. Google, el directorio de la universidad o un doble de prueba son intercambiables. |
| Segregación de interfaces | Las interfaces son pequeñas y específicas (`IdentityProvider`, `EmailSender`). Cada módulo expone a los demás solo las funciones de servicio que necesitan. |
| Inversión de dependencias | Los servicios dependen de interfaces y reciben las implementaciones al construir la aplicación, lo que permite probarlos sin base de datos ni servicios externos. |

#### 4.3.3 Estructura de carpetas

```text
atlas/
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── frontend/                      # Next.js
│   ├── app/                       
│   ├── components/
│   └── lib/api.ts                
├── backend/                       # Flask
│   ├── app/
│   │   ├── __init__.py          
│   │   ├── config.py
│   │   ├── shared/             
│   │   └── modules/
│   │       ├── identity/
│   │       │   ├── routes.py
│   │       │   ├── service.py
│   │       │   ├── repository.py
│   │       │   └── providers/     
│   │       ├── catalog/
│   │       ├── calls/
│   │       ├── applications/
│   │       ├── privacy/
│   │       ├── notifications/
│   │       ├── metrics/
│   │       └── imports/
│   ├── migrations/                # versioned SQL, including analytics views
│   └── tests/
└── infra/  
```

Todos los módulos repiten la estructura de `identity`.

#### 4.3.4 Autenticación y control de acceso

La autenticación se delega en Google Workspace mediante OpenID Connect, con la cuenta institucional; el equipo validó el flujo en una prueba de concepto. El backend verifica la firma del token y que el dominio sea `unal.edu.co`, porque el filtro de dominio que presenta Google puede omitirse. El rol de docente director se asigna cuando el correo coincide con el del director de un semillero.

La autorización se verifica en la capa de servicio, por rol y por propiedad: un director solo consulta y modifica su propio semillero, incluso si invoca la API directamente.

#### 4.3.5 Escalabilidad

La arquitectura escala por etapas y ninguna exige reescribir el sistema. El criterio para avanzar es que el catálogo responda en 600 ms o menos en el percentil 95. Las etapas, en orden, son: escalar verticalmente la máquina; trasladar PostgreSQL a una máquina dedicada o a un servicio administrado; replicar el backend detrás de un balanceador, posible porque la API no conserva estado; y separar módulos en servicios, empezando por notificaciones, que ya opera desacoplado. La alta disponibilidad y el ambiente de producción se excluyen de este hito porque no son necesarios para validar el MVP.

#### 4.3.6 Interoperabilidad con fuentes oficiales (posterior al MVP)

Si la universidad habilita el acceso a datos oficiales, por ejemplo para confirmar si una persona es estudiante o docente, Atlas los consulta con una copia local de respaldo. El diseño asume que la fuente puede fallar o actualizarse con poca frecuencia, y garantiza que Atlas siempre responda.

<img width="1520" height="1008" alt="official-data-flow" src="https://github.com/user-attachments/assets/2d438c0b-622a-456a-9936-a91aacfd53f1" />

Solo se acude a la fuente cuando la copia local venció. Si la fuente no responde, se usa la última copia disponible; si nunca hubo una, se aplica la regla actual, que deduce el rol a partir del correo registrado en la ficha.

- **Dónde reside.** La lógica está en un servicio, `OfficialDataService`, y la copia en un almacén genérico, `official_data_cache`. Las tablas del dominio no cambian.
- **Cómo se conecta.** Cada fuente se integra con un adaptador (REST, SOAP o archivo) detrás de la interfaz `OfficialDataSource`.
- **Cómo se mantiene al día.** Una tarea programada refresca las copias en segundo plano. Ante fallos repetidos, las consultas se suspenden durante un intervalo.
- **Costo asumido.** Consistencia eventual: un cambio en la fuente puede tardar en reflejarse hasta el siguiente refresco.
