import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface ManagerData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  companyId: string;
  hotelesAsignados: string[];
  fechaCreacion: Date;
  ultimoAcceso?: Date;
  estado: 'activo' | 'inactivo';
}

export const useCurrentManager = () => {
  const [manager, setManager] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchManagerData = async () => {
      if (!user || user.role !== 'gerente') {
        setLoading(false);
        return;
      }

      try {
        const managersRef = collection(db, 'managers');
        const q = query(managersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const managerDoc = querySnapshot.docs[0];
          const managerData = {
            id: managerDoc.id,
            ...managerDoc.data(),
            fechaCreacion: managerDoc.data().fechaCreacion?.toDate() || new Date(),
            // Si no tiene hoteles asignados, asignar los hoteles por defecto
            hotelesAsignados: managerDoc.data().hotelesAsignados || ['Hotel Principal', 'Hotel Sucursal']
          } as ManagerData;
          
          setManager(managerData);
        }
      } catch (error) {
        console.error('Error fetching manager data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [user]);

  return {
    manager,
    loading,
    hotelesAsignados: manager?.hotelesAsignados || []
  };
};