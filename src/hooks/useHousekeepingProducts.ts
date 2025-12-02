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

export interface HousekeepingProduct {
  id: string;
  nombre: string;
  categoriaId: string;
  tipo: 'linen' | 'amenities' | 'cleaning' | 'maintenance';
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  costoUnitario: number;
  proveedor: string;
  ubicacion: string;
  fechaVencimiento?: Date;
  ultimoRestock?: Date;
  autoReorder: boolean;
  usoDiario: number;
  hotelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useHousekeepingProducts = (hotelId?: string) => {
  const [products, setProducts] = useState<HousekeepingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const productsRef = collection(db, 'productos_housekeeping');
    const q = query(productsRef, where('hotelId', '==', hotelId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaVencimiento: doc.data().fechaVencimiento?.toDate(),
          ultimoRestock: doc.data().ultimoRestock?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as HousekeepingProduct[];
        setProducts(productsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addProduct = async (data: Omit<HousekeepingProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'productos_housekeeping'), {
        ...data,
        fechaVencimiento: data.fechaVencimiento ? Timestamp.fromDate(data.fechaVencimiento) : null,
        ultimoRestock: data.ultimoRestock ? Timestamp.fromDate(data.ultimoRestock) : Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id: string, data: Partial<HousekeepingProduct>) => {
    try {
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      };
      
      if (data.fechaVencimiento) {
        updateData.fechaVencimiento = Timestamp.fromDate(data.fechaVencimiento);
      }
      if (data.ultimoRestock) {
        updateData.ultimoRestock = Timestamp.fromDate(data.ultimoRestock);
      }
      
      await updateDoc(doc(db, 'productos_housekeeping', id), updateData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'productos_housekeeping', id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
