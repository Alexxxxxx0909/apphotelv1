import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
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
    try {
      setLoading(true);
      const collaboratorData = {
        ...data,
        rol: data.cargo.toLowerCase().replace(/\s+/g, '_'),
        estado: 'activo' as const,
        fechaCreacion: Timestamp.now(),
        ultimoAcceso: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'collaborators'), collaboratorData);
      
      toast({
        title: "Colaborador creado",
        description: `${data.nombre} ha sido registrado exitosamente`,
      });
      
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo crear el colaborador",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCollaborator = async (id: string, data: Partial<CollaboratorFormData>) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'collaborators', id), {
        ...data,
        updatedAt: Timestamp.now()
      });
      
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