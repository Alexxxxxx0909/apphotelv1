import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Crown,
  Building,
  Users, 
  CreditCard,
  Shield,
  Settings,
  BarChart3,
  Database,
  LogOut,
  Menu,
  X,
  Home,
  UserCheck,
  Globe,
  MessageSquare,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  Server,
  User
} from 'lucide-react';
import CompaniesManagement from '@/components/admin/CompaniesManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import SecurityModule from '@/components/admin/SecurityModule';
import AuditingModule from '@/components/admin/AuditingModule';
import GlobalConfigModule from '@/components/admin/GlobalConfigModule';
import PlanAndLicenseModule from '@/components/admin/PlanAndLicenseModule';
import AdminReportsModule from '@/components/admin/AdminReportsModule';
import SupportCommunicationsModule from '@/components/admin/SupportCommunicationsModule';
import SystemMaintenanceModule from '@/components/admin/SystemMaintenanceModule';
import ProfileModule from '@/components/profile/ProfileModule';

interface AdminMenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const adminMenuItems: AdminMenuItem[] = [
  { 
    id: 'empresas', 
    name: 'Empresas/Hoteles', 
    icon: Building, 
    description: 'Gestión de empresas hoteleras',
    color: 'text-blue-600'
  },
  { 
    id: 'usuarios', 
    name: 'Usuarios del Sistema', 
    icon: Users, 
    description: 'Administración de usuarios',
    color: 'text-green-600'
  },
  { 
    id: 'seguridad', 
    name: 'Seguridad y Accesos', 
    icon: Shield, 
    description: 'Control de roles y permisos',
    color: 'text-red-600'
  },
  { 
    id: 'auditoria', 
    name: 'Monitoreo y Auditoría', 
    icon: Activity, 
    description: 'Logs y actividad del sistema',
    color: 'text-orange-600'
  },
  { 
    id: 'configuracion', 
    name: 'Configuración Global', 
    icon: Settings, 
    description: 'Parametrización del sistema',
    color: 'text-purple-600'
  },
  { 
    id: 'planes', 
    name: 'Planes y Licencias', 
    icon: CreditCard, 
    description: 'Gestión SaaS y facturación',
    color: 'text-indigo-600'
  },
  { 
    id: 'reportes', 
    name: 'Reportes Administrativos', 
    icon: BarChart3, 
    description: 'Reportes y análisis globales',
    color: 'text-cyan-600'
  },
  { 
    id: 'soporte', 
    name: 'Soporte y Comunicaciones', 
    icon: MessageSquare, 
    description: 'Tickets y mensajes globales',
    color: 'text-pink-600'
  },
  { 
    id: 'sistema', 
    name: 'Mantenimiento del Sistema', 
    icon: Server, 
    description: 'Respaldos y actualizaciones',
    color: 'text-amber-600'
  },
];

const AdminDashboard: React.FC = () => {
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
              <Crown className="h-6 w-6 text-yellow-600" />
              <h1 className="text-lg font-semibold text-foreground">
                Panel de Administrador - Sistema Hotelero
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-yellow-600 font-medium">Administrador</p>
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
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-16 bottom-0 bg-white border-r border-border shadow-sm z-40 overflow-hidden"
      >
        <div className="p-4">
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
          
          <nav className="space-y-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={activeModule === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start ${!isSidebarOpen ? 'px-2' : ''}`}
                    onClick={() => setActiveModule(item.id)}
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="ml-2 text-left"
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
                  ? 'Dashboard Administrativo' 
                  : adminMenuItems.find(item => item.id === activeModule)?.name
                }
              </h2>
              <p className="text-muted-foreground">
                {activeModule === 'dashboard' 
                  ? 'Panel de control global del sistema hotelero'
                  : adminMenuItems.find(item => item.id === activeModule)?.description
                }
              </p>
            </div>

            {activeModule === 'dashboard' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Empresas Activas</CardTitle>
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">+2 este mes</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-xs text-muted-foreground">+12 esta semana</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$4,250</div>
                      <p className="text-xs text-muted-foreground">+8% vs mes anterior</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Uptime Sistema</CardTitle>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">99.9%</div>
                      <p className="text-xs text-muted-foreground">Últimos 30 días</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Actividad Reciente</CardTitle>
                      <CardDescription>Últimas acciones en el sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Nuevo hotel registrado</p>
                            <p className="text-xs text-muted-foreground">Hotel Bella Vista - hace 2 horas</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Usuario creado</p>
                            <p className="text-xs text-muted-foreground">Maria González - Gerente - hace 4 horas</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Plan actualizado</p>
                            <p className="text-xs text-muted-foreground">Hotel Plaza Premium - hace 6 horas</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Estado del Sistema</CardTitle>
                      <CardDescription>Monitoreo en tiempo real</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Base de Datos</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Operativo</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>API Services</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Operativo</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Sistema de Pagos</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Operativo</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Respaldos</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Último: hace 1 hora</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Module Content */}
            {activeModule === 'empresas' && <CompaniesManagement />}
            {activeModule === 'usuarios' && <UsersManagement />}
            {activeModule === 'seguridad' && <SecurityModule />}
            {activeModule === 'auditoria' && <AuditingModule />}
            {activeModule === 'configuracion' && <GlobalConfigModule />}
            {activeModule === 'planes' && <PlanAndLicenseModule />}
            {activeModule === 'reportes' && <AdminReportsModule />}
            {activeModule === 'soporte' && <SupportCommunicationsModule />}
            {activeModule === 'sistema' && <SystemMaintenanceModule />}
            {activeModule === 'perfil' && <ProfileModule />}
            
            {/* Module Placeholder for remaining sections */}
            {!['dashboard', 'empresas', 'usuarios', 'seguridad', 'auditoria', 'configuracion', 'planes', 'reportes', 'soporte', 'sistema', 'perfil'].includes(activeModule) && (
              <Card className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                    {adminMenuItems.find(item => item.id === activeModule)?.icon && 
                      React.createElement(adminMenuItems.find(item => item.id === activeModule)!.icon, {
                        className: `w-10 h-10 ${adminMenuItems.find(item => item.id === activeModule)?.color}`
                      })
                    }
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {adminMenuItems.find(item => item.id === activeModule)?.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {adminMenuItems.find(item => item.id === activeModule)?.description}
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

export default AdminDashboard;