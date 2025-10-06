'use client'

import { useState } from 'react'
import { ArrowRight, Shield, Heart, Clock, Star } from 'lucide-react'
import ServiceRequestModal from './ServiceRequestModal'

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <section id="inicio" className="relative bg-gradient-to-br from-soft-blue via-white to-soft-green overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-green rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary-blue rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-primary-green rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-primary-blue rounded-full"></div>
      </div>

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary-green/10 text-primary-green px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Servicio Profesional Certificado</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Cuidado de enfermería{' '}
                <span className="text-primary-green">profesional</span>{' '}
                a domicilio
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Atención médica especializada en la comodidad de tu hogar. 
                Personal altamente capacitado disponible 24/7 para brindarte 
                el mejor cuidado y tranquilidad.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center justify-center space-x-2 group">
                <span>Solicita tu servicio</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary">
                Conoce más
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-8">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-primary-green rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">+500 pacientes satisfechos</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.9/5 calificación</span>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Cuidado Personalizado</h3>
                    <p className="text-gray-600">Atención adaptada a tus necesidades</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                    <span className="text-gray-700">Curaciones especializadas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                    <span className="text-gray-700">Inyecciones seguras</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                    <span className="text-gray-700">Controles de salud</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                    <span className="text-gray-700">Monitoreo continuo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-primary-blue text-white p-4 rounded-xl shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">24/7</span>
              </div>
              <p className="text-sm opacity-90">Disponible</p>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-primary-green text-white p-4 rounded-xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">100%</span>
              </div>
              <p className="text-sm opacity-90">Seguro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
      <ServiceRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

