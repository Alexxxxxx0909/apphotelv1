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

export interface RoomFeature {
  id: string;
  hotelId: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion: Date;
}

export const useRoomFeatures = (hotelId?: string) => {
  const [features, setFeatures] = useState<RoomFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'roomFeatures'),
      where('hotelId', '==', hotelId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const featuresData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date()
        })) as RoomFeature[];
        
        // Ordenar por nombre en el cliente
        featuresData.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        setFeatures(featuresData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading room features:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addFeature = async (data: Omit<RoomFeature, 'id' | 'fechaCreacion'>) => {
    try {
      const docRef = await addDoc(collection(db, 'roomFeatures'), {
        ...data,
        fechaCreacion: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding feature:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateFeature = async (id: string, data: Partial<RoomFeature>) => {
    try {
      await updateDoc(doc(db, 'roomFeatures', id), data);
    } catch (err: any) {
      console.error('Error updating feature:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteFeature = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'roomFeatures', id));
    } catch (err: any) {
      console.error('Error deleting feature:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    features,
    loading,
    error,
    addFeature,
    updateFeature,
    deleteFeature
  };
};
