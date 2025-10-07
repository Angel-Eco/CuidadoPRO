'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { profesionalesAPI } from '@/services/api'
import ImageUpload from '../ImageUpload'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  XCircle,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Award
} from 'lucide-react'

interface Profesional {
  id: string
  nombre: string
  especialidad: string
  experiencia: number
  descripcion: string
  telefono?: string
  email?: string
  foto_url?: string
  activo: boolean
  orden: number
  created_at: string
  updated_at?: string
}

interface ProfesionalCreate {
  nombre: string
  especialidad: string
  experiencia: number
  descripcion: string
  telefono?: string
  email?: string
  foto_url?: string
  activo?: boolean
  orden?: number
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

export default function ProfesionalesTable() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([])
  const [filteredProfesionales, setFilteredProfesionales] = useState<Profesional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({
    especialidad: '',
    activo: ''
  })
  const [searchInput, setSearchInput] = useState('')
  const [selectedProfesional, setSelectedProfesional] = useState<Profesional | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profesionalToDelete, setProfesionalToDelete] = useState<Profesional | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('')
  
  const { token, isLoading } = useAuth()

  // Cargar todos los profesionales una sola vez
  useEffect(() => {
    if (token && !isLoading) {
      loadProfesionales()
    }
  }, [token, isLoading])

  // Filtrado local en tiempo real
  useEffect(() => {
    let filtered = [...profesionales]

    // Filtro por búsqueda (tiempo real)
    if (searchInput.trim()) {
      const searchTerm = searchInput.toLowerCase().trim()
      filtered = filtered.filter(profesional => 
        profesional.nombre.toLowerCase().includes(searchTerm) ||
        profesional.especialidad.toLowerCase().includes(searchTerm) ||
        profesional.descripcion.toLowerCase().includes(searchTerm) ||
        (profesional.email && profesional.email.toLowerCase().includes(searchTerm)) ||
        (profesional.telefono && profesional.telefono.includes(searchTerm))
      )
    }

    // Filtro por especialidad
    if (filtros.especialidad) {
      filtered = filtered.filter(profesional => profesional.especialidad === filtros.especialidad)
    }

    // Filtro por estado activo
    if (filtros.activo) {
      const isActive = filtros.activo === 'activo'
      filtered = filtered.filter(profesional => profesional.activo === isActive)
    }

    setFilteredProfesionales(filtered)
  }, [profesionales, searchInput, filtros.especialidad, filtros.activo])

  const loadProfesionales = async () => {
    try {
      setLoading(true)
      const data = await profesionalesAPI.getAll(token!, { limit: 100 })
      setProfesionales(data.profesionales)
      setFilteredProfesionales(data.profesionales)
    } catch (error) {
      console.error('Error loading profesionales:', error)
      setError('Error al cargar los profesionales')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActivo = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(true)
      await profesionalesAPI.update(id, { activo: !currentStatus }, token!)
      
      // Actualizar el estado local inmediatamente
      setProfesionales(prev => prev.map(p => 
        p.id === id ? { ...p, activo: !currentStatus } : p
      ))
      setFilteredProfesionales(prev => prev.map(p => 
        p.id === id ? { ...p, activo: !currentStatus } : p
      ))
    } catch (error) {
      console.error('Error updating profesional status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleCreateProfesional = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUpdating(true)

    const formData = new FormData(e.currentTarget)
    const newProfesional = {
      nombre: formData.get('nombre') as string,
      especialidad: formData.get('especialidad') as string,
      telefono: (formData.get('telefono') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      descripcion: formData.get('descripcion') as string || `Profesional especializado en ${formData.get('especialidad') as string}`,
      experiencia: parseInt(formData.get('experiencia') as string) || 0,
      orden: parseInt(formData.get('orden') as string) || 1,
      activo: formData.get('activo') === 'on',
      foto_url: selectedImageUrl || undefined
    }

    try {
      const createdProfesional = await profesionalesAPI.create(newProfesional, token!)
      
      // Actualizar el estado local
      setProfesionales(prev => [...prev, createdProfesional])
      setFilteredProfesionales(prev => [...prev, createdProfesional])
      
      // Cerrar el modal
      setShowCreateModal(false)
      setSelectedImageUrl('')
      
      // Limpiar el formulario
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error creating profesional:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteClick = (profesional: Profesional) => {
    setProfesionalToDelete(profesional)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!profesionalToDelete) return
    
    try {
      await profesionalesAPI.delete(profesionalToDelete.id, token!)
      
      // Actualizar el estado local inmediatamente
      setProfesionales(prev => prev.filter(p => p.id !== profesionalToDelete.id))
      setFilteredProfesionales(prev => prev.filter(p => p.id !== profesionalToDelete.id))
      
      // Cerrar el modal
      setShowDeleteModal(false)
      setProfesionalToDelete(null)
    } catch (error) {
      console.error('Error deleting profesional:', error)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setProfesionalToDelete(null)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const getEspecialidadLabel = (especialidad: string) => {
    const found = ESPECIALIDADES.find(e => e.value === especialidad)
    return found ? found.label : especialidad
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Profesionales</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona el equipo de profesionales de enfermería.
            {filteredProfesionales.length !== profesionales.length && (
              <span className="ml-2 text-primary-green font-medium">
                ({filteredProfesionales.length} de {profesionales.length} resultados)
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-green px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-green/90 focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Profesional
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, especialidad..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 text-sm"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                title="Limpiar búsqueda"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Especialidad Filter */}
          <select
            value={filtros.especialidad}
            onChange={(e) => setFiltros(prev => ({ ...prev, especialidad: e.target.value }))}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 text-sm bg-white"
          >
            <option value="">Todas las especialidades</option>
            {ESPECIALIDADES.map(especialidad => (
              <option key={especialidad.value} value={especialidad.value}>
                {especialidad.label}
              </option>
            ))}
          </select>

          {/* Estado Filter */}
          <select
            value={filtros.activo}
            onChange={(e) => setFiltros(prev => ({ ...prev, activo: e.target.value }))}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 text-sm bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setFiltros({ especialidad: '', activo: '' })
              setSearchInput('')
            }}
            className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {filteredProfesionales.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay profesionales</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchInput || filtros.especialidad || filtros.activo 
                  ? 'No se encontraron profesionales con los filtros aplicados.'
                  : 'No hay profesionales registrados aún.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Especialidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experiencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProfesionales.map((profesional) => (
                    <tr key={profesional.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {profesional.foto_url ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={profesional.foto_url}
                                alt={profesional.nombre}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {profesional.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              Orden: {profesional.orden}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getEspecialidadLabel(profesional.especialidad)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-900">
                            {profesional.experiencia} años
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActivo(profesional.id, profesional.activo)}
                          disabled={updating}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            profesional.activo
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          {profesional.activo ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Activo
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactivo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(profesional.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProfesional(profesional)
                              setShowModal(true)
                            }}
                            className="text-primary-green hover:text-primary-green/80 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProfesional(profesional)
                              setShowModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(profesional)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para ver/editar profesional */}
      {showModal && selectedProfesional && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedProfesional.nombre}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProfesional.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {getEspecialidadLabel(selectedProfesional.especialidad)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experiencia</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProfesional.experiencia} años</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedProfesional.activo ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                  {selectedProfesional.telefono && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {selectedProfesional.telefono}
                      </p>
                    </div>
                  )}
                  {selectedProfesional.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {selectedProfesional.email}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProfesional.descripcion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear nuevo profesional */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Nuevo Profesional
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setSelectedImageUrl('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateProfesional} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                    placeholder="Ej: María González"
                  />
                </div>

                <div>
                  <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">
                    Especialidad *
                  </label>
                  <select
                    id="especialidad"
                    name="especialidad"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                  >
                    <option value="">Seleccionar especialidad</option>
                    <option value="Enfermería General">Enfermería General</option>
                    <option value="Enfermería Geriátrica">Enfermería Geriátrica</option>
                    <option value="Enfermería Pediátrica">Enfermería Pediátrica</option>
                    <option value="Cuidados Intensivos">Cuidados Intensivos</option>
                    <option value="Enfermería Oncológica">Enfermería Oncológica</option>
                    <option value="Enfermería de Urgencias">Enfermería de Urgencias</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                    placeholder="Ej: +34 600 123 456"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                    placeholder="Ej: maria.gonzalez@enfermeria.com"
                  />
                </div>


                <div>
                  <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700">
                    Años de Experiencia *
                  </label>
                  <input
                    type="number"
                    id="experiencia"
                    name="experiencia"
                    required
                    min="0"
                    max="50"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                    placeholder="Ej: 5"
                  />
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                    Descripción *
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                    placeholder="Descripción del profesional y sus especialidades..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto del Profesional
                  </label>
                  <ImageUpload
                    onImageUpload={setSelectedImageUrl}
                    onImageRemove={() => setSelectedImageUrl('')}
                    currentImageUrl={selectedImageUrl}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="orden" className="block text-sm font-medium text-gray-700">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    id="orden"
                    name="orden"
                    min="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                    placeholder="1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    defaultChecked
                    className="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
                  />
                  <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                    Profesional activo
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setSelectedImageUrl('')
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-green border border-transparent rounded-md hover:bg-primary-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green disabled:opacity-50"
                  >
                    {updating ? 'Creando...' : 'Crear Profesional'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar profesional */}
      {showDeleteModal && profesionalToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Icono de advertencia */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Título */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Eliminar Profesional
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  ¿Estás seguro de que quieres eliminar este profesional? Esta acción no se puede deshacer.
                </p>
                
                {/* Información del profesional */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      {profesionalToDelete.foto_url ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={profesionalToDelete.foto_url}
                          alt={profesionalToDelete.nombre}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {profesionalToDelete.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getEspecialidadLabel(profesionalToDelete.especialidad)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {profesionalToDelete.experiencia} años de experiencia
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones */}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


