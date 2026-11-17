import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from '../App'
import { StoreProvider } from '../store'

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </MemoryRouter>,
  )
}

async function cambiarCuenta(user: ReturnType<typeof userEvent.setup>, correoRegex: RegExp) {
  await user.click(screen.getByRole('button', { name: /Modo evaluación/ }))
  await user.click(screen.getByRole('button', { name: /Cuentas y opciones/ }))
  await user.click(screen.getByRole('button', { name: correoRegex }))
  await user.click(screen.getByRole('button', { name: 'Cerrar' })) // cierra el panel
}

describe('E1 · Exploración (HU-01, HU-02, HU-04)', () => {
  it('muestra 20 semilleros por página en orden alfabético y 6 en la página 2', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const lista = screen.getAllByRole('listitem').filter((li) => li.querySelector('a[href^="/semilleros/"]'))
    expect(lista).toHaveLength(20)
    expect(screen.getByTestId('contador')).toHaveTextContent('Mostrando 1–20 de 26 semilleros')
    const nombres = lista.map((li) => li.querySelector('h3')!.textContent!)
    expect(nombres).toEqual([...nombres].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })))
    await user.click(screen.getByRole('button', { name: 'Página 2' }))
    expect(screen.getByTestId('contador')).toHaveTextContent('Mostrando 21–26 de 26 semilleros')
  })

  it('busca ignorando mayúsculas y tildes, y ofrece salida cuando no hay resultados', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.type(screen.getByLabelText('Buscar por palabra clave'), 'ROBOTICA')
    expect(screen.getByText(/de \d+ semilleros|Mostrando 1–\d+ de \d+/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Robótica y Control Móvil/ })).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Buscar por palabra clave'))
    await user.type(screen.getByLabelText('Buscar por palabra clave'), 'xyz')
    expect(screen.getByText('No encontramos semilleros para «xyz»')).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar por palabra clave')).toHaveValue('xyz')
    await user.click(screen.getByRole('button', { name: 'Ver todos los semilleros' }))
    expect(screen.getByTestId('contador')).toHaveTextContent('de 26 semilleros')
  })

  it('P02: las áreas temáticas aparecen antes que el campo de búsqueda', () => {
    renderApp('/')
    const areas = screen.getByRole('heading', { name: 'Explora por área temática' })
    const campo = screen.getByLabelText('Buscar por palabra clave')
    expect(areas.compareDocumentPosition(campo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(campo).toHaveAttribute('placeholder', 'Busca por tema, nombre o línea de investigación')
  })

  it('P04: sugiere áreas, semilleros y líneas mientras se escribe y se maneja con teclado', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const campo = screen.getByRole('combobox', { name: 'Buscar por palabra clave' })
    await user.type(campo, 'rob')
    const lista = screen.getByRole('listbox', { name: 'Sugerencias de búsqueda' })
    expect(campo).toHaveAttribute('aria-expanded', 'true')
    expect(within(lista).getByRole('option', { name: /Robótica y control\s*Área/ })).toBeInTheDocument()
    expect(within(lista).getByRole('option', { name: /Robótica y Control Móvil\s*Semillero/ })).toBeInTheDocument()

    // Escape cierra la lista sin borrar lo escrito
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(campo).toHaveValue('rob')

    // Flecha abajo abre y marca la primera opción (el área); Enter la aplica como filtro
    await user.keyboard('{ArrowDown}')
    expect(campo).toHaveAttribute('aria-activedescendant', 'sugerencia-0')
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Robótica y control' })).toHaveAttribute('aria-pressed', 'true')
    expect(campo).toHaveValue('')

    // Elegir un semillero abre su ficha
    await user.type(campo, 'movil')
    await user.click(screen.getByRole('option', { name: /Robótica y Control Móvil/ }))
    expect(screen.getByRole('heading', { level: 1, name: /Robótica y Control Móvil/ })).toBeInTheDocument()
  })

  it('la ficha muestra 7 campos, "Sin información", sello y no muestra contacto no confirmado', () => {
    renderApp('/semilleros/drones-y-sistemas-autonomos')
    for (const campo of ['Nombre', 'Descripción', 'Línea de investigación', 'Director', 'Correo del director', 'Requisitos', 'Estado de convocatoria']) {
      expect(screen.getAllByText(campo, { exact: false }).length).toBeGreaterThan(0)
    }
    expect(screen.getByText('Sin información')).toBeInTheDocument()
    expect(screen.getByText('Precargada')).toBeInTheDocument()
    expect(screen.queryByText(/Contacto confirmado/)).not.toBeInTheDocument()
  })

  it('muestra contacto solo en fichas con dato confirmado por el director', () => {
    renderApp('/semilleros/aprendizaje-automatico-aplicado')
    expect(screen.getByText(/Contacto confirmado por el director/)).toBeInTheDocument()
    expect(screen.getByText('Verificada')).toBeInTheDocument()
  })
})

