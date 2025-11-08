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

export interface InventoryCategory {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: 'alimentos' | 'bebidas' | 'suministros';
  hotelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useInventoryCategories = (hotelId?: string) => {
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const categoriesRef = collection(db, 'categorias_inventario');
    const q = query(categoriesRef, where('hotelId', '==', hotelId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as InventoryCategory[];
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

  const addCategory = async (data: Omit<InventoryCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'categorias_inventario'), {
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

  const updateCategory = async (id: string, data: Partial<InventoryCategory>) => {
    try {
      await updateDoc(doc(db, 'categorias_inventario', id), {
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
      await deleteDoc(doc(db, 'categorias_inventario', id));
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
