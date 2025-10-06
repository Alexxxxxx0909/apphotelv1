import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Plan {
  id: string;
  nombre: string;
  tipo: 'basico' | 'estandar' | 'premium';
  precio: number;
  periodicidad: 'mensual' | 'anual';
  limites: {
    usuarios: number;
    hoteles: number;
    transacciones: number;
    modulosHabilitados: string[];
  };
  descripcion?: string;
  caracteristicas?: string[];
  fechaCreacion: Date;
  estado: 'activo' | 'inactivo';
}

export const MODULOS_DISPONIBLES = [
  { id: 'reservas', nombre: 'Reservaciones' },
  { id: 'recepcion', nombre: 'Recepción' },
  { id: 'facturacion', nombre: 'Facturación' },
  { id: 'housekeeping', nombre: 'Housekeeping' },
  { id: 'mantenimiento', nombre: 'Mantenimiento' },
  { id: 'food_beverage', nombre: 'Alimentos y Bebidas' },
  { id: 'atencion_cliente', nombre: 'Servicio al Cliente' },
  { id: 'proveedores', nombre: 'Proveedores' },
  { id: 'gestion_hotelera', nombre: 'Gestión Hotelera' },
  { id: 'colaboradores', nombre: 'Colaboradores' },
  { id: 'reportes', nombre: 'Reportes' }
];

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'plans'),
      (snapshot) => {
        const planesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fechaCreacion: data.fechaCreacion?.toDate() || new Date()
          } as Plan;
        });
        setPlans(planesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error al obtener planes:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createPlan = async (planData: Omit<Plan, 'id' | 'fechaCreacion'>) => {
    try {
      const docRef = await addDoc(collection(db, 'plans'), {
        ...planData,
        fechaCreacion: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error al crear plan:', err);
      setError(err.message);
      throw err;
    }
  };

  const updatePlan = async (id: string, planData: Partial<Plan>) => {
    try {
      const planRef = doc(db, 'plans', id);
      await updateDoc(planRef, planData);
    } catch (err: any) {
      console.error('Error al actualizar plan:', err);
      setError(err.message);
      throw err;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'plans', id));
    } catch (err: any) {
      console.error('Error al eliminar plan:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    plans,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan
  };
};
