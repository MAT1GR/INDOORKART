# 🏎️ Rosario Indoor Kart - Sistema de Reservas

Sistema completo de reservas online para karting cubierto con panel administrativo.

## ✨ Características

### Frontend Público
- **Single Page App** responsive con secciones modernas
- **Wizard de reservas** paso a paso con validaciones en tiempo real
- **Sistema de "holds"** para evitar overbooking (reserva temporal 5min)
- **Búsqueda de reservas** por código
- **WhatsApp flotante** integrado
- **Diseño racing** con colores corporativos rojo/naranja

### Panel Administrativo
- **Dashboard** con KPIs en tiempo real
- **Gestión completa de reservas** (crear, editar, cancelar, reprogramar)
- **Administración de horarios** con generación batch
- **Control de karts** y estados (disponible/fuera de servicio)
- **Planes y precios** con versionado y vigencias
- **Sistema de roles** (Admin/Staff)

### Funcionalidades de Negocio
- **Capacidad**: 8 karts por tanda
- **Horarios**: Mar-Dom 17:00-23:00 (cerrado Lunes)
- **Validaciones**: ≥15 años, ≤110kg (obligatorio)
- **Seña**: 50% obligatoria para confirmar
- **Políticas**: cancelación pierde seña, 1 reprogramación gratuita hasta 24h antes
- **Métodos de pago**: Efectivo, Transferencia, Mercado Pago, Tarjeta

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Configuración de variables de entorno
Crear `.env` basado en `.env.example`:

```bash
# Base de datos
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="rosario-indoor-kart-secret-2024"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"

# Mercado Pago
MP_PUBLIC_KEY="TEST-tu-public-key"
MP_ACCESS_TOKEN="TEST-tu-access-token"

# App
APP_URL="http://localhost:5173"
PORT=3001
```

