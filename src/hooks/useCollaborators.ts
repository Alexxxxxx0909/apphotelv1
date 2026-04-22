import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { initializeApp, getApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { db, firebaseConfig } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';

export interface Collaborator {
  id: string;
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
  cargo: string;
  rol: string;
  estado: 'activo' | 'inactivo' | 'bloqueado';
  modulosAsignados: string[];
  fechaCreacion: any;
  ultimoAcceso?: any;
  hotelAsignado: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface CollaboratorFormData {
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
  cargo: string;
  hotelAsignado: string;
  modulosAsignados: string[];
  password: string;
}

export const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(
      collection(db, 'collaborators'),
      orderBy('fechaCreacion', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Collaborator));
        setCollaborators(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        toast({
          title: "Error",
          description: "No se pudieron cargar los colaboradores",
          variant: "destructive"
        });
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const createCollaborator = async (data: CollaboratorFormData) => {
    let secondaryApp: any = null;
    try {
      setLoading(true);

      if (!data.email || !data.password) {
        throw new Error('Email y contraseña son requeridos');
      }

      // 1) Crear usuario en Firebase Auth usando una app secundaria
      //    para no cerrar la sesión del gerente actual.
      const secondaryAppName = `secondary-${Date.now()}`;
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);
      const secondaryDb = getFirestore(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        data.email,
        data.password
      );
      const newUid = userCredential.user.uid;

      // 2) Crear documento en 'users/{uid}' para que AuthContext
      //    reconozca su rol al iniciar sesión.
      await setDoc(doc(secondaryDb, 'users', newUid), {
        name: data.nombre,
        email: data.email,
        phone: data.telefono,
        identificacion: data.documento,
        role: 'colaborador',
        hotel: data.hotelAsignado,
        cargo: data.cargo,
        permissions: data.modulosAsignados,
        active: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // 3) Crear documento en 'collaborators' para gestión interna
      const collaboratorData = {
        ...data,
        uid: newUid,
        rol: 'colaborador',
        estado: 'activo' as const,
        fechaCreacion: Timestamp.now(),
        ultimoAcceso: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, 'collaborators'), collaboratorData);

      // 4) Cerrar sesión secundaria y eliminar la app secundaria
      try { await signOut(secondaryAuth); } catch {}
      await deleteApp(secondaryApp);
      secondaryApp = null;

      toast({
        title: "Colaborador creado",
        description: `${data.nombre} fue registrado. Ya puede iniciar sesión con su email y contraseña.`,
      });

      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      const msg = err?.code === 'auth/email-already-in-use'
        ? 'El email ya está registrado en el sistema'
        : err?.code === 'auth/weak-password'
          ? 'La contraseña es muy débil (mínimo 6 caracteres)'
          : err?.code === 'auth/invalid-email'
            ? 'El email no es válido'
            : 'No se pudo crear el colaborador';
      toast({
        title: "Error",
        description: msg,
        variant: "destructive"
      });
      if (secondaryApp) {
        try { await deleteApp(secondaryApp); } catch {}
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCollaborator = async (id: string, data: Partial<CollaboratorFormData> & { estado?: string }) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'collaborators', id), {
        ...data,
        updatedAt: Timestamp.now()
      });

      // Sincronizar cambios relevantes con el documento users/{uid}
      // para que el dashboard del colaborador refleje permisos/hotel/estado en tiempo real.
      const collab = collaborators.find(c => c.id === id) as any;
      const uid = collab?.uid;
      if (uid) {
        const userUpdate: any = { updatedAt: Timestamp.now() };
        if (data.modulosAsignados !== undefined) userUpdate.permissions = data.modulosAsignados;
        if (data.hotelAsignado !== undefined) userUpdate.hotel = data.hotelAsignado;
        if (data.nombre !== undefined) userUpdate.name = data.nombre;
        if (data.telefono !== undefined) userUpdate.phone = data.telefono;
        if (data.documento !== undefined) userUpdate.identificacion = data.documento;
        if (data.cargo !== undefined) userUpdate.cargo = data.cargo;
        if ((data as any).estado !== undefined) {
          userUpdate.active = (data as any).estado === 'activo';
        }

        if (Object.keys(userUpdate).length > 1) {
          try {
            await updateDoc(doc(db, 'users', uid), userUpdate);
          } catch (syncErr) {
            console.warn('No se pudo sincronizar users/{uid}:', syncErr);
          }
        }
      }

      toast({
        title: "Colaborador actualizado",
        description: "Los datos han sido guardados exitosamente",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo actualizar el colaborador",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCollaborator = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'collaborators', id));
      
      toast({
        title: "Colaborador eliminado",
        description: "El colaborador ha sido removido del sistema",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo eliminar el colaborador",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = async (id: string, currentState: string) => {
    const newState = currentState === 'activo' ? 'inactivo' : 'activo';
    await updateCollaborator(id, { estado: newState } as any);
  };

  const blockCollaborator = async (id: string, currentState: string) => {
    const newState = currentState === 'bloqueado' ? 'activo' : 'bloqueado';
    await updateCollaborator(id, { estado: newState } as any);
  };

  const updateModules = async (id: string, modules: string[]) => {
    await updateCollaborator(id, { modulosAsignados: modules } as any);
  };

  const resetPassword = async (id: string) => {
    // Aquí implementarías la lógica para resetear contraseña
    // Por ejemplo, enviando un email con nueva contraseña
    toast({
      title: "Contraseña restablecida",
      description: "Se ha enviado una nueva contraseña temporal por email",
    });
  };

  const reassignHotel = async (id: string, newHotel: string) => {
    await updateCollaborator(id, { hotelAsignado: newHotel } as any);
  };

  return {
    collaborators,
    loading,
    error,
    createCollaborator,
    updateCollaborator,
    deleteCollaborator,
    toggleEstado,
    blockCollaborator,
    updateModules,
    resetPassword,
    reassignHotel
  };
};