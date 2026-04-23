import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './ListaSolicitudes.css'

export default function ListaSolicitudes({ nuevaSolicitud }) {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarSolicitudes = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setSolicitudes(data || [])
    } catch (error) {
      console.error('Error al cargar solicitudes:', error)
      setError('Error al cargar las solicitudes. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarSolicitudes()
  }, [])

  // Actualizar lista cuando se crea una nueva solicitud
  useEffect(() => {
    if (nuevaSolicitud) {
      setSolicitudes(prev => [nuevaSolicitud, ...prev])
    }
  }, [nuevaSolicitud])

  const formatearFecha = (fecha) => {
    const date = new Date(fecha)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const obtenerColorPrioridad = (prioridad) => {
    const colores = {
      1: 'prioridad-muy-baja',
      2: 'prioridad-baja',
      3: 'prioridad-media',
      4: 'prioridad-alta',
      5: 'prioridad-muy-alta'
    }
    return colores[prioridad] || 'prioridad-media'
  }

  const obtenerTextoPrioridad = (prioridad) => {
    const textos = {
      1: 'Muy baja',
      2: 'Baja',
      3: 'Media',
      4: 'Alta',
      5: 'Muy alta'
    }
    return textos[prioridad] || 'Media'
  }

  if (loading) {
    return (
      <div className="lista-container">
        <div className="lista-header">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80" 
            alt="Documentos organizados"
            className="lista-header-image"
          />
          <h2>Mis Solicitudes</h2>
          <p className="lista-descripcion">Historial de todas tus solicitudes</p>
        </div>
        <div className="loading-container" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Cargando solicitudes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="lista-container">
        <div className="lista-header">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80" 
            alt="Documentos organizados"
            className="lista-header-image"
          />
          <h2>Mis Solicitudes</h2>
          <p className="lista-descripcion">Historial de todas tus solicitudes</p>
        </div>
        <div className="error-container" role="alert">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button-lista" 
            onClick={cargarSolicitudes}
            aria-label="Reintentar cargar solicitudes"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="lista-container">
      <div className="lista-header">
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80" 
          alt="Documentos organizados"
          className="lista-header-image"
        />
        <h2>Mis Solicitudes</h2>
        <p className="lista-descripcion">
          {solicitudes.length === 0 
            ? 'Aún no tienes solicitudes registradas' 
            : `Total: ${solicitudes.length} solicitud${solicitudes.length !== 1 ? 'es' : ''}`
          }
        </p>
      </div>

      {solicitudes.length === 0 ? (
        <div className="empty-state">
          <svg 
            className="empty-icon" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No hay solicitudes registradas</p>
          <p className="empty-hint">Crea tu primera solicitud usando el formulario de arriba</p>
        </div>
      ) : (
        <ul className="solicitudes-lista" role="list">
          {solicitudes.map((solicitud, index) => (
            <li 
              key={solicitud.id} 
              className="solicitud-item"
              role="listitem"
            >
              <div className="solicitud-header">
                <h3 className="solicitud-titulo">{solicitud.titulo}</h3>
                <span 
                  className={`solicitud-prioridad ${obtenerColorPrioridad(solicitud.prioridad)}`}
                  aria-label={`Prioridad: ${obtenerTextoPrioridad(solicitud.prioridad)}`}
                >
                  {obtenerTextoPrioridad(solicitud.prioridad)}
                </span>
              </div>
              
              <p className="solicitud-descripcion">{solicitud.descripcion}</p>
              
              <div className="solicitud-metadata">
                <span className="solicitud-categoria" aria-label={`Categoría: ${solicitud.categoria}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {solicitud.categoria}
                </span>
                
                <span className="solicitud-email" aria-label={`Email: ${solicitud.email}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {solicitud.email}
                </span>
                
                <span className="solicitud-fecha" aria-label={`Fecha de creación: ${formatearFecha(solicitud.created_at)}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatearFecha(solicitud.created_at)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
