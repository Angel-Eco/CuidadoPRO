'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { adminAPI } from '@/services/api'
import Link from 'next/link'
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react'

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

export default function Dashboard() {
  const [stats, setStats] = useState<SolicitudStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, token } = useAuth()

  useEffect(() => {
    if (token) {
      loadStatistics()
    }
  }, [token])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getStatistics(token!)
      setStats(data)
    } catch (error) {
      setError('Error al cargar las estadísticas')
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Solicitudes',
      value: stats?.total || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Pendientes',
      value: stats?.pendientes || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'En Progreso',
      value: stats?.en_progreso || 0,
      icon: Activity,
      color: 'bg-orange-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Completadas',
      value: stats?.completadas || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+15%',
      changeType: 'positive'
    }
  ]

  const statusCards = [
    {
      name: 'Confirmadas',
      value: stats?.confirmadas || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Canceladas',
      value: stats?.canceladas || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadStatistics}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido, {user?.full_name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Aquí tienes un resumen de las actividades de enfermería a domicilio.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {statusCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.bgColor} p-3 rounded-md`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Service Types Chart */}
      {stats?.por_tipo_servicio && Object.keys(stats.por_tipo_servicio).length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Solicitudes por Tipo de Servicio
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.por_tipo_servicio).map(([tipo, cantidad]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {tipo.replace('-', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-green h-2 rounded-full"
                        style={{
                          width: `${(cantidad / stats.total) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">
                      {cantidad}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Chart */}
      {stats?.por_mes && Object.keys(stats.por_mes).length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Solicitudes por Mes (Últimos 12 meses)
            </h3>
            <div className="grid grid-cols-6 gap-4">
              {Object.entries(stats.por_mes)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(-6)
                .map(([mes, cantidad]) => (
                  <div key={mes} className="text-center">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(mes + '-01').toLocaleDateString('es', { 
                        month: 'short', 
                        year: '2-digit' 
                      })}
                    </div>
                    <div className="bg-primary-green rounded h-8 flex items-end justify-center">
                      <span className="text-xs text-white mb-1">
                        {cantidad}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/admin/solicitudes?estado=pendiente"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-green rounded-lg border border-gray-200 hover:border-primary-green"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <Clock className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Ver Solicitudes Pendientes
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Revisar y gestionar las solicitudes que requieren atención.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/solicitudes"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-green rounded-lg border border-gray-200 hover:border-primary-green"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <FileText className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Todas las Solicitudes
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Ver y gestionar todas las solicitudes del sistema.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/configuracion"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-green rounded-lg border border-gray-200 hover:border-primary-green"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-gray-50 text-gray-700 ring-4 ring-white">
                  <Calendar className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Configuración
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Configurar parámetros del sistema y usuarios.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}




