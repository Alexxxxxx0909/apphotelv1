import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useReservations } from '@/hooks/useReservations';
import { useRooms } from '@/hooks/useRooms';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Percent, 
  Package, 
  FileText,
  Download,
  Calendar,
  Building,
  CreditCard,
  Star,
  Target,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ShoppingCart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ManagementReportsModule: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const hotelId = user?.hotel;
  const { reservations, loading: reservationsLoading } = useReservations(hotelId);
  const { rooms, loading: roomsLoading } = useRooms(hotelId);
  
  const [period, setPeriod] = useState('mensual');
  const [activeTab, setActiveTab] = useState('resumen');

  // Calcular métricas reales
  const calculateMetrics = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Reservaciones del mes actual
    const currentMonthReservations = reservations.filter(r => 
      r.fechaCreacion >= startOfMonth && r.status !== 'cancelada'
    );
    
    // Reservaciones del mes anterior
    const lastMonthReservations = reservations.filter(r => 
      r.fechaCreacion >= startOfLastMonth && r.fechaCreacion <= endOfLastMonth && r.status !== 'cancelada'
    );

    // Ingresos del mes actual
    const currentMonthRevenue = currentMonthReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    const lastMonthRevenue = lastMonthReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    
    // Estimación de ingresos por consumos basado en reservaciones completadas
    const consumptionRevenue = currentMonthRevenue * 0.15; // Estimación del 15% adicional en consumos

    // Ocupación
    const totalRooms = rooms.length || 1;
    const occupiedRooms = rooms.filter(r => r.estado === 'ocupada').length;
    const occupancyRate = (occupiedRooms / totalRooms) * 100;

    // ADR (Average Daily Rate)
    const completedReservations = currentMonthReservations.filter(r => r.status === 'completada' || r.status === 'confirmada');
    const totalNights = completedReservations.reduce((sum, r) => {
      const nights = Math.ceil((r.checkOut.getTime() - r.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);
    const adr = totalNights > 0 ? currentMonthRevenue / totalNights : 0;

    // RevPAR
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const revpar = (currentMonthRevenue / (totalRooms * daysInMonth));

    // Cálculo de tendencias
    const revenueTrend = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      totalRevenue: currentMonthRevenue + consumptionRevenue,
      accommodationRevenue: currentMonthRevenue,
      consumptionRevenue,
      occupancyRate,
      adr,
      revpar,
      totalReservations: currentMonthReservations.length,
      completedReservations: completedReservations.length,
      revenueTrend,
      totalRooms,
      occupiedRooms,
      availableRooms: rooms.filter(r => r.estado === 'disponible').length,
      maintenanceRooms: rooms.filter(r => r.estado === 'mantenimiento').length
    };
  };

  const metrics = calculateMetrics();

  // Datos para gráficas de evolución mensual
  const monthlyRevenueData = [
    { mes: 'Ene', ingresos: 125000, costos: 45000, utilidad: 80000 },
    { mes: 'Feb', ingresos: 138000, costos: 48000, utilidad: 90000 },
    { mes: 'Mar', ingresos: 152000, costos: 52000, utilidad: 100000 },
    { mes: 'Abr', ingresos: 145000, costos: 50000, utilidad: 95000 },
    { mes: 'May', ingresos: 168000, costos: 55000, utilidad: 113000 },
    { mes: 'Jun', ingresos: 185000, costos: 60000, utilidad: 125000 }
  ];

  // Ocupación semanal
  const weeklyOccupancyData = [
    { dia: 'Lun', ocupacion: 72, adr: 180 },
    { dia: 'Mar', ocupacion: 68, adr: 175 },
    { dia: 'Mie', ocupacion: 75, adr: 185 },
    { dia: 'Jue', ocupacion: 82, adr: 195 },
    { dia: 'Vie', ocupacion: 95, adr: 220 },
    { dia: 'Sab', ocupacion: 98, adr: 245 },
    { dia: 'Dom', ocupacion: 85, adr: 200 }
  ];

  // Distribución de ingresos
  const revenueDistributionData = [
    { name: 'Alojamiento', value: 65, amount: metrics.accommodationRevenue },
    { name: 'Restaurante', value: 18, amount: metrics.consumptionRevenue * 0.6 },
    { name: 'Bar', value: 8, amount: metrics.consumptionRevenue * 0.3 },
    { name: 'Servicios Adicionales', value: 6, amount: metrics.consumptionRevenue * 0.08 },
    { name: 'Otros', value: 3, amount: metrics.consumptionRevenue * 0.02 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Productos/Servicios más vendidos
  const topProductsData = [
    { nombre: 'Suite Premium', categoria: 'Habitación', ventas: 45, ingresos: 157500, margen: 68 },
    { nombre: 'Habitación Doble', categoria: 'Habitación', ventas: 82, ingresos: 123000, margen: 72 },
    { nombre: 'Desayuno Buffet', categoria: 'Restaurante', ventas: 320, ingresos: 28800, margen: 55 },
    { nombre: 'Servicio de Spa', categoria: 'Servicios', ventas: 28, ingresos: 25200, margen: 62 },
    { nombre: 'Room Service', categoria: 'Servicios', ventas: 156, ingresos: 18720, margen: 48 },
    { nombre: 'Cena Gourmet', categoria: 'Restaurante', ventas: 89, ingresos: 15130, margen: 52 },
    { nombre: 'Minibar', categoria: 'Consumos', ventas: 234, ingresos: 11700, margen: 65 },
    { nombre: 'Lavandería', categoria: 'Servicios', ventas: 67, ingresos: 8040, margen: 70 }
  ];

  // Datos de clientes
  const clientSegmentsData = [
    { segmento: 'Corporativo', clientes: 145, ingresos: 185000, ticket: 1276, recurrencia: 3.2 },
    { segmento: 'Turismo Familiar', clientes: 89, ingresos: 125000, ticket: 1404, recurrencia: 1.5 },
    { segmento: 'Parejas', clientes: 156, ingresos: 98000, ticket: 628, recurrencia: 2.1 },
    { segmento: 'Grupos', clientes: 23, ingresos: 78000, ticket: 3391, recurrencia: 1.2 },
    { segmento: 'Negocios Individual', clientes: 198, ingresos: 65000, ticket: 328, recurrencia: 4.5 }
  ];

  // Rentabilidad por tipo de habitación
  const roomTypeProfitability = [
    { tipo: 'Suite Presidencial', tarifa: 450, costo: 120, margen: 73.3, ocupacion: 45, revpar: 148.5 },
    { tipo: 'Suite Premium', tipo_corto: 'Premium', tarifa: 350, costo: 95, margen: 72.9, ocupacion: 68, revpar: 173.4 },
    { tipo: 'Habitación Doble', tipo_corto: 'Doble', tarifa: 180, costo: 45, margen: 75.0, ocupacion: 85, revpar: 114.75 },
    { tipo: 'Habitación Sencilla', tipo_corto: 'Sencilla', tarifa: 120, costo: 30, margen: 75.0, ocupacion: 78, revpar: 70.2 },
    { tipo: 'Habitación Económica', tipo_corto: 'Económica', tarifa: 85, costo: 22, margen: 74.1, ocupacion: 92, revpar: 57.94 }
  ];

  // Análisis de costos
  const costAnalysisData = [
    { categoria: 'Personal', monto: 45000, porcentaje: 32, variacion: 2.5 },
    { categoria: 'Suministros', monto: 28000, porcentaje: 20, variacion: -1.2 },
    { categoria: 'Servicios Públicos', monto: 18000, porcentaje: 13, variacion: 5.8 },
    { categoria: 'Mantenimiento', monto: 12000, porcentaje: 9, variacion: -3.4 },
    { categoria: 'Marketing', monto: 8000, porcentaje: 6, variacion: 15.0 },
    { categoria: 'Amenities', monto: 6500, porcentaje: 5, variacion: 0.5 },
    { categoria: 'Administrativos', monto: 9500, porcentaje: 7, variacion: 1.8 },
    { categoria: 'Otros', monto: 11000, porcentaje: 8, variacion: -2.1 }
  ];

  // Comparativo anual
  const yearlyComparisonData = [
    { mes: 'Ene', actual: 125000, anterior: 110000 },
    { mes: 'Feb', actual: 138000, anterior: 125000 },
    { mes: 'Mar', actual: 152000, anterior: 140000 },
    { mes: 'Abr', actual: 145000, anterior: 138000 },
    { mes: 'May', actual: 168000, anterior: 155000 },
    { mes: 'Jun', actual: 185000, anterior: 165000 }
  ];

  // Canales de venta
  const salesChannelsData = [
    { canal: 'Directo Web', reservas: 245, ingresos: 185000, comision: 0, neto: 185000 },
    { canal: 'Booking.com', reservas: 156, ingresos: 125000, comision: 18750, neto: 106250 },
    { canal: 'Expedia', reservas: 89, ingresos: 78000, comision: 11700, neto: 66300 },
    { canal: 'Teléfono', reservas: 67, ingresos: 58000, comision: 0, neto: 58000 },
    { canal: 'Agencias', reservas: 45, ingresos: 42000, comision: 4200, neto: 37800 }
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte Gerencial', 14, 22);
    doc.setFontSize(11);
    doc.text(`Período: ${period === 'mensual' ? 'Mensual' : period === 'trimestral' ? 'Trimestral' : 'Anual'}`, 14, 32);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 14, 40);

    // KPIs principales
    autoTable(doc, {
      startY: 50,
      head: [['Indicador', 'Valor', 'Tendencia']],
      body: [
        ['Ingresos Totales', `$${metrics.totalRevenue.toLocaleString()}`, `${metrics.revenueTrend >= 0 ? '+' : ''}${metrics.revenueTrend.toFixed(1)}%`],
        ['Ocupación', `${metrics.occupancyRate.toFixed(1)}%`, '-'],
        ['ADR', `$${metrics.adr.toFixed(2)}`, '-'],
        ['RevPAR', `$${metrics.revpar.toFixed(2)}`, '-'],
        ['Total Reservaciones', metrics.totalReservations.toString(), '-']
      ]
    });

    // Productos más vendidos
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Producto/Servicio', 'Categoría', 'Ventas', 'Ingresos', 'Margen']],
      body: topProductsData.map(p => [
        p.nombre,
        p.categoria,
        p.ventas.toString(),
        `$${p.ingresos.toLocaleString()}`,
        `${p.margen}%`
      ])
    });

    doc.save('reporte-gerencial.pdf');
    toast({ title: 'Reporte exportado', description: 'PDF generado exitosamente' });
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Hoja de KPIs
    const kpisData = [
      ['Indicador', 'Valor'],
      ['Ingresos Totales', metrics.totalRevenue],
      ['Ingresos Alojamiento', metrics.accommodationRevenue],
      ['Ingresos Consumos', metrics.consumptionRevenue],
      ['Ocupación %', metrics.occupancyRate],
      ['ADR', metrics.adr],
      ['RevPAR', metrics.revpar],
      ['Total Reservaciones', metrics.totalReservations]
    ];
    const wsKPIs = XLSX.utils.aoa_to_sheet(kpisData);
    XLSX.utils.book_append_sheet(wb, wsKPIs, 'KPIs');

    // Hoja de productos
    const productsSheet = XLSX.utils.json_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(wb, productsSheet, 'Productos');

    // Hoja de segmentos de clientes
    const clientsSheet = XLSX.utils.json_to_sheet(clientSegmentsData);
    XLSX.utils.book_append_sheet(wb, clientsSheet, 'Segmentos Clientes');

    // Hoja de costos
    const costsSheet = XLSX.utils.json_to_sheet(costAnalysisData);
    XLSX.utils.book_append_sheet(wb, costsSheet, 'Análisis Costos');

    XLSX.writeFile(wb, 'reporte-gerencial.xlsx');
    toast({ title: 'Reporte exportado', description: 'Excel generado exitosamente' });
  };

  const isLoading = reservationsLoading || roomsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header con filtros y exportación */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileText className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {metrics.revenueTrend >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${metrics.revenueTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(metrics.revenueTrend).toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ocupación</p>
                <p className="text-2xl font-bold">{metrics.occupancyRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.occupiedRooms} de {metrics.totalRooms} habitaciones
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ADR (Tarifa Promedio)</p>
                <p className="text-2xl font-bold">${metrics.adr.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Por noche ocupada</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RevPAR</p>
                <p className="text-2xl font-bold">${metrics.revpar.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Ingreso por habitación disponible</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Target className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reservaciones</p>
                <p className="text-xl font-bold">{metrics.totalReservations}</p>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Alojamiento</p>
                <p className="text-xl font-bold">${metrics.accommodationRevenue.toLocaleString()}</p>
              </div>
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Consumos</p>
                <p className="text-xl font-bold">${metrics.consumptionRevenue.toLocaleString()}</p>
              </div>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disponibilidad</p>
                <p className="text-xl font-bold">{metrics.availableRooms} hab.</p>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de contenido */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="financiero">Financiero</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="rentabilidad">Rentabilidad</TabsTrigger>
        </TabsList>

        {/* Tab Resumen */}
        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolución de ingresos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Evolución de Ingresos y Utilidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="ingresos" fill="#3b82f6" name="Ingresos" />
                    <Bar dataKey="costos" fill="#ef4444" name="Costos" />
                    <Line type="monotone" dataKey="utilidad" stroke="#10b981" strokeWidth={3} name="Utilidad" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución de ingresos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Ingresos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={revenueDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {revenueDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Ocupación semanal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ocupación y ADR por Día de la Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={weeklyOccupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="ocupacion" fill="#3b82f6" name="Ocupación %" />
                  <Line yAxisId="right" type="monotone" dataKey="adr" stroke="#f59e0b" strokeWidth={2} name="ADR $" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparativo año anterior */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comparativo vs Año Anterior</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={yearlyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Area type="monotone" dataKey="actual" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Año Actual" />
                  <Area type="monotone" dataKey="anterior" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.3} name="Año Anterior" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Financiero */}
        <TabsContent value="financiero" className="space-y-6">
          {/* Análisis de costos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Análisis de Costos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Categoría</th>
                      <th className="text-right p-2">Monto</th>
                      <th className="text-right p-2">% del Total</th>
                      <th className="text-right p-2">Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costAnalysisData.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 font-medium">{item.categoria}</td>
                        <td className="text-right p-2">${item.monto.toLocaleString()}</td>
                        <td className="text-right p-2">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${item.porcentaje * 3}%` }}
                              />
                            </div>
                            <span>{item.porcentaje}%</span>
                          </div>
                        </td>
                        <td className="text-right p-2">
                          <Badge variant={item.variacion >= 0 ? 'destructive' : 'default'}>
                            {item.variacion >= 0 ? '+' : ''}{item.variacion}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-muted/50">
                      <td className="p-2">Total Costos</td>
                      <td className="text-right p-2">${costAnalysisData.reduce((s, i) => s + i.monto, 0).toLocaleString()}</td>
                      <td className="text-right p-2">100%</td>
                      <td className="text-right p-2">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Canales de venta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ingresos por Canal de Venta</CardTitle>
              <CardDescription>Análisis de comisiones y rendimiento neto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Canal</th>
                      <th className="text-right p-2">Reservas</th>
                      <th className="text-right p-2">Ingresos Brutos</th>
                      <th className="text-right p-2">Comisiones</th>
                      <th className="text-right p-2">Ingreso Neto</th>
                      <th className="text-right p-2">% Efectividad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesChannelsData.map((channel, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 font-medium">{channel.canal}</td>
                        <td className="text-right p-2">{channel.reservas}</td>
                        <td className="text-right p-2">${channel.ingresos.toLocaleString()}</td>
                        <td className="text-right p-2 text-red-600">
                          -${channel.comision.toLocaleString()}
                        </td>
                        <td className="text-right p-2 font-medium text-green-600">
                          ${channel.neto.toLocaleString()}
                        </td>
                        <td className="text-right p-2">
                          {((channel.neto / channel.ingresos) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-muted/50">
                      <td className="p-2">Total</td>
                      <td className="text-right p-2">{salesChannelsData.reduce((s, c) => s + c.reservas, 0)}</td>
                      <td className="text-right p-2">${salesChannelsData.reduce((s, c) => s + c.ingresos, 0).toLocaleString()}</td>
                      <td className="text-right p-2 text-red-600">-${salesChannelsData.reduce((s, c) => s + c.comision, 0).toLocaleString()}</td>
                      <td className="text-right p-2 text-green-600">${salesChannelsData.reduce((s, c) => s + c.neto, 0).toLocaleString()}</td>
                      <td className="text-right p-2">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Gráfica de costos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribución de Costos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={costAnalysisData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="monto"
                    nameKey="categoria"
                    label={({ categoria, porcentaje }) => `${categoria}: ${porcentaje}%`}
                  >
                    {costAnalysisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </RechartsPie>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Productos */}
        <TabsContent value="productos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos y Servicios Más Vendidos
              </CardTitle>
              <CardDescription>Ranking por ingresos generados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Producto/Servicio</th>
                      <th className="text-left p-2">Categoría</th>
                      <th className="text-right p-2">Ventas</th>
                      <th className="text-right p-2">Ingresos</th>
                      <th className="text-right p-2">Margen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProductsData.map((product, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <Badge variant={idx < 3 ? 'default' : 'outline'}>
                            {idx + 1}
                          </Badge>
                        </td>
                        <td className="p-2 font-medium">{product.nombre}</td>
                        <td className="p-2">
                          <Badge variant="secondary">{product.categoria}</Badge>
                        </td>
                        <td className="text-right p-2">{product.ventas}</td>
                        <td className="text-right p-2 font-medium">${product.ingresos.toLocaleString()}</td>
                        <td className="text-right p-2">
                          <span className={product.margen >= 60 ? 'text-green-600' : product.margen >= 50 ? 'text-amber-600' : 'text-red-600'}>
                            {product.margen}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Gráfica de productos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ingresos por Producto/Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nombre" type="category" width={120} />
                  <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="ingresos" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Clientes */}
        <TabsContent value="clientes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5" />
                Análisis por Segmento de Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Segmento</th>
                      <th className="text-right p-2">Clientes</th>
                      <th className="text-right p-2">Ingresos</th>
                      <th className="text-right p-2">Ticket Promedio</th>
                      <th className="text-right p-2">Recurrencia</th>
                      <th className="text-right p-2">Valor Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientSegmentsData.map((segment, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{segment.segmento}</td>
                        <td className="text-right p-2">{segment.clientes}</td>
                        <td className="text-right p-2">${segment.ingresos.toLocaleString()}</td>
                        <td className="text-right p-2">${segment.ticket.toLocaleString()}</td>
                        <td className="text-right p-2">{segment.recurrencia.toFixed(1)}x</td>
                        <td className="text-right p-2 font-medium text-green-600">
                          ${(segment.ticket * segment.recurrencia).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfica de segmentos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribución de Ingresos por Segmento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={clientSegmentsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="ingresos"
                      nameKey="segmento"
                      label={({ segmento }) => segmento}
                    >
                      {clientSegmentsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ticket promedio por segmento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ticket Promedio por Segmento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientSegmentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segmento" angle={-20} textAnchor="end" height={80} />
                    <YAxis />
                    <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="ticket" fill="#10b981" name="Ticket Promedio" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Indicadores de satisfacción */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-5 w-5" />
                Indicadores de Satisfacción
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">4.7</p>
                  <p className="text-sm text-muted-foreground">Calificación General</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">92%</p>
                  <p className="text-sm text-muted-foreground">Recomendarían</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">78</p>
                  <p className="text-sm text-muted-foreground">NPS Score</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">85%</p>
                  <p className="text-sm text-muted-foreground">Tasa Retorno</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Rentabilidad */}
        <TabsContent value="rentabilidad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Rentabilidad por Tipo de Habitación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Tipo</th>
                      <th className="text-right p-2">Tarifa</th>
                      <th className="text-right p-2">Costo</th>
                      <th className="text-right p-2">Margen</th>
                      <th className="text-right p-2">Ocupación</th>
                      <th className="text-right p-2">RevPAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomTypeProfitability.map((room, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{room.tipo}</td>
                        <td className="text-right p-2">${room.tarifa}</td>
                        <td className="text-right p-2 text-red-600">${room.costo}</td>
                        <td className="text-right p-2">
                          <Badge variant={room.margen >= 75 ? 'default' : room.margen >= 70 ? 'secondary' : 'destructive'}>
                            {room.margen.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="text-right p-2">{room.ocupacion}%</td>
                        <td className="text-right p-2 font-medium text-green-600">${room.revpar.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RevPAR por tipo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">RevPAR por Tipo de Habitación</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roomTypeProfitability}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo_corto" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="revpar" fill="#8b5cf6" name="RevPAR" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Margen vs Ocupación */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Margen vs Ocupación</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={roomTypeProfitability}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo_corto" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="margen" fill="#10b981" name="Margen %" />
                    <Line yAxisId="right" type="monotone" dataKey="ocupacion" stroke="#3b82f6" strokeWidth={2} name="Ocupación %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de rentabilidad */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-base">Resumen de Rentabilidad del Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Ingresos Brutos</p>
                  <p className="text-2xl font-bold">${(185000 + metrics.totalRevenue).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Costos Totales</p>
                  <p className="text-2xl font-bold text-red-600">$138,000</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Utilidad Neta</p>
                  <p className="text-2xl font-bold text-green-600">${(47000 + metrics.totalRevenue * 0.3).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Margen Neto</p>
                  <p className="text-2xl font-bold text-primary">25.4%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights estratégicos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Insights Estratégicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Oportunidades
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Suite Premium con alta demanda - considerar aumento de tarifa</li>
                    <li>• Segmento corporativo muy rentable - fortalecer programa fidelidad</li>
                    <li>• Fines de semana con máxima ocupación</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Áreas de Mejora
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Room Service con margen bajo (48%) - revisar costos</li>
                    <li>• Ocupación entre semana puede mejorar</li>
                    <li>• Costos de servicios públicos aumentaron 5.8%</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" /> Recomendaciones
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Promover reservas directas (menor comisión)</li>
                    <li>• Crear paquetes para parejas (alto ticket)</li>
                    <li>• Optimizar inventario de amenities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ManagementReportsModule;
