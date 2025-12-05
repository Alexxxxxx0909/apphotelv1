import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface SpecialRequest {
  id: string;
  hotelId: string;
  guestName: string;
  roomNumber: string;
  requestType: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'pendiente' | 'en-proceso' | 'completada' | 'cancelada';
  createdAt: Timestamp;
  dueDate: string;
  assignedTo?: string;
  createdBy?: string;
}

export interface NewSpecialRequest {
  guestName: string;
  roomNumber: string;
  requestType: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  dueDate: string;
  assignedTo?: string;
}

export const useSpecialRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SpecialRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.hotel) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'specialRequests'),
      where('hotelId', '==', user.hotel),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SpecialRequest[];
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching special requests:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes especiales",
        variant: "destructive"
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.hotel]);

  const addRequest = async (newRequest: NewSpecialRequest) => {
    if (!user?.hotel) {
      toast({
        title: "Error",
        description: "No se encontró el hotel asignado",
        variant: "destructive"
      });
      return false;
    }

    try {
      await addDoc(collection(db, 'specialRequests'), {
        ...newRequest,
        hotelId: user.hotel,
        status: 'pendiente',
        createdAt: Timestamp.now(),
        createdBy: user.id
      });

      toast({
        title: "Éxito",
        description: "Solicitud especial creada correctamente"
      });
      return true;
    } catch (error) {
      console.error('Error adding special request:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud especial",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateRequestStatus = async (requestId: string, status: SpecialRequest['status']) => {
    try {
      await updateDoc(doc(db, 'specialRequests', requestId), { status });
      toast({
        title: "Éxito",
        description: "Estado actualizado correctamente"
      });
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, 'specialRequests', requestId));
      toast({
        title: "Éxito",
        description: "Solicitud eliminada correctamente"
      });
      return true;
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la solicitud",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    requests,
    loading,
    addRequest,
    updateRequestStatus,
    deleteRequest
  };
};
