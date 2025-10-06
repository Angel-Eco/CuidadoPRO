import { Users, Award, Clock, Shield, Heart, CheckCircle } from 'lucide-react'

export default function Benefits() {
  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personalización",
      description: "Cada paciente recibe un plan de cuidados único y adaptado a sus necesidades específicas, garantizando la mejor atención posible.",
      details: [
        "Evaluación individualizada",
        "Planes de cuidado personalizados",
        "Adaptación a horarios específicos",
        "Seguimiento personalizado"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Profesionalismo",
      description: "Nuestro equipo está compuesto por enfermeros certificados con amplia experiencia y formación continua en las mejores prácticas.",
      details: [
        "Personal certificado y licenciado",
        "Formación continua actualizada",
        "Protocolos de seguridad estrictos",
        "Experiencia comprobada"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Disponibilidad",
      description: "Servicio 24/7 para emergencias y atención programada, adaptándonos a tus horarios y necesidades urgentes.",
      details: [
        "Disponibilidad 24 horas",
        "Respuesta rápida a emergencias",
        "Flexibilidad de horarios",
        "Servicio en fines de semana"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Confianza",
      description: "Más de 5 años brindando servicios de calidad, con protocolos de seguridad y confidencialidad que garantizan tu tranquilidad.",
      details: [
        "Confidencialidad garantizada",
        "Protocolos de seguridad",
        "Seguro de responsabilidad civil",
        "Historial de excelencia"
      ],
      color: "from-orange-500 to-orange-600"
    }
  ]

  const stats = [
    { number: "500+", label: "Pacientes atendidos", icon: <Heart className="w-6 h-6" /> },
    { number: "24/7", label: "Disponibilidad", icon: <Clock className="w-6 h-6" /> },
    { number: "98%", label: "Satisfacción", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "5+", label: "Años de experiencia", icon: <Award className="w-6 h-6" /> }
  ]

  return (
    <section id="beneficios" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>¿Por qué elegirnos?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Beneficios que nos{' '}
            <span className="text-primary-blue">distinguen</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nuestro compromiso es brindarte la mejor experiencia en cuidados de enfermería, 
            con valores fundamentales que nos guían en cada servicio.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="card p-8 h-full">
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-4 flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-blue transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-2">
                      {benefit.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-primary-green flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-blue to-primary-green rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Números que respaldan nuestro compromiso
            </h3>
            <p className="text-xl opacity-90">
              La confianza de nuestros pacientes se refleja en estos resultados
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Certificaciones y garantías
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="w-8 h-8 text-primary-green" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Seguro de Responsabilidad</div>
                  <div className="text-sm text-gray-600">Cobertura completa</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Award className="w-8 h-8 text-primary-blue" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Certificaciones</div>
                  <div className="text-sm text-gray-600">Personal licenciado</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-8 h-8 text-primary-green" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Garantía de Calidad</div>
                  <div className="text-sm text-gray-600">Protocolos estrictos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

