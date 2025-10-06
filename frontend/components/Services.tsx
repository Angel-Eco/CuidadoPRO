'use client'

import { useState } from 'react'
import { Syringe, Heart, Activity, Stethoscope, Shield, Clock } from 'lucide-react'
import ServiceRequestModal from './ServiceRequestModal'

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const services = [
    {
      icon: <Syringe className="w-8 h-8" />,
      title: "Curaciones",
      description: "Atención especializada para heridas, post-operatorios y lesiones. Técnicas avanzadas de curación con materiales de primera calidad.",
      features: ["Heridas post-operatorias", "Úlceras por presión", "Quemaduras", "Lesiones deportivas"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Inyecciones",
      description: "Aplicación segura de medicamentos inyectables, vacunas y tratamientos especializados en la comodidad de tu hogar.",
      features: ["Vacunas", "Medicamentos inyectables", "Insulinas", "Tratamientos especializados"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Controles de Salud",
      description: "Monitoreo completo de signos vitales, seguimiento de tratamientos y evaluación del estado general de salud.",
      features: ["Signos vitales", "Presión arterial", "Glucemia", "Seguimiento médico"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Atención Domiciliaria",
      description: "Cuidados integrales en casa para pacientes con necesidades especiales, adultos mayores y personas con movilidad reducida.",
      features: ["Cuidados geriátricos", "Rehabilitación", "Acompañamiento", "Soporte familiar"],
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Emergencias 24/7",
      description: "Servicio de emergencia disponible las 24 horas para situaciones que requieren atención inmediata y especializada.",
      features: ["Respuesta inmediata", "Equipos especializados", "Coordinación médica", "Soporte continuo"],
      color: "from-red-500 to-red-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Cuidados Continuos",
      description: "Programas de seguimiento y monitoreo continuo para pacientes con condiciones crónicas o en recuperación.",
      features: ["Monitoreo continuo", "Planes personalizados", "Reportes médicos", "Coordinación familiar"],
      color: "from-teal-500 to-teal-600"
    }
  ]

  return (
    <section id="servicios" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-green/10 text-primary-green px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>Nuestros Servicios</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cuidados especializados para{' '}
            <span className="text-primary-green">tu bienestar</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ofrecemos una amplia gama de servicios de enfermería profesional 
            diseñados para brindarte la mejor atención en la comodidad de tu hogar.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="card p-8 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-green transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-green rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Effect */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-gray-100 hover:bg-primary-green hover:text-white text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                    Más información
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Necesitas un servicio específico?
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo está preparado para brindarte atención personalizada 
              según tus necesidades específicas. Contáctanos para más información.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                Solicitar servicio
              </button>
              <button className="btn-secondary">
                Consultar disponibilidad
              </button>
            </div>
          </div>
        </div>
      </div>
      <ServiceRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

