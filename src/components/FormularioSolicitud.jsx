import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './FormularioSolicitud.css'

export default function FormularioSolicitud({ onSolicitudCreada }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: '3',
    email: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Validaciones
  const validateForm = () => {
    const newErrors = {}

    // Validar título (5-60 caracteres)
    if (formData.titulo.trim().length < 5) {
      newErrors.titulo = 'El título debe tener al menos 5 caracteres'
    } else if (formData.titulo.trim().length > 60) {
      newErrors.titulo = 'El título no puede exceder 60 caracteres'
    }

    // Validar descripción (20-500 caracteres)
    if (formData.descripcion.trim().length < 20) {
      newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres'
    } else if (formData.descripcion.trim().length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres'
    }

    // Validar categoría
    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Debes seleccionar una categoría'
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    // Validar prioridad (1-5)
    const prioridad = parseInt(formData.prioridad)
    if (isNaN(prioridad) || prioridad < 1 || prioridad > 5) {
      newErrors.prioridad = 'La prioridad debe estar entre 1 y 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    // Limpiar mensajes de éxito/error al editar
    if (submitError) setSubmitError(null)
    if (submitSuccess) setSubmitSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar formulario
    if (!validateForm()) {
      return
    }

    // Prevenir doble envío
    if (isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .insert([
          {
            titulo: formData.titulo.trim(),
            descripcion: formData.descripcion.trim(),
            categoria: formData.categoria,
            prioridad: parseInt(formData.prioridad),
            email: formData.email.trim()
          }
        ])
        .select()

      if (error) {
        throw error
      }

      // Éxito
      setSubmitSuccess(true)
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: '',
        prioridad: '3',
        email: ''
      })
      
      // Notificar al componente padre
      if (onSolicitudCreada) {
        onSolicitudCreada(data[0])
      }

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSubmitSuccess(false), 3000)

    } catch (error) {
      console.error('Error al enviar solicitud:', error)
      setSubmitError(
        error.message || 
        'Error al enviar la solicitud. Por favor, verifica tu conexión e inténtalo de nuevo.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verificar si el formulario es válido para habilitar/deshabilitar el botón
  const isFormValid = () => {
    return (
      formData.titulo.trim().length >= 5 &&
      formData.titulo.trim().length <= 60 &&
      formData.descripcion.trim().length >= 20 &&
      formData.descripcion.trim().length <= 500 &&
      formData.categoria.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      parseInt(formData.prioridad) >= 1 &&
      parseInt(formData.prioridad) <= 5
    )
  }

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <img 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80" 
          alt="Equipo colaborando"
          className="formulario-header-image"
        />
        <h1>Nueva Solicitud</h1>
        <p className="formulario-descripcion">
          Completa el formulario para crear una nueva solicitud de soporte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="formulario" noValidate>
        {/* Título */}
        <div className="form-group">
          <label htmlFor="titulo">
            Título <span aria-label="requerido">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.titulo ? 'true' : 'false'}
            aria-describedby={errors.titulo ? 'titulo-error' : 'titulo-hint'}
            maxLength="60"
          />
          <span id="titulo-hint" className="form-hint">
            {formData.titulo.length}/60 caracteres (mínimo 5)
          </span>
          {errors.titulo && (
            <span id="titulo-error" className="form-error" role="alert">
              {errors.titulo}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">
            Descripción <span aria-label="requerido">*</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="5"
            aria-required="true"
            aria-invalid={errors.descripcion ? 'true' : 'false'}
            aria-describedby={errors.descripcion ? 'descripcion-error' : 'descripcion-hint'}
            maxLength="500"
          />
          <span id="descripcion-hint" className="form-hint">
            {formData.descripcion.length}/500 caracteres (mínimo 20)
          </span>
          {errors.descripcion && (
            <span id="descripcion-error" className="form-error" role="alert">
              {errors.descripcion}
            </span>
          )}
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label htmlFor="categoria">
            Categoría <span aria-label="requerido">*</span>
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.categoria ? 'true' : 'false'}
            aria-describedby={errors.categoria ? 'categoria-error' : undefined}
          >
            <option value="">Selecciona una categoría</option>
            <option value="Técnico">Técnico</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Soporte">Soporte</option>
            <option value="Consulta">Consulta</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.categoria && (
            <span id="categoria-error" className="form-error" role="alert">
              {errors.categoria}
            </span>
          )}
        </div>

        {/* Prioridad */}
        <div className="form-group">
          <label htmlFor="prioridad">
            Prioridad <span aria-label="requerido">*</span>
          </label>
          <select
            id="prioridad"
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.prioridad ? 'true' : 'false'}
            aria-describedby={errors.prioridad ? 'prioridad-error' : 'prioridad-hint'}
          >
            <option value="1">1 - Muy baja</option>
            <option value="2">2 - Baja</option>
            <option value="3">3 - Media</option>
            <option value="4">4 - Alta</option>
            <option value="5">5 - Muy alta</option>
          </select>
          <span id="prioridad-hint" className="form-hint">
            Selecciona el nivel de urgencia
          </span>
          {errors.prioridad && (
            <span id="prioridad-error" className="form-error" role="alert">
              {errors.prioridad}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">
            Email <span aria-label="requerido">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="form-error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Mensajes de error/éxito generales */}
        {submitError && (
          <div className="alert alert-error" role="alert">
            <strong>Error:</strong> {submitError}
            <button 
              type="button" 
              className="retry-button"
              onClick={() => setSubmitError(null)}
              aria-label="Cerrar mensaje de error"
            >
              ✕
            </button>
          </div>
        )}

        {submitSuccess && (
          <div className="alert alert-success" role="status">
            <strong>¡Éxito!</strong> Tu solicitud ha sido enviada correctamente.
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid() || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  )
}
