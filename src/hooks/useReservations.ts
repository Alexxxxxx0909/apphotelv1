import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Reservation {
  id: string;
  hotelId: string;
  reservationNumber: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  roomType: string;
  roomTypeId: string;
  roomNumber: string;
  roomId: string;
  pricePerNight: number;
  totalPrice: number;
  plan: string;
  planId: string;
  paymentMethod: string;
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  specialRequests?: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
}

export const useReservations = (hotelId?: string) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'reservations'),
      where('hotelId', '==', hotelId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reservationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          checkIn: doc.data().checkIn?.toDate() || new Date(),
          checkOut: doc.data().checkOut?.toDate() || new Date(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
          fechaActualizacion: doc.data().fechaActualizacion?.toDate()
        })) as Reservation[];
        
        // Ordenar por fecha de creación descendente
        reservationsData.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        
        setReservations(reservationsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading reservations:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addReservation = async (data: Omit<Reservation, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    try {
      const docRef = await addDoc(collection(db, 'reservations'), {
        ...data,
        checkIn: Timestamp.fromDate(data.checkIn),
        checkOut: Timestamp.fromDate(data.checkOut),
        fechaCreacion: Timestamp.now(),
        fechaActualizacion: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding reservation:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateReservation = async (id: string, data: Partial<Reservation>) => {
    try {
      const updateData: any = { ...data };
      if (data.checkIn) {
        updateData.checkIn = Timestamp.fromDate(data.checkIn);
      }
      if (data.checkOut) {
        updateData.checkOut = Timestamp.fromDate(data.checkOut);
      }
      updateData.fechaActualizacion = Timestamp.now();
      
      await updateDoc(doc(db, 'reservations', id), updateData);
    } catch (err: any) {
      console.error('Error updating reservation:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reservations', id));
    } catch (err: any) {
      console.error('Error deleting reservation:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    reservations,
    loading,
    error,
    addReservation,
    updateReservation,
    deleteReservation
  };
};
