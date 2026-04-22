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
  hotelesAsignadosIds: string[];
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
        let hoteles: string[] = [];
        let hotelIds: string[] = [];
        let managerDocId: string | null = null;
        let managerRaw: any = {};

        // 1) Intentar obtener documento en colección 'managers'
        const managersRef = collection(db, 'managers');
        const qByUid = query(managersRef, where('userId', '==', user.id));
        const qByEmail = query(managersRef, where('email', '==', user.email));
        let querySnapshot = await getDocs(qByUid);
        if (querySnapshot.empty) {
          querySnapshot = await getDocs(qByEmail);
        }

        if (!querySnapshot.empty) {
          const managerDoc = querySnapshot.docs[0];
          managerDocId = managerDoc.id;
          managerRaw = managerDoc.data() as any;
          if (Array.isArray(managerRaw.hotelesAsignados)) {
            hoteles = managerRaw.hotelesAsignados;
          }
        }

        // 2) Si no hay hoteles aún, buscar en colección 'hotels' por managerId == uid del usuario
        if (!hoteles.length) {
          try {
            const hotelsRef = collection(db, 'hotels');
            // Buscar por managerId (uid del auth) — es como UserForm asigna al gerente
            const hotelsByUid = await getDocs(query(hotelsRef, where('managerId', '==', user.id)));
            let hotelDocs = hotelsByUid;

            // Respaldo: por managerId == id del documento del manager
            if (hotelDocs.empty && managerDocId) {
              hotelDocs = await getDocs(query(hotelsRef, where('managerId', '==', managerDocId)));
            }
            // Respaldo: por managerUserId
            if (hotelDocs.empty) {
              hotelDocs = await getDocs(query(hotelsRef, where('managerUserId', '==', user.id)));
            }

            if (!hotelDocs.empty) {
              hotelIds = hotelDocs.docs.map(d => d.id);
              hoteles = hotelDocs.docs.map(d => {
                const data = d.data() as any;
                return data.nombre || data.name || d.id;
              });
            }
          } catch (e) {
            console.error('Error buscando hoteles del gerente:', e);
          }
        }

        // 3) Respaldo final: usar user.hotel del contexto de auth si existe
        if (!hoteles.length && user.hotel) {
          hoteles = [user.hotel];
        }
        if (!hotelIds.length && user.hotel) {
          hotelIds = [user.hotel];
        }

        const managerData = {
          id: managerDocId || user.id,
          nombre: managerRaw.nombre || user.name,
          email: managerRaw.email || user.email,
          telefono: managerRaw.telefono || '',
          companyId: managerRaw.companyId || '',
          hotelesAsignados: hoteles,
          hotelesAsignadosIds: hotelIds,
          fechaCreacion: managerRaw.fechaCreacion?.toDate() || new Date(),
          estado: managerRaw.estado || 'activo',
        } as ManagerData;

        setManager(managerData);
        console.log('[useCurrentManager] Hoteles asignados:', hoteles);
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
    hotelesAsignados: manager?.hotelesAsignados || [],
    hotelesAsignadosIds: manager?.hotelesAsignadosIds || []
  };
};