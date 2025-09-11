import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wrench, 
  Clock, 
  FileText,
  Calendar,
  User,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface RepairRecord {
  id: string;
  date: string;
  location: string;
  room?: string;
  equipment: string;
  issue: string;
  solution: string;
  technician: string;
  timeSpent: string;
  cost: number;
  partsUsed: string[];
  status: 'completada' | 'en-progreso' | 'pendiente';
  priority: 'alta' | 'media' | 'baja';
}

const mockRepairs: RepairRecord[] = [
  {
    id: 'CR-001',
    date: '2024-01-15',
    location: 'Habitaciones',
    room: '205',
    equipment: 'Aire Acondicionado',
    issue: 'No enfría correctamente, ruido extraño',
    solution: 'Reemplazo de compresor y limpieza de filtros',
    technician: 'Carlos Méndez',
    timeSpent: '3.5 horas',
    cost: 450.00,
    partsUsed: ['Compresor', 'Filtro HEPA', 'Refrigerante'],
    status: 'completada',
    priority: 'alta'
  },
  {
    id: 'CR-002',
    date: '2024-01-14',
    location: 'Baños',
    room: '310',
    equipment: 'Sistema de Plomería',
    issue: 'Fuga en tubería bajo el lavabo',
    solution: 'Reemplazo de juntas y sellado de conexiones',
    technician: 'Miguel Torres',
    timeSpent: '2 horas',
    cost: 125.00,
    partsUsed: ['Juntas de goma', 'Sellador', 'Cinta teflón'],
    status: 'completada',
    priority: 'media'
  },
  {
    id: 'CR-003',
    date: '2024-01-13',
    location: 'Lobby',
    equipment: 'Iluminación LED',
    issue: 'Paneles LED intermitentes',
    solution: 'Reemplazo de driver LED y verificación de conexiones',
    technician: 'Ana López',
    timeSpent: '1.5 horas',
    cost: 200.00,
    partsUsed: ['Driver LED', 'Conectores'],
    status: 'completada',
    priority: 'baja'
  }
];

const CorrectiveMaintenance: React.FC = () => {
  const [repairs, setRepairs] = useState<RepairRecord[]>(mockRepairs);
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedLocation, setSelectedLocation] = useState('todas');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada': return 'bg-green-100 text-green-800 border-green-200';
      case 'en-progreso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const totalCost = repairs.reduce((sum, repair) => sum + repair.cost, 0);
  const avgRepairTime = repairs.reduce((sum, repair) => 
    sum + parseFloat(repair.timeSpent.split(' ')[0]), 0) / repairs.length;

  const locationStats = repairs.reduce((acc, repair) => {
    const location = repair.location;
    if (!acc[location]) {
      acc[location] = { count: 0, cost: 0 };
    }
    acc[location].count++;
    acc[location].cost += repair.cost;
    return acc;
  }, {} as Record<string, { count: number; cost: number }>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{repairs.length}</p>
                <p className="text-sm text-muted-foreground">Reparaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Costo Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{avgRepairTime.toFixed(1)}h</p>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {repairs.filter(r => r.status === 'completada').length}
                </p>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Reparaciones Recientes</TabsTrigger>
          <TabsTrigger value="history">Historial por Ubicación</TabsTrigger>
          <TabsTrigger value="analysis">Análisis de Fallas</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mantenimiento Correctivo Reciente</CardTitle>
              <CardDescription>
                Registro de reparaciones y soluciones implementadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Problema</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead>Costo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repairs.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell className="font-medium">{repair.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{repair.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{repair.location}</span>
                          {repair.room && <span className="text-muted-foreground">({repair.room})</span>}
                        </div>
                      </TableCell>
                      <TableCell>{repair.equipment}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={repair.issue}>
                        {repair.issue}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{repair.technician}</span>
                        </div>
                      </TableCell>
                      <TableCell>{repair.timeSpent}</TableCell>
                      <TableCell>${repair.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(repair.status)}>
                          {repair.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial por Ubicación</CardTitle>
                <CardDescription>
                  Incidencias registradas por área del hotel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(locationStats).map(([location, stats]) => (
                    <div key={location} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{location}</h4>
                        <Badge variant="outline">
                          {stats.count} reparaciones
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Incidencias</p>
                          <p className="font-medium">{stats.count}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Costo Total</p>
                          <p className="font-medium">${stats.cost.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reparaciones Detalladas</CardTitle>
                <CardDescription>
                  Información específica de cada intervención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repairs.map((repair) => (
                    <div key={repair.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{repair.equipment}</h4>
                          <p className="text-sm text-muted-foreground">
                            {repair.location} {repair.room && `- ${repair.room}`}
                          </p>
                        </div>
                        <Badge variant="outline" className={getPriorityColor(repair.priority)}>
                          {repair.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Problema:</span>
                          <p className="text-muted-foreground">{repair.issue}</p>
                        </div>
                        <div>
                          <span className="font-medium">Solución:</span>
                          <p className="text-muted-foreground">{repair.solution}</p>
                        </div>
                        <div>
                          <span className="font-medium">Repuestos utilizados:</span>
                          <p className="text-muted-foreground">{repair.partsUsed.join(', ')}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span>Técnico: {repair.technician}</span>
                          <span>Costo: ${repair.cost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipos con Más Fallas</CardTitle>
                <CardDescription>
                  Análisis de equipos que requieren más atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { equipment: 'Aire Acondicionado', failures: 8, avgCost: 425 },
                    { equipment: 'Sistema de Plomería', failures: 6, avgCost: 185 },
                    { equipment: 'Iluminación', failures: 4, avgCost: 150 },
                    { equipment: 'Elevadores', failures: 3, avgCost: 850 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.equipment}</p>
                        <p className="text-sm text-muted-foreground">{item.failures} fallas</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.avgCost}</p>
                        <p className="text-sm text-muted-foreground">Costo promedio</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones</CardTitle>
                <CardDescription>
                  Sugerencias basadas en el historial de fallas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                    <h4 className="font-medium text-yellow-800">Mantenimiento Preventivo</h4>
                    <p className="text-sm text-yellow-700">
                      Aumentar frecuencia de revisión de aires acondicionados en temporada alta
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                    <h4 className="font-medium text-blue-800">Capacitación</h4>
                    <p className="text-sm text-blue-700">
                      Entrenamiento específico en sistemas HVAC para técnicos
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 bg-green-50 p-4">
                    <h4 className="font-medium text-green-800">Inventario</h4>
                    <p className="text-sm text-green-700">
                      Mantener stock de filtros y compresores más comunes
                    </p>
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

export default CorrectiveMaintenance;