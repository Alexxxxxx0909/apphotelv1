import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  Building,
  Activity,
  FileText,
  Mail,
  Filter,
  Search,
  PieChart,
  LineChart,
  Trophy,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ReportData {
  id: string;
  titulo: string;
  tipo: 'global' | 'comparativo' | 'usuarios';
  fechaGeneracion: Date;
  periodo: string;
  datos: any;
}

const AdminReportsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('globales');
  const [selectedPeriod, setSelectedPeriod] = useState('mes-actual');
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  
  // Mock data - En producción esto vendría de la base de datos
  const globalStats = {
    totalIngresos: 15750000,
    totalReservas: 1250,
    reservasCanceladas: 85,
    ocupacionPromedio: 78.5,
    crecimientoMensual: 12.3,
    hotelesTotales: 12,
    usuariosActivos: 156
  };

  const hoteles = [
    { id: '1', nombre: 'Hotel Bella Vista', ciudad: 'Cartagena' },
    { id: '2', nombre: 'Hotel Plaza Premium', ciudad: 'Medellín' },
    { id: '3', nombre: 'Hotel Costa Dorada', ciudad: 'Santa Marta' },
    { id: '4', nombre: 'Hotel Centro Ejecutivo', ciudad: 'Bogotá' }
  ];

  const hotelComparison = [
    {
      id: '1',
      hotel: 'Hotel Bella Vista',
      ciudad: 'Cartagena',
      ingresos: 4250000,
      reservas: 320,
      ocupacion: 85.2,
      calificacion: 4.8,
      ranking: 1
    },
    {
      id: '2',
      hotel: 'Hotel Plaza Premium',
      ciudad: 'Medellín',
      ingresos: 3890000,
      reservas: 295,
      ocupacion: 82.1,
      calificacion: 4.6,
      ranking: 2
    },
    {
      id: '3',
      hotel: 'Hotel Costa Dorada',
      ciudad: 'Santa Marta',
      ingresos: 3120000,
      reservas: 245,
      ocupacion: 75.8,
      calificacion: 4.4,
      ranking: 3
    },
    {
      id: '4',
      hotel: 'Hotel Centro Ejecutivo',
      ciudad: 'Bogotá',
      ingresos: 4490000,
      reservas: 390,
      ocupacion: 78.9,
      calificacion: 4.7,
      ranking: 2
    }
  ];

  const userStats = [
    { rol: 'Recepcionistas', cantidad: 48, activos: 45, productividad: 92.5 },
    { rol: 'Gerentes', cantidad: 12, activos: 12, productividad: 95.8 },
    { rol: 'Housekeeping', cantidad: 65, activos: 58, productividad: 87.2 },
    { rol: 'Mantenimiento', cantidad: 18, activos: 16, productividad: 88.9 },
    { rol: 'Administradores', cantidad: 8, activos: 8, productividad: 96.2 },
    { rol: 'Customer Service', cantidad: 15, activos: 13, productividad: 89.7 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const getRankingIcon = (ranking: number) => {
    switch (ranking) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 2:
        return <Trophy className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Trophy className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const exportReport = (tipo: string) => {
    // Simulación de exportación
    console.log(`Exportando reporte ${tipo}...`);
  };

  const scheduleReport = () => {
    // Simulación de programación de reportes
    console.log('Programando reporte automático...');
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(globalStats.totalIngresos)}</p>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{globalStats.totalReservas}</p>
                <p className="text-sm text-muted-foreground">Reservas Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{globalStats.ocupacionPromedio}%</p>
                <p className="text-sm text-muted-foreground">Ocupación Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">+{globalStats.crecimientoMensual}%</p>
                <p className="text-sm text-muted-foreground">Crecimiento Mensual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controles de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana-actual">Semana Actual</SelectItem>
                <SelectItem value="mes-actual">Mes Actual</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Año Actual</SelectItem>
                <SelectItem value="personalizado">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avanzados
            </Button>

            <Button variant="outline" onClick={scheduleReport}>
              <Mail className="h-4 w-4 mr-2" />
              Programar Envío
            </Button>

            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Todos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Reports Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="globales">Reportes Globales</TabsTrigger>
          <TabsTrigger value="comparativos">Reportes Comparativos</TabsTrigger>
          <TabsTrigger value="usuarios">Reportes de Usuarios</TabsTrigger>
        </TabsList>

        {/* Global Reports Tab */}
        <TabsContent value="globales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Ingresos por Mes</span>
                </CardTitle>
                <CardDescription>Evolución de ingresos en los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Gráfico de ingresos</p>
                    <p className="text-xs text-muted-foreground">Integración con librerías de gráficos</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => exportReport('ingresos')}>
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Mes actual</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(globalStats.totalIngresos)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Chart Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Ocupación Global</span>
                </CardTitle>
                <CardDescription>Distribución de ocupación por hoteles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Gráfico de ocupación</p>
                    <p className="text-xs text-muted-foreground">Distribución por propiedades</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => exportReport('ocupacion')}>
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Promedio global</p>
                    <p className="text-lg font-bold text-blue-600">{globalStats.ocupacionPromedio}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reservations Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Reservas</CardTitle>
                <CardDescription>Estado de reservas del período seleccionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Reservas Confirmadas</span>
                    </div>
                    <span className="font-bold text-green-700">{globalStats.totalReservas}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span>Reservas Canceladas</span>
                    </div>
                    <span className="font-bold text-red-700">{globalStats.reservasCanceladas}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <span>Tasa de Conversión</span>
                    </div>
                    <span className="font-bold text-blue-700">
                      {((globalStats.totalReservas / (globalStats.totalReservas + globalStats.reservasCanceladas)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => exportReport('reservas')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Reporte Detallado de Reservas
                </Button>
              </CardContent>
            </Card>

            {/* Revenue by Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Rentabilidad por Área</CardTitle>
                <CardDescription>Distribución de ingresos por servicios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { area: 'Habitaciones', porcentaje: 65, monto: 10237500 },
                    { area: 'Alimentos y Bebidas', porcentaje: 20, monto: 3150000 },
                    { area: 'Eventos y Conferencias', porcentaje: 10, monto: 1575000 },
                    { area: 'Servicios Adicionales', porcentaje: 5, monto: 787500 }
                  ].map((item) => (
                    <div key={item.area} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.area}</span>
                        <span className="font-medium">{formatCurrency(item.monto)} ({item.porcentaje}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.porcentaje}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => exportReport('rentabilidad')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Análisis Completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comparative Reports Tab */}
        <TabsContent value="comparativos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Hoteles por Desempeño</CardTitle>
              <CardDescription>Comparativa de hoteles basada en múltiples métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hotelComparison
                  .sort((a, b) => b.ingresos - a.ingresos)
                  .map((hotel, index) => (
                  <div key={hotel.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{hotel.hotel}</h4>
                          <p className="text-sm text-muted-foreground">{hotel.ciudad}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRankingIcon(index + 1)}
                        <Badge variant="outline">{hotel.calificacion} ⭐</Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-xs text-muted-foreground">Ingresos</p>
                        <p className="text-sm font-bold text-green-700">{formatCurrency(hotel.ingresos)}</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-muted-foreground">Reservas</p>
                        <p className="text-sm font-bold text-blue-700">{hotel.reservas}</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="text-xs text-muted-foreground">Ocupación</p>
                        <p className="text-sm font-bold text-purple-700">{hotel.ocupacion}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2 mt-6">
                <Button onClick={() => exportReport('comparativo-hoteles')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Ranking Completo
                </Button>
                <Button variant="outline" onClick={() => exportReport('comparativo-ciudades')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Comparativo por Ciudades
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Reports Tab */}
        <TabsContent value="usuarios" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usuarios por Rol</CardTitle>
                <CardDescription>Distribución y estado de usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.map((stat) => (
                    <div key={stat.rol} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stat.rol}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{stat.activos}/{stat.cantidad}</Badge>
                          <span className="text-sm text-muted-foreground">{stat.productividad}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${stat.productividad > 90 ? 'bg-green-500' : stat.productividad > 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${stat.productividad}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => exportReport('usuarios-productividad')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Reporte de Productividad
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad del Sistema</CardTitle>
                <CardDescription>Sesiones y uso por período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Gráfico de actividad</p>
                    <p className="text-xs text-muted-foreground">Sesiones por hora/día</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-xs text-muted-foreground">Usuarios Activos</p>
                    <p className="text-lg font-bold text-blue-700">{globalStats.usuariosActivos}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-xs text-muted-foreground">Sesiones Hoy</p>
                    <p className="text-lg font-bold text-green-700">284</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => exportReport('actividad-usuarios')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Reporte de Actividad
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReportsModule;