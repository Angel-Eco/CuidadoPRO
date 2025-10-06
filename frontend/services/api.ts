// API service for backend communication

const API_BASE_URL = 'http://localhost:8000/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

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
  estado: string
  fecha: string
  updated_at?: string
}

interface Profesional {
  id: string
  nombre: string
  especialidad: string
  experiencia: number
  descripcion: string
  telefono?: string
  email?: string
  imagen_url?: string
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
  imagen_url?: string
  activo?: boolean
  orden?: number
}

interface ProfesionalUpdate {
  nombre?: string
  especialidad?: string
  experiencia?: number
  descripcion?: string
  telefono?: string
  email?: string
  imagen_url?: string
  activo?: boolean
  orden?: number
}

interface SolicitudStats {
  total: number
  pendientes: number
  confirmadas: number
  en_progreso: number
  completadas: number
  canceladas: number
  por_tipo_servicio: Record<string, number>
  por_mes: Record<string, number>
}

interface User {
  id: string
  username: string
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'viewer'
  is_active: boolean
  created_at: string
  last_login: string | null
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    return apiRequest<{
      access_token: string
      token_type: string
      user: User
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  getCurrentUser: async (token: string) => {
    return apiRequest<User>('/auth/me', {
      method: 'GET',
    }, token)
  },

  changePassword: async (currentPassword: string, newPassword: string, token: string) => {
    return apiRequest<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }, token)
  },

  getUsers: async (token: string) => {
    return apiRequest<User[]>('/auth/users', {
      method: 'GET',
    }, token)
  },

  registerUser: async (userData: {
    username: string
    email: string
    password: string
    full_name: string
    role: string
  }, token: string) => {
    return apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, token)
  },
}

// Admin API
export const adminAPI = {
  getSolicitudes: async (token: string, params?: {
    estado?: string
    tipo_servicio?: string
    limit?: number
    offset?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.estado) queryParams.append('estado', params.estado)
    if (params?.tipo_servicio) queryParams.append('tipo_servicio', params.tipo_servicio)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    
    const queryString = queryParams.toString()
    const endpoint = `/admin/solicitudes${queryString ? `?${queryString}` : ''}`
    
    return apiRequest<Solicitud[]>(endpoint, {
      method: 'GET',
    }, token)
  },

  getSolicitudById: async (id: string, token: string) => {
    return apiRequest<Solicitud>(`/admin/solicitudes/${id}`, {
      method: 'GET',
    }, token)
  },

  updateSolicitudStatus: async (id: string, updateData: {
    estado: string
    comentarios_admin?: string
  }, token: string) => {
    return apiRequest<{
      success: boolean
      message: string
      data: Solicitud
    }>(`/admin/solicitudes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }, token)
  },

  getStatistics: async (token: string) => {
    return apiRequest<SolicitudStats>('/admin/estadisticas', {
      method: 'GET',
    }, token)
  },

  getPendingSolicitudes: async (token: string) => {
    return apiRequest<Solicitud[]>('/admin/solicitudes-pendientes', {
      method: 'GET',
    }, token)
  },

  deleteSolicitud: async (id: string, token: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>(`/admin/solicitudes/${id}`, {
      method: 'DELETE',
    }, token)
  },
}

// API para profesionales
export const profesionalesAPI = {
  // Obtener profesionales activos (público)
  getActivos: async () => {
    return apiRequest<Profesional[]>('/profesionales/public/activos', {
      method: 'GET',
    })
  },

  // Obtener todos los profesionales (admin)
  getAll: async (token: string, params?: {
    activo?: boolean
    especialidad?: string
    limit?: number
    offset?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.activo !== undefined) queryParams.append('activo', params.activo.toString())
    if (params?.especialidad) queryParams.append('especialidad', params.especialidad)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())

    const url = `/admin/profesionales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiRequest<{
      profesionales: Profesional[]
      total: number
    }>(url, {
      method: 'GET',
    }, token)
  },

  // Obtener un profesional específico
  getById: async (id: string, token: string) => {
    return apiRequest<Profesional>(`/admin/profesionales/${id}`, {
      method: 'GET',
    }, token)
  },

  // Crear nuevo profesional
  create: async (profesional: ProfesionalCreate, token: string) => {
    return apiRequest<Profesional>('/admin/profesionales', {
      method: 'POST',
      body: JSON.stringify(profesional),
    }, token)
  },

  // Actualizar profesional
  update: async (id: string, profesional: ProfesionalUpdate, token: string) => {
    return apiRequest<Profesional>(`/admin/profesionales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profesional),
    }, token)
  },

  // Eliminar profesional
  delete: async (id: string, token: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>(`/admin/profesionales/${id}`, {
      method: 'DELETE',
    }, token)
  },
}

// Public API (for contact form)
export const publicAPI = {
  createSolicitud: async (solicitudData: {
    nombre: string
    telefono: string
    email: string
    direccion: string
    tipo_servicio: string
    fecha_sugerida?: string
    hora_sugerida?: string
    comentarios?: string
  }) => {
    return apiRequest<{
      success: boolean
      message: string
      data: Solicitud
    }>('/solicitud', {
      method: 'POST',
      body: JSON.stringify(solicitudData),
    })
  },

  getSolicitudes: async () => {
    return apiRequest<{
      success: boolean
      data: Solicitud[]
    }>('/solicitudes', {
      method: 'GET',
    })
  },
}

