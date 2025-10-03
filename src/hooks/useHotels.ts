import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Hotel {
  id: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  telefono?: string;
  email?: string;
  companyId?: string;
  managerId?: string;
  estado: 'activo' | 'inactivo';
  fechaCreacion: Date;
}

export const useHotels = (companyId?: string) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = query(collection(db, 'hotels'), orderBy('nombre', 'asc'));
    
    // Si se proporciona companyId, filtrar por empresa
    if (companyId) {
      q = query(
        collection(db, 'hotels'), 
        where('companyId', '==', companyId),
        orderBy('nombre', 'asc')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const hotelsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date()
        })) as Hotel[];
        setHotels(hotelsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading hotels:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [companyId]);

  return { hotels, loading, error };
};
