# Bloom Suites

## Descripción breve
**Bloom Suites** es un sistema integral de gestión hotelera (PMS) basado en la nube, diseñado para optimizar y automatizar las operaciones diarias de hoteles de cualquier tamaño. La plataforma centraliza en un solo lugar la administración de reservas, recepción, housekeeping, alimentos y bebidas, mantenimiento, proveedores, facturación y atención al cliente.

Construido como una Single Page Application con React, TypeScript y Firebase, ofrece sincronización en tiempo real entre todos los usuarios conectados, garantizando información siempre actualizada. Cuenta con un sistema multi-tenant que permite gestionar varias empresas y hoteles, control de acceso por roles (administrador, gerente y colaborador), planes SaaS personalizables y gestión de licencias.

Incluye dashboards con métricas clave, generación de reportes en PDF y Excel, control de disponibilidad, precios dinámicos, gestión de consumos y facturación unificada, brindando a los hoteles una herramienta moderna, escalable y fácil de usar.

---

## Problema que soluciona
Muchos hoteles, especialmente pequeños y medianos, todavía gestionan sus operaciones con planillas de Excel, cuadernos o sistemas desconectados, lo que genera errores en reservas, pérdida de información, doble facturación, mala comunicación entre áreas (recepción, housekeeping, restaurante) y dificultad para tomar decisiones basadas en datos. **Bloom Suites** unifica todos los procesos del hotel en una sola plataforma en tiempo real, eliminando la duplicidad de información, reduciendo errores operativos y permitiendo un control total del negocio desde cualquier dispositivo.

---

## Tecnologías utilizadas

### Frontend
- **React 18** + **TypeScript 5** — Librería UI con tipado estático.
- **Vite 5** — Build tool y dev server ultrarrápido.
- **React Router DOM 6** — Enrutamiento SPA.
- **Tailwind CSS 3** — Estilos utility-first con tokens semánticos.
- **shadcn/ui** (Radix UI) — Componentes accesibles.
- **Framer Motion** — Animaciones fluidas.
- **Lucide React** — Iconografía SVG.

### Estado, datos y formularios
- **TanStack Query 5** — Cache y sincronización de datos.
- **Context API** — Estado global (autenticación).
- **React Hook Form 7** — Manejo de formularios.
- **Zod 3** — Validación de esquemas tipados.

### Backend (BaaS — Serverless)
- **Firebase Authentication** — Gestión de usuarios y sesiones.
- **Cloud Firestore** — Base de datos NoSQL en tiempo real (WebSockets).
- **Firebase SDK v10+** — Cliente JavaScript oficial.

### Reportes y exportación
- **jsPDF** + **jspdf-autotable** — Generación de PDFs con tablas.
- **xlsx (SheetJS)** — Exportación a Excel.
- **Recharts** — Gráficos y dashboards interactivos.

### Utilidades
- **date-fns 3** — Manipulación de fechas.
- **Sonner** — Notificaciones toast.
- **clsx** + **tailwind-merge** — Composición de clases CSS.

### Seguridad
- **Firebase Authentication** — Autenticación gestionada con estándares de la industria; las contraseñas se almacenan con **hash bcrypt** del lado de Firebase (nunca en texto plano).
- **JSON Web Tokens (JWT)** — Tokens de sesión firmados, con **refresh token** automático manejado por el SDK.
- **HTTPS / TLS 1.2+** — Toda la comunicación entre el cliente y Firebase viaja cifrada.
- **IndexedDB segura** — Almacenamiento de tokens en el navegador gestionado por el SDK de Firebase (no en `localStorage` plano).
- **Reglas de seguridad de Firestore** — Control de acceso a nivel de base de datos por usuario autenticado y rol.
- **Control de acceso basado en roles (RBAC)** — Tres roles (Administrador, Gerente, Colaborador) con módulos habilitados según plan y licencia.
- **Reautenticación obligatoria** — Para operaciones sensibles como el cambio de contraseña (Firebase `reauthenticateWithCredential`).
- **Bloqueo de cuentas** — Los colaboradores marcados como “inactivos” no pueden iniciar sesión.
- **Validación con Zod** — Validación estricta de entradas en formularios para prevenir datos malformados.
- **Protección XSS nativa** — React escapa automáticamente el contenido renderizado.
- **Restricción de API Key** — La clave pública de Firebase se restringe por dominio en Google Cloud Console.
- **Aislamiento multi-tenant** — Cada empresa/hotel solo accede a sus propios datos mediante filtros por `hotelId` y reglas de Firestore.

---

## ¿Qué hace innovador al proyecto?
- **Sincronización en tiempo real** entre todas las áreas del hotel: lo que cambia en recepción se ve al instante en housekeeping, restaurante y facturación.
- **Arquitectura multi-tenant** que permite a una sola plataforma gestionar varias empresas y hoteles con planes SaaS personalizables.
- **Módulos dinámicos por plan y licencia**, habilitando o bloqueando funciones automáticamente según el tier contratado.
- **Facturación unificada** que integra alojamiento, restaurante, minibar, spa y servicios adicionales en una sola cuenta del huésped.
- **Precios dinámicos** y control de disponibilidad inteligente, junto con un sistema de roles granular (Administrador, Gerente, Colaborador).
- Todo construido con un stack **serverless moderno**, lo que lo hace rápido, escalable y de bajo costo de mantenimiento.

---

## Áreas de impacto
- **Negocios:** ✅ Impacto principal. Profesionaliza y digitaliza la gestión hotelera, mejora la rentabilidad, reduce errores y facilita la toma de decisiones con dashboards y reportes.
- **Tecnología:** ✅ Impacto directo. Lleva a la industria hotelera tecnologías modernas (cloud, tiempo real, SaaS multi-tenant) que antes solo estaban al alcance de grandes cadenas.
