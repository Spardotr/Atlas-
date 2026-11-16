# Atlas · Prototipo de alta fidelidad (Hito 1 · Módulo I)

Catálogo de semilleros de la Facultad de Ingeniería de la Universidad Nacional de Colombia.
Prototipo interactivo en React + Vite + TypeScript + Tailwind. No tiene backend: todo el estado vive en memoria con datos de ejemplo.

## Cómo correrlo
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 12 pruebas de flujo (vitest + testing-library)
npm run build      # versión estática en dist/
```

## Cómo evaluarlo
- Botón **Modo evaluación** (abajo a la izquierda): cambia de cuenta (estudiante, director, director 2, vicedecanatura, correo externo rechazado), muestra los correos simulados y activa las etiquetas de historias de usuario (HU-xx).
- Ruta **/evaluacion** (también en «Mapa del sitio» del pie): tabla de las 22 historias Must → pantalla donde se cumple.
- **Reiniciar datos** vuelve al estado inicial.

## Cuentas de demostración
| Rol | Correo |
|---|---|
| Estudiante | estudiante.demo@unal.edu.co |
| Director (Robótica y Control Móvil, ficha precargada) | director.demo@unal.edu.co |
| Director (Aprendizaje Automático Aplicado, verificada) | director2.demo@unal.edu.co |
| Vicedecanatura | vicedecanatura.demo@unal.edu.co |
| Correo externo (rechazado) | externo.demo@gmail.com |

## Notas
- HU-15 (declaración de mayoría de edad) está implementada pero marcada «sujeta a decisión».
- Tipografía: Ancízar Sans vía Google Fonts (con respaldo a sans del sistema).
- Escudo y logos del encabezado/pie provienen de las capturas de unal.edu.co (public/img).