### 3. Configurar base de datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Poblar con datos iniciales
npx prisma db seed
```

### 4. Iniciar desarrollo
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:5173/admin

## 👤 Usuarios de Prueba

### Admin (acceso completo)
- **Email**: admin@rosarioindoorkart.com
- **Contraseña**: admin123

### Staff (solo gestión de reservas)
- **Email**: staff1@rosarioindoorkart.com
- **Contraseña**: staff123

## 📊 Base de Datos

### Estructura Principal
- **Branch**: Sucursal (única: Anchorena 2750)
- **TimeSlot**: Horarios disponibles (generados cada 20min)
- **Plan/PlanPrice**: Planes con precios versionados por método de pago
- **Booking**: Reservas con estados (pending/confirmed/cancelled)
- **Payment**: Pagos y seña del 50%
- **Kart**: Estado de karts (1-8, ok/fuera de servicio)
- **User**: Usuarios admin/staff
- **Hold**: Reservas temporales para evitar conflictos

### Datos Semilla Incluidos
- ✅ Sucursal Rosario (Anchorena 2750)
- ✅ 3 planes iniciales (Plan 10, Plan 15, Promo Doble)
- ✅ Precios por método de pago
- ✅ 8 karts numerados
- ✅ Horarios generados para próximos 30 días
- ✅ Usuarios admin y staff

## 🎮 Funcionalidades del Wizard de Reservas

### Paso 1: Selección de Fecha
- Calendario mensual (es-AR)
- Bloqueo de fechas pasadas y Lunes
- Indicador de disponibilidad por día

### Paso 2: Horarios Disponibles  
- Tarjetas con horarios cada 20min (17:00-23:00)
- Estados: Disponible / Casi lleno / Completo
- Cupos en tiempo real (X/8)

### Paso 3: Planes y Karts
- Selección de plan con precios dinámicos
- Grid visual de karts (1-8)  
- Estados: Libre / Ocupado / Seleccionado / Fuera de servicio
- Hold automático por 5min al seleccionar

### Paso 4: Datos y Pago
- Formulario completo de cliente
- Validación obligatoria edad/peso
- Cálculo automático de seña (50%)
- Código único de reserva (RIK-XXXXXX)

## 📱 Búsqueda de Reservas (/mi-reserva)

- Búsqueda por código de reserva
- Ver estado completo (confirmada/pendiente/cancelada)
- Cancelar reserva (pierde seña)
- Reprogramar por WhatsApp
- Reenvío de confirmación

## 🔧 Panel Administrativo (/admin)

### Dashboard
- KPIs del día: reservas, ingresos, ocupación
- Próximas reservas (2 horas)
- Alertas del sistema
- Resumen semanal

### Gestión de Reservas
- Búsqueda avanzada por código/email/fecha
- Estados: Confirmada/Pendiente/Cancelada/No Show
- Reprogramación manual
- Reenvío de emails

### Configuración de Horarios
- Generación batch de tandas
- Intervalos configurables (def: 20min)
- Duración + buffer (def: 12min + 3min)
- Fechas de mantenimiento (blackout)

### Control de Karts
- Estado individual (1-8)
- Motivo y período fuera de servicio
- Vista grilla rápida

### Planes y Precios
- CRUD de planes de carrera
- Precios por método de pago
- Vigencias con versiones históricas
- Recargos configurables

## 🛡️ Seguridad y Validaciones

### Frontend
- Validación de formularios en tiempo real
- Hold temporal para evitar overbooking
- Confirmaciones para acciones destructivas
- Sanitización de inputs

### Backend  
- Autenticación JWT con refresh tokens
- Bcrypt para passwords
- Validación de edad/peso obligatoria
- Rate limiting en endpoints críticos
- Sanitización de datos de entrada

### Base de Datos
- Foreign keys con CASCADE
- Índices en búsquedas frecuentes
- Transacciones para operaciones críticas
- Validaciones a nivel schema

## 📧 Sistema de Emails

### Plantillas HTML Incluidas
- **Confirmación**: Código QR, datos completos, mapa, requisitos
- **Recordatorio**: 24h antes (opcional)  
- **Reprogramación**: Nuevos datos de reserva
- **Cancelación**: Confirmación y políticas

### Configuración SMTP
Compatible con Gmail, Outlook, servicios SMTP personalizados.

## 💳 Integración de Pagos

### Métodos Soportados
- **Mercado Pago**: Checkout redirect completo
- **Transferencia**: Datos bancarios automáticos  
- **Efectivo**: Pago en local
- **Tarjeta**: Integración lista (requiere gateway)

### Seña del 50%
- Obligatoria para confirmar reserva
- No reintegrable en cancelaciones
- Link de pago automático

## 🌐 Responsive y Accesibilidad

### Responsive Design
- Mobile-first approach
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- Grid adaptable para móviles
- Navegación hamburger en mobile

### Accesibilidad (WCAG AA)
- Contraste mínimo 4.5:1
- Navegación por teclado completa
- Labels semánticos
- ARIA labels en componentes interactivos
- Alt text en imágenes

## 🚢 Deployment

### Variables de Producción
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# JWT (generar secreto fuerte)
JWT_SECRET="secreto-super-seguro-de-produccion"

# Email
SMTP_HOST="smtp.tudominio.com"
SMTP_USER="reservas@rosarioindoorkart.com"
SMTP_PASS="password-seguro"

# Mercado Pago (credenciales de producción)
MP_PUBLIC_KEY="APP_USR-tu-public-key-prod"
MP_ACCESS_TOKEN="APP-tu-access-token-prod"

# App
APP_URL="https://tudominio.com"
NODE_ENV="production"
```

### Build de Producción
```bash
# Frontend
npm run build

# Backend (si usas PM2)
pm2 start server/index.ts --name kart-api

# O con Docker
docker build -t rosario-kart .
docker run -p 3000:3000 rosario-kart
```

## 📞 Soporte y Contacto

### Información de la Empresa
- **Nombre**: Rosario Indoor Kart
- **Dirección**: Anchorena 2750, Rosario, Santa Fe, Argentina  
- **Teléfono**: +54 9 341 618 8143
- **WhatsApp**: +54 9 341 618 8143
- **Horarios**: Martes a Domingo 17:00-23:00

### Soporte Técnico
Para consultas técnicas sobre el sistema:
1. Revisar este README
2. Consultar la documentación del código
3. Abrir issue en el repositorio

## 🎯 Roadmap Futuro

### Funcionalidades Pendientes
- [ ] Sistema de cupones y promociones
- [ ] Recordatorios SMS/WhatsApp automáticos  
- [ ] App móvil nativa
- [ ] Sistema de fidelización
- [ ] Reportes avanzados con gráficos
- [ ] Integración con redes sociales
- [ ] Sistema de reviews/comentarios

### Mejoras Técnicas
- [ ] Cache con Redis
- [ ] CDN para imágenes
- [ ] Monitoreo con Sentry
- [ ] Tests automatizados
- [ ] CI/CD pipeline
- [ ] Logs estructurados
- [ ] Backup automático

---

## 🏁 ¡Listo para la Pista!

El sistema está completo y listo para recibir reservas. La adrenalina del karting ahora tiene su plataforma digital perfecta.

**¿Problemas?** Revisá los logs, verificá las variables de entorno y consultá la documentación. ¡A correr! 🏎️