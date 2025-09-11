import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  LogIn, 
  LogOut, 
  Receipt, 
  BarChart3,
  UserPlus,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  Home
} from 'lucide-react';
import CheckInManagement from './CheckInManagement';
import CheckOutManagement from './CheckOutManagement';
import GuestGroupManagement from './GuestGroupManagement';
import InvoiceGeneration from './InvoiceGeneration';
import ReservationReports from './reports/ReservationReports';
import OccupancyReports from './reports/OccupancyReports';
import MovementReports from './reports/MovementReports';
import ClientReports from './reports/ClientReports';
import FinancialReports from './reports/FinancialReports';
import GeneralReports from './reports/GeneralReports';

interface ReceptionOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'operations' | 'reports';
}

const receptionOptions: ReceptionOption[] = [
  // Operaciones
  {
    id: 'checkin',
    name: 'Check-in',
    description: 'Registro de llegada de huéspedes',
    icon: LogIn,
    color: 'text-green-600',
    category: 'operations'
  },
  {
    id: 'checkout',
    name: 'Check-out',
    description: 'Salida con desglose de consumos',
    icon: LogOut,
    color: 'text-blue-600',
    category: 'operations'
  },
  {
    id: 'groups',
    name: 'Grupos',
    description: 'Registro de acompañantes y grupos',
    icon: UserPlus,
    color: 'text-purple-600',
    category: 'operations'
  },
  {
    id: 'invoices',
    name: 'Facturación',
    description: 'Factura consolidada',
    icon: Receipt,
    color: 'text-orange-600',
    category: 'operations'
  },
  // Reportes
  {
    id: 'reservation-reports',
    name: 'Reportes de Reservas',
    description: 'Activas, canceladas, no-show, origen',
    icon: Calendar,
    color: 'text-indigo-600',
    category: 'reports'
  },
  {
    id: 'occupancy-reports',
    name: 'Reportes de Ocupación',
    description: 'Porcentaje, ADR, RevPAR',
    icon: Home,
    color: 'text-cyan-600',
    category: 'reports'
  },
  {
    id: 'movement-reports',
    name: 'Reportes de Movimientos',
    description: 'Check-in/out diarios, huéspedes activos',
    icon: TrendingUp,
    color: 'text-emerald-600',
    category: 'reports'
  },
  {
    id: 'client-reports',
    name: 'Informes de Clientes',
    description: 'Frecuentes, segmentación, preferencias',
    icon: Users,
    color: 'text-pink-600',
    category: 'reports'
  },
  {
    id: 'financial-reports',
    name: 'Reportes Financieros',
    description: 'Ingresos, anticipos, métodos de pago',
    icon: DollarSign,
    color: 'text-amber-600',
    category: 'reports'
  },
  {
    id: 'general-reports',
    name: 'Reporte General',
    description: 'KPIs y resumen ejecutivo',
    icon: BarChart3,
    color: 'text-red-600',
    category: 'reports'
  }
];

const ReceptionModule: React.FC = () => {
  const [activeOption, setActiveOption] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeOption) {
      case 'checkin':
        return <CheckInManagement />;
      case 'checkout':
        return <CheckOutManagement />;
      case 'groups':
        return <GuestGroupManagement />;
      case 'invoices':
        return <InvoiceGeneration />;
      case 'reservation-reports':
        return <ReservationReports />;
      case 'occupancy-reports':
        return <OccupancyReports />;
      case 'movement-reports':
        return <MovementReports />;
      case 'client-reports':
        return <ClientReports />;
      case 'financial-reports':
        return <FinancialReports />;
      case 'general-reports':
        return <GeneralReports />;
      default:
        return null;
    }
  };

  const operationsOptions = receptionOptions.filter(opt => opt.category === 'operations');
  const reportsOptions = receptionOptions.filter(opt => opt.category === 'reports');

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
            ← Volver a Recepción
          </Button>
          <h3 className="text-2xl font-bold">
            {receptionOptions.find(opt => opt.id === activeOption)?.name}
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
      {/* Operaciones */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Operaciones de Recepción</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Reportes */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Reportes y Análisis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportsOptions.map((option) => {
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

      {/* Resumen rápido */}
      <Card>
        <CardHeader>
          <CardTitle>Estado Actual de Recepción</CardTitle>
          <CardDescription>
            Resumen de la actividad del día
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-green-700">Check-ins Hoy</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-blue-700">Check-outs Hoy</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-purple-700">Huéspedes Activos</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-sm text-orange-700">Ocupación</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReceptionModule;