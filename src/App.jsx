import { useState } from 'react'
import FormularioSolicitud from './components/FormularioSolicitud'
import ListaSolicitudes from './components/ListaSolicitudes'
import './App.css'

function App() {
  const [recargarLista, setRecargarLista] = useState(0)

  const handleSolicitudEnviada = () => {
    // Incrementar el contador para forzar la recarga de la lista
    setRecargarLista(prev => prev + 1)
  }

  return (
    <div className="app-container">
      <header className="app-header" role="banner">
        <h1 className="app-title">Sistema de Gestión de Solicitudes</h1>
        <p className="app-subtitle">Formulario con persistencia en Supabase</p>
      </header>

      <main role="main">
        <FormularioSolicitud onSolicitudEnviada={handleSolicitudEnviada} />
        <ListaSolicitudes key={recargarLista} />
      </main>

      <footer className="app-footer" role="contentinfo">
        <p>© 2026 NTT DATA - Ejercicio 2: Formulario + BBDD Cloud</p>
      </footer>
    </div>
  )
}

export default App
