import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Download,
  Calendar,
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

const GeneralBillingReports: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const { toast } = useToast();

  // Datos de evolución de ingresos
  const revenueEvolution = [
    { mes: 'Ago', ingresos: 142500, facturas: 780, ticketProm: 183 },
    { mes: 'Sep', ingresos: 138900, facturas: 765, ticketProm: 182 },
    { mes: 'Oct', ingresos: 148200, facturas: 820, ticketProm: 181 },
    { mes: 'Nov', ingresos: 152800, facturas: 835, ticketProm: 183 },
    { mes: 'Dic', ingresos: 168500, facturas: 910, ticketProm: 185 },
    { mes: 'Ene', ingresos: 156890, facturas: 847, ticketProm: 185 },
  ];

  // Ventas por centro de costo
  const costCenterData = [
    { centro: 'Alojamiento', valor: 89600, porcentaje: 57.1, facturas: 380 },
    { centro: 'Restaurante', valor: 32450, porcentaje: 20.7, facturas: 245 },
    { centro: 'Bar', valor: 18200, porcentaje: 11.6, facturas: 156 },
    { centro: 'Spa', valor: 12800, porcentaje: 8.2, facturas: 48 },
    { centro: 'Eventos', valor: 3840, porcentaje: 2.4, facturas: 18 },
  ];

  // Métodos de pago
  const paymentMethods = [
    { metodo: 'Tarjeta Crédito', transacciones: 456, monto: 89560, porcentaje: 57.1 },
    { metodo: 'Tarjeta Débito', transacciones: 234, monto: 34780, porcentaje: 22.2 },
    { metodo: 'Efectivo', transacciones: 123, monto: 18950, porcentaje: 12.1 },
    { metodo: 'Transferencia', transacciones: 34, monto: 13600, porcentaje: 8.7 },
  ];

  // Indicadores DIAN
  const dianIndicators = [
    { indicador: 'Facturas Aprobadas', valor: 832, porcentaje: 98.2 },
    { indicador: 'Facturas Rechazadas', valor: 15, porcentaje: 1.8 },
    { indicador: 'Tiempo Respuesta Prom.', valor: '1.2s', porcentaje: 100 },
    { indicador: 'Notas Crédito', valor: 23, porcentaje: 2.7 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleExportPDF = () => {
    const data = costCenterData.map(center => ({
      'Centro de Costo': center.centro,
      'Ingresos': `$${center.valor.toLocaleString()}`,
      'Porcentaje': `${center.porcentaje}%`,
      'Facturas': center.facturas
    }));

    exportToPDF(
      'Reporte General de Facturación',
      data,
      [
        { header: 'Centro de Costo', dataKey: 'Centro de Costo' },
        { header: 'Ingresos', dataKey: 'Ingresos' },
        { header: 'Porcentaje', dataKey: 'Porcentaje' },
        { header: 'Facturas', dataKey: 'Facturas' }
      ],
      [
        { label: 'Ingresos Totales', value: '$156,890' },
        { label: 'Facturas Emitidas', value: '847' },
        { label: 'Ticket Promedio', value: '$185.32' },
        { label: 'Aprobación DIAN', value: '98.2%' }
      ]
    );

    toast({ title: 'Reporte exportado a PDF', description: 'El archivo ha sido descargado exitosamente' });
  };

  const handleExportExcel = () => {
    const data = costCenterData.map(center => ({
      'Centro de Costo': center.centro,
      'Ingresos': center.valor,
      'Porcentaje': center.porcentaje,
      'Facturas Emitidas': center.facturas,
      'Ticket Promedio': (center.valor / center.facturas).toFixed(2)
    }));

    exportToExcel('Reporte_Facturacion_General', data, 'Facturación');

    toast({ title: 'Reporte exportado a Excel', description: 'El archivo ha sido descargado exitosamente' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filtros y exportación */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte General de Facturación</CardTitle>
          <CardDescription>
            Análisis integral de ingresos y facturación electrónica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Diario</SelectItem>
                <SelectItem value="week">Semanal</SelectItem>
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
                <FileSpreadsheet className="h-4 w-4 mr-2" />
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
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-3xl font-bold text-green-600">$156,890</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% vs período anterior
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Facturas Emitidas</p>
                <p className="text-3xl font-bold text-blue-600">847</p>
                <p className="text-xs text-blue-600">15 anuladas (1.8%)</p>
              </div>
              <FileText className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Promedio</p>
                <p className="text-3xl font-bold text-purple-600">$185.32</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3% vs período anterior
                </p>
              </div>
              <BarChart3 className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprobación DIAN</p>
                <p className="text-3xl font-bold text-orange-600">98.2%</p>
                <p className="text-xs text-orange-600">15 rechazadas</p>
              </div>
              <FileText className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evolución de ingresos */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Ingresos - Últimos 6 meses</CardTitle>
          <CardDescription>Tendencia de facturación y ticket promedio</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueEvolution}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="ingresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresos)" name="Ingresos $" />
              <Line yAxisId="right" type="monotone" dataKey="ticketProm" stroke="#3b82f6" name="Ticket Prom. $" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ventas por centro de costo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Centro de Costo</CardTitle>
            <CardDescription>Distribución de ingresos por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={costCenterData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ centro, porcentaje }) => `${centro} ${porcentaje}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="porcentaje"
                >
                  {costCenterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {costCenterData.map((center, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index]}} />
                    {center.centro}
                  </span>
                  <span className="font-medium">${center.valor.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
            <CardDescription>Distribución de transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{method.metodo}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.transacciones} transacciones
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${method.monto.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{method.porcentaje}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${method.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores DIAN */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores de Facturación Electrónica DIAN</CardTitle>
          <CardDescription>Estado de cumplimiento normativo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dianIndicators.map((indicator, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{indicator.valor}</p>
                <p className="text-sm text-muted-foreground mt-1">{indicator.indicador}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle>Insights y Recomendaciones Financieras</CardTitle>
          <CardDescription>Análisis para optimización de ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">✓ Indicadores Positivos</h4>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Crecimiento sostenido de ingresos (+12.5% mensual)</li>
                <li>• Ticket promedio en alza ($185.32, +8.3%)</li>
                <li>• Excelente tasa de aprobación DIAN (98.2%)</li>
                <li>• Alojamiento mantiene liderazgo con 57.1% de ingresos</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠ Oportunidades de Mejora</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Diversificar ingresos: 57% concentrado en alojamiento</li>
                <li>• Aumentar uso de efectivo (solo 12.1%) mediante incentivos</li>
                <li>• Reducir tasa de anulación de facturas (1.8%)</li>
                <li>• Potenciar ventas de Spa (8.2% actual) y Eventos (2.4%)</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Acciones Estratégicas</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Crear paquetes integrados (habitación + spa + restaurante) para aumentar ticket promedio</li>
                <li>• Implementar programa de cashback para pagos con efectivo (reducir comisiones bancarias)</li>
                <li>• Revisar proceso de facturación para eliminar causas de rechazo DIAN</li>
                <li>• Desarrollar estrategia comercial para área de eventos (alto margen, baja participación)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GeneralBillingReports;
