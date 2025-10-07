'use client'

import { useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import ServiceRequestModal from './ServiceRequestModal'

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const testimonials = [
    {
      name: "María González",
      role: "Paciente",
      location: "Ciudad de México",
      rating: 5,
      text: "El servicio de CuidadoPro ha sido excepcional. La enfermera que me atendió fue muy profesional y cariñosa. Me ayudó con mis curaciones post-operatorias y siempre llegó puntual. Definitivamente los recomiendo.",
      service: "Curaciones post-operatorias",
      image: "👩‍🦱"
    },
    {
      name: "Carlos Rodríguez",
      role: "Familiar de paciente",
      location: "Guadalajara",
      rating: 5,
      text: "Mi madre de 78 años recibió cuidados excelentes. El personal es muy capacitado y paciente. Nos dieron tranquilidad sabiendo que estaba en buenas manos. El seguimiento fue constante y detallado.",
      service: "Cuidados geriátricos",
      image: "👨‍🦳"
    },
    {
      name: "Ana Martínez",
      role: "Paciente",
      location: "Monterrey",
      rating: 5,
      text: "Necesitaba inyecciones diarias y el servicio fue perfecto. La enfermera llegaba siempre a la hora acordada, era muy cuidadosa y me explicaba todo el proceso. Me sentí muy segura y cómoda.",
      service: "Inyecciones diarias",
      image: "👩‍💼"
    },
    {
      name: "Roberto Silva",
      role: "Paciente",
      location: "Puebla",
      rating: 5,
      text: "Después de mi cirugía, necesitaba cuidados especializados en casa. El equipo de CuidadoPro fue increíble. Muy profesionales, puntuales y con un trato humano excepcional. Mi recuperación fue mucho más rápida.",
      service: "Cuidados post-operatorios",
      image: "👨‍💻"
    },
    {
      name: "Laura Fernández",
      role: "Familiar de paciente",
      location: "Tijuana",
      rating: 5,
      text: "Mi hijo de 12 años necesitaba curaciones especiales. La enfermera fue muy dulce con él y lo tranquilizó durante todo el proceso. Ahora él mismo pide que venga la misma enfermera. Excelente servicio.",
      service: "Cuidados pediátricos",
      image: "👩‍👦"
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonios" className="section-padding bg-gradient-to-br from-soft-blue to-soft-green">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-green/10 text-primary-green px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>Testimonios</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lo que dicen nuestros{' '}
            <span className="text-primary-green">pacientes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            La satisfacción de nuestros pacientes es nuestra mayor recompensa. 
            Conoce las experiencias reales de quienes han confiado en nosotros.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-primary-green" />
            </div>

            <div className="pt-8">
              {/* Rating */}
              <div className="flex items-center justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed mb-8 italic">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-blue to-primary-green rounded-full flex items-center justify-center text-2xl">
                  {testimonials[currentTestimonial].image}
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonials[currentTestimonial].location}
                  </p>
                  <div className="mt-2">
                    <span className="inline-block bg-primary-green/10 text-primary-green px-3 py-1 rounded-full text-sm font-medium">
                      {testimonials[currentTestimonial].service}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-gray-100 hover:bg-primary-green hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-primary-green scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-gray-100 hover:bg-primary-green hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`card p-6 cursor-pointer transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'ring-2 ring-primary-green bg-primary-green/5' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setCurrentTestimonial(index)}
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-primary-green rounded-full flex items-center justify-center text-lg">
                    {testimonial.image}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">
                      {testimonial.name}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {testimonial.service}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para ser nuestro próximo testimonio?
            </h3>
            <p className="text-gray-600 mb-6">
              Únete a cientos de pacientes satisfechos que han confiado en nuestros servicios.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              Solicitar servicio ahora
            </button>
          </div>
        </div>
      </div>
      <ServiceRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

