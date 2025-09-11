import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  MessageCircle, 
  AlertTriangle, 
  Car, 
  Bed, 
  Star,
  FileText,
  Settings,
  CheckCircle,
  Clock
} from 'lucide-react';
import SpecialRequestsManagement from './SpecialRequestsManagement';
import ComplaintsManagement from './ComplaintsManagement';
import AdditionalServicesManagement from './AdditionalServicesManagement';
import HousekeepingCoordination from './HousekeepingCoordination';

interface CustomerServiceOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'operations' | 'coordination';
}

const customerServiceOptions: CustomerServiceOption[] = [
  // Operaciones principales
  {
    id: 'special-requests',
    name: 'Solicitudes Especiales',
    description: 'Registro y seguimiento de peticiones especiales',
    icon: Star,
    color: 'text-yellow-600',
    category: 'operations'
  },
  {
    id: 'complaints',
    name: 'Quejas y Reclamos',
    description: 'Gestión de quejas, reclamos y soluciones',
    icon: AlertTriangle,
    color: 'text-red-600',
    category: 'operations'
  },
  {
    id: 'additional-services',
    name: 'Servicios Adicionales',
    description: 'Transporte, tours, spa y otros servicios',
    icon: Car,
    color: 'text-blue-600',
    category: 'operations'
  },
  // Coordinación
  {
    id: 'housekeeping-coordination',
    name: 'Coordinación Housekeeping',
    description: 'Enlace para liberar/habilitar habitaciones',
    icon: Bed,
    color: 'text-green-600',
    category: 'coordination'
  }
];

const CustomerServiceModule: React.FC = () => {
  const [activeOption, setActiveOption] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeOption) {
      case 'special-requests':
        return <SpecialRequestsManagement />;
      case 'complaints':
        return <ComplaintsManagement />;
      case 'additional-services':
        return <AdditionalServicesManagement />;
      case 'housekeeping-coordination':
        return <HousekeepingCoordination />;
      default:
        return null;
    }
  };

  const operationsOptions = customerServiceOptions.filter(opt => opt.category === 'operations');
  const coordinationOptions = customerServiceOptions.filter(opt => opt.category === 'coordination');

  if (activeOption) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setActiveOption(null)}
          >
            ← Volver a Atención al Cliente
          </Button>
          <h3 className="text-2xl font-bold">
            {customerServiceOptions.find(opt => opt.id === activeOption)?.name}
          </h3>
        </div>
        {renderContent()}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Operaciones de Atención al Cliente */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Gestión de Servicios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operationsOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-primary"
                  onClick={() => setActiveOption(option.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className={`h-6 w-6 ${option.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Coordinación */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Coordinación Interna</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coordinationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => setActiveOption(option.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Icon className={`h-6 w-6 ${option.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{option.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Resumen de actividad */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Atención al Cliente</CardTitle>
          <CardDescription>
            Resumen de solicitudes y servicios del día
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">7</div>
              <div className="text-sm text-yellow-700">Solicitudes Pendientes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-red-700">Reclamos Activos</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-blue-700">Servicios Solicitados</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-green-700">Satisfacción Cliente</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomerServiceModule;