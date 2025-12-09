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

export interface MenuItemIngredient {
  productoId: string;
  nombre: string;
  cantidad: number;
  unidadMedida: string;
  costoUnitario: number;
}

export interface MenuItem {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number;
  categoria: string;
  tipo: 'plato' | 'bebida';
  activo: boolean;
  especial: boolean;
  tiempoPreparacion: number;
  ingredientes: MenuItemIngredient[];
  hotelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useMenuItems = (hotelId?: string) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const menuRef = collection(db, 'menu_items');
    const q = query(menuRef, where('hotelId', '==', hotelId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const itemsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as MenuItem[];
        setMenuItems(itemsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addMenuItem = async (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'menu_items'), {
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

  const updateMenuItem = async (id: string, data: Partial<MenuItem>) => {
    try {
      await updateDoc(doc(db, 'menu_items', id), {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menu_items', id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  };
};
