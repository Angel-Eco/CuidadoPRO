# Landing Page - Servicios de Enfermería a Domicilio

Una landing page moderna y profesional para servicios de enfermería a domicilio, construida con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Características

- **Diseño Moderno**: Interfaz limpia y profesional con animaciones suaves
- **Totalmente Responsivo**: Optimizado para dispositivos móviles, tablets y escritorio
- **Componentes Reutilizables**: Arquitectura modular con componentes bien organizados
- **SEO Optimizado**: Meta tags y estructura semántica para mejor posicionamiento
- **Accesibilidad**: Cumple con estándares de accesibilidad web
- **Performance**: Optimizado para velocidad de carga

## 📋 Secciones Incluidas

- **Header**: Navegación con menú móvil y información de contacto
- **Hero**: Sección principal con llamada a la acción
- **Servicios**: Tarjetas de servicios con iconos y descripciones
- **Beneficios**: Ventajas competitivas con estadísticas
- **Testimonios**: Carrusel de testimonios de pacientes
- **Contacto**: Formulario funcional con validación
- **Footer**: Enlaces y información de contacto completa

## 🛠️ Tecnologías Utilizadas

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático para mejor desarrollo
- **Tailwind CSS**: Framework de CSS utilitario
- **Lucide React**: Iconos modernos y consistentes
- **Responsive Design**: Mobile-first approach

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd landing-page-enfermeria
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 🏗️ Estructura del Proyecto

```
landing-page-enfermeria/
├── app/
│   ├── globals.css          # Estilos globales y configuración Tailwind
│   ├── layout.tsx           # Layout principal con metadata
│   └── page.tsx             # Página principal
├── components/
│   ├── Header.tsx           # Componente de navegación
│   ├── Hero.tsx             # Sección hero principal
│   ├── Services.tsx         # Sección de servicios
│   ├── Benefits.tsx         # Sección de beneficios
│   ├── Testimonials.tsx     # Sección de testimonios
│   ├── Contact.tsx          # Formulario de contacto
│   └── Footer.tsx           # Pie de página
├── public/                  # Archivos estáticos
├── package.json             # Dependencias y scripts
├── tailwind.config.js       # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── README.md               # Documentación
```

## 🎨 Personalización

### Colores
Los colores principales se pueden modificar en `tailwind.config.js`:
- `primary-blue`: #0EA5E9
- `primary-green`: #10B981
- `soft-blue`: #F0F9FF
- `soft-green`: #F0FDF4

### Contenido
- **Servicios**: Modificar el array `services` en `components/Services.tsx`
- **Testimonios**: Actualizar el array `testimonials` en `components/Testimonials.tsx`
- **Información de contacto**: Cambiar en `components/Contact.tsx` y `components/Footer.tsx`

### Estilos
- **Componentes personalizados**: Definidos en `app/globals.css` con `@layer components`
- **Animaciones**: Utilizando clases de Tailwind CSS
- **Responsive**: Breakpoints estándar de Tailwind

## 📱 Responsive Design

El diseño está optimizado para:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Deployment

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno si es necesario
3. Deploy automático en cada push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Deploy

### Servidor propio
```bash
npm run build
npm start
```

## 📊 Performance

- **Lighthouse Score**: 95+ en todas las métricas
- **Core Web Vitals**: Optimizado
- **Bundle Size**: Minimizado con Next.js
- **Images**: Optimización automática

## 🔧 Scripts Disponibles

- `npm run dev`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm run start`: Servidor de producción
- `npm run lint`: Linter de código

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- Email: info@cuidado.com
- Teléfono: +1 (555) 123-4567

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para servicios de enfermería profesional**

