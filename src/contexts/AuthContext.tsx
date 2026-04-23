import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, updateDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hotel?: string;
  permissions?: string[];
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
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      // Limpiar listener anterior si cambia el usuario
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (firebaseUser) {
        try {
          console.log('Usuario autenticado:', firebaseUser.email);

          const userDocRef = doc(db, 'users', firebaseUser.uid);

          // Suscribirse en tiempo real al documento del usuario para
          // que los cambios de permisos del gerente se reflejen al instante.
          unsubscribeUserDoc = onSnapshot(
            userDocRef,
            async (userDocSnap) => {
              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                console.log('Datos del usuario desde Firestore:', userData);

                // Si el colaborador fue desactivado/bloqueado, cerrar la sesión inmediatamente.
                if (userData.active === false) {
                  console.warn('Cuenta inactiva detectada, cerrando sesión.');
                  try { await signOut(auth); } catch {}
                  setUser(null);
                  setLoading(false);
                  return;
                }

                // Resolver nombre del rol
                let roleName = userData.role;
                try {
                  const roleDocRef = doc(db, 'roles', userData.role);
                  const roleDocSnap = await getDoc(roleDocRef);
                  if (roleDocSnap.exists()) {
                    roleName = roleDocSnap.id;
                  }
                } catch {}

                const newUser = {
                  id: firebaseUser.uid,
                  name: userData.name,
                  email: firebaseUser.email || '',
                  role: roleName,
                  hotel: userData.hotel,
                  permissions: Array.isArray(userData.permissions) ? userData.permissions : []
                };
                setUser(newUser);
                console.log('Usuario establecido con rol:', newUser.role, 'permisos:', newUser.permissions);
              } else {
                if (firebaseUser.email === 'admin@hotel.com') {
                  setUser({
                    id: firebaseUser.uid,
                    name: 'Administrador Principal',
                    email: firebaseUser.email,
                    role: 'administrador'
                  });
                } else {
                  setUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Usuario',
                    email: firebaseUser.email || '',
                    role: 'colaborador',
                    permissions: []
                  });
                }
              }
              setLoading(false);
            },
            (error) => {
              console.error('Error en snapshot del usuario:', error);
              setLoading(false);
            }
          );
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      unsubscribe();
    };
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