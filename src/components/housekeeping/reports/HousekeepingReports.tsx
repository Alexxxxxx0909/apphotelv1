import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  Bed, 
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package
} from 'lucide-react';
// Import placeholder - reports will be implemented
// import RoomStatusReports from './RoomStatusReports';
// import StaffProductivityReports from './StaffProductivityReports';
// import InventoryReports from './InventoryReports';
// import QualityReports from './QualityReports';

const HousekeepingReports: React.FC = () => {
  const [activeReport, setActiveReport] = useState('room-status');

  // Mock data for quick stats
  const quickStats = {
    roomsReady: 45,
    pendingCleaning: 12,
    staffEfficiency: 95,
    inventoryAlerts: 3,
    qualityScore: 92,
    avgCleaningTime: 38
  };

  const reportTypes = [
    {
      id: 'room-status',
      name: 'Estado de Habitaciones',
      description: 'Reportes de ocupación y estado de limpieza',
      icon: Bed,
      color: 'text-blue-600'
    },
    {
      id: 'staff-productivity',
      name: 'Productividad del Personal',
      description: 'Eficiencia y rendimiento de camareras',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 'inventory',
      name: 'Inventario',
      description: 'Stock de insumos y ropa blanca',
      icon: Package,
      color: 'text-purple-600'
    },
    {
      id: 'quality',
      name: 'Control de Calidad',
      description: 'Inspecciones y estándares de limpieza',
      icon: CheckCircle,
      color: 'text-orange-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Reportes de Housekeeping</h3>
          <p className="text-muted-foreground">Análisis y estadísticas del departamento de amas de llaves</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar Todos
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-xl font-bold">{quickStats.roomsReady}</p>
                <p className="text-xs text-muted-foreground">Hab. Listas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <div>
                <p className="text-xl font-bold">{quickStats.pendingCleaning}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xl font-bold">{quickStats.staffEfficiency}%</p>
                <p className="text-xs text-muted-foreground">Eficiencia</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-xl font-bold">{quickStats.inventoryAlerts}</p>
                <p className="text-xs text-muted-foreground">Alertas Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-xl font-bold">{quickStats.qualityScore}</p>
                <p className="text-xs text-muted-foreground">Calidad</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-indigo-600" />
              <div>
                <p className="text-xl font-bold">{quickStats.avgCleaningTime}m</p>
                <p className="text-xs text-muted-foreground">Tiempo Prom.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Reportes</CardTitle>
          <CardDescription>Selecciona el tipo de reporte que deseas generar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card 
                  key={report.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    activeReport === report.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActiveReport(report.id)}
                >
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <Icon className={`h-8 w-8 mx-auto ${report.color}`} />
                      <h4 className="font-semibold">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Reporte: {reportTypes.find(r => r.id === activeReport)?.name}</h3>
            <p className="text-muted-foreground mb-4">Los reportes detallados están en desarrollo</p>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default HousekeepingReports;