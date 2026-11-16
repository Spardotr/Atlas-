import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function A11yPanel() {
  const [abierto, setAbierto] = useState(false)
  const [escala, setEscala] = useState(100)
  const [contraste, setContraste] = useState(false)

  useEffect(() => {
    document.documentElement.style.fontSize = `${escala}%`
  }, [escala])
  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [abierto])
  useEffect(() => {
    document.documentElement.classList.toggle('hc', contraste)
  }, [contraste])

  return (
    <>
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label="Panel de Accesibilidad"
        className="fixed right-0 top-[124px] z-40 flex items-stretch bg-black/70 text-sm font-bold text-white shadow-md backdrop-blur-sm"
      >
        <span className="flex h-10 w-10 items-center justify-center bg-[#1F58D6]" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="4.2" r="2.2" />
            <path d="M5 8.2c0-.6.5-1 1-1 2 .5 4 .7 6 .7s4-.2 6-.7c.6 0 1 .4 1 1s-.4 1-1 1.2l-4 .8v3.2l1.8 6.1c.2.6-.2 1.3-.9 1.3-.5 0-.9-.3-1-.8L12 15.8l-1.9 5.2c-.1.5-.5.8-1 .8-.7 0-1.100-.7-.9-1.300L11 13.900v-3.500l-4-.8c-.6-.2-1-.7-1-1.400z" />
          </svg>
        </span>
        <span className="hidden items-center px-4 sm:flex">Panel de Accesibilidad</span>
      </button>
      {abierto && (
        <div role="dialog" aria-label="Panel de accesibilidad" className="fixed right-2 top-[170px] z-40 w-72 rounded bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider">Accesibilidad</h2>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar panel"><X size={16} /></button>
          </div>
          <p className="mb-1 text-sm font-semibold">Tamaño del texto ({escala} %)</p>
          <div className="mb-4 flex gap-2">
            <button className="btn-outline" onClick={() => setEscala((e) => Math.max(85, e - 10))} aria-label="Disminuir texto">A−</button>
            <button className="btn-outline" onClick={() => setEscala(100)}>Normal</button>
            <button className="btn-outline" onClick={() => setEscala((e) => Math.min(150, e + 10))} aria-label="Aumentar texto">A+</button>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={contraste} onChange={(e) => setContraste(e.target.checked)} className="h-4 w-4 accent-unal-verde-oscuro" />
            Alto contraste
          </label>
        </div>
      )}
    </>
  )
}
