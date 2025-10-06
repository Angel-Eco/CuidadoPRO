'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { adminAPI } from '@/services/api'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity,
  Filter,
  Search,
  FileText,
  Settings
} from 'lucide-react'

interface Solicitud {
  id: string
  nombre: string
  telefono: string
  email: string
  direccion: string
  tipo_servicio: string
  fecha_sugerida?: string
  hora_sugerida?: string
  comentarios?: string
  estado: string | null
  fecha: string
  updated_at?: string
}

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
]

const TIPOS_SERVICIO = [
  { value: '', label: 'Todos los servicios' },
  { value: 'curacion', label: 'Curación' },
  { value: 'control-presion', label: 'Control de presión' },
  { value: 'acompanamiento', label: 'Acompañamiento' },
  { value: 'inyecciones', label: 'Inyecciones' },
  { value: 'otros', label: 'Otros' },
]

export default function SolicitudesTable() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({
    estado: '',
    tipo_servicio: '',
    search: ''
  })
  const [searchInput, setSearchInput] = useState('') // Estado separado para el input
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [solicitudToDelete, setSolicitudToDelete] = useState<Solicitud | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [solicitudToUpdate, setSolicitudToUpdate] = useState<Solicitud | null>(null)
  
  const { token } = useAuth()

  // Función para detectar si una solicitud está cancelada
  const isSolicitudCancelada = (solicitud: Solicitud) => {
    return solicitud.comentarios?.includes('[CANCELADA]') || false
  }

  // Cargar todas las solicitudes una sola vez
  useEffect(() => {
    if (token) {
      loadSolicitudes()
    }
  }, [token])

  // Filtrado local en tiempo real
  useEffect(() => {
    let filtered = [...solicitudes]

    // Filtro por búsqueda (tiempo real)
    if (searchInput.trim()) {
      const searchTerm = searchInput.toLowerCase().trim()
      filtered = filtered.filter(solicitud => 
        solicitud.nombre.toLowerCase().includes(searchTerm) ||
        solicitud.email.toLowerCase().includes(searchTerm) ||
        solicitud.telefono.toLowerCase().includes(searchTerm) ||
        solicitud.direccion.toLowerCase().includes(searchTerm)
      )
    }

    // Filtro por estado
    if (filtros.estado) {
      filtered = filtered.filter(solicitud => solicitud.estado === filtros.estado)
    }

    // Filtro por tipo de servicio
    if (filtros.tipo_servicio) {
      filtered = filtered.filter(solicitud => solicitud.tipo_servicio === filtros.tipo_servicio)
    }

    setFilteredSolicitudes(filtered)
  }, [solicitudes, searchInput, filtros.estado, filtros.tipo_servicio])

  const loadSolicitudes = async () => {
    try {
      setLoading(true)
      // Cargar todas las solicitudes sin filtros para filtrado local
      const data = await adminAPI.getSolicitudes(token!, { limit: 100 })
      setSolicitudes(data)
      setFilteredSolicitudes(data) // Inicializar con todos los datos
    } catch (error) {
      setError('Error al cargar las solicitudes')
      console.error('Error loading solicitudes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, nuevoEstado: string, comentariosAdmin?: string) => {
    try {
      setUpdating(true)
      const updateData: { estado: string; comentarios_admin?: string } = { estado: nuevoEstado }
      if (comentariosAdmin && comentariosAdmin.trim()) {
        updateData.comentarios_admin = comentariosAdmin.trim()
      }
      
      await adminAPI.updateSolicitudStatus(id, updateData, token!)
      
      // Actualizar el estado local inmediatamente
      setSolicitudes(prev => prev.map(s => 
        s.id === id ? { ...s, estado: nuevoEstado } : s
      ))
      setFilteredSolicitudes(prev => prev.map(s => 
        s.id === id ? { ...s, estado: nuevoEstado } : s
      ))
      setShowModal(false)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteClick = (solicitud: Solicitud) => {
    setSolicitudToDelete(solicitud)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!solicitudToDelete) return
    
    try {
      await adminAPI.deleteSolicitud(solicitudToDelete.id, token!)
      
      // Actualizar el estado local marcando como cancelada
      setSolicitudes(prev => prev.map(s => 
        s.id === solicitudToDelete.id 
          ? { ...s, comentarios: `[CANCELADA] Solicitud cancelada por el administrador\n${s.comentarios || ''}` }
          : s
      ))
      setFilteredSolicitudes(prev => prev.map(s => 
        s.id === solicitudToDelete.id 
          ? { ...s, comentarios: `[CANCELADA] Solicitud cancelada por el administrador\n${s.comentarios || ''}` }
          : s
      ))
      
      // Cerrar el modal
      setShowDeleteModal(false)
      setSolicitudToDelete(null)
    } catch (error) {
      console.error('Error deleting solicitud:', error)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setSolicitudToDelete(null)
  }

  const handleStatusChangeClick = (solicitud: Solicitud) => {
    setSolicitudToUpdate(solicitud)
    setShowStatusModal(true)
  }

  const handleStatusChangeConfirm = async (nuevoEstado: string) => {
    if (!solicitudToUpdate) return
    
    try {
      await adminAPI.updateSolicitudStatus(solicitudToUpdate.id, { estado: nuevoEstado }, token!)
      
      // Actualizar el estado local inmediatamente
      setSolicitudes(prev => prev.map(s => 
        s.id === solicitudToUpdate.id ? { ...s, estado: nuevoEstado } : s
      ))
      setFilteredSolicitudes(prev => prev.map(s => 
        s.id === solicitudToUpdate.id ? { ...s, estado: nuevoEstado } : s
      ))
      
      // Cerrar el modal
      setShowStatusModal(false)
      setSolicitudToUpdate(null)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleStatusChangeCancel = () => {
    setShowStatusModal(false)
    setSolicitudToUpdate(null)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // La búsqueda ya es en tiempo real, no necesitamos hacer nada especial
      e.preventDefault()
    }
  }

  const getEstadoBadge = (estado: string | null) => {
    const badges = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmada: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      en_progreso: { color: 'bg-orange-100 text-orange-800', icon: Activity },
      completada: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelada: { color: 'bg-red-100 text-red-800', icon: XCircle },
      sin_estado: { color: 'bg-gray-100 text-gray-800', icon: Clock },
    }
    
    // Si estado es null, usar el badge por defecto
    const estadoKey = estado || 'sin_estado'
    const badge = badges[estadoKey as keyof typeof badges] || badges.sin_estado
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {estado ? estado.replace('_', ' ') : 'Sin estado'}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
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
          <h1 className="text-xl font-semibold text-gray-900">Solicitudes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona todas las solicitudes de servicios de enfermería.
            {filteredSolicitudes.length !== solicitudes.length && (
              <span className="ml-2 text-primary-green font-medium">
                ({filteredSolicitudes.length} de {solicitudes.length} resultados)
              </span>
            )}
          </p>
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
              placeholder="Buscar por nombre, email o teléfono..."
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

          {/* Estado Filter */}
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 text-sm bg-white"
          >
            {ESTADOS.map(estado => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>

          {/* Tipo Servicio Filter */}
          <select
            value={filtros.tipo_servicio}
            onChange={(e) => setFiltros(prev => ({ ...prev, tipo_servicio: e.target.value }))}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 text-sm bg-white"
          >
            {TIPOS_SERVICIO.map(tipo => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setFiltros({ estado: '', tipo_servicio: '', search: '' })
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

          {filteredSolicitudes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchInput || filtros.estado || filtros.tipo_servicio 
                  ? 'No se encontraron solicitudes con los filtros aplicados.'
                  : 'No hay solicitudes registradas aún.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
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
                  {filteredSolicitudes.map((solicitud) => {
                    const isCancelada = isSolicitudCancelada(solicitud)
                    return (
                    <tr key={solicitud.id} className={`hover:bg-gray-50 ${isCancelada ? 'bg-red-50 opacity-75' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {solicitud.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {solicitud.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {solicitud.telefono}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {solicitud.tipo_servicio.replace('-', ' ')}
                        </div>
                        {solicitud.fecha_sugerida && (
                          <div className="text-sm text-gray-500">
                            {formatDate(solicitud.fecha_sugerida)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isCancelada ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Cancelada
                          </span>
                        ) : (
                          getEstadoBadge(solicitud.estado)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(solicitud.fecha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSolicitud(solicitud)
                              setShowModal(true)
                            }}
                            className="text-primary-green hover:text-primary-green/80"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChangeClick(solicitud)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Cambiar estado"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                          {!isCancelada && (
                            <button
                              onClick={() => handleDeleteClick(solicitud)}
                              className="text-red-600 hover:text-red-800"
                              title="Cancelar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedSolicitud && (
        <SolicitudModal
          solicitud={selectedSolicitud}
          onClose={() => {
            setShowModal(false)
            setSelectedSolicitud(null)
          }}
          onUpdateStatus={handleUpdateStatus}
          updating={updating}
        />
      )}

      {/* Modal de confirmación para cancelar solicitud */}
      {showDeleteModal && solicitudToDelete && (
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
                  Cancelar Solicitud
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  ¿Estás seguro de que quieres cancelar esta solicitud?
                </p>
                
                {/* Información de la solicitud */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{solicitudToDelete.nombre}</div>
                    <div className="text-gray-500">{solicitudToDelete.email}</div>
                    <div className="text-gray-500 capitalize">
                      {solicitudToDelete.tipo_servicio.replace('-', ' ')}
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
                  Sí, Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para cambiar estado de solicitud */}
      {showStatusModal && solicitudToUpdate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Icono de configuración */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              
              {/* Título */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Cambiar Estado de Solicitud
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Selecciona el nuevo estado para esta solicitud.
                </p>
                
                {/* Información de la solicitud */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{solicitudToUpdate.nombre}</div>
                    <div className="text-gray-500">{solicitudToUpdate.email}</div>
                    <div className="text-gray-500 capitalize">
                      {solicitudToUpdate.tipo_servicio.replace('-', ' ')}
                    </div>
                    <div className="text-gray-500">
                      Estado actual: <span className="font-medium">{solicitudToUpdate.estado || 'pendiente'}</span>
                    </div>
                  </div>
                </div>

                {/* Selector de estado */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nuevo Estado
                  </label>
                  <select
                    id="nuevo-estado"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                    defaultValue={solicitudToUpdate.estado || 'pendiente'}
                  >
                    {ESTADOS.slice(1).map(estado => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Botones */}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleStatusChangeCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const select = document.getElementById('nuevo-estado') as HTMLSelectElement
                    handleStatusChangeConfirm(select.value)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-green border border-transparent rounded-md hover:bg-primary-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
                >
                  Cambiar Estado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Modal component for viewing/editing solicitud
function SolicitudModal({ 
  solicitud, 
  onClose, 
  onUpdateStatus, 
  updating 
}: { 
  solicitud: Solicitud
  onClose: () => void
  onUpdateStatus: (id: string, estado: string | null, comentariosAdmin?: string) => void
  updating: boolean
}) {
  const [selectedEstado, setSelectedEstado] = useState(solicitud.estado || 'pendiente')

  const handleSave = () => {
    const comentariosAdmin = (document.getElementById('comentarios-admin') as HTMLTextAreaElement)?.value || ''
    
    if (selectedEstado !== solicitud.estado || comentariosAdmin.trim()) {
      onUpdateStatus(solicitud.id, selectedEstado, comentariosAdmin)
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Detalles y Gestión de Solicitud
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cliente</label>
                    <p className="mt-1 text-sm text-gray-900">{solicitud.nombre}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contacto</label>
                    <p className="mt-1 text-sm text-gray-900">{solicitud.email}</p>
                    <p className="text-sm text-gray-900">{solicitud.telefono}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900">{solicitud.direccion}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Servicio</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {solicitud.tipo_servicio.replace('-', ' ')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      value={selectedEstado}
                      onChange={(e) => setSelectedEstado(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                      disabled={updating}
                    >
                      {ESTADOS.slice(1).map(estado => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Cambia el estado de la solicitud según su progreso
                    </p>
                  </div>
                  
                  {solicitud.comentarios && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Comentarios del Cliente</label>
                      <p className="mt-1 text-sm text-gray-900">{solicitud.comentarios}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comentarios del Administrador</label>
                    <textarea
                      id="comentarios-admin"
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                      placeholder="Agregar comentarios internos sobre esta solicitud..."
                      disabled={updating}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Estos comentarios son solo visibles para administradores
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              disabled={updating}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-green text-base font-medium text-white hover:bg-primary-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {updating ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
