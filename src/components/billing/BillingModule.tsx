import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Receipt, 
  CreditCard, 
  FileText, 
  AlertTriangle,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Building,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import UnifiedBilling from './UnifiedBilling';
import PaymentMethods from './PaymentMethods';
import FiscalReceipts from './FiscalReceipts';
import AccountsReceivable from './AccountsReceivable';
import GeneralBillingReports from './reports/GeneralBillingReports';
import PaymentMethodReports from './reports/PaymentMethodReports';
import AccountsReceivableReports from './reports/AccountsReceivableReports';
import CustomerConsumptionReports from './reports/CustomerConsumptionReports';
import ComparativeReports from './reports/ComparativeReports';

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
    id: 'unified-billing',
    name: 'Facturación Unificada',
    description: 'Facturación de alojamiento, restaurante, bar, spa y eventos',
    icon: Receipt,
    color: 'text-blue-600',
    category: 'operations'
  },
  {
    id: 'payment-methods',
    name: 'Medios de Pago',
    description: 'Gestión de efectivo, tarjetas, transferencias y pagos online',
    icon: CreditCard,
    color: 'text-green-600',
    category: 'operations'
  },
  {
    id: 'fiscal-receipts',
    name: 'Comprobantes Fiscales',
    description: 'Emisión y control de facturas electrónicas',
    icon: FileText,
    color: 'text-purple-600',
    category: 'operations'
  },
  {
    id: 'accounts-receivable',
    name: 'Cuentas por Cobrar',
    description: 'Control de pagos pendientes y morosos',
    icon: AlertTriangle,
    color: 'text-red-600',
    category: 'operations'
  },
  // Reportes
  {
    id: 'general-reports',
    name: 'Reporte General de Facturación',
    description: 'Ingresos totales, ventas por centro de costo y facturas',
    icon: BarChart3,
    color: 'text-indigo-600',
    category: 'reports'
  },
  {
    id: 'payment-reports',
    name: 'Reporte por Medios de Pago',
    description: 'Distribución de ingresos según método de pago',
    icon: PieChart,
    color: 'text-emerald-600',
    category: 'reports'
  },
  {
    id: 'receivable-reports',
    name: 'Reporte de Cuentas por Cobrar',
    description: 'Facturas pendientes, vencidas y anticipos',
    icon: AlertTriangle,
    color: 'text-orange-600',
    category: 'reports'
  },
  {
    id: 'customer-reports',
    name: 'Consumos por Cliente',
    description: 'Detalle de cargos por huésped y habitación',
    icon: Users,
    color: 'text-cyan-600',
    category: 'reports'
  },
  {
    id: 'comparative-reports',
    name: 'Reporte Comparativo',
    description: 'Análisis comparativo y proyecciones',
    icon: TrendingUp,
    color: 'text-rose-600',
    category: 'reports'
  }
];

const BillingModule: React.FC = () => {
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'operations' | 'reports'>('operations');

  const renderSubModuleContent = () => {
    switch (activeSubModule) {
      case 'unified-billing':
        return <UnifiedBilling />;
      case 'payment-methods':
        return <PaymentMethods />;
      case 'fiscal-receipts':
        return <FiscalReceipts />;
      case 'accounts-receivable':
        return <AccountsReceivable />;
      case 'general-reports':
        return <GeneralBillingReports />;
      case 'payment-reports':
        return <PaymentMethodReports />;
      case 'receivable-reports':
        return <AccountsReceivableReports />;
      case 'customer-reports':
        return <CustomerConsumptionReports />;
      case 'comparative-reports':
        return <ComparativeReports />;
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
            ← Volver a Facturación
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
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">$156,890</div>
                <div className="text-sm text-muted-foreground">Ingresos del Mes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Receipt className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">847</div>
                <div className="text-sm text-muted-foreground">Facturas Emitidas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">$12,450</div>
                <div className="text-sm text-muted-foreground">Pagos Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">15</div>
                <div className="text-sm text-muted-foreground">Clientes Corporativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default BillingModule;