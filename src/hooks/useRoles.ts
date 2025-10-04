import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Role {
  id: string;
  nombre: string;
  permisos: string[];
  estado: 'activo' | 'inactivo';
  fechaCreacion: Date;
}

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'roles'), orderBy('nombre', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rolesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date()
        })) as Role[];
        setRoles(rolesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading roles:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { roles, loading, error };
};
