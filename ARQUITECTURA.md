# 🏗️ Arquitectura y Análisis Técnico - Bloom Suites

> Documento técnico detallado sobre la arquitectura, seguridad, comunicación y componentes del sistema de gestión hotelera **Bloom Suites**.

---

## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo](#-resumen-ejecutivo)
2. [Tipo de Arquitectura](#-tipo-de-arquitectura)
3. [¿Tiene API el proyecto?](#-tiene-api-el-proyecto)
4. [Stack Tecnológico Completo](#-stack-tecnológico-completo)
5. [Frontend](#-frontend)
6. [Backend](#-backend)
7. [Base de Datos](#-base-de-datos)
8. [Autenticación](#-autenticación)
9. [Comunicación entre Componentes](#-comunicación-entre-componentes)
10. [Seguridad y Vulnerabilidades](#-seguridad-y-vulnerabilidades)
11. [Integraciones Externas](#-integraciones-externas)
12. [Manejo de Solicitudes (Requests)](#-manejo-de-solicitudes-requests)
13. [Lo que SÍ tiene el proyecto](#-lo-que-sí-tiene-el-proyecto)
14. [Lo que NO tiene el proyecto](#-lo-que-no-tiene-el-proyecto)
15. [Recomendaciones de Mejora](#-recomendaciones-de-mejora)

---

## 📊 Resumen Ejecutivo

**Bloom Suites** es una **Single Page Application (SPA)** construida con React + TypeScript que utiliza **Firebase** como **Backend-as-a-Service (BaaS)**. No es una aplicación monolítica tradicional ni una arquitectura de microservicios; es una **arquitectura cliente-servidor serverless** donde toda la lógica de negocio se ejecuta en el cliente y la persistencia/autenticación se delega a servicios gestionados de Google Firebase.

| Característica | Valor |
|----------------|-------|
| **Tipo de App** | SPA (Single Page Application) |
| **Arquitectura** | Cliente-Servidor con BaaS (Serverless) |
| **Backend Propio** | ❌ No (usa Firebase como BaaS) |
| **API REST/GraphQL Propia** | ❌ No |
| **Base de Datos** | Firebase Firestore (NoSQL) |
| **Autenticación** | Firebase Authentication |
| **Renderizado** | CSR (Client-Side Rendering) |
| **Despliegue** | Estático (Vite build) |

---

## 🏛️ Tipo de Arquitectura

### Arquitectura: **Cliente-Servidor Serverless (BaaS)**

La aplicación **NO es monolítica** en el sentido tradicional (donde frontend y backend conviven en un mismo servidor). Tampoco es una arquitectura de microservicios. Su modelo es:

```
┌─────────────────────────────────────────────────────────┐
│                  NAVEGADOR DEL USUARIO                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │           React SPA (Frontend Completo)            │  │
│  │  - UI / UX                                         │  │
│  │  - Lógica de negocio                              │  │
│  │  - Validaciones                                    │  │
│  │  - Routing (React Router)                          │  │
│  │  - Estado global (Context API + TanStack Query)    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS / WebSocket
                          │ (Firebase SDK)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              FIREBASE (Google Cloud) - BaaS              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Firebase   │  │   Firestore  │  │   Firebase   │  │
│  │     Auth     │  │   Database   │  │   Storage    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Características de esta arquitectura:

- ✅ **Frontend autónomo**: Todo el código de UI y lógica vive en el cliente.
- ✅ **Sin servidor propio**: No hay un servidor Node.js, Python o Java que gestionemos.
- ✅ **Serverless**: La infraestructura de backend la administra Google Firebase.
- ✅ **Tiempo real**: Firestore ofrece sincronización en tiempo real mediante WebSockets (`onSnapshot`).
- ⚠️ **Lógica en el cliente**: La validación y reglas de negocio se ejecutan en el navegador, lo cual tiene implicaciones de seguridad (ver sección de Seguridad).

---

## 🔌 ¿Tiene API el proyecto?

### Respuesta corta: **NO tiene una API propia (REST/GraphQL).**

### Respuesta detallada:

El proyecto **no expone endpoints HTTP propios** del tipo `GET /api/reservations` o `POST /api/users`. En su lugar, **consume directamente la API del SDK de Firebase**, que internamente se comunica con los servicios de Google Cloud mediante:

- **gRPC** (para Firestore en tiempo real)
- **HTTPS REST** (para operaciones puntuales)
- **WebSocket** (para listeners en tiempo real con `onSnapshot`)

### Ejemplo de cómo se hacen las "llamadas":

```typescript
// NO se hace esto (API REST tradicional):
fetch('/api/reservations').then(res => res.json())

// SÍ se hace esto (Firebase SDK):
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const snapshot = await getDocs(collection(db, 'reservations'));
const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### ¿Podría tener una API propia en el futuro?

Sí, mediante **Firebase Cloud Functions** (no implementadas actualmente). Esto permitiría:
- Endpoints HTTP personalizados
- Lógica de servidor segura
- Integraciones con servicios externos (Stripe, SendGrid, etc.)

---

## 🛠️ Stack Tecnológico Completo

### 🎨 Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3.1 | Librería UI |
| **TypeScript** | 5.x | Tipado estático |
| **Vite** | 5.x | Build tool y dev server |
| **React Router DOM** | 6.x | Enrutamiento SPA |
| **Tailwind CSS** | 3.x | Estilos utility-first |
| **shadcn/ui** | Latest | Componentes accesibles (Radix UI) |
| **Framer Motion** | Latest | Animaciones |
| **Lucide React** | Latest | Iconos SVG |
| **TanStack Query** | 5.x | Cache y sincronización de datos |
| **React Hook Form** | 7.x | Manejo de formularios |
| **Zod** | 3.x | Validación de esquemas |
| **Recharts** | Latest | Gráficos y dashboards |
| **date-fns** | 3.x | Manipulación de fechas |
| **Sonner** | Latest | Notificaciones toast |

### 🔥 Backend (BaaS)

| Servicio Firebase | Uso en el Proyecto |
|-------------------|---------------------|
| **Firebase Authentication** | Login, registro, gestión de sesiones |
| **Cloud Firestore** | Base de datos NoSQL en tiempo real |
| **Firebase SDK v10+** | Cliente JavaScript para comunicación |
| ❌ Cloud Functions | **NO implementadas** |
| ❌ Firebase Storage | **NO implementado** |
| ❌ Firebase Hosting | **NO usado** (despliegue en Lovable/Vercel) |

### 📦 Utilidades

| Librería | Función |
|----------|---------|
| **jsPDF** | Generación de PDFs |
| **jspdf-autotable** | Tablas en PDFs |
| **xlsx** | Exportación a Excel |
| **clsx + tailwind-merge** | Combinación de clases CSS |

---

## 🎨 Frontend

### Estructura

```
src/
├── components/         # Componentes de UI organizados por módulo
│   ├── ui/            # Componentes base (shadcn)
│   ├── admin/         # Vistas de administrador
│   ├── reception/     # Recepción
│   ├── reservations/  # Reservas
│   ├── billing/       # Facturación
│   └── ...
├── contexts/          # Context API (AuthContext)
├── hooks/             # Custom hooks (useReservations, useRooms, etc.)
├── pages/             # Páginas de rutas
├── lib/               # Utilidades (exportUtils, utils)
├── config/            # Configuración Firebase
└── scripts/           # Scripts de inicialización
```

### Patrones utilizados

- **Component-Based Architecture**: Componentes reutilizables y atómicos.
- **Custom Hooks**: Encapsulación de lógica de Firestore (`useReservations`, `useRooms`, `useMenuItems`, etc.).
- **Context API**: Estado global de autenticación.
- **Compound Components**: Patrones de shadcn/ui (Dialog, Card, etc.).
- **Real-time subscriptions**: `onSnapshot` para datos en vivo.

### Renderizado

- **CSR (Client-Side Rendering)**: Todo se renderiza en el navegador.
- ❌ No hay SSR (Server-Side Rendering).
- ❌ No hay SSG (Static Site Generation).
- ❌ No hay ISR (Incremental Static Regeneration).

---

## 🔥 Backend

### NO hay backend propio

El proyecto **no tiene un servidor backend escrito en Node.js, Python, Java u otro lenguaje**. Se utiliza Firebase como **BaaS (Backend-as-a-Service)**.

### Servicios Firebase utilizados:

#### 1. **Firebase Authentication**
- Manejo de usuarios (signup, login, logout).
- Sesiones persistentes en localStorage del navegador.
- Tokens JWT gestionados automáticamente por el SDK.

#### 2. **Cloud Firestore**
- Base de datos NoSQL orientada a documentos.
- Sincronización en tiempo real.
- Consultas con índices automáticos y compuestos.

### ⚠️ Lo que NO tiene este proyecto:

- ❌ Servidor Node.js / Express / NestJS
- ❌ Cloud Functions de Firebase
- ❌ API Gateway
- ❌ Cron jobs / tareas programadas
- ❌ Webhooks
- ❌ Procesamiento server-side de pagos
- ❌ Envío de emails desde el servidor

---

## 💾 Base de Datos

### Firebase Firestore (NoSQL)

#### Colecciones principales:

```
firestore/
├── users/                  # Usuarios del sistema (UID = document ID)
├── roles/                  # Roles (administrador, gerente, colaborador)
├── companies/              # Empresas hoteleras (multi-tenant)
├── hotels/                 # Hoteles asociados a empresas
├── reservations/           # Reservas
├── rooms/                  # Habitaciones
├── roomTypes/              # Tipos de habitación
├── roomFeatures/           # Características de habitación
├── menuItems/              # Items del menú (F&B)
├── inventoryProducts/      # Productos de inventario
├── inventoryCategories/    # Categorías de inventario
├── housekeepingProducts/   # Productos de housekeeping
├── suppliers/              # Proveedores
├── complaints/             # Quejas y reclamos
├── specialRequests/        # Solicitudes especiales
├── additionalServices/     # Servicios adicionales
├── consumptions/           # Consumos
├── mealPlans/              # Planes de alimentación
├── pricingRules/           # Reglas de precios dinámicos
├── plans/                  # Planes SaaS
└── hotelModules/           # Módulos habilitados por hotel
```

#### Características de Firestore:

- ✅ **Tiempo real**: Cambios se reflejan al instante en todos los clientes conectados.
- ✅ **Escalabilidad automática**: Google maneja la infraestructura.
- ✅ **Offline-first**: SDK cachea datos para uso sin conexión.
- ✅ **Multi-región**: Replicación automática.
- ⚠️ **NoSQL**: No hay JOINs nativos; las relaciones se manejan con IDs y consultas múltiples.

---

## 🔐 Autenticación

### Firebase Authentication

#### Flujo actual:

1. Usuario ingresa email/password en `LoginPage`.
2. Se llama a `signInWithEmailAndPassword(auth, email, password)`.
3. Firebase valida y retorna un usuario con UID + tokens JWT.
4. `onAuthStateChanged` detecta el cambio y carga datos extra desde Firestore (`users/{uid}`).
5. Se obtiene el rol desde `roles/{roleId}` y se enruta al dashboard correspondiente.

#### Roles soportados:

| Rol | Acceso |
|-----|--------|
| `administrador` | Panel de administración global |
| `gerente` | Dashboard gerencial del hotel |
| `colaborador` | Dashboard operativo limitado |

#### Almacenamiento de sesión:

- Tokens JWT se guardan en **IndexedDB** (manejado por Firebase SDK).
- El refresh token se renueva automáticamente.
- La sesión persiste entre recargas del navegador.

---

## 📡 Comunicación entre Componentes

### 1. **Cliente ↔ Firebase**

```
React App  ──HTTPS/WSS──►  Firebase SDK  ──gRPC/REST──►  Google Cloud
```

- Toda la comunicación es **cifrada con TLS 1.2+**.
- Los listeners en tiempo real usan **WebSocket** persistente.
- Las queries puntuales usan **HTTPS REST**.

### 2. **Componente ↔ Componente**

- **Props**: Comunicación padre → hijo.
- **Context API**: Estado global (autenticación).
- **Custom Events**: Eventos del navegador (`window.dispatchEvent`) para casos puntuales (ej: `navigate-to-login`).
- **TanStack Query**: Cache compartido entre componentes.

### 3. **Estado**

- **Local**: `useState`, `useReducer`.
- **Global**: `AuthContext`.
- **Server state**: `TanStack Query` + custom hooks con `onSnapshot`.

---

## 🛡️ Seguridad y Vulnerabilidades

### ✅ Lo que SÍ está protegido:

| Aspecto | Implementación |
|---------|---------------|
| **HTTPS** | Forzado por Firebase y hosting |
| **Autenticación** | Firebase Auth (estándar de la industria) |
| **Tokens JWT** | Manejados automáticamente, con refresh |
| **Validación de formularios** | Zod + React Hook Form en cliente |
| **XSS básico** | React escapa por defecto el contenido renderizado |
| **Hash de contraseñas** | Firebase usa bcrypt internamente |

### ⚠️ Vulnerabilidades y Riesgos Actuales:

#### 🔴 **CRÍTICO: Reglas de Firestore**

Si las reglas de seguridad de Firestore están configuradas como permisivas (`allow read, write: if true`), **cualquier persona con la API key puede leer y modificar toda la base de datos**.

**Estado actual**: ⚠️ Requiere verificación. El código asume que las reglas están configuradas correctamente, pero NO hay reglas versionadas en el repositorio.

**Recomendación urgente**: Configurar reglas como:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Solo administradores pueden escribir en colecciones críticas
    match /users/{userId} {
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'administrador';
    }
    
    // Cada usuario solo puede modificar sus propios datos
    match /users/{userId} {
      allow update: if request.auth.uid == userId;
    }
  }
}
```

#### 🟠 **ALTO: Validación solo en el cliente**

Toda la validación de datos (Zod, React Hook Form) ocurre en el navegador. Un atacante puede:
- Saltarse las validaciones llamando directamente a Firestore con el SDK.
- Enviar datos malformados o maliciosos.

**Mitigación**: Implementar validación server-side con **Cloud Functions** o **reglas de Firestore avanzadas**.

#### 🟠 **ALTO: API Key expuesta en el cliente**

```typescript
// src/config/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyAxEtVHxOlBJ3Diyhxmn5jhki1Optxpm-A",
  // ...
};
```

**Aclaración**: Esto es **normal y esperado** en aplicaciones Firebase. La API key NO es secreta; es un identificador del proyecto. La seguridad real depende de:
1. **Reglas de Firestore** (autorización).
2. **Restricciones de API key** en Google Cloud Console (dominios permitidos).

**Recomendación**: Restringir la API key en Google Cloud Console a los dominios de producción.

#### 🟡 **MEDIO: Lógica de roles en cliente**

El enrutamiento por rol (`administrador`, `gerente`, `colaborador`) se decide en el cliente (`App.tsx`). Un atacante con conocimientos técnicos podría modificar el rol en memoria.

**Mitigación**: Validar permisos también en las reglas de Firestore.

#### 🟡 **MEDIO: No hay protección CSRF**

Al usar Firebase SDK directamente (no cookies de sesión), el riesgo de CSRF es bajo, pero existe si se agregan endpoints custom.

#### 🟢 **BAJO: Inyección SQL**

Firestore es NoSQL → no aplica inyección SQL tradicional. Pero hay riesgo de **inyección NoSQL** si se concatenan strings en queries (no es el caso actual).

#### 🟢 **BAJO: Dependencias**

Ejecutar `npm audit` regularmente para detectar vulnerabilidades en paquetes.

### 🛡️ Resumen de Seguridad

| Vector de Ataque | Riesgo | Estado |
|------------------|--------|--------|
| XSS | 🟢 Bajo | Protegido por React |
| SQL Injection | 🟢 N/A | NoSQL |
| CSRF | 🟢 Bajo | No aplica con JWT |
| Acceso no autorizado a DB | 🔴 Alto | Depende de reglas Firestore |
| Suplantación de roles | 🟠 Medio | Validar en backend |
| Man-in-the-Middle | 🟢 Bajo | HTTPS forzado |
| Credenciales filtradas | 🟢 Bajo | Firebase maneja hashing |
| Bypass de validaciones | 🟠 Medio | Falta validación server-side |

---

## 🔌 Integraciones Externas

### Integraciones actuales:

| Servicio | Estado | Uso |
|----------|--------|-----|
| **Firebase Auth** | ✅ Activo | Autenticación |
| **Firebase Firestore** | ✅ Activo | Base de datos |
| **jsPDF** | ✅ Activo | Generación de PDFs (cliente) |
| **xlsx** | ✅ Activo | Exportación a Excel (cliente) |

### Integraciones NO implementadas (potenciales):

- ❌ Pasarelas de pago (Stripe, PayPal, MercadoPago).
- ❌ Envío de emails (SendGrid, Resend, Mailgun).
- ❌ SMS (Twilio).
- ❌ Channel Managers (Booking.com, Expedia, Airbnb).
- ❌ Facturación electrónica (DIAN, SAT, AFIP).
- ❌ Google Maps / geolocalización.
- ❌ Analytics (Google Analytics, Mixpanel).
- ❌ Sentry / monitoreo de errores.
- ❌ Storage de archivos (Firebase Storage, S3).

---

## 📨 Manejo de Solicitudes (Requests)

### Patrón actual:

```typescript
// Custom Hook típico (ej: useReservations.ts)
export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscripción en tiempo real
    const unsubscribe = onSnapshot(
      collection(db, 'reservations'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(data);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup
  }, []);

  return { reservations, loading };
};
```

### Tipos de operaciones:

| Operación | Función Firestore | Tipo |
|-----------|-------------------|------|
| Leer (1 vez) | `getDocs`, `getDoc` | HTTPS REST |
| Leer (tiempo real) | `onSnapshot` | WebSocket |
| Crear | `addDoc`, `setDoc` | HTTPS REST |
| Actualizar | `updateDoc` | HTTPS REST |
| Eliminar | `deleteDoc` | HTTPS REST |
| Consulta filtrada | `query` + `where` | HTTPS REST |

### Manejo de errores:

```typescript
try {
  await addDoc(collection(db, 'reservations'), data);
  toast.success('Reserva creada');
} catch (error) {
  console.error(error);
  toast.error('Error al crear reserva');
}
```

### Cache:

- **TanStack Query** se usa parcialmente para cache.
- **Firebase SDK** mantiene cache local automáticamente.

---

## ✅ Lo que SÍ tiene el proyecto

### Funcionalidades:

- ✅ Sistema multi-tenant (varias empresas/hoteles).
- ✅ Autenticación con roles (admin, gerente, colaborador).
- ✅ 13 módulos funcionales (Recepción, Reservas, F&B, Housekeeping, etc.).
- ✅ Sincronización en tiempo real entre usuarios.
- ✅ Exportación de reportes (PDF, Excel).
- ✅ Sistema de planes SaaS.
- ✅ Gestión de licencias con vencimiento.
- ✅ Dashboards con métricas.
- ✅ Diseño responsive (mobile-first).
- ✅ Tema claro/oscuro (parcial).
- ✅ Animaciones fluidas (Framer Motion).
- ✅ Validación de formularios (Zod).

### Técnico:

- ✅ TypeScript estricto.
- ✅ Componentes accesibles (Radix UI).
- ✅ Sistema de diseño con tokens semánticos (Tailwind + CSS variables).
- ✅ Hot Module Replacement (Vite).
- ✅ Tree-shaking automático.

---

## ❌ Lo que NO tiene el proyecto

### Infraestructura:

- ❌ Backend propio (Node.js, Python, etc.).
- ❌ API REST/GraphQL custom.
- ❌ Cloud Functions de Firebase.
- ❌ Microservicios.
- ❌ Servidor de WebSockets propio.
- ❌ Cron jobs / tareas programadas.

### Seguridad:

- ❌ Reglas de Firestore versionadas en el repo.
- ❌ Validación server-side.
- ❌ Rate limiting.
- ❌ 2FA / autenticación de dos factores.
- ❌ Auditoría de cambios server-side.
- ❌ Tests automatizados (unitarios, integración, E2E).

### Funcionalidades:

- ❌ Pasarela de pagos integrada.
- ❌ Envío automático de emails.
- ❌ Notificaciones push.
- ❌ Subida y gestión de archivos (imágenes, documentos).
- ❌ Channel managers (booking.com, etc.).
- ❌ Facturación electrónica oficial.
- ❌ Internacionalización (i18n) completa.
- ❌ App móvil nativa (solo web responsive).
- ❌ Modo offline robusto.

### DevOps:

- ❌ CI/CD pipelines configurados.
- ❌ Tests automatizados.
- ❌ Monitoreo de errores en producción (Sentry).
- ❌ Analytics de uso.
- ❌ Logs centralizados.

---

## 🚀 Recomendaciones de Mejora

### Prioridad ALTA 🔴

1. **Configurar reglas de Firestore estrictas** y versionarlas en el repo (`firestore.rules`).
2. **Restringir la API key de Firebase** por dominio en Google Cloud Console.
3. **Implementar Cloud Functions** para validación server-side de operaciones críticas (creación de usuarios, cambios de rol, facturación).
4. **Añadir tests automatizados** (Vitest + React Testing Library).

### Prioridad MEDIA 🟠

5. **Integrar Firebase Storage** para subir imágenes de habitaciones, logos, etc.
6. **Implementar envío de emails** (Resend / SendGrid vía Cloud Functions).
7. **Configurar Sentry** para monitoreo de errores.
8. **Agregar 2FA** para cuentas de administrador.
9. **Implementar rate limiting** en operaciones sensibles.

### Prioridad BAJA 🟢

10. **Internacionalización (i18n)** con `react-i18next`.
11. **PWA** (instalable como app).
12. **Modo offline** con sincronización al reconectar.
13. **Analytics** con Google Analytics o Plausible.

---

## 📚 Conclusión

**Bloom Suites** es una aplicación moderna tipo **SPA + BaaS** que aprovecha Firebase para evitar la complejidad de mantener un backend propio. Esto la hace **rápida de desarrollar y desplegar**, pero también **dependiente de la configuración correcta de reglas de seguridad de Firestore**.

### TL;DR

| Pregunta | Respuesta |
|----------|-----------|
| ¿Tiene API propia? | ❌ No, usa Firebase SDK |
| ¿Es monolítica? | ❌ No, es SPA + BaaS |
| ¿Tiene backend? | ⚠️ Sí, pero gestionado (Firebase) |
| ¿Es vulnerable? | ⚠️ Depende de las reglas de Firestore |
| ¿Cómo se comunica? | HTTPS + WebSocket vía Firebase SDK |
| ¿Frontend? | React + TypeScript + Vite |
| ¿Base de datos? | Firestore (NoSQL en tiempo real) |
| ¿Autenticación? | Firebase Auth (JWT) |
| ¿Tiempo real? | ✅ Sí, con `onSnapshot` |
| ¿Tests? | ❌ No implementados |

---

**Documento generado**: 2026  
**Versión del proyecto**: 1.0.0  
**Mantenedor**: Equipo Bloom Suites