describe('E3 · Convocatoria (HU-12)', () => {
  it('convocatoria cerrada: mensaje y sin botón; abierta: cierre, cupos y botón', () => {
    const { unmount } = renderApp('/semilleros/control-de-sistemas-no-lineales')
    expect(screen.getByText('Este semillero no tiene convocatoria abierta')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Quiero unirme' })).not.toBeInTheDocument()
    unmount()
    renderApp('/semilleros/robotica-y-control-movil')
    expect(screen.getByText(/Cierra el .* a las 23:59/)).toBeInTheDocument()
    expect(screen.getByText(/Cupos disponibles:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quiero unirme' })).toBeInTheDocument()
  })

  it('una convocatoria cerrada no permite entrar directo al formulario', async () => {
    const user = userEvent.setup()
    renderApp('/ingresar?next=/postular/control-de-sistemas-no-lineales')
    await user.click(screen.getByRole('button', { name: 'Entiendo, continuar' }))
    await user.click(screen.getByRole('button', { name: /Iniciar sesión con Google/ }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /estudiante\.demo@unal\.edu\.co/ }))
    expect((await screen.findAllByText('Este semillero no tiene convocatoria abierta')).length).toBeGreaterThan(0)
    expect(screen.queryByText('Formulario de postulación')).not.toBeInTheDocument()
  })
})

describe('E2 · Acceso (HU-08)', () => {
  it('muestra el aviso antes del inicio de sesión y rechaza otros dominios', async () => {
    const user = userEvent.setup()
    renderApp('/semilleros/robotica-y-control-movil')
    await user.click(screen.getByRole('button', { name: 'Quiero unirme' }))
    expect(screen.getByRole('heading', { name: /Aviso de privacidad/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Iniciar sesión con Google/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Entiendo, continuar' }))
    await user.click(screen.getByRole('button', { name: /Iniciar sesión con Google/ }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /externo\.demo@gmail\.com/ }))
    expect(screen.getByText('Solo puedes entrar con tu correo @unal.edu.co')).toBeInTheDocument()
    expect(document.querySelector('input[type="password"]')).toBeNull()
  })
})

describe('Flujo completo E4 → E5 → E7', () => {
  it('estudiante se postula, el director decide y el estudiante ve el resultado; tablero y privacidad reaccionan', async () => {
    const user = userEvent.setup()
    renderApp('/semilleros/robotica-y-control-movil')

    // Acceso + vuelve a la ficha → postular
    await user.click(screen.getByRole('button', { name: 'Quiero unirme' }))
    await user.click(screen.getByRole('button', { name: 'Entiendo, continuar' }))
    await user.click(screen.getByRole('button', { name: /Iniciar sesión con Google/ }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /estudiante\.demo@unal\.edu\.co/ }))

    // HU-15: mayoría de edad
    const continuar = await screen.findByRole('button', { name: 'Continuar' })
    expect(continuar).toBeDisabled()
    expect(screen.getByText(/Sin esta declaración no puedes crear tu perfil ni postularte/)).toBeInTheDocument()
    await user.click(screen.getByLabelText('Declaro que soy mayor de edad'))
    await user.click(continuar)

    // HU-16: autorización sin marcar por defecto
    const casilla = await screen.findByLabelText(/Autorizo tratar mis datos personales/)
    expect(casilla).not.toBeChecked()
    expect(screen.queryByText('Formulario de postulación')).not.toBeInTheDocument()
    await user.click(casilla)
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    // HU-17: campos obligatorios y mensaje ≤ 500
    await screen.findByText('Formulario de postulación')
    await user.click(screen.getByRole('button', { name: 'Enviar postulación' }))
    expect(screen.getByText('Selecciona tu programa curricular')).toBeInTheDocument()
    expect(screen.queryByText('Postulación enviada')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/género|edad|estrato|promedio/i)).not.toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText(/Programa curricular/), 'Ingeniería de Sistemas y Computación')
    await user.selectOptions(screen.getByLabelText(/Semestre/), '5')
    await user.selectOptions(screen.getByLabelText(/Disponibilidad semanal/), 'Entre 5 y 10 h por semana')
    await user.click(screen.getByLabelText(/Mensaje al director/))
    await user.paste('x'.repeat(600))
    expect(screen.getByTestId('contador-mensaje')).toHaveTextContent('500/500')
    await user.click(screen.getByRole('button', { name: 'Enviar postulación' }))
    expect(await screen.findByRole('heading', { name: 'Postulación enviada' })).toBeInTheDocument()
    expect(screen.getByTestId('numero-postulacion')).toHaveTextContent('ATL-2026-0033')

    // HU-18: correo al director sin datos personales
    await user.click(screen.getByRole('button', { name: /Modo evaluación/ }))
    await user.click(screen.getByRole('button', { name: /Correos simulados/ }))
    expect(screen.getByText('Para: director.demo@unal.edu.co')).toBeInTheDocument()
    expect(screen.getByText(/Nueva postulación recibida en Robótica y Control Móvil/)).toBeInTheDocument()
    const panel = within(screen.getByRole('dialog', { name: 'Modo evaluación' }))
    expect(panel.queryByText(/Estudiante Demo|estudiante\.demo@/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))

    // HU-19: director revisa y acepta
    await cambiarCuenta(user, /director\.demo@unal\.edu\.co/)
    expect(await screen.findByTestId('nuevas')).toHaveTextContent('4')
    await user.click(screen.getByRole('link', { name: 'Ver postulaciones' }))
    const filas = screen.getAllByRole('row').slice(1)
    expect(filas).toHaveLength(4)
    await user.click(within(filas[3]).getByRole('link', { name: 'Abrir' }))
    expect(screen.getByText('Ingeniería de Sistemas y Computación')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Aceptar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirmar' }))
    expect(await screen.findByText(/Decisión registrada el/)).toBeInTheDocument()

    // HU-21 + HU-33: estudiante ve el resultado
    await cambiarCuenta(user, /estudiante\.demo@unal\.edu\.co/)
    await user.click(screen.getByRole('button', { name: /^ED/ }))
    await user.click(screen.getByRole('menuitem', { name: 'Mis datos y privacidad' }))
    await user.click(screen.getByRole('tab', { name: 'Mis postulaciones' }))
    expect(within(screen.getByTestId('mi-postulacion')).getByText('Aceptada')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Autorizaciones' }))
    expect(screen.getByText(/Otorgada el/)).toBeInTheDocument()
    expect(screen.getAllByText(/aviso v1\.0/).length).toBeGreaterThan(0)

    // HU-24/25/26: tablero con datos vivos (18 vs 15 = +20 %)
    await cambiarCuenta(user, /vicedecanatura\.demo/)
    expect(await screen.findByTestId('variacion')).toHaveTextContent('+20 %')
    expect(screen.getByText('Bajo la meta')).toBeInTheDocument()
    expect(screen.getByTestId('pct-verificadas')).toHaveTextContent('54 %')
    expect(screen.getByTestId('viejas')).toHaveTextContent('3 fichas llevan más de 6 meses')
    expect(screen.getByTestId('casos-sin-aut')).toHaveTextContent('1 caso sin autorización registrada')
    expect(document.body.textContent).not.toMatch(/@unal\.edu\.co.*Valentina|Valentina Rojas/)
  })
})

describe('E6 · Director (HU-09, HU-29, HU-30, HU-32)', () => {
  async function entrarComoDirector(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: /Modo evaluación/ }))
    await user.click(screen.getByRole('button', { name: /director\.demo@unal\.edu\.co/ }))
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
  }

  it('reclama la ficha, edita sin aprobación y controla la publicación del teléfono', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await entrarComoDirector(user)
    expect(await screen.findByRole('heading', { name: /Mi semillero/ })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Revisar mi ficha' }))
    await user.click(screen.getByRole('button', { name: 'Verificar mi ficha' }))
    const dlg = screen.getByRole('dialog')
    expect(within(dlg).getByRole('button', { name: 'Confirmar y verificar' })).toBeDisabled()
    await user.click(within(dlg).getByLabelText('Confirmo que la información es correcta'))
    await user.click(within(dlg).getByRole('button', { name: 'Confirmar y verificar' }))
    expect(await screen.findByText('Verificada')).toBeInTheDocument()

    // HU-30: teléfono nuevo no se publica sin autorización
    await user.type(screen.getByLabelText('Teléfono'), '601 555 0000')
    expect(screen.getAllByLabelText('Autorizo publicar este dato')[0]).not.toBeChecked()
    await user.clear(screen.getByLabelText('Línea de investigación'))
    await user.type(screen.getByLabelText('Línea de investigación'), 'Línea editada por el director')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    // la edición se publica sin aprobación: se ve en la ficha pública
    await user.click(screen.getAllByRole('link', { name: /Explorar/ })[0])
    await user.type(screen.getByLabelText('Buscar por palabra clave'), 'robotica')
    await user.click(screen.getByRole('link', { name: /Robótica y Control Móvil/ }))
    expect(screen.getByText('Línea editada por el director')).toBeInTheDocument()
  })

  it('un director no abre fichas ni postulaciones ajenas', async () => {
    const user = userEvent.setup()
    renderApp('/director/ficha?semillero=aprendizaje-automatico-aplicado')
    // visitante → inicio de sesión
    await user.click(screen.getByRole('button', { name: 'Entiendo, continuar' }))
    await user.click(screen.getByRole('button', { name: /Iniciar sesión con Google/ }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /director\.demo@unal\.edu\.co/ }))
    expect(await screen.findByText('No tienes permiso para ver este semillero')).toBeInTheDocument()
  })

  it('cerrar la convocatoria se refleja de inmediato en la ficha pública', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await entrarComoDirector(user)
    await user.click(await screen.findByRole('link', { name: 'Administrar convocatoria' }))
    expect(screen.getByText(/La convocatoria se cierra sola el .* a las 23:59/)).toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: 'Convocatoria abierta' }))
    await user.click(screen.getByRole('button', { name: 'Guardar convocatoria' }))
    await user.click(screen.getAllByRole('link', { name: /Explorar/ })[0])
    await user.type(screen.getByLabelText('Buscar por palabra clave'), 'robotica')
    await user.click(screen.getByRole('link', { name: /Robótica y Control Móvil/ }))
    expect(screen.getByText('Este semillero no tiene convocatoria abierta')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Quiero unirme' })).not.toBeInTheDocument()
  })
})

