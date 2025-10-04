import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const defaultRoles = [
  {
    id: 'administrador',
    nombre: 'Administrador',
    permisos: ['all'],
    estado: 'activo',
    fechaCreacion: new Date()
  },
  {
    id: 'gerente',
    nombre: 'Gerente',
    permisos: ['reservations', 'reception', 'housekeeping', 'billing', 'reports', 'maintenance', 'customer-service'],
    estado: 'activo',
    fechaCreacion: new Date()
  },
  {
    id: 'colaborador',
    nombre: 'Colaborador',
    permisos: ['reception', 'housekeeping', 'customer-service'],
    estado: 'activo',
    fechaCreacion: new Date()
  }
];

export const initializeRoles = async () => {
  try {
    // Check if roles already exist
    const rolesSnapshot = await getDocs(collection(db, 'roles'));
    
    if (rolesSnapshot.empty) {
      console.log('Initializing default roles...');
      
      for (const role of defaultRoles) {
        await setDoc(doc(db, 'roles', role.id), role);
        console.log(`Role ${role.nombre} created`);
      }
      
      console.log('Default roles initialized successfully');
    } else {
      console.log('Roles already exist');
    }
  } catch (error) {
    console.error('Error initializing roles:', error);
    throw error;
  }
};
