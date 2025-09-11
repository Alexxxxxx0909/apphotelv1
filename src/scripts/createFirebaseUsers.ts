import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export const createDefaultUsers = async () => {
  const defaultUsers = [
    {
      email: 'admin@hotel.com',
      password: 'hotel123',
      userData: {
        name: 'Administrador Principal',
        role: 'administrador',
        active: true,
        permissions: ['all']
      }
    },
    {
      email: 'gerente@hotel.com',
      password: 'hotel123',
      userData: {
        name: 'Gerente General',
        role: 'gerente',
        active: true,
        permissions: ['reception', 'housekeeping', 'billing', 'reports']
      }
    },
    {
      email: 'recepcion@hotel.com',
      password: 'hotel123',
      userData: {
        name: 'Colaborador Recepción',
        role: 'colaborador',
        active: true,
        permissions: ['reception']
      }
    }
  ];

  const results = [];

  for (const user of defaultUsers) {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        user.email, 
        user.password
      );
      
      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: user.email,
        ...user.userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      results.push({ email: user.email, success: true });
      console.log(`Usuario ${user.email} creado exitosamente`);
      
    } catch (error: any) {
      // Si el usuario ya existe, no es un error crítico
      if (error.code === 'auth/email-already-in-use') {
        results.push({ email: user.email, success: true, message: 'Ya existe' });
        console.log(`Usuario ${user.email} ya existe`);
      } else {
        results.push({ email: user.email, success: false, error: error.message });
        console.error(`Error creando usuario ${user.email}:`, error);
      }
    }
  }

  return results;
};