describe('E7 · Privacidad (HU-35, HU-36)', () => {
  it('revoca la autorización de postulación y elimina el perfil', async () => {
    const user = userEvent.setup()
    renderApp('/postular/robotica-y-control-movil')
    await user.click(screen.getByRole('button', { name: 'Entiendo, continuar' }))
    await user.click(screen.getByRole('button', { name: /Iniciar sesión con Google/ }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /estudiante\.demo@unal\.edu\.co/ }))
    await user.click(await screen.findByLabelText('Declaro que soy mayor de edad'))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(await screen.findByLabelText(/Autorizo tratar mis datos personales/))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await screen.findByText('Formulario de postulación')

    await user.click(screen.getByRole('button', { name: /^ED/ }))
    await user.click(screen.getByRole('menuitem', { name: 'Mis datos y privacidad' }))
    await user.click(screen.getByRole('tab', { name: 'Autorizaciones' }))
    await user.click(screen.getByRole('button', { name: 'Revocar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Revocar autorización' }))
    expect(await screen.findByText(/Revocada el/)).toBeInTheDocument()
    expect(screen.getAllByText(/Autorización revocada:/).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('tab', { name: 'Eliminar perfil' }))
    await user.click(screen.getByRole('button', { name: 'Eliminar mi perfil' }))
    const dlg = screen.getByRole('dialog')
    expect(within(dlg).getByRole('button', { name: 'Eliminar definitivamente' })).toBeDisabled()
    expect(within(dlg).getByText('Tus datos se eliminarán en menos de 24 horas.')).toBeInTheDocument()
    await user.type(within(dlg).getByLabelText(/escribe ELIMINAR/), 'ELIMINAR')
    await user.click(within(dlg).getByRole('button', { name: 'Eliminar definitivamente' }))
    expect(await screen.findByRole('heading', { name: /Explorar semilleros/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^ED/ })).not.toBeInTheDocument()
  })
})

