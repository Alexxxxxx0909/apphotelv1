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
        // Buscar por userId (más confiable) y como respaldo por email
        const qByUid = query(managersRef, where('userId', '==', user.id));
        const qByEmail = query(managersRef, where('email', '==', user.email));
        let querySnapshot = await getDocs(qByUid);
        if (querySnapshot.empty) {
          querySnapshot = await getDocs(qByEmail);
        }

        if (!querySnapshot.empty) {
          const managerDoc = querySnapshot.docs[0];
          const raw = managerDoc.data() as any;

          // Hoteles desde el propio documento del gerente
          let hoteles: string[] = Array.isArray(raw.hotelesAsignados) ? raw.hotelesAsignados : [];

          // Si no hay hoteles en el doc del gerente, intentar desde colección 'hotels'
          if (!hoteles.length) {
            try {
              const hotelsRef = collection(db, 'hotels');
              // Intentar por managerId (id del doc) y como respaldo por userId del auth
              const hotelsByManagerId = await getDocs(query(hotelsRef, where('managerId', '==', managerDoc.id)));
              const hotelsByUserId = hoteles.length ? null : await getDocs(query(hotelsRef, where('managerUserId', '==', user.id)));
              const hotelDocs = !hotelsByManagerId.empty ? hotelsByManagerId : hotelsByUserId;
              if (hotelDocs && !hotelDocs.empty) {
                hoteles = hotelDocs.docs.map(d => (d.data() as any).nombre || (d.data() as any).name || d.id);
              }
            } catch (e) {
              // Si no existe la colección 'hotels' o falla la consulta, simplemente continuar
            }
          }

          const managerData = {
            id: managerDoc.id,
            ...raw,
            fechaCreacion: raw.fechaCreacion?.toDate() || new Date(),
            hotelesAsignados: hoteles,
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