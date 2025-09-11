import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Server,
  Database,
  Shield,
  Download,
  Upload,
  Calendar,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  FileText,
  Archive,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Bell,
  TrendingUp,
  BarChart3,
  Trash2,
  Eye,
  Filter,
  Search,
  Plus,
  Edit
} from 'lucide-react';

interface BackupInfo {
  id: string;
  tipo: 'automatico' | 'manual';
  tamaño: number;
  fechaCreacion: Date;
  estado: 'completado' | 'en_progreso' | 'fallido';
  duracion: number;
  descripcion: string;
}

interface SystemLog {
  id: string;
  nivel: 'info' | 'warning' | 'error' | 'critical';
  categoria: 'sistema' | 'base_datos' | 'api' | 'seguridad' | 'integracion';
  mensaje: string;
  timestamp: Date;
  detalles: string;
  resuelto: boolean;
}

interface SystemMetric {
  nombre: string;
  valor: number;
  unidad: string;
  estado: 'normal' | 'advertencia' | 'critico';
  limite: number;
}

interface MaintenanceWindow {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  tipo: 'programado' | 'emergencia';
  estado: 'programado' | 'activo' | 'completado';
  afecta: string[];
}

interface SystemUpdate {
  id: string;
  version: string;
  tipo: 'funcionalidad' | 'seguridad' | 'bugfix';
  descripcion: string;
  fechaLanzamiento: Date;
  fechaInstalacion?: Date;
  estado: 'disponible' | 'instalado' | 'fallido';
  critica: boolean;
}

const SystemMaintenanceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('backups');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [dialogMode, setDialogMode] = useState<'none' | 'create-backup' | 'schedule-maintenance' | 'install-update' | 'view-logs'>('none');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data - En producción esto vendría del sistema de monitoreo
  const systemMetrics: SystemMetric[] = [
    { nombre: 'CPU', valor: 45, unidad: '%', estado: 'normal', limite: 80 },
    { nombre: 'Memoria RAM', valor: 67, unidad: '%', estado: 'normal', limite: 85 },
    { nombre: 'Disco Duro', valor: 78, unidad: '%', estado: 'advertencia', limite: 90 },
    { nombre: 'Base de Datos', valor: 34, unidad: '%', estado: 'normal', limite: 70 },
    { nombre: 'Ancho de Banda', valor: 23, unidad: 'MB/s', estado: 'normal', limite: 100 },
    { nombre: 'Conexiones Activas', valor: 156, unidad: 'conexiones', estado: 'normal', limite: 1000 }
  ];

  const backups: BackupInfo[] = [
    {
      id: 'BK001',
      tipo: 'automatico',
      tamaño: 2.4,
      fechaCreacion: new Date('2024-11-11 03:00'),
      estado: 'completado',
      duracion: 45,
      descripcion: 'Backup automático completo del sistema'
    },
    {
      id: 'BK002',
      tipo: 'manual',
      tamaño: 2.1,
      fechaCreacion: new Date('2024-11-10 14:30'),
      estado: 'completado',
      duracion: 38,
      descripcion: 'Backup manual antes de actualización'
    },
    {
      id: 'BK003',
      tipo: 'automatico',
      tamaño: 0.0,
      fechaCreacion: new Date('2024-11-09 03:00'),
      estado: 'fallido',
      duracion: 0,
      descripcion: 'Backup automático - Error de espacio en disco'
    }
  ];

  const systemLogs: SystemLog[] = [
    {
      id: 'LOG001',
      nivel: 'error',
      categoria: 'base_datos',
      mensaje: 'Timeout en conexión a base de datos',
      timestamp: new Date('2024-11-11 14:23:45'),
      detalles: 'Connection timeout after 30 seconds on query execution',
      resuelto: false
    },
    {
      id: 'LOG002',
      nivel: 'warning',
      categoria: 'sistema',
      mensaje: 'Alto uso de CPU detectado',
      timestamp: new Date('2024-11-11 13:15:22'),
      detalles: 'CPU usage exceeded 80% for more than 5 minutes',
      resuelto: true
    },
    {
      id: 'LOG003',
      nivel: 'info',
      categoria: 'api',
      mensaje: 'Nuevo usuario registrado exitosamente',
      timestamp: new Date('2024-11-11 12:45:10'),
      detalles: 'User registration completed for Hotel Plaza Premium',
      resuelto: true
    }
  ];

  const maintenanceWindows: MaintenanceWindow[] = [
    {
      id: 'MW001',
      titulo: 'Actualización del sistema de pagos',
      descripcion: 'Mantenimiento programado para actualizar el sistema de procesamiento de pagos',
      fechaInicio: new Date('2024-11-15 02:00'),
      fechaFin: new Date('2024-11-15 06:00'),
      tipo: 'programado',
      estado: 'programado',
      afecta: ['Módulo de Facturación', 'Procesamiento de Pagos']
    }
  ];

  const systemUpdates: SystemUpdate[] = [
    {
      id: 'UPD001',
      version: '2.1.3',
      tipo: 'seguridad',
      descripcion: 'Actualización de seguridad crítica - Parche de vulnerabilidades',
      fechaLanzamiento: new Date('2024-11-10'),
      estado: 'disponible',
      critica: true
    },
    {
      id: 'UPD002',
      version: '2.1.2',
      tipo: 'funcionalidad',
      descripcion: 'Mejoras en el módulo de reservas y nuevas funcionalidades',
      fechaLanzamiento: new Date('2024-10-28'),
      fechaInstalacion: new Date('2024-11-01'),
      estado: 'instalado',
      critica: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado':
      case 'normal':
      case 'instalado':
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'en_progreso':
      case 'advertencia':
      case 'programado':
        return 'bg-yellow-100 text-yellow-800';
      case 'fallido':
      case 'critico':
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'disponible':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatFileSize = (sizeInGB: number) => {
    return `${sizeInGB.toFixed(1)} GB`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const createBackup = () => {
    console.log('Iniciando backup manual...');
  };

  const restoreBackup = (backupId: string) => {
    console.log(`Restaurando backup ${backupId}...`);
  };

  const toggleMaintenanceMode = () => {
    setMaintenanceMode(!maintenanceMode);
    console.log(`Modo mantenimiento ${!maintenanceMode ? 'activado' : 'desactivado'}`);
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{backups.filter(b => b.estado === 'completado').length}</p>
                <p className="text-sm text-muted-foreground">Backups OK</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{systemLogs.filter(l => !l.resuelto && l.nivel === 'error').length}</p>
                <p className="text-sm text-muted-foreground">Errores Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{systemUpdates.filter(u => u.estado === 'disponible' && u.critica).length}</p>
                <p className="text-sm text-muted-foreground">Updates Críticos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Mode Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Control de Modo Mantenimiento</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {maintenanceMode ? 'Activo' : 'Inactivo'}
              </span>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={toggleMaintenanceMode}
              />
            </div>
          </CardTitle>
        </CardHeader>
        {maintenanceMode && (
          <CardContent>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <p className="text-sm font-medium text-orange-800">
                  Sistema en modo mantenimiento. Los usuarios verán un mensaje informativo.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoreo de Infraestructura</CardTitle>
          <CardDescription>Métricas en tiempo real del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemMetrics.map((metric) => (
              <div key={metric.nombre} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.nombre}</span>
                  <Badge className={getStatusColor(metric.estado)}>
                    {metric.valor}{metric.unidad}
                  </Badge>
                </div>
                <Progress 
                  value={metric.unidad === '%' ? metric.valor : (metric.valor / metric.limite) * 100} 
                  className={`h-2 ${
                    metric.estado === 'critico' ? 'bg-red-200' : 
                    metric.estado === 'advertencia' ? 'bg-yellow-200' : 'bg-green-200'
                  }`} 
                />
                {metric.estado !== 'normal' && (
                  <p className="text-xs text-orange-600">
                    ⚠️ {metric.estado === 'advertencia' ? 'Revisar uso' : 'Acción requerida'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="backups">Gestión de Backups</TabsTrigger>
          <TabsTrigger value="logs">Logs y Depuración</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
          <TabsTrigger value="updates">Actualizaciones</TabsTrigger>
        </TabsList>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Gestión de Copias de Seguridad</h3>
              <p className="text-muted-foreground">Administra respaldos automáticos y manuales</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Programar Backup
              </Button>
              <Button onClick={createBackup}>
                <Database className="h-4 w-4 mr-2" />
                Backup Manual
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {backups.map((backup) => (
                  <div key={backup.id} className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Database className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Backup #{backup.id}</h4>
                          <p className="text-sm text-muted-foreground">{backup.descripcion}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                            <span>{backup.fechaCreacion.toLocaleString()}</span>
                            <span>{formatFileSize(backup.tamaño)}</span>
                            <span>{formatDuration(backup.duracion)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={backup.tipo === 'automatico' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
                        >
                          {backup.tipo.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(backup.estado)}>
                          {backup.estado.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      {backup.estado === 'completado' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => restoreBackup(backup.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restaurar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Button>
                        </>
                      )}
                      {backup.estado === 'fallido' && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reintentar
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Logs del Sistema y Depuración</h3>
              <p className="text-muted-foreground">Monitoreo de errores y eventos del sistema</p>
            </div>
            <div className="flex space-x-2">
              <Input placeholder="Buscar en logs..." className="w-64" />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {systemLogs.map((log) => (
                  <div key={log.id} className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getLevelIcon(log.nivel)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{log.mensaje}</h4>
                            {!log.resuelto && log.nivel === 'error' && (
                              <Badge className="bg-red-100 text-red-800">
                                Sin resolver
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{log.detalles}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>{log.timestamp.toLocaleString()}</span>
                            <span>Categoría: {log.categoria.replace('_', ' ')}</span>
                            <span>ID: {log.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(log.nivel)}>
                          {log.nivel.toUpperCase()}
                        </Badge>
                        {log.resuelto && (
                          <div className="flex items-center space-x-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span>Resuelto</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                      {!log.resuelto && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar Resuelto
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Ventanas de Mantenimiento</h3>
              <p className="text-muted-foreground">Programa y gestiona mantenimientos del sistema</p>
            </div>
            <Button onClick={() => setDialogMode('schedule-maintenance')}>
              <Plus className="h-4 w-4 mr-2" />
              Programar Mantenimiento
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {maintenanceWindows.map((maintenance) => (
                  <div key={maintenance.id} className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Settings className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{maintenance.titulo}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{maintenance.descripcion}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>{maintenance.fechaInicio.toLocaleString()} - {maintenance.fechaFin.toLocaleString()}</span>
                            <span>Tipo: {maintenance.tipo}</span>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Afecta a: {maintenance.afecta.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(maintenance.estado)}>
                        {maintenance.estado.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      {maintenance.estado === 'programado' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Iniciar Ahora
                          </Button>
                        </>
                      )}
                      {maintenance.estado === 'activo' && (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-1" />
                          Finalizar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Actualizaciones del Sistema</h3>
              <p className="text-muted-foreground">Gestiona parches de seguridad y nuevas versiones</p>
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Buscar Actualizaciones
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {systemUpdates.map((update) => (
                  <div key={update.id} className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Upload className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">Versión {update.version}</h4>
                            {update.critica && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Crítica
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{update.descripcion}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Lanzado: {update.fechaLanzamiento.toLocaleDateString()}</span>
                            <span>Tipo: {update.tipo}</span>
                            {update.fechaInstalacion && (
                              <span>Instalado: {update.fechaInstalacion.toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(update.estado)}>
                        {update.estado.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      {update.estado === 'disponible' && (
                        <>
                          <Button 
                            variant={update.critica ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedItem(update);
                              setDialogMode('install-update');
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Instalar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </>
                      )}
                      {update.estado === 'instalado' && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Instalado
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for various forms */}
      <Dialog open={dialogMode !== 'none'} onOpenChange={() => setDialogMode('none')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-backup' && 'Crear Backup Manual'}
              {dialogMode === 'schedule-maintenance' && 'Programar Mantenimiento'}
              {dialogMode === 'install-update' && 'Instalar Actualización'}
              {dialogMode === 'view-logs' && 'Detalles del Log'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4">
            <p className="text-muted-foreground">
              Funcionalidad de formularios en desarrollo. 
              Aquí se implementarán los formularios para gestionar backups, programar mantenimiento e instalar actualizaciones.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemMaintenanceModule;