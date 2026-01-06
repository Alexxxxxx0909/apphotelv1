# 🏨 Bloom Suites - Sistema de Gestión Hotelera

<div align="center">

![Bloom Suites](https://img.shields.io/badge/Bloom%20Suites-Sistema%20Hotelero-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)

**Sistema integral de gestión hotelera multi-tenant con control de licencias y módulos basados en planes de suscripción.**

[Demo en Vivo](https://lovable.dev/projects/3b229be6-91f2-415e-a742-17a8806c2231) · [Documentación](#documentación) · [Reportar Bug](#soporte)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Sistema de Roles y Permisos](#-sistema-de-roles-y-permisos)
- [Sistema de Planes y Licencias](#-sistema-de-planes-y-licencias)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Guía de Uso](#-guía-de-uso)
- [API y Hooks Personalizados](#-api-y-hooks-personalizados)
- [Exportación de Reportes](#-exportación-de-reportes)

---

## 🎯 Descripción General

**Bloom Suites** es un sistema de gestión hotelera completo desarrollado en React con TypeScript. Diseñado para hoteles de cualquier tamaño, ofrece una solución integral que abarca desde la gestión de reservaciones hasta el control de inventarios, pasando por facturación, mantenimiento y reportes gerenciales.

### Características Destacadas

- ✅ **Multi-tenant**: Soporte para múltiples hoteles y empresas
- ✅ **Control de Licencias**: Sistema de suscripción con fechas de vencimiento
- ✅ **Módulos Configurables**: Acceso basado en el plan contratado
- ✅ **Tiempo Real**: Sincronización en tiempo real con Firebase
- ✅ **Responsive**: Diseño adaptable a dispositivos móviles
- ✅ **Exportación**: Reportes en PDF y Excel
- ✅ **Multi-rol**: Administrador, Gerente y Colaborador

---

## ✨ Características Principales

### Para Administradores del Sistema
- Gestión completa de empresas y hoteles
- Administración de planes y licencias
- Monitoreo de actividad de usuarios
- Configuración global del sistema
- Reportes de auditoría y seguridad

### Para Gerentes de Hotel
- Dashboard con métricas en tiempo real
- Gestión completa del hotel
- Control de colaboradores
- Acceso a reportes gerenciales
- Configuración de precios dinámicos

### Para Colaboradores
- Acceso a módulos asignados
- Gestión de reservaciones
- Atención al cliente
- Registro de consumos
- Gestión de habitaciones

---

## 🛠 Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 18.3.1 | Biblioteca principal para UI |
| **TypeScript** | 5.0+ | Tipado estático |
| **Vite** | 5.x | Build tool y dev server |
| **Tailwind CSS** | 3.4 | Framework de estilos utility-first |
| **shadcn/ui** | Latest | Componentes UI accesibles |
| **Framer Motion** | 12.x | Animaciones fluidas |
| **React Router DOM** | 6.30 | Enrutamiento SPA |
| **TanStack Query** | 5.83 | Gestión de estado del servidor |

### Backend y Base de Datos

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Firebase** | 12.2.1 | Plataforma backend completa |
| **Firestore** | - | Base de datos NoSQL en tiempo real |
| **Firebase Auth** | - | Autenticación de usuarios |

### Librerías de Utilidad

| Librería | Uso |
|----------|-----|
| **date-fns** | Manipulación de fechas |
| **Recharts** | Gráficos y visualizaciones |
| **jsPDF** | Generación de PDFs |
| **jspdf-autotable** | Tablas en PDFs |
| **xlsx** | Exportación a Excel |
| **Zod** | Validación de esquemas |
| **React Hook Form** | Gestión de formularios |
| **Lucide React** | Iconografía |
| **Sonner** | Notificaciones toast |

---

## 🏗 Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Páginas   │  │ Componentes │  │      Contextos          │  │
│  │  - Index    │  │  - UI       │  │  - AuthContext          │  │
│  │  - Login    │  │  - Módulos  │  │  (Estado global auth)   │  │
│  │  - Dashboard│  │  - Admin    │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    HOOKS PERSONALIZADOS                      │ │
│  │  useReservations | useRooms | useHotels | useCompanies      │ │
│  │  useCollaborators | useMenuItems | useSuppliers | etc.      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE (Backend)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Firestore  │  │ Firebase    │  │    Firebase             │  │
│  │  Database   │  │ Auth        │  │    Storage              │  │
│  │             │  │             │  │    (Futuro)             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Patrón de Arquitectura

El sistema sigue una arquitectura basada en componentes con separación de responsabilidades:

1. **Capa de Presentación**: Componentes React con Tailwind CSS
2. **Capa de Lógica de Negocio**: Hooks personalizados
3. **Capa de Datos**: Firebase Firestore con listeners en tiempo real
4. **Capa de Autenticación**: Firebase Auth con contexto React

### Flujo de Datos

```
Usuario → Componente → Hook → Firebase → Firestore
                ↑                           │
                └───── Actualización ───────┘
                     (Tiempo Real)
```

---

## 📁 Estructura del Proyecto

```
src/
├── components/                 # Componentes React
│   ├── ui/                    # Componentes UI base (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ... (50+ componentes)
│   │
│   ├── admin/                 # Módulos del administrador
│   │   ├── AdminMetricsCards.tsx
│   │   ├── CompaniesManagement.tsx
│   │   ├── UsersManagement.tsx
│   │   ├── PlanAndLicenseModule.tsx
│   │   ├── SecurityModule.tsx
│   │   ├── AuditingModule.tsx
│   │   └── ...
│   │
│   ├── reservations/          # Módulo de reservaciones
│   │   ├── ReservationsModule.tsx
│   │   ├── RegisterReservation.tsx
│   │   ├── ReservationManagement.tsx
│   │   ├── AvailabilityControl.tsx
│   │   ├── DynamicPricing.tsx
│   │   └── RoomBlocking.tsx
│   │
│   ├── reception/             # Módulo de recepción
│   │   ├── ReceptionModule.tsx
│   │   ├── CheckInManagement.tsx
│   │   ├── CheckOutManagement.tsx
│   │   ├── GuestGroupManagement.tsx
│   │   └── reports/
│   │
│   ├── billing/               # Módulo de facturación
│   │   ├── BillingModule.tsx
│   │   ├── UnifiedBilling.tsx
│   │   ├── AccountsReceivable.tsx
│   │   ├── FiscalReceipts.tsx
│   │   └── reports/
│   │
│   ├── housekeeping/          # Módulo de ama de llaves
│   │   ├── HousekeepingModule.tsx
│   │   ├── RoomStatusManagement.tsx
│   │   ├── TaskAssignment.tsx
│   │   ├── InventoryControl.tsx
│   │   └── reports/
│   │
│   ├── maintenance/           # Módulo de mantenimiento
│   │   ├── MaintenanceModule.tsx
│   │   ├── WorkOrderManagement.tsx
│   │   ├── PreventiveMaintenance.tsx
│   │   ├── AssetManagement.tsx
│   │   └── reports/
│   │
│   ├── food-beverage/         # Módulo de alimentos y bebidas
│   │   ├── FoodBeverageModule.tsx
│   │   ├── MenuManagement.tsx
│   │   ├── OrdersConsumption.tsx
│   │   ├── SuppliesInventory.tsx
│   │   └── TablesAreasManagement.tsx
│   │
│   ├── customer-service/      # Módulo de atención al cliente
│   │   ├── CustomerServiceModule.tsx
│   │   ├── ComplaintsManagement.tsx
│   │   ├── SpecialRequestsManagement.tsx
│   │   └── AdditionalServicesManagement.tsx
│   │
│   ├── suppliers/             # Módulo de proveedores
│   │   ├── SuppliersModule.tsx
│   │   ├── SuppliersManagement.tsx
│   │   ├── PurchaseOrders.tsx
│   │   └── PaymentsFinance.tsx
│   │
│   ├── management/            # Gestión hotelera
│   │   ├── HotelManagementModule.tsx
│   │   └── CollaboratorsModule.tsx
│   │
│   ├── reports/               # Reportes gerenciales
│   │   └── ManagementReportsModule.tsx
│   │
│   ├── profile/               # Perfil de usuario
│   │   └── ProfileModule.tsx
│   │
│   ├── AdminDashboard.tsx     # Dashboard administrador
│   ├── Dashboard.tsx          # Dashboard gerente
│   ├── CollaboratorDashboard.tsx # Dashboard colaborador
│   ├── LoginPage.tsx          # Página de login
│   └── MetricsCards.tsx       # Tarjetas de métricas
│
├── contexts/                   # Contextos React
│   └── AuthContext.tsx        # Contexto de autenticación
│
├── hooks/                      # Hooks personalizados
│   ├── useReservations.ts     # Gestión de reservaciones
│   ├── useRooms.ts            # Gestión de habitaciones
│   ├── useHotels.ts           # Gestión de hoteles
│   ├── useCompanies.ts        # Gestión de empresas
│   ├── useCollaborators.ts    # Gestión de colaboradores
│   ├── useMenuItems.ts        # Gestión de menú
│   ├── useSuppliers.ts        # Gestión de proveedores
│   ├── useHotelModules.ts     # Control de módulos por plan
│   ├── usePlans.ts            # Gestión de planes
│   ├── useRoles.ts            # Gestión de roles
│   ├── useRoomTypes.ts        # Tipos de habitación
│   ├── usePricingRules.ts     # Reglas de precios
│   ├── useConsumptions.ts     # Consumos de huéspedes
│   ├── useComplaints.ts       # Quejas y reclamos
│   ├── useSpecialRequests.ts  # Solicitudes especiales
│   └── ... (20+ hooks)
│
├── config/                     # Configuración
│   └── firebase.ts            # Configuración Firebase
│
├── lib/                        # Utilidades
│   ├── utils.ts               # Funciones utilitarias
│   └── exportUtils.ts         # Exportación PDF/Excel
│
├── pages/                      # Páginas
│   ├── Index.tsx              # Página principal
│   └── NotFound.tsx           # Página 404
│
├── scripts/                    # Scripts de inicialización
│   ├── initializeDatabase.ts
│   ├── initializeRoles.ts
│   └── createFirebaseUsers.ts
│
├── App.tsx                     # Componente principal
├── App.css                     # Estilos globales
├── main.tsx                    # Punto de entrada
└── index.css                   # Estilos Tailwind
```

---

## 📦 Módulos del Sistema

### 1. 📊 Dashboard

**Descripción**: Panel principal con métricas en tiempo real del hotel.

**Funcionalidades**:
- Visualización de KPIs principales (ocupación, ingresos, ADR, RevPAR)
- Gráficos de tendencias de ocupación
- Estado actual de habitaciones
- Reservaciones del día (llegadas/salidas)
- Alertas de licencia próxima a vencer

**Métricas calculadas**:
- **Tasa de Ocupación**: (Habitaciones ocupadas / Total habitaciones) × 100
- **ADR** (Average Daily Rate): Ingresos / Habitaciones vendidas
- **RevPAR** (Revenue Per Available Room): ADR × Tasa de ocupación

---

### 2. 📅 Reservaciones

**Descripción**: Gestión completa del ciclo de vida de reservaciones.

**Sub-módulos**:

| Sub-módulo | Funcionalidad |
|------------|---------------|
| **Registrar Reservación** | Crear nuevas reservaciones con datos del huésped, fechas, habitación y plan de comidas |
| **Gestión de Reservaciones** | Ver, editar, cancelar reservaciones existentes |
| **Control de Disponibilidad** | Visualizar y gestionar disponibilidad de habitaciones |
| **Bloqueo de Habitaciones** | Bloquear habitaciones para mantenimiento o eventos |
| **Precios Dinámicos** | Configurar reglas de precios por temporada, día de semana, etc. |

**Estados de reservación**:
- `pendiente` - Reservación creada, pendiente de confirmación
- `confirmada` - Reservación confirmada
- `checkin` - Huésped registrado
- `checkout` - Huésped salió
- `cancelada` - Reservación cancelada
- `no-show` - Huésped no se presentó

---

### 3. 🛎️ Recepción

**Descripción**: Operaciones de front desk para check-in y check-out.

**Sub-módulos**:

| Sub-módulo | Funcionalidad |
|------------|---------------|
| **Check-In** | Registro de llegada de huéspedes |
| **Check-Out** | Proceso de salida con desglose de cargos |
| **Grupos y Acompañantes** | Gestión de miembros del grupo |
| **Reservaciones del Día** | Lista de llegadas y salidas programadas |

**Proceso de Check-Out**:
1. Selección de reservación activa
2. Visualización de cargos de alojamiento
3. Desglose de consumos (restaurante, minibar, spa, etc.)
4. Generación de factura
5. Registro de método de pago
6. Liberación de habitación (estado → limpieza)

---

### 4. 💳 Facturación

**Descripción**: Gestión financiera y de facturación del hotel.

**Sub-módulos**:

| Sub-módulo | Funcionalidad |
|------------|---------------|
| **Facturación Unificada** | Generación de facturas consolidadas |
| **Cuentas por Cobrar** | Seguimiento de pagos pendientes |
| **Comprobantes Fiscales** | Gestión de documentos fiscales |
| **Métodos de Pago** | Configuración de formas de pago |
| **Reportes** | Reportes financieros y de facturación |

---

### 5. 🧹 Ama de Llaves (Housekeeping)

**Descripción**: Control de limpieza y estado de habitaciones.

**Sub-módulos**:

| Sub-módulo | Funcionalidad |
|------------|---------------|
| **Estado de Habitaciones** | Visualización y actualización de estados |
| **Asignación de Tareas** | Asignar habitaciones a personal de limpieza |
| **Control de Inventario** | Gestión de suministros de limpieza |
| **Seguimiento de Eficiencia** | Métricas de rendimiento del equipo |
| **Reportes** | Reportes de productividad y consumo |

**Estados de habitación**:
- `disponible` - Lista para asignar
- `ocupada` - Con huésped
- `limpieza` - En proceso de limpieza
- `mantenimiento` - En reparación
- `fuera_servicio` - No disponible

---

### 6. 🔧 Mantenimiento

**Descripción**: Gestión de mantenimiento preventivo y correctivo.

**Sub-módulos**:

| Sub-módulo | Funcionalidad |
|------------|---------------|
| **Órdenes de Trabajo** | Crear y gestionar solicitudes de mantenimiento |
| **Mantenimiento Preventivo** | Programar mantenimientos periódicos |
| **Mantenimiento Correctivo** | Registrar y dar seguimiento a reparaciones |
| **Gestión de Activos** | Inventario de equipos y activos |
| **Inventario** | Control de repuestos y materiales |
| **Agenda de Técnicos** | Programación del personal técnico |
| **Reportes** | Análisis de costos y tiempos |

---

### 7. 🍽️ Alimentos y Bebidas

**Descripción**: Gestión completa del área de restaurante y bar.

**Sub-módulos**:

| Sub-módulo | Funcionalidad |
|------------|---------------|
| **Gestión de Menú** | Crear platillos con ingredientes del inventario |
| **Pedidos y Consumos** | Registrar consumos de huéspedes |
| **Inventario de Insumos** | Control de productos e ingredientes |
| **Mesas y Áreas** | Configuración del layout del restaurante |
| **Categorías** | Organización de productos por categoría |
| **Reportes** | Análisis de ventas y costos |

**Sistema de Ingredientes**:
- Selección de productos del inventario
- Especificación de cantidad y unidad de medida
- Cálculo automático del costo de producción
- Control de precio de venta y margen

---

### 8. 👥 Atención al Cliente

**Descripción**: Gestión de la experiencia del huésped.

**Sub-módulos**:

| Sub-módulo | Funcionalidad |
|------------|---------------|
| **Solicitudes Especiales** | Registro y seguimiento de peticiones |
| **Quejas y Reclamos** | Gestión de inconformidades |
| **Servicios Adicionales** | Tours, transporte, etc. |
| **Coordinación Housekeeping** | Comunicación con ama de llaves |

**Estados de solicitudes**:
- `pendiente` - Nueva solicitud
- `en-proceso` - En atención
- `completada` - Resuelta
- `cancelada` - Cancelada

---

### 9. 📦 Proveedores

**Descripción**: Gestión de la cadena de suministro.

**Sub-módulos**:

| Sub-módulo | Funcionalidad |
|------------|---------------|
| **Gestión de Proveedores** | Registro y administración de proveedores |
| **Órdenes de Compra** | Crear y dar seguimiento a pedidos |
| **Pagos y Finanzas** | Control de cuentas por pagar |
| **Evaluación de Calidad** | Calificar desempeño de proveedores |
| **Reportes** | Análisis de compras y pagos |

---

### 10. 🏨 Gestión del Hotel

**Descripción**: Configuración y administración del hotel.

**Funcionalidades**:
- Información general del hotel
- Gestión de tipos de habitación
- Configuración de características de habitaciones
- Planes de alimentación
- Inventario de habitaciones

---

### 11. 👨‍💼 Colaboradores

**Descripción**: Administración del personal del hotel.

**Funcionalidades**:
- Registro de colaboradores
- Asignación de roles y permisos
- Asignación de módulos de acceso
- Historial de actividad

---

### 12. 📈 Reportes Gerenciales

**Descripción**: Análisis integral para la toma de decisiones.

**Secciones**:
- **KPIs Principales**: Ingresos, ocupación, ADR, RevPAR
- **Resumen Financiero**: Ingresos totales, por alojamiento y consumos
- **Análisis de Costos**: Desglose por categoría
- **Rendimiento por Canal**: Booking, Expedia, directo, etc.
- **Top Productos**: Ranking con márgenes de ganancia
- **Segmentación de Clientes**: Distribución y satisfacción

**Exportación**: PDF y Excel

---

### 13. 👤 Perfil

**Descripción**: Configuración personal del usuario.

**Funcionalidades**:
- Información personal
- Cambio de contraseña
- Configuración de notificaciones
- Preferencias de tema e idioma
- Historial de sesiones

---

## 👥 Sistema de Roles y Permisos

### Roles del Sistema

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Administrador** | Super usuario del sistema | Todas las empresas, hoteles y configuraciones |
| **Gerente** | Administrador del hotel | Todos los módulos del plan contratado |
| **Colaborador** | Personal operativo | Módulos específicos asignados |

### Matriz de Permisos por Rol

```
┌─────────────────────┬───────────────┬──────────┬─────────────┐
│ Funcionalidad       │ Administrador │ Gerente  │ Colaborador │
├─────────────────────┼───────────────┼──────────┼─────────────┤
│ Gestión Empresas    │      ✅       │    ❌    │     ❌      │
│ Gestión Planes      │      ✅       │    ❌    │     ❌      │
│ Gestión Licencias   │      ✅       │    ❌    │     ❌      │
│ Crear Gerentes      │      ✅       │    ❌    │     ❌      │
│ Dashboard Hotel     │      ❌       │    ✅    │     ✅      │
│ Gestión Colaborador │      ❌       │    ✅    │     ❌      │
│ Módulos del Plan    │      ❌       │    ✅    │   Asignados │
│ Reportes Gerencial  │      ❌       │    ✅    │     ❌      │
│ Perfil Personal     │      ✅       │    ✅    │     ✅      │
└─────────────────────┴───────────────┴──────────┴─────────────┘
```

---

## 💼 Sistema de Planes y Licencias

### Planes Disponibles

| Plan | Módulos Incluidos | Límites |
|------|-------------------|---------|
| **Básico** | Colaboradores, Reservas, Recepción, Facturación, Gestión Hotelera | 50 habitaciones, 5 usuarios |
| **Estándar** | Básico + Housekeeping, Atención al Cliente, Reportes | 150 habitaciones, 15 usuarios |
| **Premium** | Estándar + Mantenimiento, Alimentos y Bebidas, Proveedores | Ilimitado |

### Sistema de Licencias

- Cada hotel tiene una licencia con fecha de vencimiento
- **Alertas automáticas**:
  - 🟡 Amarilla: 30 días antes del vencimiento
  - 🔴 Roja: Licencia vencida
- **Licencia vencida**: Todos los módulos se bloquean
- **Renovación**: Solo administradores pueden renovar

---

## 🚀 Instalación y Configuración

### Requisitos Previos

| Requisito | Versión Mínima | Descripción |
|-----------|----------------|-------------|
| **Node.js** | 18.0+ | Runtime de JavaScript |
| **npm** | 9.0+ | Gestor de paquetes (incluido con Node.js) |
| **bun** | 1.0+ | Alternativa a npm (opcional, más rápido) |
| **Git** | 2.0+ | Control de versiones |
| **Cuenta Firebase** | - | Para base de datos y autenticación |

### Paso 1: Clonar el Repositorio

```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>

# Navegar al directorio del proyecto
cd <YOUR_PROJECT_NAME>
```

### Paso 2: Instalar Dependencias

```bash
# Usando npm
npm install

# O usando bun (más rápido)
bun install
```

> ⏱️ **Nota**: La instalación puede tomar 2-5 minutos dependiendo de tu conexión a internet.

### Paso 3: Verificar Instalación

```bash
# Verificar que las dependencias se instalaron correctamente
npm list --depth=0

# Deberías ver una lista de paquetes sin errores
```

---

## 🔥 Cómo Conectar Firebase

Esta guía te llevará paso a paso para configurar tu propio proyecto de Firebase y conectarlo con Bloom Suites.

### 3.1 Crear un Proyecto en Firebase

1. **Acceder a Firebase Console**
   - Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Inicia sesión con tu cuenta de Google

2. **Crear Nuevo Proyecto**
   ```
   Click en "Agregar proyecto" o "Add project"
   ├── Nombre del proyecto: bloom-suites (o el nombre que prefieras)
   ├── Google Analytics: Puedes habilitarlo o deshabilitarlo (opcional)
   └── Click en "Crear proyecto"
   ```

3. **Esperar a que se cree el proyecto** (aproximadamente 30 segundos)

### 3.2 Registrar tu Aplicación Web

1. En la página principal de tu proyecto Firebase, haz click en el ícono de **Web** (`</>`)

2. **Registrar la app**:
   ```
   Nombre de la app: bloom-suites-web
   ☐ Configurar Firebase Hosting (opcional, no necesario para desarrollo)
   ```

3. **Copiar la configuración** que Firebase te proporciona:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...........................",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

### 3.3 Configurar Firebase en el Proyecto

1. **Abrir el archivo de configuración**:
   ```
   src/config/firebase.ts
   ```

2. **Reemplazar la configuración** con tus credenciales:
   ```typescript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";

   // Tu configuración de Firebase (reemplazar con tus datos)
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_PROYECTO.firebaseapp.com",
     projectId: "TU_PROYECTO",
     storageBucket: "TU_PROYECTO.firebasestorage.app",
     messagingSenderId: "TU_SENDER_ID",
     appId: "TU_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export default app;
   ```

### 3.4 Habilitar Autenticación

1. En Firebase Console, ve a **Build > Authentication**

2. Click en **"Comenzar"** o **"Get started"**

3. En la pestaña **"Sign-in method"**, habilita:
   - ✅ **Email/Password** (Obligatorio)
   - ⬜ Google (Opcional)
   - ⬜ Otros proveedores (Opcional)

4. **Configurar Email/Password**:
   ```
   Proveedor: Correo electrónico/contraseña
   ├── Habilitar: ✅
   ├── Verificación de correo: Opcional (recomendado desactivar para desarrollo)
   └── Guardar
   ```

### 3.5 Crear Base de Datos Firestore

1. En Firebase Console, ve a **Build > Firestore Database**

2. Click en **"Crear base de datos"**

3. **Seleccionar modo**:
   ```
   ◉ Modo de producción (recomendado)
   ○ Modo de prueba (expira en 30 días)
   ```

4. **Seleccionar ubicación del servidor**:
   ```
   Recomendadas para Latinoamérica:
   ├── us-east1 (Carolina del Sur)
   ├── us-central1 (Iowa)
   └── southamerica-east1 (São Paulo) - Mejor latencia para LATAM
   ```

5. Click en **"Habilitar"**

### 3.6 Configurar Reglas de Seguridad de Firestore

1. En Firestore, ve a la pestaña **"Reglas"**

2. **Reglas para desarrollo** (menos restrictivas):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Permitir lectura y escritura solo a usuarios autenticados
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Reglas para producción** (más seguras):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Usuarios: solo pueden ver/editar su propio perfil
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // Hoteles: acceso basado en pertenencia
       match /hoteles/{hotelId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
       }
       
       // Colecciones anidadas de hotel
       match /hoteles/{hotelId}/{collection}/{docId} {
         allow read, write: if request.auth != null;
       }
       
       // Empresas: solo administradores
       match /empresas/{empresaId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // Planes: solo lectura para todos, escritura para admin
       match /planes/{planId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

4. Click en **"Publicar"**

### 3.7 Crear Colecciones Iniciales

1. En Firestore, pestaña **"Datos"**, crea las siguientes colecciones:

   | Colección | Descripción |
   |-----------|-------------|
   | `users` | Usuarios del sistema |
   | `empresas` | Empresas/compañías hoteleras |
   | `hoteles` | Hoteles individuales |
   | `planes` | Planes de suscripción |
   | `roles` | Roles y permisos |

2. **Crear documento de usuario administrador inicial**:
   ```
   Colección: users
   ID del documento: (automático o el UID del usuario)
   
   Campos:
   ├── email: "admin@tuhotel.com"
   ├── name: "Administrador"
   ├── role: "admin"
   ├── createdAt: (timestamp actual)
   └── active: true
   ```

### 3.8 Crear Usuario en Authentication

1. Ve a **Authentication > Users**

2. Click en **"Agregar usuario"**

3. **Datos del administrador**:
   ```
   Email: admin@tuhotel.com
   Contraseña: Admin123! (cámbiala después)
   ```

4. **Copiar el UID del usuario** creado y usarlo como ID en la colección `users`

---

## ▶️ Ejecutar el Proyecto

### Modo Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# O con bun
bun dev
```

El proyecto estará disponible en: **http://localhost:5173**

### Modo Producción

```bash
# Crear build de producción
npm run build

# Previsualizar build
npm run preview
```

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm run build` | Genera build optimizado para producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para verificar código |

---

## 🔧 Solución de Problemas Comunes

### Error: "Firebase App named '[DEFAULT]' already exists"

**Causa**: La app de Firebase se está inicializando múltiples veces.

**Solución**: Verifica que solo haya una llamada a `initializeApp()` en tu código.

### Error: "Permission denied" en Firestore

**Causa**: Las reglas de seguridad están bloqueando el acceso.

**Solución**:
1. Verifica que el usuario esté autenticado
2. Revisa las reglas de Firestore
3. Para desarrollo, usa reglas más permisivas

### Error: "auth/configuration-not-found"

**Causa**: Email/Password no está habilitado en Firebase.

**Solución**: Ve a Authentication > Sign-in method y habilita Email/Password.

### La página se queda en blanco

**Posibles causas**:
1. Error en la configuración de Firebase
2. Credenciales incorrectas
3. Firestore no creado

**Solución**: Revisa la consola del navegador (F12) para ver errores específicos.

### Error de CORS

**Causa**: Dominio no autorizado en Firebase.

**Solución**:
1. Ve a Authentication > Settings > Authorized domains
2. Agrega `localhost` y tu dominio de producción

---

## 📋 Checklist de Configuración

Usa esta lista para verificar que todo esté configurado correctamente:

```
Pre-requisitos
├── [ ] Node.js 18+ instalado
├── [ ] Git instalado
└── [ ] Cuenta de Google/Firebase creada

Firebase Console
├── [ ] Proyecto Firebase creado
├── [ ] App Web registrada
├── [ ] Credenciales copiadas a firebase.ts
├── [ ] Authentication habilitado
├── [ ] Email/Password activado
├── [ ] Firestore Database creado
├── [ ] Reglas de seguridad configuradas
├── [ ] Usuario administrador creado en Auth
└── [ ] Documento de usuario en colección 'users'

Proyecto Local
├── [ ] Repositorio clonado
├── [ ] Dependencias instaladas (npm install)
├── [ ] firebase.ts configurado con credenciales
├── [ ] npm run dev funciona sin errores
└── [ ] Login funciona con usuario admin
```

---

## 📖 Guía de Uso

### Primer Inicio

1. **Acceder al sistema** como administrador
2. **Crear una empresa** con su hotel asociado
3. **Seleccionar un plan** para la empresa
4. **Crear un gerente** para el hotel
5. El gerente puede **crear colaboradores** y asignar módulos

### Flujo de Operación Diario

```
Mañana:
├── Revisar Dashboard
├── Check-out de salidas
├── Verificar habitaciones en limpieza
└── Actualizar estados de habitaciones

Día:
├── Procesar reservaciones nuevas
├── Atender solicitudes especiales
├── Registrar consumos
└── Gestionar mantenimientos

Tarde/Noche:
├── Check-in de llegadas
├── Actualizar inventarios
├── Revisar reportes
└── Preparar siguiente día
```

---

## 🔧 API y Hooks Personalizados

### Hooks Principales

```typescript
// Reservaciones
const { reservations, addReservation, updateReservation, deleteReservation } = useReservations(hotelId);

// Habitaciones
const { rooms, addRoom, updateRoom, deleteRoom } = useRooms(hotelId);

// Colaboradores
const { collaborators, addCollaborator, updateCollaborator } = useCollaborators(hotelId);

// Menú e Ingredientes
const { menuItems, addMenuItem, updateMenuItem } = useMenuItems(hotelId);

// Control de Módulos
const { isModuleAllowed, isLicenseValid, getDaysUntilExpiration } = useHotelModules();
```

### Patrón de Uso

Todos los hooks siguen el mismo patrón:

```typescript
const { 
  data,           // Array de elementos
  loading,        // Estado de carga
  error,          // Mensaje de error
  addItem,        // Función para agregar
  updateItem,     // Función para actualizar
  deleteItem      // Función para eliminar
} = useHook(hotelId);
```

---

## 📄 Exportación de Reportes

### Formatos Soportados

| Tipo de Reporte | PDF | Excel |
|-----------------|-----|-------|
| Reportes Generales | ✅ | ❌ |
| Reportes Financieros | ✅ | ✅ |
| Reportes de Facturación | ✅ | ✅ |
| Reportes de Proveedores | ✅ | ✅ |
| Reportes Gerenciales | ✅ | ✅ |

### Uso

```typescript
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';

// Exportar a PDF
exportToPDF(data, 'nombre-reporte', columnas);

// Exportar a Excel
exportToExcel(data, 'nombre-reporte', columnas);
```

---

## 🔒 Seguridad

- **Autenticación**: Firebase Auth con email/password
- **Autorización**: Control de acceso basado en roles
- **Datos**: Firestore con reglas de seguridad
- **Sesiones**: Gestión automática de sesiones
- **Auditoría**: Registro de actividades de usuarios

---

## 📞 Soporte

Para reportar bugs o solicitar funcionalidades:

1. Abrir un issue en el repositorio
2. Contactar al equipo de desarrollo
3. Consultar la documentación en línea

---

## 📜 Licencia

Este proyecto es propietario. Todos los derechos reservados.

---

<div align="center">

**Desarrollado con ❤️ usando [Lovable](https://lovable.dev)**

</div>
