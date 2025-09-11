import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Tipos de usuario y roles
export const USER_ROLES = {
  ADMIN: 'administrador',
  MANAGER: 'gerente',
  COLLABORATOR: 'colaborador'
};

// Estructura completa de la base de datos
export const initializeDatabase = async () => {
  try {
    console.log('Inicializando estructura completa de base de datos...');

    // 1. EMPRESAS HOTELES
    const empresasHoteles = [
      {
        razonSocial: 'Bloom Suites S.A.S',
        nit: '900123456-7',
        direccion: 'Av. Principal 123, Ciudad',
        logo: '/logo.png',
        moneda: 'USD',
        impuestos: {
          iva: 19,
          retefuente: 3.5
        },
        plan: 'premium',
        estado: 'activo',
        fechaRegistro: Timestamp.now()
      }
    ];

    for (const empresa of empresasHoteles) {
      await addDoc(collection(db, 'empresasHoteles'), empresa);
    }

    // 2. ROLES Y PERMISOS
    const rolesPermisos = [
      {
        nombreRol: 'administrador',
        permisos: {
          empresas: ['crear', 'leer', 'actualizar', 'eliminar'],
          usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
          reportes: ['leer', 'exportar'],
          configuracion: ['leer', 'actualizar'],
          auditoria: ['leer']
        }
      },
      {
        nombreRol: 'gerente',
        permisos: {
          habitaciones: ['crear', 'leer', 'actualizar'],
          reservas: ['crear', 'leer', 'actualizar', 'eliminar'],
          clientes: ['crear', 'leer', 'actualizar'],
          inventario: ['leer', 'actualizar'],
          personal: ['leer', 'actualizar'],
          reportes: ['leer', 'exportar']
        }
      },
      {
        nombreRol: 'colaborador',
        permisos: {
          recepcion: ['crear', 'leer', 'actualizar'],
          housekeeping: ['leer', 'actualizar'],
          mantenimiento: ['leer', 'actualizar']
        }
      }
    ];

    for (const rol of rolesPermisos) {
      await addDoc(collection(db, 'rolesPermisos'), rol);
    }

    // 3. MÓDULOS DEL SISTEMA
    const modulos = [
      { nombre: 'Recepción', descripcion: 'Gestión de huéspedes y check-in/out' },
      { nombre: 'Housekeeping', descripcion: 'Gestión de limpieza y mantenimiento de habitaciones' },
      { nombre: 'Mantenimiento', descripcion: 'Gestión de reparaciones y mantenimiento preventivo' },
      { nombre: 'Facturación', descripcion: 'Gestión de facturación y pagos' },
      { nombre: 'Inventario', descripcion: 'Control de inventario y suministros' },
      { nombre: 'Reportes', descripcion: 'Generación de informes y estadísticas' },
      { nombre: 'Atención al Cliente', descripcion: 'Gestión de quejas y servicios adicionales' }
    ];

    for (const modulo of modulos) {
      await addDoc(collection(db, 'modulos'), modulo);
    }

    // 4. HABITACIONES
    const habitaciones = [
      { numero: '101', tipo: 'sencilla', estado: 'disponible', precioBase: 80, piso: 1 },
      { numero: '102', tipo: 'sencilla', estado: 'disponible', precioBase: 80, piso: 1 },
      { numero: '103', tipo: 'doble', estado: 'ocupada', precioBase: 120, piso: 1 },
      { numero: '201', tipo: 'doble', estado: 'limpieza', precioBase: 120, piso: 2 },
      { numero: '202', tipo: 'suite', estado: 'disponible', precioBase: 250, piso: 2 },
      { numero: '301', tipo: 'suite', estado: 'mantenimiento', precioBase: 250, piso: 3 }
    ];

    for (const habitacion of habitaciones) {
      await addDoc(collection(db, 'habitaciones'), habitacion);
    }

    // 5. CLIENTES DE EJEMPLO
    const clientes = [
      {
        nombre: 'Juan Pérez',
        documento: '12345678',
        telefono: '+1234567890',
        correo: 'juan.perez@email.com',
        fechaRegistro: Timestamp.now()
      },
      {
        nombre: 'María García',
        documento: '87654321',
        telefono: '+0987654321',
        correo: 'maria.garcia@email.com',
        fechaRegistro: Timestamp.now()
      }
    ];

    for (const cliente of clientes) {
      await addDoc(collection(db, 'clientes'), cliente);
    }

    // 6. PROVEEDORES
    const proveedores = [
      {
        nombre: 'Suministros Hoteleros S.A.',
        contacto: 'Carlos Rodríguez',
        telefono: '+1122334455',
        direccion: 'Calle 45 #12-34',
        estado: 'activo'
      },
      {
        nombre: 'Lavandería Express',
        contacto: 'Ana López',
        telefono: '+5566778899',
        direccion: 'Av. Lavado 67',
        estado: 'activo'
      }
    ];

    for (const proveedor of proveedores) {
      await addDoc(collection(db, 'proveedores'), proveedor);
    }

    // 7. INVENTARIO
    const inventario = [
      {
        nombre: 'Toallas',
        categoria: 'lencería',
        cantidad: 150,
        unidad: 'piezas',
        proveedor: 'Suministros Hoteleros S.A.',
        estado: 'disponible'
      },
      {
        nombre: 'Jabón de baño',
        categoria: 'amenities',
        cantidad: 200,
        unidad: 'piezas',
        proveedor: 'Suministros Hoteleros S.A.',
        estado: 'disponible'
      },
      {
        nombre: 'Papel higiénico',
        categoria: 'aseo',
        cantidad: 80,
        unidad: 'rollos',
        proveedor: 'Suministros Hoteleros S.A.',
        estado: 'bajo'
      }
    ];

    for (const item of inventario) {
      await addDoc(collection(db, 'inventario'), item);
    }

    // 8. PERSONAL
    const personal = [
      {
        nombre: 'Carlos Méndez',
        rol: 'recepción',
        turno: 'mañana',
        sueldo: 1200,
        estado: 'activo',
        fechaIngreso: Timestamp.now()
      },
      {
        nombre: 'Laura Jiménez',
        rol: 'limpieza',
        turno: 'tarde',
        sueldo: 900,
        estado: 'activo',
        fechaIngreso: Timestamp.now()
      },
      {
        nombre: 'Roberto Silva',
        rol: 'mantenimiento',
        turno: 'mañana',
        sueldo: 1100,
        estado: 'activo',
        fechaIngreso: Timestamp.now()
      }
    ];

    for (const empleado of personal) {
      await addDoc(collection(db, 'personal'), empleado);
    }

    // 9. PLANES SAAS
    const planesSaas = [
      {
        nombrePlan: 'Básico',
        limiteUsuarios: 5,
        limiteModulos: 3,
        precio: 99,
        estado: 'activo'
      },
      {
        nombrePlan: 'Premium',
        limiteUsuarios: 15,
        limiteModulos: 7,
        precio: 299,
        estado: 'activo'
      },
      {
        nombrePlan: 'Enterprise',
        limiteUsuarios: -1, // ilimitado
        limiteModulos: -1, // ilimitado
        precio: 599,
        estado: 'activo'
      }
    ];

    for (const plan of planesSaas) {
      await addDoc(collection(db, 'planesSaas'), plan);
    }

    // 10. CONFIGURACIÓN DEL HOTEL
    const hotelConfig = {
      nombreHotel: 'Bloom Suites Hotel',
      direccion: 'Av. Principal 123, Ciudad',
      telefono: '+1234567890',
      email: 'info@bloomsuites.com',
      moneda: 'USD',
      timezone: 'America/New_York',
      horaCheckIn: '15:00',
      horaCheckOut: '11:00',
      politicasCancelacion: '24 horas antes sin penalidad',
      politicasReembolso: 'Reembolso completo hasta 48 horas antes'
    };

    await setDoc(doc(db, 'configuracion', 'hotel'), hotelConfig);

    // 11. TIPOS DE HABITACIÓN DETALLADOS
    const tiposHabitacion = [
      {
        tipo: 'sencilla',
        nombre: 'Habitación Sencilla',
        capacidad: 1,
        precioBase: 80,
        amenidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Escritorio'],
        descripcion: 'Habitación cómoda para una persona con todas las comodidades básicas'
      },
      {
        tipo: 'doble',
        nombre: 'Habitación Doble',
        capacidad: 2,
        precioBase: 120,
        amenidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Sofá'],
        descripcion: 'Habitación espaciosa para dos personas con amenidades premium'
      },
      {
        tipo: 'suite',
        nombre: 'Suite Premium',
        capacidad: 4,
        precioBase: 250,
        amenidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Jacuzzi', 'Sala de estar', 'Vista panorámica'],
        descripcion: 'Suite de lujo con todas las comodidades premium y vista espectacular'
      }
    ];

    for (const tipo of tiposHabitacion) {
      await addDoc(collection(db, 'tiposHabitacion'), tipo);
    }

    console.log('Estructura completa de base de datos inicializada correctamente');
    return true;
  } catch (error) {
    console.error('Error inicializando estructura de base de datos:', error);
    throw error;
  }
};

// Función para resetear la base de datos (solo para desarrollo)
export const resetDatabase = async () => {
  console.log('Esta función debe implementarse con cuidado en producción');
  // Implementar limpieza de colecciones si es necesario
};