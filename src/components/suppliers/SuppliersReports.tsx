import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, DollarSign, TrendingUp, Star, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

const SuppliersReports: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const { toast } = useToast();

  // Gastos por proveedor
  const supplierExpenses = [
    { proveedor: 'Distribuidora Alimentos SA', gastos: 45200, porcentaje: 35.8, facturas: 12 },
    { proveedor: 'Licores Premium Ltda', gastos: 28900, porcentaje: 22.9, facturas: 8 },
    { proveedor: 'Insumos Hoteleros SAS', gastos: 22600, porcentaje: 17.9, facturas: 15 },
    { proveedor: 'Mantenimiento Integral', gastos: 18450, porcentaje: 14.6, facturas: 6 },
    { proveedor: 'Servicios Generales', gastos: 11050, porcentaje: 8.8, facturas: 9 },
  ];

  // Tendencia de gastos
  const expenseTrend = [
    { mes: 'Ago', total: 118500, alimentos: 42000, bebidas: 26800, insumos: 21200, servicios: 28500 },
    { mes: 'Sep', total: 122300, alimentos: 43500, bebidas: 27200, insumos: 22100, servicios: 29500 },
    { mes: 'Oct', total: 119800, alimentos: 41800, bebidas: 28100, insumos: 21900, servicios: 28000 },
    { mes: 'Nov', total: 124600, alimentos: 44200, bebidas: 28500, insumos: 22800, servicios: 29100 },
    { mes: 'Dic', total: 131200, alimentos: 46500, bebidas: 30200, insumos: 24100, servicios: 30400 },
    { mes: 'Ene', total: 126200, alimentos: 45200, bebidas: 28900, insumos: 22600, servicios: 29500 },
  ];

  // Ranking de proveedores
  const supplierRanking = [
    { proveedor: 'Distribuidora Alimentos SA', calificacion: 4.8, puntualidad: 95, calidad: 98, precio: 92 },
    { proveedor: 'Licores Premium Ltda', calificacion: 4.7, puntualidad: 92, calidad: 96, precio: 88 },
    { proveedor: 'Insumos Hoteleros SAS', calificacion: 4.5, puntualidad: 88, calidad: 94, precio: 90 },
    { proveedor: 'Mantenimiento Integral', calificacion: 4.3, puntualidad: 85, calidad: 90, precio: 85 },
  ];

  // Alertas de pagos
  const paymentAlerts = [
    { proveedor: 'Distribuidora Alimentos SA', factura: 'FAC-001', monto: 8500, vencimiento: '2024-01-25', dias: 5, estado: 'próximo' },
    { proveedor: 'Servicios Generales', factura: 'FAC-089', monto: 3200, vencimiento: '2024-01-20', dias: 0, estado: 'vencido' },
    { proveedor: 'Licores Premium Ltda', factura: 'FAC-045', monto: 6700, vencimiento: '2024-01-28', dias: 8, estado: 'próximo' },
  ];

  const handleExportPDF = () => {
    const data = supplierExpenses.map(supplier => ({
      'Proveedor': supplier.proveedor,
      'Gastos': `$${supplier.gastos.toLocaleString()}`,
      'Porcentaje': `${supplier.porcentaje}%`,
      'Facturas': supplier.facturas
    }));

    exportToPDF(
      'Reporte de Proveedores',
      data,
      [
        { header: 'Proveedor', dataKey: 'Proveedor' },
        { header: 'Gastos', dataKey: 'Gastos' },
        { header: 'Porcentaje', dataKey: 'Porcentaje' },
        { header: 'Facturas', dataKey: 'Facturas' }
      ],
      [
        { label: 'Gastos Totales', value: '$126,200' },
        { label: 'Proveedores Activos', value: '15' },
        { label: 'Pagos Pendientes', value: '3' }
      ]
    );

    toast({ title: 'Reporte exportado a PDF', description: 'El archivo ha sido descargado' });
  };

  const handleExportExcel = () => {
    const data = supplierExpenses.map(supplier => ({
      'Proveedor': supplier.proveedor,
      'Gastos': supplier.gastos,
      'Porcentaje': supplier.porcentaje,
      'Facturas': supplier.facturas,
      'Promedio por Factura': (supplier.gastos / supplier.facturas).toFixed(2)
    }));

    exportToExcel('Reporte_Proveedores', data, 'Proveedores');

    toast({ title: 'Reporte exportado a Excel', description: 'El archivo ha sido descargado' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Gerenciales de Proveedores</CardTitle>
          <CardDescription>Análisis de gastos, desempeño y pagos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mensual</SelectItem>
                <SelectItem value="quarter">Trimestral</SelectItem>
                <SelectItem value="year">Anual</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button onClick={handleExportExcel} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gastos Totales</p>
                <p className="text-3xl font-bold text-red-600">$126,200</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  -3.8% vs mes anterior
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Proveedores Activos</p>
                <p className="text-3xl font-bold text-blue-600">15</p>
                <p className="text-xs text-blue-600">50 total registrados</p>
              </div>
              <Star className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Calificación Promedio</p>
                <p className="text-3xl font-bold text-yellow-600">4.6</p>
                <p className="text-xs text-green-600">⭐ Excelente</p>
              </div>
              <Star className="h-10 w-10 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagos Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">3</p>
                <p className="text-xs text-orange-600">1 vencido</p>
              </div>
              <AlertCircle className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gastos por proveedor */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Proveedor - Top 5</CardTitle>
          <CardDescription>Distribución de compras del período</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="proveedor" angle={-15} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="gastos" fill="#3b82f6" name="Gastos $" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tendencia de gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Gastos por Categoría</CardTitle>
          <CardDescription>Evolución últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenseTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="alimentos" stroke="#3b82f6" name="Alimentos" />
              <Line type="monotone" dataKey="bebidas" stroke="#10b981" name="Bebidas" />
              <Line type="monotone" dataKey="insumos" stroke="#f59e0b" name="Insumos" />
              <Line type="monotone" dataKey="servicios" stroke="#ef4444" name="Servicios" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ranking de proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Proveedores por Desempeño</CardTitle>
          <CardDescription>Evaluación de calidad, puntualidad y precio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplierRanking.map((supplier, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-semibold">{supplier.proveedor}</p>
                    <p className="text-sm text-muted-foreground">Calificación General</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-bold text-lg">{supplier.calificacion}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Puntualidad</p>
                    <p className="font-semibold">{supplier.puntualidad}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Calidad</p>
                    <p className="font-semibold">{supplier.calidad}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Precio</p>
                    <p className="font-semibold">{supplier.precio}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas de pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Pagos Pendientes</CardTitle>
          <CardDescription>Facturas próximas a vencer o vencidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentAlerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border ${alert.estado === 'vencido' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{alert.proveedor}</p>
                    <p className="text-sm text-muted-foreground">{alert.factura} - ${alert.monto.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Vencimiento: {alert.vencimiento}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${alert.estado === 'vencido' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {alert.estado === 'vencido' ? 'VENCIDO' : `${alert.dias} días`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Estratégicos</CardTitle>
          <CardDescription>Recomendaciones para optimización de compras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">✓ Puntos Positivos</h4>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Reducción de gastos del 3.8% vs mes anterior</li>
                <li>• Calificación promedio excelente (4.6/5.0)</li>
                <li>• Distribuidora Alimentos SA mantiene alta calificación (4.8)</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠ Áreas de Atención</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Alta dependencia de un solo proveedor (35.8% del gasto)</li>
                <li>• 1 factura vencida requiere atención inmediata</li>
                <li>• Evaluar renegociación con Mantenimiento Integral (calificación 4.3)</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Recomendaciones</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Diversificar proveedores de alimentos para reducir riesgo</li>
                <li>• Implementar sistema de pago automático para evitar vencimientos</li>
                <li>• Negociar descuentos por volumen con top 3 proveedores</li>
                <li>• Realizar auditoría de calidad con proveedores bajo 4.5 de calificación</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersReports;
