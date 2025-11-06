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

export interface Consumption {
  id: string;
  reservationId: string;
  hotelId: string;
  service: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: Date;
  category: 'restaurant' | 'minibar' | 'spa' | 'laundry' | 'parking' | 'phone' | 'other';
  fechaCreacion: Date;
}

export const useConsumptions = (reservationId?: string) => {
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservationId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'consumptions'),
      where('reservationId', '==', reservationId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const consumptionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date()
        })) as Consumption[];
        
        setConsumptions(consumptionsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading consumptions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [reservationId]);

  const addConsumption = async (data: Omit<Consumption, 'id' | 'fechaCreacion'>) => {
    try {
      const docRef = await addDoc(collection(db, 'consumptions'), {
        ...data,
        date: Timestamp.fromDate(data.date),
        fechaCreacion: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding consumption:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateConsumption = async (id: string, data: Partial<Consumption>) => {
    try {
      const updateData: any = { ...data };
      if (data.date) {
        updateData.date = Timestamp.fromDate(data.date);
      }
      
      await updateDoc(doc(db, 'consumptions', id), updateData);
    } catch (err: any) {
      console.error('Error updating consumption:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteConsumption = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'consumptions', id));
    } catch (err: any) {
      console.error('Error deleting consumption:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    consumptions,
    loading,
    error,
    addConsumption,
    updateConsumption,
    deleteConsumption
  };
};
