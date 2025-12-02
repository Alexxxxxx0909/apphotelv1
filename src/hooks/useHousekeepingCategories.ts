import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface HousekeepingCategory {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: 'linen' | 'amenities' | 'cleaning' | 'maintenance';
  hotelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useHousekeepingCategories = (hotelId?: string) => {
  const [categories, setCategories] = useState<HousekeepingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const categoriesRef = collection(db, 'categorias_housekeeping');
    const q = query(categoriesRef, where('hotelId', '==', hotelId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as HousekeepingCategory[];
        setCategories(categoriesData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addCategory = async (data: Omit<HousekeepingCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'categorias_housekeeping'), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCategory = async (id: string, data: Partial<HousekeepingCategory>) => {
    try {
      await updateDoc(doc(db, 'categorias_housekeeping', id), {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categorias_housekeeping', id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
