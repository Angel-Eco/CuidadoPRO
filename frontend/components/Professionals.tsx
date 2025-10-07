'use client'

import { useState, useEffect } from 'react'
import { profesionalesAPI } from '@/services/api'
import { Award, Mail, Phone } from 'lucide-react'

interface Profesional {
  id: string
  nombre: string
  especialidad: string
  experiencia: number
  descripcion: string
  telefono?: string
  email?: string
  imagen_url?: string
  foto_url?: string
  activo: boolean
  orden: number
  created_at: string
  updated_at?: string
}

const ESPECIALIDADES = [
  { value: 'enfermeria_general', label: 'Enfermería General' },
  { value: 'enfermeria_geriatrica', label: 'Enfermería Geriátrica' },
  { value: 'enfermeria_pediatrica', label: 'Enfermería Pediátrica' },
  { value: 'enfermeria_critica', label: 'Enfermería Crítica' },
  { value: 'enfermeria_comunitaria', label: 'Enfermería Comunitaria' },
  { value: 'cuidados_paliativos', label: 'Cuidados Paliativos' },
  { value: 'rehabilitacion', label: 'Rehabilitación' },
  { value: 'otros', label: 'Otros' }
]

export default function Professionals() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfesionales()
  }, [])

  const loadProfesionales = async () => {
    try {
      setLoading(true)
      const data = await profesionalesAPI.getActivos()
      setProfesionales(data)
    } catch (error) {
      console.error('Error loading profesionales:', error)
      setError('Error al cargar los profesionales')
    } finally {
      setLoading(false)
    }
  }

  const getEspecialidadLabel = (especialidad: string) => {
    const found = ESPECIALIDADES.find(e => e.value === especialidad)
    return found ? found.label : especialidad
  }

  return (
    <section id="profesionales" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-green/10 text-primary-green px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>Nuestro Equipo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Nuestros Profesionales</h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {profesionales.length > 0 ? (
              profesionales.map((profesional) => (
                <div key={profesional.id} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="w-28 h-28 mx-auto mb-6">
                    {(profesional.foto_url || profesional.imagen_url) ? (
                      <img
                        src={profesional.foto_url || profesional.imagen_url}
                        alt={profesional.nombre}
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-full border-4 border-white shadow flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                          {profesional.nombre.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{profesional.nombre}</h3>
                  <p className="text-primary-green font-medium mb-3">
                    {getEspecialidadLabel(profesional.especialidad)}
                  </p>
                  
                  <div className="flex items-center justify-center mb-3">
                    <Award className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {profesional.experiencia} años de experiencia
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {profesional.descripcion}
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {profesional.telefono && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-1" />
                        {profesional.telefono}
                      </div>
                    )}
                    {profesional.email && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {profesional.email}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No hay profesionales disponibles en este momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}



