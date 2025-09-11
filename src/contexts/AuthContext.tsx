import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Obtener datos adicionales del usuario desde Firestore
        try {
          console.log('Usuario autenticado:', firebaseUser.email);
          
          // Buscar usuario por UID en la colección users
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('uid', '==', firebaseUser.uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log('Datos del usuario desde Firestore:', userData);
            console.log('Rol del usuario:', userData.role);
            const newUser = {
              id: firebaseUser.uid,
              name: userData.name,
              email: firebaseUser.email || '',
              role: userData.role
            };
            setUser(newUser);
            console.log('Usuario establecido con rol:', newUser.role);
            console.log('Objeto usuario completo:', newUser);
          } else {
            console.log('Usuario no existe en Firestore, verificando si es admin');
            // Si es el email de admin, asignar rol de administrador
            if (firebaseUser.email === 'admin@hotel.com') {
              setUser({
                id: firebaseUser.uid,
                name: 'Administrador Principal',
                email: firebaseUser.email,
                role: 'administrador'
              });
              console.log('Usuario admin detectado, asignando rol administrador');
            } else {
              // Si no existe en Firestore y no es admin, crear usuario básico
              setUser({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Usuario',
                email: firebaseUser.email || '',
                role: 'colaborador'
              });
              console.log('Usuario básico creado como colaborador');
            }
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error('Error de autenticación:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};