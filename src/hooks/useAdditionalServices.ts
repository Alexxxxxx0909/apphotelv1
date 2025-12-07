import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface AdditionalService {
  id: string;
  hotelId: string;
  guestName: string;
  roomNumber: string;
  serviceType: string;
  serviceName: string;
  description: string;
  price: number;
  status: 'solicitado' | 'confirmado' | 'en-proceso' | 'completado' | 'cancelado';
  requestedDate: Timestamp;
  serviceDate: string;
  notes?: string;
  provider?: string;
  createdBy: string;
}

export interface NewAdditionalService {
  guestName: string;
  roomNumber: string;
  serviceType: string;
  serviceName: string;
  description: string;
  price: number;
  serviceDate: string;
  notes?: string;
  provider?: string;
}

export const useAdditionalServices = () => {
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.hotel) {
      setServices([]);
      setLoading(false);
      return;
    }

    const servicesRef = collection(db, 'additionalServices');
    const q = query(servicesRef, where('hotelId', '==', user.hotel));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdditionalService[];
      
      // Sort in memory to avoid composite index requirement
      servicesData.sort((a, b) => {
        const dateA = a.requestedDate?.toMillis?.() || 0;
        const dateB = b.requestedDate?.toMillis?.() || 0;
        return dateB - dateA;
      });
      
      setServices(servicesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching additional services:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.hotel]);

  const addService = async (newService: NewAdditionalService): Promise<boolean> => {
    if (!user?.hotel) return false;

    try {
      await addDoc(collection(db, 'additionalServices'), {
        ...newService,
        hotelId: user.hotel,
        status: 'solicitado',
        requestedDate: Timestamp.now(),
        createdBy: user.email || ''
      });
      return true;
    } catch (error) {
      console.error('Error adding additional service:', error);
      return false;
    }
  };

  const updateServiceStatus = async (serviceId: string, status: AdditionalService['status']): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'additionalServices', serviceId), { status });
      return true;
    } catch (error) {
      console.error('Error updating service status:', error);
      return false;
    }
  };

  const updateService = async (serviceId: string, data: Partial<AdditionalService>): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'additionalServices', serviceId), data);
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      return false;
    }
  };

  const deleteService = async (serviceId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'additionalServices', serviceId));
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  };

  return {
    services,
    loading,
    addService,
    updateServiceStatus,
    updateService,
    deleteService
  };
};
