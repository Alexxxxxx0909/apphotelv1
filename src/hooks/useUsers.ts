import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  identificacion?: string;
  direccion?: string;
  role: string;
  hotel?: string;
  active: boolean;
  permissions?: string[];
  twoFactorEnabled?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate(),
          lastLogin: doc.data().lastLogin?.toDate()
        })) as User[];
        setUsers(usersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading users:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getUserById = (userId: string): User | undefined => {
    return users.find(u => u.id === userId);
  };

  return { users, loading, error, getUserById };
};
