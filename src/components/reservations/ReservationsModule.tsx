import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarPlus, 
  Calendar, 
  TrendingUp, 
  Edit,
  ChevronRight
} from 'lucide-react';
import RegisterReservation from './RegisterReservation';
import AvailabilityControl from './AvailabilityControl';
import DynamicPricing from './DynamicPricing';
import ReservationManagement from './ReservationManagement';

interface SubModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const subModules: SubModule[] = [
  {
    id: 'register',
    name: 'Registrar Reservas',
    description: 'Crear nuevas reservas con todos los detalles',
    icon: CalendarPlus,
    color: 'text-blue-600'
  },
  {
    id: 'availability',
    name: 'Control de Disponibilidad',
    description: 'Monitoreo en tiempo real de habitaciones',
    icon: Calendar,
    color: 'text-green-600'
  },
  {
    id: 'pricing',
    name: 'Tarifas Dinámicas',
    description: 'Gestión de precios y promociones',
    icon: TrendingUp,
    color: 'text-purple-600'
  },
  {
    id: 'management',
    name: 'Modificar/Cancelar Reservas',
    description: 'Gestionar reservas existentes',
    icon: Edit,
    color: 'text-orange-600'
  }
];

const ReservationsModule: React.FC = () => {
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);

  const renderSubModuleContent = () => {
    switch (activeSubModule) {
      case 'register':
        return <RegisterReservation />;
      case 'availability':
        return <AvailabilityControl />;
      case 'pricing':
        return <DynamicPricing />;
      case 'management':
        return <ReservationManagement />;
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
            ← Volver a Reservas
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subModules.map((module) => {
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
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">45</div>
              <div className="text-sm text-muted-foreground">Reservas Hoy</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">28</div>
              <div className="text-sm text-muted-foreground">Habitaciones Disponibles</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-muted-foreground">En Mantenimiento</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-muted-foreground">Ocupación</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ReservationsModule;