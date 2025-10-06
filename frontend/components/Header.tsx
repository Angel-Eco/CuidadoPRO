'use client'

import { useState } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CuidadoPro</h1>
              <p className="text-sm text-gray-600">Enfermería a Domicilio</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-primary-green transition-colors">
              Inicio
            </a>
            <a href="#servicios" className="text-gray-700 hover:text-primary-green transition-colors">
              Servicios
            </a>
            <a href="#beneficios" className="text-gray-700 hover:text-primary-green transition-colors">
              Beneficios
            </a>
            <a href="#testimonios" className="text-gray-700 hover:text-primary-green transition-colors">
              Testimonios
            </a>
            <a href="#contacto" className="text-gray-700 hover:text-primary-green transition-colors">
              Contacto
            </a>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>info@cuidado.com</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#inicio" className="text-gray-700 hover:text-primary-green transition-colors">
                Inicio
              </a>
              <a href="#servicios" className="text-gray-700 hover:text-primary-green transition-colors">
                Servicios
              </a>
              <a href="#beneficios" className="text-gray-700 hover:text-primary-green transition-colors">
                Beneficios
              </a>
              <a href="#testimonios" className="text-gray-700 hover:text-primary-green transition-colors">
                Testimonios
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-primary-green transition-colors">
                Contacto
              </a>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>info@cuidado.com</span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

