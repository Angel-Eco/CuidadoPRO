'use client'

import { useEffect, useState, useRef } from 'react'

type ServiceRequestModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ServiceRequestModal({ isOpen, onClose }: ServiceRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    const formData = new FormData(formRef.current!)
    const data = {
      nombre: formData.get('nombre') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string,
      direccion: formData.get('direccion') as string,
      tipo_servicio: formData.get('tipo_servicio') as string,
      fecha_sugerida: formData.get('fecha_sugerida') as string || null,
      hora_sugerida: formData.get('hora_sugerida') as string || null,
      comentarios: formData.get('comentarios') as string || null
    }
    
    console.log('Sending data to backend:', data) // Debug log

    try {
      const response = await fetch('http://localhost:8000/api/solicitud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        
        // Handle validation errors (422)
        if (response.status === 422) {
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const validationErrors = errorData.detail.map((err: any) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
            throw new Error(`Error de validación: ${validationErrors}`)
          } else if (errorData.detail) {
            throw new Error(`Error de validación: ${errorData.detail}`)
          }
        }
        
        throw new Error(errorData.detail || `Error del servidor (${response.status})`)
      }

      const result = await response.json()
      console.log('Response from backend:', result) // Debug log

      if (result.success) {
        setSubmitMessage('¡Solicitud enviada exitosamente! Te contactaremos pronto.')
        // Reset form safely
        if (formRef.current) {
          formRef.current.reset()
        }
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose()
          setSubmitMessage('')
        }, 2000)
      } else {
        setSubmitMessage(`Error: ${result.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error sending request:', error) // Debug log
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setSubmitMessage(`Error al enviar la solicitud: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4">
        <div className="flex items-center justify-between px-6 py-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Solicita tu servicio</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="md:col-span-1">
              <nav className="sticky top-4 space-y-2">
                <a href="#datos-contacto" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Datos de contacto</a>
                <a href="#direccion" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Dirección</a>
                <a href="#tipo-servicio" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Tipo de servicio</a>
                <a href="#fecha-hora" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Fecha y hora</a>
                <a href="#comentarios" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Comentarios</a>
              </nav>
            </aside>

            {/* Form Body */}
            <form ref={formRef} onSubmit={handleSubmit} className="md:col-span-3 space-y-8 overflow-y-auto max-h-[70vh] pr-1" id="form-solicitud">
              {/* Nombre y contacto */}
              <section id="datos-contacto" className="space-y-5">
                <h4 className="text-lg font-semibold text-gray-900">Datos de contacto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input name="nombre" type="text" className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="Juan Pérez" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input name="telefono" type="tel" className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="+56 9 1234 5678" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                    <input name="email" type="email" className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="correo@ejemplo.com" required />
                  </div>
                </div>
              </section>

              {/* Dirección */}
              <section id="direccion" className="space-y-5">
                <h4 className="text-lg font-semibold text-gray-900">Dirección</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección completa</label>
                  <input name="direccion" type="text" className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="Calle 123, Ciudad" required />
                </div>
              </section>

              {/* Tipo de servicio */}
              <section id="tipo-servicio" className="space-y-5">
                <h4 className="text-lg font-semibold text-gray-900">Tipo de servicio</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona una opción</label>
                  <select name="tipo_servicio" className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green" defaultValue="curacion" required>
                    <option value="curacion">Curación</option>
                    <option value="control-presion">Control de presión</option>
                    <option value="acompanamiento">Acompañamiento</option>
                    <option value="inyecciones">Inyecciones</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
              </section>

              {/* Fecha/hora sugerida */}
              <section id="fecha-hora" className="space-y-5">
                <h4 className="text-lg font-semibold text-gray-900">Fecha y hora sugerida</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input name="fecha_sugerida" type="date" className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input name="hora_sugerida" type="time" className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green" />
                  </div>
                </div>
              </section>

              {/* Comentarios */}
              <section id="comentarios" className="space-y-5">
                <h4 className="text-lg font-semibold text-gray-900">Comentarios adicionales</h4>
                <textarea name="comentarios" className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green" rows={4} placeholder="Cuéntanos cualquier detalle importante..." />
              </section>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`p-4 rounded-xl ${submitMessage.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  {submitMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


