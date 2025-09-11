import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wrench, 
  ClipboardList, 
  Calendar, 
  AlertTriangle,
  BarChart3,
  Package,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  ChevronRight,
  Settings,
  FileText,
  Shield
} from 'lucide-react';
import WorkOrderManagement from './WorkOrderManagement';
import PreventiveMaintenance from './PreventiveMaintenance';
import CorrectiveMaintenance from './CorrectiveMaintenance';
import AssetManagement from './AssetManagement';
import TechniciansSchedule from './TechniciansSchedule';
import InventoryManagement from './InventoryManagement';
import MaintenanceReports from './reports/MaintenanceReports';

interface SubModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'operations' | 'reports';
}

const subModules: SubModule[] = [
  // Operaciones
  {
    id: 'work-orders',
    name: 'Órdenes de Trabajo',
    description: 'Registro, clasificación y asignación de incidencias',
    icon: ClipboardList,
    color: 'text-blue-600',
    category: 'operations'
  },
  {
    id: 'preventive',
    name: 'Mantenimiento Preventivo',
    description: 'Calendario de revisiones y mantenimiento programado',
    icon: Calendar,
    color: 'text-green-600',
    category: 'operations'
  },
  {
    id: 'corrective',
    name: 'Mantenimiento Correctivo',
    description: 'Reparación de fallas e historial de intervenciones',
    icon: Wrench,
    color: 'text-orange-600',
    category: 'operations'
  },
  {
    id: 'assets',
    name: 'Gestión de Activos',
    description: 'Registro de equipos, muebles e instalaciones',
    icon: Package,
    color: 'text-purple-600',
    category: 'operations'
  },
  {
    id: 'technicians',
    name: 'Gestión de Técnicos',
    description: 'Horarios, asignaciones y especialidades del personal',
    icon: Users,
    color: 'text-cyan-600',
    category: 'operations'
  },
  {
    id: 'inventory',
    name: 'Inventario de Repuestos',
    description: 'Control de stock de herramientas y materiales',
    icon: Settings,
    color: 'text-emerald-600',
    category: 'operations'
  },
  // Reportes
  {
    id: 'general-reports',
    name: 'Reportes Generales',
    description: 'Tiempo de resolución, costos y incidencias frecuentes',
    icon: BarChart3,
    color: 'text-indigo-600',
    category: 'reports'
  },
  {
    id: 'cost-reports',
    name: 'Análisis de Costos',
    description: 'Costos de mantenimiento por área y equipo',
    icon: DollarSign,
    color: 'text-red-600',
    category: 'reports'
  },
  {
    id: 'efficiency-reports',
    name: 'Indicadores de Eficiencia',
    description: 'KPIs de mantenimiento y productividad',
    icon: Clock,
    color: 'text-amber-600',
    category: 'reports'
  },
  {
    id: 'compliance-reports',
    name: 'Cumplimiento Normativo',
    description: 'Certificaciones y auditorías de seguridad',
    icon: Shield,
    color: 'text-rose-600',
    category: 'reports'
  }
];

const MaintenanceModule: React.FC = () => {
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'operations' | 'reports'>('operations');

  const renderSubModuleContent = () => {
    switch (activeSubModule) {
      case 'work-orders':
        return <WorkOrderManagement />;
      case 'preventive':
        return <PreventiveMaintenance />;
      case 'corrective':
        return <CorrectiveMaintenance />;
      case 'assets':
        return <AssetManagement />;
      case 'technicians':
        return <TechniciansSchedule />;
      case 'inventory':
        return <InventoryManagement />;
      case 'general-reports':
      case 'cost-reports':
      case 'efficiency-reports':
      case 'compliance-reports':
        return <MaintenanceReports reportType={activeSubModule} />;
      default:
        return null;
    }
  };

  if (activeSubModule) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setActiveSubModule(null)}
            className="hover:bg-muted"
          >
            ← Volver a Mantenimiento
          </Button>
          <div>
            <h3 className="text-2xl font-semibold">
              {subModules.find(m => m.id === activeSubModule)?.name}
            </h3>
            <p className="text-muted-foreground">
              {subModules.find(m => m.id === activeSubModule)?.description}
            </p>
          </div>
        </div>
        {renderSubModuleContent()}
      </motion.div>
    );
  }

  const filteredModules = subModules.filter(module => module.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Category Selector */}
      <div className="flex space-x-2 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeCategory === 'operations' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('operations')}
        >
          Operaciones
        </Button>
        <Button
          variant={activeCategory === 'reports' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('reports')}
        >
          Reportes
        </Button>
      </div>

      {/* Sub-modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-hotel transition-all duration-300 border-l-4 border-l-primary"
                onClick={() => setActiveSubModule(module.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className={`h-6 w-6 ${module.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">23</div>
                <div className="text-sm text-muted-foreground">Órdenes Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">45</div>
                <div className="text-sm text-muted-foreground">Trabajos Completados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">2.4h</div>
                <div className="text-sm text-muted-foreground">Tiempo Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">$8,450</div>
                <div className="text-sm text-muted-foreground">Costos del Mes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default MaintenanceModule;