import { describe, expect, it } from 'vitest'
import { normalizarUrl } from '../lib/utils'

describe('normalizarUrl (página web del semillero)', () => {
  it('agrega https cuando falta el esquema', () => {
    expect(normalizarUrl('semillero.unal.edu.co')).toBe('https://semillero.unal.edu.co/')
  })
  it('respeta http y https', () => {
    expect(normalizarUrl('http://a.co/x')).toBe('http://a.co/x')
  })
  it('rechaza esquemas peligrosos y textos inválidos', () => {
    expect(normalizarUrl('javascript:alert(1)')).toBeNull()
    expect(normalizarUrl('data:text/html,hola')).toBeNull()
    expect(normalizarUrl('hola')).toBeNull()
    expect(normalizarUrl('')).toBeNull()
  })
})

import { enlaceWhatsApp, numeroWhatsApp } from '../lib/utils'

describe('numeroWhatsApp / enlaceWhatsApp', () => {
  it('agrega el indicativo 57 a un celular colombiano de 10 dígitos', () => {
    expect(numeroWhatsApp('300 555 0142')).toBe('573005550142')
    expect(numeroWhatsApp('(300) 555-0142')).toBe('573005550142')
  })
  it('respeta números con indicativo', () => {
    expect(numeroWhatsApp('+57 300 555 0142')).toBe('573005550142')
    expect(numeroWhatsApp('+1 415 555 2671')).toBe('14155552671')
  })
  it('rechaza números inválidos', () => {
    expect(numeroWhatsApp('12345')).toBeNull()
    expect(numeroWhatsApp('abc')).toBeNull()
  })
  it('arma el enlace wa.me con el mensaje codificado', () => {
    expect(enlaceWhatsApp('3005550142', 'Hola «x»')).toBe('https://wa.me/573005550142?text=Hola%20%C2%ABx%C2%BB')
  })
})
