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

export interface Room {
  id: string;
  hotelId: string;
  numero: string;
  tipo: string;
  tipoId?: string;
  estado: 'disponible' | 'ocupada' | 'limpieza' | 'mantenimiento' | 'fuera_servicio';
  piso: number;
  capacidad: number;
  precio: number;
  caracteristicas: string[];
  ultimaLimpieza?: Date;
  proximoMantenimiento?: Date;
  fechaCreacion: Date;
}

export const useRooms = (hotelId?: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'rooms'),
      where('hotelId', '==', hotelId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const roomsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
          ultimaLimpieza: doc.data().ultimaLimpieza?.toDate(),
          proximoMantenimiento: doc.data().proximoMantenimiento?.toDate()
        })) as Room[];
        
        // Ordenar por número de habitación
        roomsData.sort((a, b) => {
          const numA = parseInt(a.numero) || 0;
          const numB = parseInt(b.numero) || 0;
          return numA - numB;
        });
        
        setRooms(roomsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading rooms:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addRoom = async (data: Omit<Room, 'id' | 'fechaCreacion'>) => {
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        ...data,
        ultimaLimpieza: data.ultimaLimpieza ? Timestamp.fromDate(data.ultimaLimpieza) : null,
        proximoMantenimiento: data.proximoMantenimiento ? Timestamp.fromDate(data.proximoMantenimiento) : null,
        fechaCreacion: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding room:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateRoom = async (id: string, data: Partial<Room>) => {
    try {
      const updateData: any = { ...data };
      if (data.ultimaLimpieza) {
        updateData.ultimaLimpieza = Timestamp.fromDate(data.ultimaLimpieza);
      }
      if (data.proximoMantenimiento) {
        updateData.proximoMantenimiento = Timestamp.fromDate(data.proximoMantenimiento);
      }
      await updateDoc(doc(db, 'rooms', id), updateData);
    } catch (err: any) {
      console.error('Error updating room:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'rooms', id));
    } catch (err: any) {
      console.error('Error deleting room:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    rooms,
    loading,
    error,
    addRoom,
    updateRoom,
    deleteRoom
  };
};
