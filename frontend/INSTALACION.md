# 🚀 Guía de Instalación - Landing Page Enfermería

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**

## 🛠️ Pasos de Instalación

### 1. Instalar Dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (iconos)

### 2. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

### 3. Abrir en el Navegador

Visita: `http://localhost:3000`

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm start

# Linter
npm run lint
```

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `tailwind.config.js`:
```javascript
colors: {
  'primary-blue': '#0EA5E9',    // Azul principal
  'primary-green': '#10B981',   // Verde principal
  'soft-blue': '#F0F9FF',       // Azul suave
  'soft-green': '#F0FDF4',      // Verde suave
}
```

### Cambiar Contenido
- **Servicios**: `components/Services.tsx`
- **Testimonios**: `components/Testimonials.tsx`
- **Información de contacto**: `components/Contact.tsx` y `components/Footer.tsx`

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Deploy automático

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`

## ❓ Solución de Problemas

### Error: "Cannot find module 'react'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript
```bash
npm run build
```

### Puerto ocupado
```bash
npm run dev -- -p 3001
```

## 📞 Soporte

Si tienes problemas con la instalación:
- Revisa que Node.js esté actualizado
- Verifica que todas las dependencias se instalaron correctamente
- Consulta la documentación de Next.js

---

**¡Listo para usar! 🎉**

