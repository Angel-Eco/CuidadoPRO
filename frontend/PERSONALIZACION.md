# 🎨 Guía de Personalización

## 📝 Cambiar Contenido de Texto

### 1. Título Principal (Hero)
**Archivo**: `components/Hero.tsx`
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
  Tu nuevo título aquí
</h1>
```

### 2. Servicios
**Archivo**: `components/Services.tsx`
```tsx
const services = [
  {
    icon: <Syringe className="w-8 h-8" />,
    title: "Tu Servicio",
    description: "Descripción del servicio...",
    features: ["Característica 1", "Característica 2"],
    color: "from-blue-500 to-blue-600"
  },
  // Agregar más servicios...
]
```

### 3. Testimonios
**Archivo**: `components/Testimonials.tsx`
```tsx
const testimonials = [
  {
    name: "Nombre del Cliente",
    role: "Rol del Cliente",
    location: "Ubicación",
    rating: 5,
    text: "Testimonio del cliente...",
    service: "Servicio recibido",
    image: "👤" // Emoji o inicial
  },
  // Agregar más testimonios...
]
```

### 4. Información de Contacto
**Archivo**: `components/Contact.tsx` y `components/Footer.tsx`
```tsx
// Cambiar números de teléfono, emails, direcciones
const contactInfo = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Teléfono",
    details: ["+1 (555) 123-4567"], // Tu número
    description: "Línea directa 24/7"
  },
  // Más información...
]
```

## 🎨 Cambiar Colores

### 1. Colores Principales
**Archivo**: `tailwind.config.js`
```javascript
colors: {
  'primary-blue': '#0EA5E9',     // Cambiar por tu azul
  'primary-green': '#10B981',    // Cambiar por tu verde
  'soft-blue': '#F0F9FF',        // Azul de fondo suave
  'soft-green': '#F0FDF4',       // Verde de fondo suave
}
```

### 2. Colores de Servicios
**Archivo**: `components/Services.tsx`
```tsx
// Cambiar los gradientes de colores
color: "from-purple-500 to-purple-600"  // Tu color preferido
```

## 🖼️ Agregar Imágenes

### 1. Logo
**Archivo**: `components/Header.tsx`
```tsx
// Reemplazar el logo actual con una imagen
<Image 
  src="/logo.png" 
  alt="Tu Logo" 
  width={40} 
  height={40} 
/>
```

### 2. Imágenes de Servicios
**Archivo**: `components/Services.tsx`
```tsx
// Agregar imágenes a los servicios
<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
  <Image src="/servicio1.png" alt="Servicio" width={32} height={32} />
</div>
```

## 📱 Personalizar Responsive

### 1. Breakpoints
**Archivo**: `tailwind.config.js`
```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

### 2. Espaciado
**Archivo**: `app/globals.css`
```css
.section-padding {
  @apply py-20 md:py-32;  // Cambiar padding
}
```

## 🔧 Funcionalidades Adicionales

### 1. Agregar Animaciones
**Archivo**: `app/globals.css`
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}
```

### 2. Integrar Analytics
**Archivo**: `app/layout.tsx`
```tsx
// Agregar Google Analytics
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

### 3. Agregar SEO
**Archivo**: `app/layout.tsx`
```tsx
export const metadata: Metadata = {
  title: 'Tu Título SEO',
  description: 'Tu descripción SEO',
  keywords: 'palabra1, palabra2, palabra3',
  openGraph: {
    title: 'Tu Título',
    description: 'Tu descripción',
    images: ['/og-image.jpg'],
  },
}
```

## 📧 Integrar Formulario

### 1. EmailJS
```bash
npm install @emailjs/browser
```

### 2. Configurar envío
**Archivo**: `components/Contact.tsx`
```tsx
import emailjs from '@emailjs/browser';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      formData,
      'YOUR_PUBLIC_KEY'
    );
    setSubmitStatus('success');
  } catch (error) {
    setSubmitStatus('error');
  }
};
```

## 🎯 Optimizaciones

### 1. Performance
- Usar `next/image` para imágenes
- Implementar lazy loading
- Optimizar bundle size

### 2. SEO
- Agregar meta tags
- Implementar structured data
- Optimizar Core Web Vitals

### 3. Accesibilidad
- Agregar alt text a imágenes
- Implementar navegación por teclado
- Usar colores con buen contraste

## 📋 Checklist de Personalización

- [ ] Cambiar título y subtítulo
- [ ] Actualizar información de contacto
- [ ] Modificar servicios ofrecidos
- [ ] Agregar testimonios reales
- [ ] Cambiar colores de marca
- [ ] Agregar logo e imágenes
- [ ] Configurar formulario de contacto
- [ ] Optimizar para SEO
- [ ] Probar en diferentes dispositivos
- [ ] Configurar analytics

---

**¡Tu landing page personalizada está lista! 🚀**

