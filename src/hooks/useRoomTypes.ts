import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface RoomType {
  id: string;
  hotelId: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  precioBase: number;
  caracteristicas: string[];
  cantidad: number;
  fechaCreacion: Date;
}

export const useRoomTypes = (hotelId?: string) => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'roomTypes'),
      where('hotelId', '==', hotelId),
      orderBy('nombre', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const types = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date()
        })) as RoomType[];
        setRoomTypes(types);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading room types:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addRoomType = async (data: Omit<RoomType, 'id' | 'fechaCreacion'>) => {
    try {
      const docRef = await addDoc(collection(db, 'roomTypes'), {
        ...data,
        fechaCreacion: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding room type:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateRoomType = async (id: string, data: Partial<RoomType>) => {
    try {
      await updateDoc(doc(db, 'roomTypes', id), data);
    } catch (err: any) {
      console.error('Error updating room type:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteRoomType = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'roomTypes', id));
    } catch (err: any) {
      console.error('Error deleting room type:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    roomTypes,
    loading,
    error,
    addRoomType,
    updateRoomType,
    deleteRoomType
  };
};
