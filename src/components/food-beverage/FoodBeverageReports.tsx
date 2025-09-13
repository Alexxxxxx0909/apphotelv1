import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Package,
  Users,
  Clock
} from 'lucide-react';

interface SalesReport {
  periodo: string;
  restaurante: number;
  bar: number;
  cafeteria: number;
  roomService: number;
  total: number;
}

interface ProductReport {
  id: string;
  nombre: string;
  categoria: string;
  vendidos: number;
  ingresos: number;
  margen: number;
}

interface WasteReport {
  id: string;
  producto: string;
  cantidad: number;
  valor: number;
  motivo: string;
  fecha: Date;
}

const FoodBeverageReports: React.FC = () => {
  const [reportType, setReportType] = useState('ventas');
  const [dateRange, setDateRange] = useState('hoy');
  const [selectedArea, setSelectedArea] = useState('todas');

  // Mock data
  const salesData: SalesReport[] = [
    {
      periodo: 'Hoy',
      restaurante: 850000,
      bar: 320000,
      cafeteria: 180000,
      roomService: 150000,
      total: 1500000
    },
    {
      periodo: 'Ayer',
      restaurante: 920000,
      bar: 280000,
      cafeteria: 160000,
      roomService: 140000,
      total: 1500000
    },
    {
      periodo: 'Esta Semana',
      restaurante: 6500000,
      bar: 2100000,
      cafeteria: 1200000,
      roomService: 900000,
      total: 10700000
    }
  ];

  const topProducts: ProductReport[] = [
    {
      id: '1',
      nombre: 'Filete Premium',
      categoria: 'Carnes',
      vendidos: 25,
      ingresos: 1125000,
      margen: 65
    },
    {
      id: '2',
      nombre: 'Mojito Clásico',
      categoria: 'Cócteles',
      vendidos: 45,
      ingresos: 675000,
      margen: 75
    },
    {
      id: '3',
      nombre: 'Salmón Grillado',
      categoria: 'Pescados',
      vendidos: 18,
      ingresos: 720000,
      margen: 60
    },
    {
      id: '4',
      nombre: 'Tiramisú',
      categoria: 'Postres',
      vendidos: 32,
      ingresos: 480000,
      margen: 80
    }
  ];

  const wasteData: WasteReport[] = [
    {
      id: '1',
      producto: 'Filete de Res',
      cantidad: 2,
      valor: 70000,
      motivo: 'Vencimiento',
      fecha: new Date()
    },
    {
      id: '2',
      producto: 'Vegetales Frescos',
      cantidad: 5,
      valor: 25000,
      motivo: 'Deterioro',
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(salesData[0].restaurante)}
                </div>
                <div className="text-sm text-muted-foreground">Restaurante</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(salesData[0].bar)}
                </div>
                <div className="text-sm text-muted-foreground">Bar</div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(salesData[0].cafeteria)}
                </div>
                <div className="text-sm text-muted-foreground">Cafetería</div>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(salesData[0].roomService)}
                </div>
                <div className="text-sm text-muted-foreground">Room Service</div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparativo de Ventas</CardTitle>
          <CardDescription>Ventas por periodo y punto de venta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="font-medium">{data.periodo}</div>
                <div className="flex gap-6 text-sm">
                  <div>Restaurante: {formatCurrency(data.restaurante)}</div>
                  <div>Bar: {formatCurrency(data.bar)}</div>
                  <div>Cafetería: {formatCurrency(data.cafeteria)}</div>
                  <div>Room Service: {formatCurrency(data.roomService)}</div>
                  <div className="font-bold">Total: {formatCurrency(data.total)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductsReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
          <CardDescription>Ranking de productos por ventas e ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{product.nombre}</div>
                    <div className="text-sm text-muted-foreground">{product.categoria}</div>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{product.vendidos}</div>
                    <div className="text-muted-foreground">Vendidos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{formatCurrency(product.ingresos)}</div>
                    <div className="text-muted-foreground">Ingresos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{product.margen}%</div>
                    <div className="text-muted-foreground">Margen</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">127</div>
            <div className="text-sm text-muted-foreground">Items Vendidos Hoy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{formatCurrency(3250000)}</div>
            <div className="text-sm text-muted-foreground">Ingresos Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">68%</div>
            <div className="text-sm text-muted-foreground">Margen Promedio</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderWasteReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pérdidas y Mermas</CardTitle>
          <CardDescription>Productos desperdiciados o en mal estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wasteData.map((waste) => (
              <div key={waste.id} className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                <div>
                  <div className="font-medium">{waste.producto}</div>
                  <div className="text-sm text-muted-foreground">
                    {waste.fecha.toLocaleDateString('es-CO')} - {waste.motivo}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-600">{formatCurrency(waste.valor)}</div>
                  <div className="text-sm text-muted-foreground">Cantidad: {waste.cantidad}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{formatCurrency(95000)}</div>
            <div className="text-sm text-muted-foreground">Pérdidas Hoy</div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{formatCurrency(650000)}</div>
            <div className="text-sm text-muted-foreground">Pérdidas Este Mes</div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">2.8%</div>
            <div className="text-sm text-muted-foreground">% de Merma</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (reportType) {
      case 'ventas':
        return renderSalesReport();
      case 'productos':
        return renderProductsReport();
      case 'perdidas':
        return renderWasteReport();
      default:
        return renderSalesReport();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ventas">Ventas por Punto</SelectItem>
              <SelectItem value="productos">Productos Más Vendidos</SelectItem>
              <SelectItem value="perdidas">Pérdidas y Mermas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="ayer">Ayer</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mes</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las Áreas</SelectItem>
              <SelectItem value="restaurante">Restaurante</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="cafeteria">Cafetería</SelectItem>
              <SelectItem value="room-service">Room Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Gráficos
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(1500000)}</div>
              <div className="text-sm text-muted-foreground">Ventas Totales Hoy</div>
              <div className="text-xs text-green-600 mt-1">↗ +12% vs ayer</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-muted-foreground">Órdenes Completadas</div>
              <div className="text-xs text-green-600 mt-1">↗ +8% vs ayer</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(11800)}</div>
              <div className="text-sm text-muted-foreground">Ticket Promedio</div>
              <div className="text-xs text-green-600 mt-1">↗ +3% vs ayer</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">68%</div>
              <div className="text-sm text-muted-foreground">Margen de Ganancia</div>
              <div className="text-xs text-green-600 mt-1">↗ +2% vs ayer</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default FoodBeverageReports;