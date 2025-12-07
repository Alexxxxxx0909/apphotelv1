import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Complaint {
  id: string;
  hotelId: string;
  guestName: string;
  roomNumber: string;
  category: string;
  subject: string;
  description: string;
  severity: 'critica' | 'alta' | 'media' | 'baja';
  status: 'abierta' | 'en-proceso' | 'resuelta' | 'escalada';
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  assignedTo?: string;
  solution?: string;
  compensation?: string;
  createdBy: string;
}

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.hotel) {
      setComplaints([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'complaints'),
      where('hotelId', '==', user.hotel)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaintsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Complaint[];
      
      // Sort in memory to avoid needing a composite index
      complaintsData.sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;
        return dateB - dateA;
      });
      
      setComplaints(complaintsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching complaints:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las quejas",
        variant: "destructive"
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.hotel]);

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'hotelId' | 'createdAt' | 'createdBy' | 'status'>) => {
    if (!user?.hotel) {
      toast({
        title: "Error",
        description: "No se pudo identificar el hotel",
        variant: "destructive"
      });
      return null;
    }

    try {
      const docRef = await addDoc(collection(db, 'complaints'), {
        ...complaintData,
        hotelId: user.hotel,
        status: 'abierta',
        createdAt: Timestamp.now(),
        createdBy: user.email || ''
      });

      toast({
        title: "Queja registrada",
        description: "La queja se ha registrado correctamente"
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding complaint:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la queja",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateComplaint = async (
    id: string, 
    updates: Partial<Pick<Complaint, 'status' | 'assignedTo' | 'solution' | 'compensation' | 'resolvedAt'>>
  ) => {
    try {
      const docRef = doc(db, 'complaints', id);
      await updateDoc(docRef, updates);

      toast({
        title: "Queja actualizada",
        description: "La queja se ha actualizado correctamente"
      });

      return true;
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la queja",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteComplaint = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'complaints', id));

      toast({
        title: "Queja eliminada",
        description: "La queja se ha eliminado correctamente"
      });

      return true;
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la queja",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    complaints,
    loading,
    addComplaint,
    updateComplaint,
    deleteComplaint
  };
};
