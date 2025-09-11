import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Key, 
  Users, 
  Lock, 
  Smartphone,
  AlertTriangle,
  Settings,
  Clock,
  Eye,
  MapPin,
  Edit,
  Trash2,
  Plus,
  History
} from 'lucide-react';
import UserActivityLog from './UserActivityLog';

const SecurityModule: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passwordComplexity, setPasswordComplexity] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  const activeSessions = [
    {
      user: 'Carlos Rodríguez',
      company: 'Hotel Bella Vista',
      ip: '192.168.1.100',
      device: 'Chrome - Windows',
      lastActivity: '2024-01-15 10:30',
      location: 'Bogotá, Colombia'
    },
    {
      user: 'Ana Martínez',
      company: 'Resort Paradise',
      ip: '192.168.1.101',
      device: 'Safari - macOS',
      lastActivity: '2024-01-15 10:25',
      location: 'Cartagena, Colombia'
    }
  ];

  const securityAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Múltiples intentos de acceso fallidos desde IP 192.168.1.200',
      time: '2024-01-15 09:45',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      message: 'Usuario Carlos Rodríguez habilitó 2FA',
      time: '2024-01-15 08:30',
      severity: 'low'
    },
    {
      id: 3,
      type: 'critical',
      message: 'Intento de acceso desde ubicación no usual - Usuario Ana Martínez',
      time: '2024-01-14 22:15',
      severity: 'high'
    }
  ];

  const roles = [
    {
      name: 'Administrador',
      permissions: ['Acceso total', 'Gestión de usuarios', 'Configuración global'],
      users: 2
    },
    {
      name: 'Gerente',
      permissions: ['Dashboard gerencial', 'Reportes', 'Gestión operativa'],
      users: 8
    },
    {
      name: 'Colaborador',
      permissions: ['Módulos asignados', 'Reportes básicos'],
      users: 25
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Control de Seguridad y Accesos</h3>
        <p className="text-muted-foreground">Configuración de seguridad y monitoreo de accesos</p>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
          <TabsTrigger value="sessions">Sesiones Activas</TabsTrigger>
          <TabsTrigger value="alerts">Alertas de Seguridad</TabsTrigger>
          <TabsTrigger value="activity">Historial de Accesos</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Políticas de Contraseña
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Complejidad requerida</label>
                    <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, mayúsculas, números</p>
                  </div>
                  <Switch checked={passwordComplexity} onCheckedChange={setPasswordComplexity} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Expiración de contraseña</label>
                    <p className="text-xs text-muted-foreground">Cambio obligatorio cada 90 días</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Intentos fallidos</label>
                    <p className="text-xs text-muted-foreground">Bloqueo después de 5 intentos</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Autenticación de Dos Factores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">2FA obligatorio</label>
                    <p className="text-xs text-muted-foreground">Para todos los administradores</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">2FA opcional para gerentes</label>
                    <p className="text-xs text-muted-foreground">Recomendado pero no obligatorio</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Configurar Métodos 2FA
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Enviar Código de Activación
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Gestión de Sesiones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Timeout automático</label>
                    <p className="text-xs text-muted-foreground">Cierre después de 30 min inactividad</p>
                  </div>
                  <Switch checked={sessionTimeout} onCheckedChange={setSessionTimeout} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Sesión única</label>
                    <p className="text-xs text-muted-foreground">Un usuario, una sesión activa</p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Cerrar Todas las Sesiones
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuraciones Avanzadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Restricción por IP</label>
                    <p className="text-xs text-muted-foreground">Limitar acceso por ubicación</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auditoría detallada</label>
                    <p className="text-xs text-muted-foreground">Log completo de acciones</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Configurar Alertas
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Gestionar IPs Permitidas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Gestión de Roles Globales</h3>
              <p className="text-muted-foreground">Configura roles y permisos para toda la plataforma</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Rol
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Roles del Sistema</CardTitle>
              <CardDescription>Gestiona permisos granulares por rol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{role.name}</h4>
                          <p className="text-sm text-muted-foreground">{role.users} usuarios asignados</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Permisos
                        </Button>
                        {role.name !== 'Administrador' && (
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="outline">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuración de Permisos</CardTitle>
              <CardDescription>Define permisos específicos por módulo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Módulos del Sistema</h4>
                  <div className="space-y-2">
                    {['Reservas', 'Recepción', 'Housekeeping', 'Mantenimiento', 'Facturación', 'Reportes'].map((module) => (
                      <div key={module} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{module}</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">Lectura</Badge>
                          <Badge variant="outline" className="text-xs">Escritura</Badge>
                          <Badge variant="outline" className="text-xs">Eliminación</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Acciones Administrativas</h4>
                  <div className="space-y-2">
                    {['Gestión de usuarios', 'Configuración global', 'Respaldos', 'Auditoría', 'Reportes financieros'].map((action) => (
                      <div key={action} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{action}</span>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Control de Sesiones</h3>
              <p className="text-muted-foreground">Monitorea y gestiona sesiones activas en tiempo real</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Filtrar por Ubicación
              </Button>
              <Button variant="destructive">
                Cerrar Todas las Sesiones
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{activeSessions.length}</p>
                    <p className="text-sm text-muted-foreground">Sesiones Activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">24m</p>
                    <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Ubicaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sesiones Detalladas</CardTitle>
              <CardDescription>Lista completa de usuarios conectados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{session.user}</h4>
                          <p className="text-sm text-muted-foreground">{session.company}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Actividad
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Cerrar Sesión
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">IP: </span>
                        {session.ip}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dispositivo: </span>
                        {session.device}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ubicación: </span>
                        {session.location}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Última actividad: </span>
                        {session.lastActivity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Alertas de Seguridad</h3>
              <p className="text-muted-foreground">Monitoreo de eventos y actividades sospechosas</p>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="high">Críticas</SelectItem>
                  <SelectItem value="medium">Medias</SelectItem>
                  <SelectItem value="low">Bajas</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                Configurar Alertas
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Alertas Críticas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Alertas Medias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Alertas Informativas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Eventos Recientes</CardTitle>
              <CardDescription>Actividades de seguridad detectadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          alert.severity === 'high' ? 'bg-red-100' :
                          alert.severity === 'medium' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                          <AlertTriangle className={`h-5 w-5 ${
                            alert.severity === 'high' ? 'text-red-600' :
                            alert.severity === 'medium' ? 'text-orange-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          alert.severity === 'high' ? 'destructive' :
                          alert.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {alert.severity === 'high' ? 'Crítico' :
                           alert.severity === 'medium' ? 'Medio' : 'Bajo'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Investigar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Historial de Accesos</h3>
            <p className="text-muted-foreground">Registro completo de intentos de acceso al sistema</p>
          </div>
          <UserActivityLog showAllUsers={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityModule;