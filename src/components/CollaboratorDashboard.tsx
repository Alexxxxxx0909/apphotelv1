import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar,
  Bed,
  Phone,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  User,
  Briefcase
} from 'lucide-react';

const CollaboratorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTask, setActiveTask] = useState('pending');

  const taskSummary = {
    pending: 8,
    inProgress: 3,
    completed: 15
  };

  const recentTasks = [
    { id: 1, type: 'check-in', description: 'Check-in Habitación 205', time: '10:30 AM', status: 'pending' },
    { id: 2, type: 'cleaning', description: 'Limpieza Habitación 301', time: '11:00 AM', status: 'in-progress' },
    { id: 3, type: 'maintenance', description: 'Revisar aire acondicionado 102', time: '2:00 PM', status: 'pending' },
    { id: 4, type: 'service', description: 'Solicitud toallas extra 204', time: '3:15 PM', status: 'completed' }
  ];

  const quickActions = [
    { 
      id: 'checkin', 
      name: 'Check-in Rápido', 
      icon: Users, 
      description: 'Registro de huéspedes'
    },
    { 
      id: 'checkout', 
      name: 'Check-out', 
      icon: Calendar, 
      description: 'Salida de huéspedes'
    },
    { 
      id: 'room-status', 
      name: 'Estado Habitaciones', 
      icon: Bed, 
      description: 'Actualizar estado'
    },
    { 
      id: 'guest-service', 
      name: 'Atención Huésped', 
      icon: Phone, 
      description: 'Solicitudes de servicio'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'in-progress': return Clock;
      case 'completed': return CheckCircle;
      default: return ClipboardList;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border h-16 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-semibold text-foreground">
                Panel de Colaborador
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-blue-600 font-medium">Colaborador</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Bienvenido, {user?.name}
              </h2>
              <p className="text-muted-foreground">
                Tus tareas y actividades del día
              </p>
            </div>

            {/* Task Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{taskSummary.pending}</div>
                  <p className="text-xs text-muted-foreground">Por completar hoy</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{taskSummary.inProgress}</div>
                  <p className="text-xs text-muted-foreground">Tareas activas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{taskSummary.completed}</div>
                  <p className="text-xs text-muted-foreground">¡Buen trabajo!</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{action.name}</h4>
                              <p className="text-xs text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Tareas Recientes</CardTitle>
                <CardDescription>
                  Tus últimas actividades y tareas asignadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTasks.map((task) => {
                    const StatusIcon = getStatusIcon(task.status);
                    return (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{task.description}</p>
                            <p className="text-xs text-muted-foreground">{task.time}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status === 'pending' && 'Pendiente'}
                          {task.status === 'in-progress' && 'En progreso'}
                          {task.status === 'completed' && 'Completado'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Current Shift Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Información del Turno</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Turno Actual</p>
                    <p className="font-semibold">Mañana (7:00 AM - 3:00 PM)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horas Trabajadas</p>
                    <p className="font-semibold">5h 30min</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Próximo Descanso</p>
                    <p className="font-semibold">12:00 PM (30min)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorDashboard;