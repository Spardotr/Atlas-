import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppRoutes from './App'
import { StoreProvider } from './store'
import './index.css'

// Data router: necesario para poder avisar al usuario antes de salir de un formulario con cambios sin guardar.
const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    ),
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
