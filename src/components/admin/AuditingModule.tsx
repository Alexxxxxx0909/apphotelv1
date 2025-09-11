import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Activity, 
  BarChart3, 
  Clock, 
  Users, 
  AlertTriangle,
  FileText,
  Download,
  TrendingUp,
  Database,
  Monitor,
  Bell,
  Calendar,
  Search,
  Plus
} from 'lucide-react';
import UserActivityLog from './UserActivityLog';

const AuditingModule: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedModule, setSelectedModule] = useState('all');

  const systemMetrics = [
    {
      title: 'Operaciones Totales',
      value: '15,847',
      change: '+12%',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      title: 'Usuarios Activos',
      value: '156',
      change: '+8%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Tiempo Promedio Sesión',
      value: '24m',
      change: '+3%',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Errores del Sistema',
      value: '12',
      change: '-15%',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  const moduleUsage = [
    { module: 'Reservas', operations: 3245, users: 45, avgTime: '18m', errors: 2 },
    { module: 'Recepción', operations: 2856, users: 32, avgTime: '22m', errors: 1 },
    { module: 'Facturación', operations: 1967, users: 28, avgTime: '15m', errors: 3 },
    { module: 'Housekeeping', operations: 1534, users: 38, avgTime: '12m', errors: 1 },
    { module: 'Mantenimiento', operations: 892, users: 15, avgTime: '25m', errors: 2 },
    { module: 'Reportes', operations: 756, users: 22, avgTime: '8m', errors: 1 }
  ];

  const criticalActions = [
    {
      id: 1,
      action: 'Eliminación de reserva',
      user: 'Carlos Rodríguez',
      hotel: 'Hotel Bella Vista',
      timestamp: '2024-01-15 14:30:00',
      details: 'Reserva #12345 eliminada permanentemente',
      severity: 'high'
    },
    {
      id: 2,
      action: 'Cambio de rol de usuario',
      user: 'Ana Martínez',
      hotel: 'Sistema',
      timestamp: '2024-01-15 11:15:00',
      details: 'Usuario María González promovido a Gerente',
      severity: 'medium'
    },
    {
      id: 3,
      action: 'Modificación de tarifa',
      user: 'Luis García',
      hotel: 'Resort Paradise',
      timestamp: '2024-01-15 09:45:00',
      details: 'Tarifa habitación Deluxe modificada de $150 a $180',
      severity: 'medium'
    },
    {
      id: 4,
      action: 'Factura anulada',
      user: 'Carmen López',
      hotel: 'Hotel Plaza',
      timestamp: '2024-01-14 16:20:00',
      details: 'Factura #F-2024-001567 anulada por error en datos',
      severity: 'high'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'Acceso no autorizado',
      description: 'Múltiples intentos fallidos desde IP 192.168.1.200',
      timestamp: '2024-01-15 15:45:00',
      status: 'active',
      severity: 'high'
    },
    {
      id: 2,
      type: 'Usuario inactivo',
      description: 'Usuario María González sin actividad por 30 días',
      timestamp: '2024-01-15 10:30:00',
      status: 'pending',
      severity: 'low'
    },
    {
      id: 3,
      type: 'Cambio de configuración',
      description: 'Modificación en políticas de contraseña',
      timestamp: '2024-01-15 08:15:00',
      status: 'resolved',
      severity: 'medium'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Monitoreo y Auditoría</h3>
        <p className="text-muted-foreground">Vigilancia del uso del sistema y trazabilidad completa</p>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
          <TabsTrigger value="activity">Logs de Actividad</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="reports">Reportes de Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-medium">Panel de Monitoreo</h4>
            <div className="flex space-x-2">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {systemMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className="text-sm text-green-600">{metric.change}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${metric.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Uso por Módulo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estadísticas por Módulo</CardTitle>
              <CardDescription>Uso detallado de cada módulo del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleUsage.map((module) => (
                  <div key={module.module} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{module.module}</h4>
                      <Badge variant="outline">{module.users} usuarios</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Operaciones: </span>
                        <span className="font-medium">{module.operations.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tiempo promedio: </span>
                        <span className="font-medium">{module.avgTime}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Errores: </span>
                        <span className={`font-medium ${module.errors > 2 ? 'text-red-600' : 'text-green-600'}`}>
                          {module.errors}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-medium">Logs de Actividad</h4>
              <p className="text-sm text-muted-foreground">Registro detallado de todas las acciones del sistema</p>
            </div>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los módulos</SelectItem>
                <SelectItem value="reservas">Reservas</SelectItem>
                <SelectItem value="recepcion">Recepción</SelectItem>
                <SelectItem value="facturacion">Facturación</SelectItem>
                <SelectItem value="housekeeping">Housekeeping</SelectItem>
                <SelectItem value="usuario">Gestión de usuarios</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Acciones Críticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acciones Críticas Recientes</CardTitle>
              <CardDescription>Operaciones que requieren auditoría especial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalActions.map((action) => (
                  <div key={action.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{action.action}</h4>
                      <Badge variant={action.severity === 'high' ? 'destructive' : 'default'}>
                        {action.severity === 'high' ? 'Crítico' : 'Medio'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Usuario: </span>
                        <span className="font-medium">{action.user}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hotel: </span>
                        <span className="font-medium">{action.hotel}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fecha: </span>
                        <span className="font-medium">{action.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{action.details}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Log Completo */}
          <UserActivityLog showAllUsers={true} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-medium">Alertas y Notificaciones</h4>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Configurar Alertas
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Alerta
              </Button>
            </div>
          </div>

          {/* Estado de Alertas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Alertas Activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Resueltas Hoy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alertas del Sistema</CardTitle>
              <CardDescription>Eventos automáticos detectados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{alert.type}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          alert.status === 'active' ? 'destructive' :
                          alert.status === 'pending' ? 'default' : 'secondary'
                        }>
                          {alert.status === 'active' ? 'Activa' :
                           alert.status === 'pending' ? 'Pendiente' : 'Resuelta'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Ver Detalle
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-medium">Reportes de Auditoría</h4>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
          </div>

          {/* Tipos de Reportes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reportes de Acceso</CardTitle>
                <CardDescription>Análisis de accesos por usuario y hotel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reporte de accesos por usuario</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reporte de accesos por hotel</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Excel
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Análisis de horarios de acceso</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reportes de Modificaciones</CardTitle>
                <CardDescription>Trazabilidad de cambios críticos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modificaciones críticas</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cambios de configuración</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Excel
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Historial de eliminaciones</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Programación de Reportes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reportes Programados</CardTitle>
              <CardDescription>Genera reportes automáticos para cumplimiento normativo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">Reporte Mensual de Auditoría</h4>
                    <p className="text-sm text-muted-foreground">Enviado cada primer día del mes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Activo</Badge>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">Reporte Semanal de Accesos</h4>
                    <p className="text-sm text-muted-foreground">Enviado cada lunes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Activo</Badge>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </div>
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Programar Nuevo Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditingModule;