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

export interface Supplier {
  id: string;
  nombre: string;
  nit: string;
  categoria: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  estado: 'activo' | 'inactivo';
  calificacion?: number;
  hotelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useSuppliers = (hotelId?: string) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const suppliersRef = collection(db, 'proveedores');
    const q = query(suppliersRef, where('hotelId', '==', hotelId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const suppliersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Supplier[];
        setSuppliers(suppliersData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addSupplier = async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'proveedores'), {
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

  const updateSupplier = async (id: string, data: Partial<Supplier>) => {
    try {
      await updateDoc(doc(db, 'proveedores', id), {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'proveedores', id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };
};
