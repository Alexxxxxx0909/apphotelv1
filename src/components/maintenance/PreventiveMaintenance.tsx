import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Bell,
  Settings,
  Wrench,
  Plus
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  equipment: string;
  area: string;
  frequency: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'pendiente' | 'vencida' | 'completada' | 'programada';
  technician: string;
  estimatedDuration: string;
  checklist: string[];
}

const mockTasks: MaintenanceTask[] = [
  {
    id: 'PM-001',
    equipment: 'Ascensor Principal',
    area: 'Lobby',
    frequency: 'Mensual',
    lastMaintenance: '2024-12-15',
    nextMaintenance: '2024-01-15',
    status: 'pendiente',
    technician: 'Roberto Silva',
    estimatedDuration: '4 horas',
    checklist: ['Inspección de cables', 'Lubricación de rieles', 'Prueba de frenos', 'Calibración de sensores']
  },
  {
    id: 'PM-002',
    equipment: 'Sistema HVAC - Zona A',
    area: 'Habitaciones 101-150',
    frequency: 'Trimestral',
    lastMaintenance: '2024-11-01',
    nextMaintenance: '2024-02-01',
    status: 'programada',
    technician: 'Carlos Méndez',
    estimatedDuration: '6 horas',
    checklist: ['Cambio de filtros', 'Limpieza de ductos', 'Verificación de termostatos', 'Prueba de presión']
  },
  {
    id: 'PM-003',
    equipment: 'Caldera Principal',
    area: 'Sótano',
    frequency: 'Semanal',
    lastMaintenance: '2024-01-08',
    nextMaintenance: '2024-01-15',
    status: 'vencida',
    technician: 'Miguel Torres',
    estimatedDuration: '2 horas',
    checklist: ['Verificación de presión', 'Limpieza de quemadores', 'Inspección de válvulas', 'Prueba de seguridad']
  }
];

const PreventiveMaintenance: React.FC = () => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>(mockTasks);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'vencida': return 'bg-red-100 text-red-800 border-red-200';
      case 'completada': return 'bg-green-100 text-green-800 border-green-200';
      case 'programada': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente': return <Clock className="h-4 w-4" />;
      case 'vencida': return <AlertTriangle className="h-4 w-4" />;
      case 'completada': return <CheckCircle className="h-4 w-4" />;
      case 'programada': return <CalendarIcon className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const upcomingTasks = tasks.filter(task => 
    new Date(task.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const overdueTasks = tasks.filter(task => task.status === 'vencida');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
                <p className="text-sm text-muted-foreground">Tareas Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{upcomingTasks.length}</p>
                <p className="text-sm text-muted-foreground">Próximas 7 días</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-sm text-muted-foreground">Completadas este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="equipment">Por Equipo</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendario de Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tareas Programadas</CardTitle>
                  <CardDescription>
                    Mantenimientos preventivos programados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{task.equipment}</h4>
                              <Badge variant="outline" className={getStatusColor(task.status)}>
                                {getStatusIcon(task.status)}
                                <span className="ml-1">{task.status.toUpperCase()}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{task.area}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span>Frecuencia: {task.frequency}</span>
                              <span>Duración: {task.estimatedDuration}</span>
                              <span>Técnico: {task.technician}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span>Último: {task.lastMaintenance}</span>
                              <span className={task.status === 'vencida' ? 'text-red-600 font-medium' : ''}>
                                Próximo: {task.nextMaintenance}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Wrench className="h-4 w-4 mr-2" />
                            Gestionar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipos y Sistemas</CardTitle>
              <CardDescription>
                Lista de equipos con mantenimiento preventivo programado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Ascensores', count: 3, nextMaintenance: '2024-01-15', status: 'warning' },
                  { name: 'Sistema HVAC', count: 5, nextMaintenance: '2024-01-20', status: 'good' },
                  { name: 'Calderas', count: 2, nextMaintenance: '2024-01-12', status: 'overdue' },
                  { name: 'Bombas de Agua', count: 4, nextMaintenance: '2024-01-25', status: 'good' },
                  { name: 'Generador', count: 1, nextMaintenance: '2024-01-18', status: 'warning' },
                  { name: 'Sistema Eléctrico', count: 8, nextMaintenance: '2024-02-01', status: 'good' }
                ].map((equipment, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{equipment.name}</h4>
                          <p className="text-sm text-muted-foreground">{equipment.count} equipos</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Próximo: {equipment.nextMaintenance}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          equipment.status === 'overdue' ? 'bg-red-500' :
                          equipment.status === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas y Notificaciones</CardTitle>
              <CardDescription>
                Tareas vencidas y próximas a vencer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueTasks.length > 0 && (
                  <div className="border-l-4 border-red-500 bg-red-50 p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Tareas Vencidas</h4>
                    {overdueTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">{task.equipment}</p>
                          <p className="text-sm text-muted-foreground">
                            Vencida desde: {task.nextMaintenance}
                          </p>
                        </div>
                        <Button size="sm" variant="destructive">
                          Programar Ahora
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {upcomingTasks.length > 0 && (
                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Próximas Tareas (7 días)</h4>
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">{task.equipment}</p>
                          <p className="text-sm text-muted-foreground">
                            Programada: {task.nextMaintenance}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Ver Detalles
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PreventiveMaintenance;