import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface GroupMember {
  id: string;
  reservationId: string;
  name: string;
  email?: string;
  phone?: string;
  documentType: string;
  documentNumber: string;
  relationship: string;
  age?: number;
  createdAt: Date;
}

export const useGroupMembers = (hotelId?: string) => {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'groupMembers'),
      where('hotelId', '==', hotelId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const membersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as GroupMember[];
        
        setMembers(membersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading group members:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const addMember = async (data: Omit<GroupMember, 'id' | 'createdAt'> & { hotelId: string }) => {
    try {
      const docRef = await addDoc(collection(db, 'groupMembers'), {
        ...data,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding group member:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'groupMembers', id));
    } catch (err: any) {
      console.error('Error deleting group member:', err);
      setError(err.message);
      throw err;
    }
  };

  const getMembersByReservation = (reservationId: string) => {
    return members.filter(m => m.reservationId === reservationId);
  };

  return {
    members,
    loading,
    error,
    addMember,
    deleteMember,
    getMembersByReservation
  };
};
