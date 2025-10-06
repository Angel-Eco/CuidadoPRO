'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import ServiceRequestModal from './ServiceRequestModal'

export default function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Teléfono",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "Línea directa 24/7"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@cuidado.com", "emergencias@cuidado.com"],
      description: "Respuesta en menos de 2 horas"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Ubicación",
      details: ["123 Calle Salud", "Ciudad, CP 12345"],
      description: "Oficina principal"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Horarios",
      details: ["24/7 Disponible", "Emergencias inmediatas"],
      description: "Servicio continuo"
    }
  ]


  return (
    <section id="contacto" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>Contacto</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Estamos aquí para{' '}
            <span className="text-primary-blue">ayudarte</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Contáctanos para solicitar nuestros servicios o resolver cualquier duda. 
            Nuestro equipo está disponible 24/7 para brindarte la mejor atención.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Información de contacto
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center text-primary-blue flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h4>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-gray-500 mt-1">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900">Emergencias</h4>
                  <p className="text-red-700 text-sm">Línea directa 24/7</p>
                </div>
              </div>
              <p className="text-red-800 font-semibold text-lg">
                +1 (555) 911-HELP
              </p>
              <p className="text-red-600 text-sm mt-2">
                Para situaciones que requieren atención inmediata
              </p>
            </div>
          </div>

          {/* Service Request Button */}
          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Necesitas nuestros servicios?
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Solicita tu servicio de enfermería a domicilio de manera rápida y sencilla. 
              Nuestro equipo está listo para brindarte la mejor atención.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              Solicitar servicio
            </button>
            <p className="text-sm text-gray-500 mt-6">
              Respuesta garantizada en menos de 2 horas
            </p>
          </div>
        </div>
      </div>
      <ServiceRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

