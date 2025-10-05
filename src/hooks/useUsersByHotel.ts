import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const useUsersByHotel = () => {
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const counts: Record<string, number> = {};
        
        snapshot.docs.forEach(doc => {
          const userData = doc.data();
          const hotelId = userData.hotel;
          
          if (hotelId) {
            counts[hotelId] = (counts[hotelId] || 0) + 1;
          }
        });
        
        setUserCounts(counts);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading user counts:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getUserCountForHotel = (hotelId: string): number => {
    return userCounts[hotelId] || 0;
  };

  return {
    userCounts,
    loading,
    getUserCountForHotel
  };
};
