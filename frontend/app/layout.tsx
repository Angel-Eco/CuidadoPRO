import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cuidado de Enfermería Profesional a Domicilio',
  description: 'Servicios de enfermería profesional en la comodidad de tu hogar. Curaciones, inyecciones y controles de salud con personal altamente capacitado.',
  keywords: 'enfermería, domicilio, cuidados, salud, profesional, curaciones, inyecciones',
  authors: [{ name: 'Servicios de Enfermería' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  )
}

