import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Users, 
  Clock, 
  Calendar as CalendarIcon,
  User,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  specialties: string[];
  level: 'junior' | 'senior' | 'expert';
  status: 'disponible' | 'ocupado' | 'ausente';
  activeOrders: number;
  completedToday: number;
  workHours: string;
  location: string;
}

interface Schedule {
  technicianId: string;
  date: string;
  workOrders: {
    id: string;
    title: string;
    location: string;
    estimatedTime: string;
    priority: 'alta' | 'media' | 'baja';
    status: 'pendiente' | 'en-progreso' | 'completada';
  }[];
}

const mockTechnicians: Technician[] = [
  {
    id: 'TECH-001',
    name: 'Carlos Méndez',
    email: 'carlos.mendez@hotel.com',
    phone: '+1-555-0101',
    specialties: ['HVAC', 'Refrigeración', 'Electricidad'],
    level: 'expert',
    status: 'ocupado',
    activeOrders: 3,
    completedToday: 2,
    workHours: '08:00 - 17:00',
    location: 'Piso 2-3'
  },
  {
    id: 'TECH-002',
    name: 'Miguel Torres',
    email: 'miguel.torres@hotel.com',
    phone: '+1-555-0102',
    specialties: ['Plomería', 'Fontanería', 'Carpintería'],
    level: 'senior',
    status: 'disponible',
    activeOrders: 1,
    completedToday: 4,
    workHours: '07:00 - 16:00',
    location: 'Piso 1-2'
  },
  {
    id: 'TECH-003',
    name: 'Ana López',
    email: 'ana.lopez@hotel.com',
    phone: '+1-555-0103',
    specialties: ['Electricidad', 'Iluminación', 'Seguridad'],
    level: 'senior',
    status: 'disponible',
    activeOrders: 2,
    completedToday: 3,
    workHours: '09:00 - 18:00',
    location: 'Áreas Comunes'
  },
  {
    id: 'TECH-004',
    name: 'Roberto Silva',
    email: 'roberto.silva@hotel.com',
    phone: '+1-555-0104',
    specialties: ['Elevadores', 'Mecánica General', 'Motores'],
    level: 'expert',
    status: 'ocupado',
    activeOrders: 1,
    completedToday: 1,
    workHours: '08:00 - 17:00',
    location: 'Elevadores/Sótano'
  }
];

const mockSchedules: Schedule[] = [
  {
    technicianId: 'TECH-001',
    date: '2024-01-15',
    workOrders: [
      {
        id: 'WO-001',
        title: 'Reparar AC Habitación 205',
        location: 'Piso 2',
        estimatedTime: '2h',
        priority: 'alta',
        status: 'en-progreso'
      },
      {
        id: 'WO-005',
        title: 'Mantenimiento HVAC Zona A',
        location: 'Piso 3',
        estimatedTime: '3h',
        priority: 'media',
        status: 'pendiente'
      }
    ]
  },
  {
    technicianId: 'TECH-002',
    date: '2024-01-15',
    workOrders: [
      {
        id: 'WO-002',
        title: 'Reparar fuga grifo 310',
        location: 'Piso 3',
        estimatedTime: '1h',
        priority: 'media',
        status: 'completada'
      }
    ]
  }
];

const TechniciansSchedule: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('team');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800 border-green-200';
      case 'ocupado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ausente': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'senior': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'expert': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWorkOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completada': return 'bg-green-100 text-green-800 border-green-200';
      case 'en-progreso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pendiente': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalTechnicians = technicians.length;
  const availableTechnicians = technicians.filter(t => t.status === 'disponible').length;
  const busyTechnicians = technicians.filter(t => t.status === 'ocupado').length;
  const totalActiveOrders = technicians.reduce((sum, t) => sum + t.activeOrders, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalTechnicians}</p>
                <p className="text-sm text-muted-foreground">Total Técnicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{availableTechnicians}</p>
                <p className="text-sm text-muted-foreground">Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{busyTechnicians}</p>
                <p className="text-sm text-muted-foreground">Ocupados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalActiveOrders}</p>
                <p className="text-sm text-muted-foreground">Órdenes Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="team">Equipo de Trabajo</TabsTrigger>
          <TabsTrigger value="schedule">Programación</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Técnicos de Mantenimiento</CardTitle>
              <CardDescription>
                Estado actual y especialidades del equipo técnico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {technicians.map((technician) => (
                  <Card key={technician.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={technician.avatar} />
                        <AvatarFallback>
                          {technician.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{technician.name}</h4>
                            <p className="text-sm text-muted-foreground">{technician.location}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className={getStatusColor(technician.status)}>
                              {technician.status}
                            </Badge>
                            <Badge variant="outline" className={getLevelColor(technician.level)}>
                              {technician.level}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Órdenes activas</p>
                            <p className="font-medium">{technician.activeOrders}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Completadas hoy</p>
                            <p className="font-medium">{technician.completedToday}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Especialidades:</p>
                          <div className="flex flex-wrap gap-1">
                            {technician.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{technician.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{technician.workHours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendario</CardTitle>
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
                  <CardTitle>Programación del Día</CardTitle>
                  <CardDescription>
                    Asignaciones de trabajo para {selectedDate?.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {technicians.map((technician) => {
                      const techSchedule = schedules.find(s => s.technicianId === technician.id);
                      
                      return (
                        <div key={technician.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {technician.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{technician.name}</h4>
                                <p className="text-sm text-muted-foreground">{technician.workHours}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={getStatusColor(technician.status)}>
                              {technician.status}
                            </Badge>
                          </div>
                          
                          {techSchedule && techSchedule.workOrders.length > 0 ? (
                            <div className="space-y-2">
                              {techSchedule.workOrders.map((order) => (
                                <div key={order.id} className="bg-muted rounded p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-sm">{order.title}</h5>
                                    <div className="flex space-x-2">
                                      <Badge variant="outline" className={getPriorityColor(order.priority)}>
                                        {order.priority}
                                      </Badge>
                                      <Badge variant="outline" className={getWorkOrderStatusColor(order.status)}>
                                        {order.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{order.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{order.estimatedTime}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              <p className="text-sm">Sin órdenes asignadas para este día</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento Individual</CardTitle>
                <CardDescription>
                  Métricas de productividad por técnico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.map((technician) => (
                    <div key={technician.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {technician.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{technician.name}</h4>
                            <Badge variant="outline" className={getLevelColor(technician.level)}>
                              {technician.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{technician.activeOrders}</p>
                          <p className="text-muted-foreground">Activas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{technician.completedToday}</p>
                          <p className="text-muted-foreground">Hoy</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {Math.floor(Math.random() * 20) + 25}
                          </p>
                          <p className="text-muted-foreground">Esta semana</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores del Equipo</CardTitle>
                <CardDescription>
                  Métricas generales de eficiencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-3xl font-bold text-green-600">95%</p>
                      <p className="text-sm text-muted-foreground">Eficiencia Promedio</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">2.1h</p>
                      <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Órdenes Completadas</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Satisfacción Cliente</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tiempo en Meta</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TechniciansSchedule;