describe('Correcciones de severidad 3', () => {
  it('F-02: correo vacío muestra error y mantiene el diálogo abierto', async () => {
    const user = userEvent.setup()
    renderApp('/ingresar')
    await user.click(screen.getByRole('button', { name: 'Entiendo, continuar' }))
    await user.click(screen.getByRole('button', { name: /Iniciar sesión con Google/ }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText(/Escribe tu correo institucional/)).toBeInTheDocument()
  })

  it('F-01/F-03: el estudiante retira una postulación y ningún toast revela el correo del estudiante', async () => {
    const user = userEvent.setup()
    renderApp('/postular/robotica-y-control-movil')
    await user.click(screen.getByRole('button', { name: 'Entiendo, continuar' }))
    await user.click(screen.getByRole('button', { name: /Iniciar sesión con Google/ }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /estudiante\.demo@unal\.edu\.co/ }))
    await user.click(await screen.findByLabelText('Declaro que soy mayor de edad'))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByLabelText(/Autorizo tratar mis datos/))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.selectOptions(screen.getByLabelText(/Programa curricular/), 'Ingeniería Civil')
    await user.selectOptions(screen.getByLabelText(/Semestre/), '5')
    await user.selectOptions(screen.getByLabelText(/Disponibilidad/), 'Entre 5 y 10 h por semana')
    await user.click(screen.getByRole('button', { name: 'Enviar postulación' }))
    await user.click(screen.getByRole('link', { name: 'Ver mis postulaciones' }))
    await user.click(screen.getByRole('button', { name: 'Retirar postulación' }))
    const dlg = screen.getByRole('dialog', { name: 'Retirar postulación' })
    await user.click(within(dlg).getByRole('button', { name: 'Retirar postulación' }))
    expect(screen.getByTestId('mi-postulacion')).toHaveTextContent('Retirada')
    expect(screen.queryByText(/Correo enviado a/)).not.toBeInTheDocument()
  })
})
