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

export interface MealPlan {
  id: string;
  hotelId: string;
  nombre: string;
  descripcion?: string;
  precioAdicional: number; // Precio adicional sobre la tarifa base de la habitación
  activo: boolean;
  fechaCreacion: Date;
}

export const useMealPlans = (hotelId?: string) => {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'mealPlans'),
      where('hotelId', '==', hotelId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const plansData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date()
        })) as MealPlan[];
        
        // Ordenar por nombre
        plansData.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        setPlans(plansData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading meal plans:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addMealPlan = async (data: Omit<MealPlan, 'id' | 'fechaCreacion'>) => {
    try {
      const docRef = await addDoc(collection(db, 'mealPlans'), {
        ...data,
        fechaCreacion: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding meal plan:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateMealPlan = async (id: string, data: Partial<MealPlan>) => {
    try {
      await updateDoc(doc(db, 'mealPlans', id), data);
    } catch (err: any) {
      console.error('Error updating meal plan:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'mealPlans', id));
    } catch (err: any) {
      console.error('Error deleting meal plan:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    plans,
    loading,
    error,
    addMealPlan,
    updateMealPlan,
    deleteMealPlan
  };
};
