import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

// Función para eliminar usuario actual y crear uno nuevo
export const recreateUser = async (email: string, password: string, userData: any) => {
  try {
    // Primero intentar iniciar sesión con el usuario existente
    try {
      const existingUser = await signInWithEmailAndPassword(auth, email, password);
      // Si existe, eliminarlo
      await deleteUser(existingUser.user);
      console.log(`Usuario ${email} eliminado de Auth`);
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        console.log(`Error al intentar eliminar usuario ${email}:`, error.message);
      }
    }

    // Cerrar sesión si hay alguna activa
    await signOut(auth);

    // Crear usuario nuevo
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Guardar datos en Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`Usuario ${email} creado exitosamente con rol: ${userData.role}`);
    
    // Cerrar sesión después de crear
    await signOut(auth);
    
    return { success: true, uid: userCredential.user.uid };
    
  } catch (error: any) {
    console.error(`Error recreando usuario ${email}:`, error);
    return { success: false, error: error.message };
  }
};

export const syncAllUsers = async () => {
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
    const result = await recreateUser(user.email, user.password, user.userData);
    results.push({ email: user.email, ...result });
    
    // Esperar un poco entre cada usuario para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
};

// Función específica para corregir un usuario que ya existe en Auth pero no en Firestore
export const fixUserInFirestore = async (email: string, userData: any) => {
  try {
    // Iniciar sesión para obtener el UID
    const userCredential = await signInWithEmailAndPassword(auth, email, 'hotel123');
    const uid = userCredential.user.uid;
    
    // Verificar si ya existe en Firestore
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      // Si no existe, crearlo en Firestore
      await setDoc(doc(db, 'users', uid), {
        email: email,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Usuario ${email} agregado a Firestore con rol: ${userData.role}`);
    } else {
      // Si existe, actualizarlo
      await setDoc(doc(db, 'users', uid), {
        email: email,
        ...userData,
        updatedAt: new Date(),
        createdAt: userDoc.data().createdAt || new Date()
      }, { merge: true });
      console.log(`Usuario ${email} actualizado en Firestore con rol: ${userData.role}`);
    }
    
    await signOut(auth);
    return { success: true, uid };
    
  } catch (error: any) {
    console.error(`Error corrigiendo usuario ${email}:`, error);
    await signOut(auth);
    return { success: false, error: error.message };
  }
};

export const quickFixAllUsers = async () => {
  const users = [
    {
      email: 'admin@hotel.com',
      userData: {
        name: 'Administrador Principal',
        role: 'administrador',
        active: true,
        permissions: ['all']
      }
    },
    {
      email: 'gerente@hotel.com',
      userData: {
        name: 'Gerente General',
        role: 'gerente',
        active: true,
        permissions: ['reception', 'housekeeping', 'billing', 'reports']
      }
    },
    {
      email: 'recepcion@hotel.com',
      userData: {
        name: 'Colaborador Recepción',
        role: 'colaborador',
        active: true,
        permissions: ['reception']
      }
    }
  ];

  const results = [];

  for (const user of users) {
    const result = await fixUserInFirestore(user.email, user.userData);
    results.push({ email: user.email, ...result });
  }

  return results;
};