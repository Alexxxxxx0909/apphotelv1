import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  DollarSign,
  Crown,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Building
} from 'lucide-react';

interface Plan {
  id: string;
  nombre: string;
  tipo: 'basico' | 'estandar' | 'premium';
  precio: number;
  periodicidad: 'mensual' | 'anual';
  limites: {
    usuarios: number;
    hoteles: number;
    transacciones: number;
    modulosHabilitados: string[];
  };
  fechaCreacion: Date;
  estado: 'activo' | 'inactivo';
}

interface Licencia {
  id: string;
  empresaId: string;
  empresaNombre: string;
  planId: string;
  planNombre: string;
  fechaInicio: Date;
  fechaVencimiento: Date;
  estado: 'activa' | 'vencida' | 'suspendida' | 'renovacion_pendiente';
  renovacionAutomatica: boolean;
  consumoActual: {
    usuarios: number;
    transacciones: number;
  };
  ultimoPago: Date;
  proximaFacturacion: Date;
}

interface Factura {
  id: string;
  empresaId: string;
  empresaNombre: string;
  planId: string;
  monto: number;
  fecha: Date;
  fechaVencimiento: Date;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
  metodoPago: string;
}

const PlanAndLicenseModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('planes');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogMode, setDialogMode] = useState<'none' | 'create-plan' | 'edit-plan' | 'manage-license' | 'view-billing'>('none');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data - En producción esto vendría de la base de datos
  const planes: Plan[] = [
    {
      id: '1',
      nombre: 'Plan Básico',
      tipo: 'basico',
      precio: 99000,
      periodicidad: 'mensual',
      limites: {
        usuarios: 5,
        hoteles: 1,
        transacciones: 100,
        modulosHabilitados: ['reservas', 'recepcion', 'reportes']
      },
      fechaCreacion: new Date('2024-01-15'),
      estado: 'activo'
    },
    {
      id: '2',
      nombre: 'Plan Estándar',
      tipo: 'estandar',
      precio: 199000,
      periodicidad: 'mensual',
      limites: {
        usuarios: 15,
        hoteles: 3,
        transacciones: 500,
        modulosHabilitados: ['reservas', 'recepcion', 'housekeeping', 'facturacion', 'atencion_cliente', 'reportes']
      },
      fechaCreacion: new Date('2024-01-15'),
      estado: 'activo'
    },
    {
      id: '3',
      nombre: 'Plan Premium',
      tipo: 'premium',
      precio: 399000,
      periodicidad: 'mensual',
      limites: {
        usuarios: 50,
        hoteles: 10,
        transacciones: 2000,
        modulosHabilitados: ['reservas', 'recepcion', 'housekeeping', 'mantenimiento', 'facturacion', 'atencion_cliente', 'food_beverage', 'proveedores', 'reportes']
      },
      fechaCreacion: new Date('2024-01-15'),
      estado: 'activo'
    }
  ];

  const licencias: Licencia[] = [
    {
      id: '1',
      empresaId: '1',
      empresaNombre: 'Hotel Bella Vista',
      planId: '2',
      planNombre: 'Plan Estándar',
      fechaInicio: new Date('2024-01-01'),
      fechaVencimiento: new Date('2024-12-31'),
      estado: 'activa',
      renovacionAutomatica: true,
      consumoActual: {
        usuarios: 8,
        transacciones: 234
      },
      ultimoPago: new Date('2024-11-01'),
      proximaFacturacion: new Date('2024-12-01')
    },
    {
      id: '2',
      empresaId: '2',
      empresaNombre: 'Hotel Plaza Premium',
      planId: '3',
      planNombre: 'Plan Premium',
      fechaInicio: new Date('2024-02-01'),
      fechaVencimiento: new Date('2024-12-15'),
      estado: 'renovacion_pendiente',
      renovacionAutomatica: false,
      consumoActual: {
        usuarios: 32,
        transacciones: 1456
      },
      ultimoPago: new Date('2024-10-15'),
      proximaFacturacion: new Date('2024-12-15')
    }
  ];

  const facturas: Factura[] = [
    {
      id: '1',
      empresaId: '1',
      empresaNombre: 'Hotel Bella Vista',
      planId: '2',
      monto: 199000,
      fecha: new Date('2024-11-01'),
      fechaVencimiento: new Date('2024-11-30'),
      estado: 'pagada',
      metodoPago: 'Tarjeta de Crédito'
    },
    {
      id: '2',
      empresaId: '2',
      empresaNombre: 'Hotel Plaza Premium',
      planId: '3',
      monto: 399000,
      fecha: new Date('2024-11-01'),
      fechaVencimiento: new Date('2024-11-30'),
      estado: 'pendiente',
      metodoPago: 'Transferencia Bancaria'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa':
      case 'activo':
      case 'pagada': 
        return 'bg-green-100 text-green-800';
      case 'vencida':
        return 'bg-red-100 text-red-800';
      case 'suspendida':
        return 'bg-orange-100 text-orange-800';
      case 'renovacion_pendiente':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactivo':
      case 'cancelada':
        return 'bg-gray-100 text-gray-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basico': return 'bg-blue-100 text-blue-800';
      case 'estandar': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{planes.length}</p>
                <p className="text-sm text-muted-foreground">Planes Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{licencias.length}</p>
                <p className="text-sm text-muted-foreground">Licencias Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(facturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.monto, 0))}</p>
                <p className="text-sm text-muted-foreground">Ingresos Este Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{licencias.filter(l => l.estado === 'renovacion_pendiente').length}</p>
                <p className="text-sm text-muted-foreground">Renovaciones Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planes">Gestión de Planes</TabsTrigger>
          <TabsTrigger value="licencias">Gestión de Licencias</TabsTrigger>
          <TabsTrigger value="facturacion">Facturación</TabsTrigger>
          <TabsTrigger value="monitoreo">Monitoreo de Consumo</TabsTrigger>
        </TabsList>

        {/* Planes Tab */}
        <TabsContent value="planes" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Planes de Suscripción</h3>
              <p className="text-muted-foreground">Gestiona los planes disponibles para las empresas</p>
            </div>
            <Button onClick={() => setDialogMode('create-plan')}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planes.map((plan) => (
              <Card key={plan.id} className="relative">
                {plan.tipo === 'premium' && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.nombre}
                    <Badge className={getPlanColor(plan.tipo)}>
                      {plan.tipo.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    <div className="text-2xl font-bold">{formatCurrency(plan.precio)}</div>
                    <div className="text-sm">por {plan.periodicidad}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Usuarios</span>
                      <span className="font-medium">{plan.limites.usuarios}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hoteles</span>
                      <span className="font-medium">{plan.limites.hoteles}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Transacciones/mes</span>
                      <span className="font-medium">{plan.limites.transacciones.toLocaleString()}</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Módulos incluidos:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.limites.modulosHabilitados.map((modulo) => (
                          <Badge key={modulo} variant="outline" className="text-xs">
                            {modulo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedItem(plan);
                          setDialogMode('edit-plan');
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Licencias Tab */}
        <TabsContent value="licencias" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Gestión de Licencias</h3>
              <p className="text-muted-foreground">Administra las licencias de las empresas</p>
            </div>
            <div className="flex space-x-2">
              <Input 
                placeholder="Buscar empresa..."
                className="w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {licencias.map((licencia) => (
                  <div key={licencia.id} className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{licencia.empresaNombre}</h4>
                          <p className="text-sm text-muted-foreground">Plan: {licencia.planNombre}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(licencia.estado)}>
                          {licencia.estado.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {licencia.renovacionAutomatica && (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            Auto-renovación
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Vigencia</p>
                        <p className="text-sm font-medium">
                          {licencia.fechaVencimiento.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Usuarios</p>
                        <p className="text-sm font-medium">
                          {licencia.consumoActual.usuarios} / {planes.find(p => p.id === licencia.planId)?.limites.usuarios}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Transacciones</p>
                        <p className="text-sm font-medium">
                          {licencia.consumoActual.transacciones} / {planes.find(p => p.id === licencia.planId)?.limites.transacciones}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Próximo Pago</p>
                        <p className="text-sm font-medium">
                          {licencia.proximaFacturacion.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedItem(licencia);
                          setDialogMode('manage-license');
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Gestionar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Renovar
                      </Button>
                      {licencia.estado === 'activa' && (
                        <Button variant="outline" size="sm" className="text-orange-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          Suspender
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facturación Tab */}
        <TabsContent value="facturacion" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Facturación de Planes</h3>
              <p className="text-muted-foreground">Historial de pagos y facturación</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Factura
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {facturas.map((factura) => (
                  <div key={factura.id} className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{factura.empresaNombre}</h4>
                          <p className="text-sm text-muted-foreground">
                            Factura #{factura.id} - {formatCurrency(factura.monto)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(factura.estado)}>
                          {factura.estado.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Fecha Emisión</p>
                        <p className="text-sm font-medium">{factura.fecha.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vencimiento</p>
                        <p className="text-sm font-medium">{factura.fechaVencimiento.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Método de Pago</p>
                        <p className="text-sm font-medium">{factura.metodoPago}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Estado</p>
                        <div className="flex items-center space-x-1">
                          {factura.estado === 'pagada' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : factura.estado === 'vencida' ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="text-sm">{factura.estado}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                      {factura.estado === 'pendiente' && (
                        <Button variant="outline" size="sm">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Registrar Pago
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoreo Tab */}
        <TabsContent value="monitoreo" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Monitoreo de Consumo</h3>
            <p className="text-muted-foreground">Control de uso por empresa y alertas de límites</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {licencias.map((licencia) => {
              const plan = planes.find(p => p.id === licencia.planId);
              if (!plan) return null;

              const usuariosPercentage = calculateUsagePercentage(licencia.consumoActual.usuarios, plan.limites.usuarios);
              const transaccionesPercentage = calculateUsagePercentage(licencia.consumoActual.transacciones, plan.limites.transacciones);

              return (
                <Card key={licencia.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{licencia.empresaNombre}</CardTitle>
                    <CardDescription>{plan.nombre}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Usuarios</span>
                        <span>{licencia.consumoActual.usuarios} / {plan.limites.usuarios}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${usuariosPercentage > 90 ? 'bg-red-500' : usuariosPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${usuariosPercentage}%` }}
                        ></div>
                      </div>
                      {usuariosPercentage > 90 && (
                        <p className="text-xs text-red-600 mt-1">⚠️ Límite próximo a superarse</p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Transacciones</span>
                        <span>{licencia.consumoActual.transacciones} / {plan.limites.transacciones}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${transaccionesPercentage > 90 ? 'bg-red-500' : transaccionesPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${transaccionesPercentage}%` }}
                        ></div>
                      </div>
                      {transaccionesPercentage > 90 && (
                        <p className="text-xs text-red-600 mt-1">⚠️ Límite próximo a superarse</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(licencia.estado)}>
                        {licencia.estado.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {(usuariosPercentage > 90 || transaccionesPercentage > 90) && (
                        <Button variant="outline" size="sm" className="text-orange-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Enviar Alerta
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for creating/editing plans */}
      <Dialog open={dialogMode !== 'none'} onOpenChange={() => setDialogMode('none')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-plan' && 'Crear Nuevo Plan'}
              {dialogMode === 'edit-plan' && 'Editar Plan'}
              {dialogMode === 'manage-license' && 'Gestionar Licencia'}
              {dialogMode === 'view-billing' && 'Detalles de Facturación'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4">
            <p className="text-muted-foreground">
              Funcionalidad de formularios en desarrollo. 
              Aquí se implementarán los formularios para crear/editar planes, gestionar licencias y configurar facturación.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanAndLicenseModule;