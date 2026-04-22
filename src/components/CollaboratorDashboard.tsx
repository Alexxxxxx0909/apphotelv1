import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Users,
  CreditCard,
  Phone,
  Bed,
  Wrench,
  Coffee,
  Building,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Briefcase,
  Home,
  Clock,
  AlertCircle,
  CheckCircle,
  ClipboardList,
} from 'lucide-react';
import ProfileModule from './profile/ProfileModule';
import ReservationsModule from './reservations/ReservationsModule';
import ReceptionModule from './reception/ReceptionModule';
import CustomerServiceModule from './customer-service/CustomerServiceModule';
import BillingModule from './billing/BillingModule';
import HousekeepingModule from './housekeeping/HousekeepingModule';
import MaintenanceModule from './maintenance/MaintenanceModule';
import FoodBeverageModule from './food-beverage/FoodBeverageModule';
import ManagementReportsModule from './reports/ManagementReportsModule';
import { useHotelModules } from '@/hooks/useHotelModules';

interface MenuItem {
  id: string;          // ID interno (= ID asignado al colaborador)
  planModuleId: string; // ID del módulo en el plan del hotel
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const allMenuItems: MenuItem[] = [
  {
    id: 'reservas',
    planModuleId: 'reservas',
    name: 'Reservas',
    icon: Calendar,
    description: 'Gestión de reservas y disponibilidad',
    color: 'text-blue-600',
  },
  {
    id: 'recepcion',
    planModuleId: 'recepcion',
    name: 'Recepción',
    icon: Users,
    description: 'Check-in / Check-out',
    color: 'text-green-600',
  },
  {
    id: 'facturacion',
    planModuleId: 'facturacion',
    name: 'Facturación',
    icon: CreditCard,
    description: 'Cuentas y pagos',
    color: 'text-purple-600',
  },
  {
    id: 'atencion',
    planModuleId: 'atencion_cliente',
    name: 'Atención al Cliente',
    icon: Phone,
    description: 'Solicitudes y servicios',
    color: 'text-orange-600',
  },
  {
    id: 'housekeeping',
    planModuleId: 'housekeeping',
    name: 'Housekeeping',
    icon: Bed,
    description: 'Estado de habitaciones',
    color: 'text-pink-600',
  },
  {
    id: 'mantenimiento',
    planModuleId: 'mantenimiento',
    name: 'Mantenimiento',
    icon: Wrench,
    description: 'Órdenes de trabajo',
    color: 'text-red-600',
  },
  {
    id: 'alimentos',
    planModuleId: 'food_beverage',
    name: 'Alimentos y Bebidas',
    icon: Coffee,
    description: 'Restaurante y bar',
    color: 'text-amber-600',
  },
  {
    id: 'reportes',
    planModuleId: 'reportes',
    name: 'Reportes',
    icon: BarChart3,
    description: 'Indicadores y análisis',
    color: 'text-indigo-600',
  },
];

const CollaboratorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    isModuleAllowed,
    loading: modulesLoading,
    isLicenseValid,
    getDaysUntilExpiration,
  } = useHotelModules();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Permisos asignados por el gerente al colaborador
  const userPermissions = user?.permissions || [];

  // Filtrar: el módulo debe estar asignado al colaborador Y permitido por el plan del hotel
  const menuItems = allMenuItems.filter(
    (item) =>
      userPermissions.includes(item.id) && isModuleAllowed(item.planModuleId)
  );

  const sidebarVariants = {
    open: { width: '280px', opacity: 1 },
    closed: { width: '60px', opacity: 0.9 },
  };

  const contentVariants = {
    open: { marginLeft: '280px' },
    closed: { marginLeft: '60px' },
  };

  const taskSummary = { pending: 8, inProgress: 3, completed: 15 };

  const recentTasks = [
    { id: 1, description: 'Check-in Habitación 205', time: '10:30 AM', status: 'pending' },
    { id: 2, description: 'Limpieza Habitación 301', time: '11:00 AM', status: 'in-progress' },
    { id: 3, description: 'Revisar aire acondicionado 102', time: '2:00 PM', status: 'pending' },
    { id: 4, description: 'Solicitud toallas extra 204', time: '3:15 PM', status: 'completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'in-progress': return Clock;
      case 'completed': return CheckCircle;
      default: return ClipboardList;
    }
  };

  const renderActiveModule = () => {
    if (activeModule === 'perfil') return <ProfileModule />;

    if (activeModule === 'dashboard') {
      return (
        <>
          {/* Resumen de tareas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{taskSummary.pending}</div>
                <p className="text-xs text-muted-foreground">Por completar hoy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{taskSummary.inProgress}</div>
                <p className="text-xs text-muted-foreground">Tareas activas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{taskSummary.completed}</div>
                <p className="text-xs text-muted-foreground">¡Buen trabajo!</p>
              </CardContent>
            </Card>
          </div>

          {/* Módulos disponibles como accesos directos */}
          {menuItems.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Mis Módulos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setActiveModule(item.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tareas recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Tareas Recientes</CardTitle>
              <CardDescription>Tus últimas actividades y tareas asignadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => {
                  const StatusIcon = getStatusIcon(task.status);
                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{task.description}</p>
                          <p className="text-xs text-muted-foreground">{task.time}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'pending' && 'Pendiente'}
                        {task.status === 'in-progress' && 'En progreso'}
                        {task.status === 'completed' && 'Completado'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      );
    }

    // Verificar permiso antes de renderizar módulo
    const item = menuItems.find((m) => m.id === activeModule);
    if (!item) {
      return (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No tienes acceso a este módulo.</p>
        </Card>
      );
    }

    switch (activeModule) {
      case 'reservas': return <ReservationsModule />;
      case 'recepcion': return <ReceptionModule />;
      case 'atencion': return <CustomerServiceModule />;
      case 'facturacion': return <BillingModule />;
      case 'housekeeping': return <HousekeepingModule />;
      case 'mantenimiento': return <MaintenanceModule />;
      case 'alimentos': return <FoodBeverageModule />;
      case 'reportes': return <ManagementReportsModule />;
      default:
        return (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Módulo en desarrollo.</p>
          </Card>
        );
    }
  };

  const currentItem = menuItems.find((m) => m.id === activeModule);

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
              <Briefcase className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-semibold text-foreground">
                Panel de Colaborador
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-blue-600 font-medium">Colaborador</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveModule('perfil')}>
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <motion.aside
        initial="open"
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                  Inicio
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {modulesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : menuItems.length === 0 ? (
            isSidebarOpen && (
              <p className="text-xs text-muted-foreground text-center px-2 py-4">
                No tienes módulos asignados. Contacta a tu gerente.
              </p>
            )
          ) : (
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
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial="open"
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={contentVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                  ? `Bienvenido, ${user?.name}`
                  : activeModule === 'perfil'
                    ? 'Mi Perfil'
                    : currentItem?.name}
              </h2>
              <p className="text-muted-foreground">
                {activeModule === 'dashboard'
                  ? 'Tus tareas y actividades del día'
                  : activeModule === 'perfil'
                    ? 'Gestiona tu información personal'
                    : currentItem?.description}
              </p>
            </div>

            {/* Alertas de licencia */}
            {!isLicenseValid() && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                <div className="flex items-center space-x-3">
                  <X className="h-6 w-6 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800">Licencia Vencida</h3>
                    <p className="text-sm text-red-700">
                      La licencia del hotel ha expirado. Los módulos están bloqueados hasta que se renueve el plan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isLicenseValid() && getDaysUntilExpiration() <= 30 && (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-800">Licencia Por Vencer</h3>
                    <p className="text-sm text-yellow-700">
                      La licencia del hotel vencerá en {getDaysUntilExpiration()} días.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {modulesLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando módulos...</p>
                </div>
              </div>
            ) : (
              renderActiveModule()
            )}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default CollaboratorDashboard;
