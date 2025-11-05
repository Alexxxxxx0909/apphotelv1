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

export interface PricingRule {
  id: string;
  hotelId: string;
  nombre: string;
  tipo: 'temporada' | 'descuento' | 'promocion';
  roomTypes: string[]; // IDs de tipos de habitación
  fechaInicio: Date;
  fechaFin: Date;
  ajuste: number; // Porcentaje (positivo o negativo)
  activa: boolean;
  prioridad: number;
  descripcion?: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
}

export const usePricingRules = (hotelId?: string) => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'pricingRules'),
      where('hotelId', '==', hotelId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rulesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaInicio: doc.data().fechaInicio?.toDate() || new Date(),
          fechaFin: doc.data().fechaFin?.toDate() || new Date(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
          fechaActualizacion: doc.data().fechaActualizacion?.toDate()
        })) as PricingRule[];
        
        // Ordenar por prioridad descendente
        rulesData.sort((a, b) => b.prioridad - a.prioridad);
        
        setPricingRules(rulesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading pricing rules:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addPricingRule = async (data: Omit<PricingRule, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    try {
      const docRef = await addDoc(collection(db, 'pricingRules'), {
        ...data,
        fechaInicio: Timestamp.fromDate(data.fechaInicio),
        fechaFin: Timestamp.fromDate(data.fechaFin),
        fechaCreacion: Timestamp.now(),
        fechaActualizacion: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding pricing rule:', err);
      setError(err.message);
      throw err;
    }
  };

  const updatePricingRule = async (id: string, data: Partial<PricingRule>) => {
    try {
      const updateData: any = { ...data };
      if (data.fechaInicio) {
        updateData.fechaInicio = Timestamp.fromDate(data.fechaInicio);
      }
      if (data.fechaFin) {
        updateData.fechaFin = Timestamp.fromDate(data.fechaFin);
      }
      updateData.fechaActualizacion = Timestamp.now();
      
      await updateDoc(doc(db, 'pricingRules', id), updateData);
    } catch (err: any) {
      console.error('Error updating pricing rule:', err);
      setError(err.message);
      throw err;
    }
  };

  const deletePricingRule = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'pricingRules', id));
    } catch (err: any) {
      console.error('Error deleting pricing rule:', err);
      setError(err.message);
      throw err;
    }
  };

  // Calcular precio con reglas aplicadas
  const calculatePrice = (basePrice: number, roomTypeId: string, date: Date = new Date()): number => {
    let finalPrice = basePrice;
    
    // Filtrar reglas activas que aplican a este tipo de habitación y fecha
    const applicableRules = pricingRules.filter(rule => 
      rule.activa &&
      rule.roomTypes.includes(roomTypeId) &&
      date >= rule.fechaInicio &&
      date <= rule.fechaFin
    );

    // Aplicar reglas por prioridad
    applicableRules.forEach(rule => {
      finalPrice = finalPrice + (finalPrice * rule.ajuste / 100);
    });

    return Math.round(finalPrice);
  };

  return {
    pricingRules,
    loading,
    error,
    addPricingRule,
    updatePricingRule,
    deletePricingRule,
    calculatePrice
  };
};
