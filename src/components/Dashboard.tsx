import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Hotel, 
  Calendar, 
  Users, 
  CreditCard, 
  Phone, 
  Bed,
  Wrench, 
  Coffee, 
  Calculator, 
  UserCog,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  TrendingUp,
  Clock,
  DollarSign,
  Home,
  Building
} from 'lucide-react';
import MetricsCards from './MetricsCards';
import ReservationsModule from './reservations/ReservationsModule';
import ReceptionModule from './reception/ReceptionModule';
import CustomerServiceModule from './customer-service/CustomerServiceModule';
import BillingModule from './billing/BillingModule';
import HousekeepingModule from './housekeeping/HousekeepingModule';
import MaintenanceModule from './maintenance/MaintenanceModule';
import CollaboratorsModule from './management/CollaboratorsModule';
import HotelManagementModule from './management/HotelManagementModule';
import FoodBeverageModule from './food-beverage/FoodBeverageModule';
import SuppliersModule from './suppliers/SuppliersModule';

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { 
    id: 'colaboradores', 
    name: 'Colaboradores', 
    icon: UserCog, 
    description: 'Gestión de personal y permisos',
    color: 'text-violet-600'
  },
  { 
    id: 'gestion-hotel', 
    name: 'Gestionar Hotel', 
    icon: Building, 
    description: 'Configuración del establecimiento',
    color: 'text-slate-600'
  },
  { 
    id: 'reservas', 
    name: 'Reservas', 
    icon: Calendar, 
    description: 'Gestión de reservas y disponibilidad',
    color: 'text-blue-600'
  },
  { 
    id: 'recepcion', 
    name: 'Recepción', 
    icon: Users, 
    description: 'Check-in / Check-out',
    color: 'text-green-600'
  },
  { 
    id: 'facturacion', 
    name: 'Facturación', 
    icon: CreditCard, 
    description: 'Cuentas y pagos',
    color: 'text-purple-600'
  },
  { 
    id: 'atencion', 
    name: 'Atención al Cliente', 
    icon: Phone, 
    description: 'Solicitudes y servicios',
    color: 'text-orange-600'
  },
  { 
    id: 'housekeeping', 
    name: 'Housekeeping', 
    icon: Bed, 
    description: 'Estado de habitaciones',
    color: 'text-pink-600'
  },
  { 
    id: 'mantenimiento', 
    name: 'Mantenimiento', 
    icon: Wrench, 
    description: 'Órdenes de trabajo',
    color: 'text-red-600'
  },
  { 
    id: 'alimentos', 
    name: 'Alimentos y Bebidas', 
    icon: Coffee, 
    description: 'Restaurante y bar',
    color: 'text-amber-600'
  },
  { 
    id: 'proveedores', 
    name: 'Proveedores', 
    icon: Building, 
    description: 'Gestión de proveedores y compras',
    color: 'text-teal-600'
  },
  { 
    id: 'financiera', 
    name: 'Gestión Financiera', 
    icon: Calculator, 
    description: 'Contabilidad e inventario',
    color: 'text-emerald-600'
  },
  { 
    id: 'rrhh', 
    name: 'Recursos Humanos', 
    icon: UserCog, 
    description: 'Empleados y nómina',
    color: 'text-cyan-600'
  },
  { 
    id: 'reportes', 
    name: 'Reportes Gerenciales', 
    icon: BarChart3, 
    description: 'Indicadores y análisis',
    color: 'text-indigo-600'
  },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');

  const sidebarVariants = {
    open: { width: '280px', opacity: 1 },
    closed: { width: '60px', opacity: 0.9 }
  };

  const contentVariants = {
    open: { marginLeft: '280px' },
    closed: { marginLeft: '60px' }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border h-16 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-muted"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-2">
              <Hotel className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">
                Panel Gerencial - Gestión Hotelera
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-green-600 font-medium">Gerente</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <motion.aside
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-16 bottom-0 bg-white border-r border-border shadow-sm z-40 overflow-y-auto"
      >
        <div className="p-4 pb-20">
          <Button
            variant={activeModule === 'dashboard' ? 'default' : 'ghost'}
            className={`w-full justify-start mb-4 ${!isSidebarOpen ? 'px-2' : ''}`}
            onClick={() => setActiveModule('dashboard')}
          >
            <Home className="h-5 w-5" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2"
                >
                  Dashboard
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={activeModule === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start h-10 ${!isSidebarOpen ? 'px-2' : 'px-3'}`}
                    onClick={() => setActiveModule(item.id)}
                  >
                    <Icon className={`h-4 w-4 ${item.color} flex-shrink-0`} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="ml-2 text-left text-sm font-medium truncate"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={contentVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {activeModule === 'dashboard' 
                  ? 'Dashboard Gerencial' 
                  : menuItems.find(item => item.id === activeModule)?.name
                }
              </h2>
              <p className="text-muted-foreground">
                {activeModule === 'dashboard' 
                  ? 'Resumen ejecutivo y control operativo del hotel'
                  : menuItems.find(item => item.id === activeModule)?.description
                }
              </p>
            </div>

            {activeModule === 'dashboard' && <MetricsCards />}
            {activeModule === 'reservas' && <ReservationsModule />}
            {activeModule === 'recepcion' && <ReceptionModule />}
            {activeModule === 'atencion' && <CustomerServiceModule />}
            {activeModule === 'facturacion' && <BillingModule />}
            {activeModule === 'housekeeping' && <HousekeepingModule />}
            {activeModule === 'mantenimiento' && <MaintenanceModule />}
            {activeModule === 'colaboradores' && <CollaboratorsModule />}
            {activeModule === 'gestion-hotel' && <HotelManagementModule />}
            {activeModule === 'alimentos' && <FoodBeverageModule />}
            {activeModule === 'proveedores' && <SuppliersModule />}
            
            {activeModule !== 'dashboard' && activeModule !== 'reservas' && activeModule !== 'recepcion' && activeModule !== 'atencion' && activeModule !== 'facturacion' && activeModule !== 'housekeeping' && activeModule !== 'mantenimiento' && activeModule !== 'colaboradores' && activeModule !== 'gestion-hotel' && activeModule !== 'alimentos' && activeModule !== 'proveedores' && (
              <Card className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                    {menuItems.find(item => item.id === activeModule)?.icon && 
                      React.createElement(menuItems.find(item => item.id === activeModule)!.icon, {
                        className: `w-10 h-10 ${menuItems.find(item => item.id === activeModule)?.color}`
                      })
                    }
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {menuItems.find(item => item.id === activeModule)?.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {menuItems.find(item => item.id === activeModule)?.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Módulo en desarrollo. Funcionalidad completa disponible próximamente.
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;