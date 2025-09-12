import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';

export interface Company {
  id: string;
  nombreComercial: string;
  razonSocial: string;
  nit: string;
  direccion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  emailCorporativo: string;
  monedaOperacion: string;
  configuracionImpuestos: {
    iva: number;
    retenciones: number;
    otros: string;
  };
  logoUrl?: string;
  estado: 'activo' | 'inactivo' | 'bloqueado';
  plan: {
    tipo: 'basico' | 'estandar' | 'premium';
    fechaInicio: Date;
    fechaVencimiento: Date;
    modulosActivos: string[];
  };
  gerenteGeneralId?: string;
  fechaCreacion: Date;
  ultimoAcceso?: Date;
  estadisticas: {
    usuarios: number;
    modulosEnUso: string[];
    actividadReciente: any[];
  };
}

export interface Manager {
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

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeCompanies = onSnapshot(
      query(collection(db, 'companies'), orderBy('fechaCreacion', 'desc')),
      (snapshot) => {
        const companiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
          plan: {
            ...doc.data().plan,
            fechaInicio: doc.data().plan?.fechaInicio?.toDate() || new Date(),
            fechaVencimiento: doc.data().plan?.fechaVencimiento?.toDate() || new Date()
          }
        })) as Company[];
        setCompanies(companiesData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    const unsubscribeManagers = onSnapshot(
      collection(db, 'managers'),
      (snapshot) => {
        const managersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date()
        })) as Manager[];
        setManagers(managersData);
      },
      (err) => {
        console.error('Error loading managers:', err);
      }
    );

    return () => {
      unsubscribeCompanies();
      unsubscribeManagers();
    };
  }, []);

  const createCompany = async (companyData: Omit<Company, 'id' | 'fechaCreacion' | 'estadisticas'>) => {
    try {
      const docRef = await addDoc(collection(db, 'companies'), {
        ...companyData,
        fechaCreacion: Timestamp.now(),
        estadisticas: {
          usuarios: 0,
          modulosEnUso: [],
          actividadReciente: []
        }
      });

      toast({
        title: "Empresa creada",
        description: `${companyData.nombreComercial} ha sido registrada exitosamente.`,
      });

      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo crear la empresa. Intenta de nuevo.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateCompany = async (id: string, data: Partial<Company>) => {
    try {
      await updateDoc(doc(db, 'companies', id), {
        ...data,
        fechaActualizacion: Timestamp.now()
      });

      toast({
        title: "Empresa actualizada",
        description: "Los datos han sido actualizados correctamente.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo actualizar la empresa.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await updateDoc(doc(db, 'companies', id), {
        estado: 'inactivo',
        fechaEliminacion: Timestamp.now()
      });

      toast({
        title: "Empresa desactivada",
        description: "La empresa ha sido marcada como inactiva.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo desactivar la empresa.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const createManager = async (managerData: Omit<Manager, 'id' | 'fechaCreacion'>, password: string) => {
    try {
      // Guardar la sesión actual del admin
      const currentUser = auth.currentUser;
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, managerData.email, password);
      const userId = userCredential.user.uid;

      // Crear documento en Firestore para users con el userId como ID del documento
      await addDoc(collection(db, 'users'), {
        uid: userId,
        name: managerData.nombre,
        email: managerData.email,
        role: 'gerente',
        companyId: managerData.companyId,
        telefono: managerData.telefono,
        createdAt: Timestamp.now()
      });

      // Crear documento específico para managers
      const managerRef = await addDoc(collection(db, 'managers'), {
        ...managerData,
        userId: userId,
        fechaCreacion: Timestamp.now(),
        estado: 'activo'
      });

      // Actualizar la empresa con el gerente asignado
      await updateDoc(doc(db, 'companies', managerData.companyId), {
        gerenteGeneralId: managerRef.id
      });

      // Cerrar sesión del nuevo usuario y restaurar la sesión del admin
      await auth.signOut();
      
      // Si había un usuario admin anteriormente, intentar mantenerlo logueado
      // Nota: En Firebase Web SDK no es posible mantener múltiples usuarios autenticados
      // El admin tendrá que volver a autenticarse si es necesario

      // Enviar email de bienvenida (simulado)
      await sendWelcomeEmail(managerData.email, managerData.nombre, password);

      toast({
        title: "Gerente creado",
        description: `${managerData.nombre} ha sido creado y notificado por email. Es posible que necesites volver a iniciar sesión.`,
      });

      return managerRef.id;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo crear el gerente. Verifica que el email no esté en uso.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const sendWelcomeEmail = async (email: string, nombre: string, password: string) => {
    // Simulación del envío de email
    // En una implementación real, aquí integrarías con un servicio como SendGrid, Mailgun, etc.
    console.log(`
      ===== EMAIL DE BIENVENIDA =====
      Para: ${email}
      Asunto: Bienvenido al Sistema Hotelero - Credenciales de Acceso

      Estimado/a ${nombre},

      ¡Bienvenido/a al Sistema de Gestión Hotelera!

      Su cuenta de Gerente General ha sido creada exitosamente. A continuación encontrará sus credenciales de acceso:

      📧 Usuario: ${email}
      🔑 Contraseña temporal: ${password}

      Por favor, cambie su contraseña en el primer inicio de sesión por seguridad.

      Acceda al sistema en: [URL del sistema]

      Saludos cordiales,
      Equipo de Administración
      Sistema de Gestión Hotelera
      ================================
    `);

    toast({
      title: "Email enviado",
      description: `Credenciales enviadas a ${email}`,
    });
  };

  const getCompanyStatistics = () => {
    return {
      totalEmpresas: companies.length,
      empresasActivas: companies.filter(c => c.estado === 'activo').length,
      empresasInactivas: companies.filter(c => c.estado === 'inactivo').length,
      empresasBloqueadas: companies.filter(c => c.estado === 'bloqueado').length,
      totalUsuarios: companies.reduce((sum, c) => sum + c.estadisticas.usuarios, 0),
      planDistribution: {
        basico: companies.filter(c => c.plan.tipo === 'basico').length,
        estandar: companies.filter(c => c.plan.tipo === 'estandar').length,
        premium: companies.filter(c => c.plan.tipo === 'premium').length
      }
    };
  };

  return {
    companies,
    managers,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    createManager,
    sendWelcomeEmail,
    getCompanyStatistics
  };
};