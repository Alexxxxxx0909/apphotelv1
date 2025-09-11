import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertCircle, CheckCircle, Users, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initializeDatabase } from '@/scripts/initializeDatabase';
import { createDefaultUsers } from '@/scripts/createFirebaseUsers';
import { syncAllUsers, quickFixAllUsers } from '@/scripts/syncUsers';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

const DatabaseInitializer: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [usersCreated, setUsersCreated] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const { toast } = useToast();

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      // Crear usuarios en Firebase Auth
      await createDefaultUsers();
      setUsersCreated(true);
      
      // Inicializar estructura de base de datos
      await initializeDatabase();
      setIsInitialized(true);
      
      toast({
        title: "Sistema inicializado",
        description: "Usuarios y base de datos creados correctamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al inicializar el sistema.",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleFixUsers = async () => {
    setIsFixing(true);
    try {
      const results = await quickFixAllUsers();
      const successCount = results.filter(r => r.success).length;
      
      toast({
        title: "Usuarios corregidos",
        description: `${successCount} usuarios sincronizados correctamente en Firestore.`,
      });
      
      // Recargar la página después de un momento para que el AuthContext detecte los cambios
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al sincronizar usuarios.",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleRecreateUsers = async () => {
    setIsFixing(true);
    try {
      const results = await syncAllUsers();
      const successCount = results.filter(r => r.success).length;
      
      toast({
        title: "Usuarios recreados",
        description: `${successCount} usuarios recreados exitosamente.`,
      });
      
      // Recargar la página después de un momento
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al recrear usuarios.",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Database className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Inicializar Base de Datos</CardTitle>
        <CardDescription>
          Configure usuarios y estructura inicial de Firebase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
            <p>
              Opciones para configurar usuarios y estructura de la base de datos.
            </p>
          </div>
          
          {/* Botón para arreglar usuarios existentes */}
          <Button 
            onClick={handleFixUsers} 
            disabled={isFixing || isInitializing}
            className="w-full"
            variant="default"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isFixing ? "Corrigiendo usuarios..." : "Corregir Usuarios en Firestore"}
          </Button>
          
          {/* Botón para recrear todos los usuarios */}
          <Button 
            onClick={handleRecreateUsers} 
            disabled={isFixing || isInitializing}
            className="w-full"
            variant="outline"
          >
            <Users className="w-4 h-4 mr-2" />
            {isFixing ? "Recreando usuarios..." : "Recrear Todos los Usuarios"}
          </Button>
          
          {/* Botón para inicializar sistema completo */}
          <Button 
            onClick={handleInitialize} 
            disabled={isInitializing || isFixing}
            className="w-full"
            variant="secondary"
          >
            <Database className="w-4 h-4 mr-2" />
            {isInitializing ? "Inicializando..." : "Inicializar Sistema Completo"}
          </Button>
        </div>
        
        {isInitialized && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <p>Sistema inicializado correctamente</p>
            </div>
            {usersCreated && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Users className="w-4 h-4" />
                <p>Usuarios de Firebase Authentication creados</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>Los usuarios se crearán automáticamente en Firebase cuando inicialices el sistema.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseInitializer;