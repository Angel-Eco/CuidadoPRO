import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">+</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">CuidadoPro</h3>
                  <p className="text-sm text-gray-400">Enfermería a Domicilio</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Brindamos servicios de enfermería profesional en la comodidad de tu hogar, 
                con personal altamente capacitado y comprometido con tu bienestar.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#inicio" className="text-gray-400 hover:text-white transition-colors">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="text-gray-400 hover:text-white transition-colors">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#beneficios" className="text-gray-400 hover:text-white transition-colors">
                    Beneficios
                  </a>
                </li>
                <li>
                  <a href="#testimonios" className="text-gray-400 hover:text-white transition-colors">
                    Testimonios
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="text-gray-400 hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Nuestros Servicios</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#servicios" className="text-gray-400 hover:text-white transition-colors">
                    Curaciones
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="text-gray-400 hover:text-white transition-colors">
                    Inyecciones
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="text-gray-400 hover:text-white transition-colors">
                    Controles de Salud
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="text-gray-400 hover:text-white transition-colors">
                    Cuidados Post-operatorios
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="text-gray-400 hover:text-white transition-colors">
                    Monitoreo de Signos Vitales
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Información de Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary-green mt-0.5" />
                  <div>
                    <p className="text-gray-400">Teléfono</p>
                    <p className="text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary-green mt-0.5" />
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white">info@cuidado.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-green mt-0.5" />
                  <div>
                    <p className="text-gray-400">Dirección</p>
                    <p className="text-white">123 Calle Salud<br />Ciudad, CP 12345</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-green mt-0.5" />
                  <div>
                    <p className="text-gray-400">Horarios</p>
                    <p className="text-white">24/7 Disponible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 CuidadoPro. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sobre nosotros
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

