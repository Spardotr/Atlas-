import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Campo, Dialog } from '../components/UI'

describe('Accesibilidad de componentes base', () => {
  it('el diálogo atrapa el foco: Tab desde el último botón vuelve al primero y Shift+Tab al último', async () => {
    const user = userEvent.setup()
    render(
      <Dialog titulo="Confirmar" onClose={() => {}} acciones={<><button>Cancelar</button><button>Aceptar</button></>}>
        <p>Texto</p>
      </Dialog>,
    )
    const cerrar = screen.getByRole('button', { name: 'Cerrar' })
    const aceptar = screen.getByRole('button', { name: 'Aceptar' })
    aceptar.focus()
    await user.tab()
    expect(cerrar).toHaveFocus()
    await user.tab({ shift: true })
    expect(aceptar).toHaveFocus()
  })

  it('el error de un campo queda vinculado al control con aria-invalid y aria-describedby', () => {
    render(
      <Campo label="Correo" htmlFor="c" error="Escribe un correo válido">
        <input id="c" />
      </Campo>,
    )
    const input = screen.getByLabelText('Correo')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Escribe un correo válido')
  })

  it('sin error, el control no se marca como inválido y la ayuda lo describe', () => {
    render(
      <Campo label="Web" htmlFor="w" hint="Ej.: https://x.unal.edu.co">
        <div><input id="w" /></div>
      </Campo>,
    )
    const input = screen.getByLabelText('Web')
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).toHaveAccessibleDescription('Ej.: https://x.unal.edu.co')
  })
})
