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
- **Frontend:** React 18, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, Lucide Icons.
- **Estado y datos:** TanStack Query, Context API, React Hook Form, Zod.
- **Backend (BaaS):** Firebase Authentication, Cloud Firestore (NoSQL en tiempo real).
- **Reportes:** jsPDF, jspdf-autotable, xlsx (exportación a PDF y Excel).
- **Otros:** date-fns, Recharts (gráficos), Sonner (notificaciones).

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
