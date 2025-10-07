import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface HotelPlan {
  modulosActivos: string[];
  tipo: string;
  fechaVencimiento: Date;
}

export const useHotelModules = () => {
  const { user } = useAuth();
  const [allowedModules, setAllowedModules] = useState<string[]>([]);
  const [planInfo, setPlanInfo] = useState<HotelPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.hotel) {
      setLoading(false);
      return;
    }

    // Buscar la empresa que tiene este hotelId
    const q = query(
      collection(db, 'companies'),
      where('hotelId', '==', user.hotel)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const companyDoc = snapshot.docs[0];
          const companyData = companyDoc.data();
          
          if (companyData.plan) {
            const modules = companyData.plan.modulosActivos || [];
            setAllowedModules(modules);
            setPlanInfo({
              modulosActivos: modules,
              tipo: companyData.plan.tipo,
              fechaVencimiento: companyData.plan.fechaVencimiento?.toDate() || new Date()
            });
          }
        } else {
          // Si no hay empresa, permitir todos los módulos (fallback)
          console.warn('No se encontró empresa para el hotel:', user.hotel);
          setAllowedModules([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error al obtener módulos del hotel:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.hotel]);

  const isModuleAllowed = (moduleId: string): boolean => {
    // Si no hay módulos configurados, permitir acceso (admin o sin restricción)
    if (allowedModules.length === 0 && user?.role === 'administrador') {
      return true;
    }
    return allowedModules.includes(moduleId);
  };

  return {
    allowedModules,
    planInfo,
    loading,
    isModuleAllowed
  };
};
