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

export interface InventoryProduct {
  id: string;
  nombre: string;
  categoriaId: string;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  costoUnitario: number;
  proveedorId: string;
  ubicacion: string;
  fechaVencimiento?: Date;
  estado: 'disponible' | 'agotado' | 'bajo_stock' | 'vencido';
  hotelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useInventoryProducts = (hotelId?: string) => {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const productsRef = collection(db, 'productos_inventario');
    const q = query(productsRef, where('hotelId', '==', hotelId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaVencimiento: doc.data().fechaVencimiento?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as InventoryProduct[];
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

  const addProduct = async (data: Omit<InventoryProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'productos_inventario'), {
        ...data,
        fechaVencimiento: data.fechaVencimiento ? Timestamp.fromDate(data.fechaVencimiento) : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id: string, data: Partial<InventoryProduct>) => {
    try {
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      };
      
      if (data.fechaVencimiento) {
        updateData.fechaVencimiento = Timestamp.fromDate(data.fechaVencimiento);
      }
      
      await updateDoc(doc(db, 'productos_inventario', id), updateData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'productos_inventario', id));
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
