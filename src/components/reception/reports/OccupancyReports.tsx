import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Download,
  BarChart3,
  FileText
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

const OccupancyReports: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const { toast } = useToast();

  // Datos de tendencia histórica
  const trendData = [
    { date: 'Ene 1', ocupacion: 78, adr: 142, revpar: 111 },
    { date: 'Ene 5', ocupacion: 82, adr: 145, revpar: 119 },
    { date: 'Ene 10', ocupacion: 85, adr: 148, revpar: 126 },
    { date: 'Ene 15', ocupacion: 92, adr: 155, revpar: 143 },
    { date: 'Ene 20', ocupacion: 88, adr: 148, revpar: 130 },
    { date: 'Ene 25', ocupacion: 85, adr: 145, revpar: 123 },
    { date: 'Ene 30', ocupacion: 90, adr: 152, revpar: 137 },
  ];

  // Datos por tipo de habitación
  const roomTypeData = [
    { tipo: 'Individual', ocupadas: 14, total: 15, tarifa: 95, ingresos: 1330, ocupacionPct: 93.3 },
    { tipo: 'Doble', ocupadas: 38, total: 45, tarifa: 145, ingresos: 5510, ocupacionPct: 84.4 },
    { tipo: 'Suite', ocupadas: 16, total: 20, tarifa: 220, ingresos: 3520, ocupacionPct: 80.0 },
  ];

  // Datos comparativos mensuales
  const monthlyComparison = [
    { mes: 'Sep', ocupacion: 82, adr: 138, revpar: 113 },
    { mes: 'Oct', ocupacion: 84, adr: 140, revpar: 118 },
    { mes: 'Nov', ocupacion: 81, adr: 142, revpar: 115 },
    { mes: 'Dic', ocupacion: 87, adr: 148, revpar: 129 },
    { mes: 'Ene', ocupacion: 85, adr: 145, revpar: 124 },
  ];

  // Datos de segmentación de mercado
  const marketSegmentation = [
    { segmento: 'Corporativo', porcentaje: 35, valor: 54250 },
    { segmento: 'Turismo', porcentaje: 40, valor: 62000 },
    { segmento: 'Eventos', porcentaje: 15, valor: 23250 },
    { segmento: 'Grupos', porcentaje: 10, valor: 15500 },
  ];

  // Datos de canal de distribución
  const distributionChannels = [
    { canal: 'Directo', reservas: 156, porcentaje: 35 },
    { canal: 'OTA', reservas: 178, porcentaje: 40 },
    { canal: 'Agencias', reservas: 67, porcentaje: 15 },
    { canal: 'Corporativo', reservas: 45, porcentaje: 10 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const handleExportPDF = () => {
    const data = roomTypeData.map(room => ({
      'Tipo': room.tipo,
      'Ocupadas': room.ocupadas,
      'Total': room.total,
      'Ocupación %': room.ocupacionPct.toFixed(1),
      'Tarifa Prom': `$${room.tarifa}`,
      'Ingresos': `$${room.ingresos}`
    }));

    exportToPDF(
      'Reporte de Ocupación Hotelera',
      data,
      [
        { header: 'Tipo', dataKey: 'Tipo' },
        { header: 'Ocupadas', dataKey: 'Ocupadas' },
        { header: 'Total', dataKey: 'Total' },
        { header: 'Ocupación %', dataKey: 'Ocupación %' },
        { header: 'Tarifa Prom', dataKey: 'Tarifa Prom' },
        { header: 'Ingresos', dataKey: 'Ingresos' }
      ],
      [
        { label: 'Ocupación Actual', value: '85.4%' },
        { label: 'ADR', value: '$145' },
        { label: 'RevPAR', value: '$124' },
        { label: 'Estancia Promedio', value: '2.3 noches' }
      ]
    );

    toast({ title: 'Reporte exportado', description: 'El PDF ha sido descargado exitosamente' });
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
          <CardTitle>Análisis de Ocupación y Rendimiento</CardTitle>
          <CardDescription>
            Indicadores clave para toma de decisiones estratégicas
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
            
            <Button onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs principales con comparativos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ocupación Actual</p>
                <p className="text-3xl font-bold text-blue-600">85.4%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.2% vs mes anterior
                </p>
              </div>
              <Home className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ADR (Tarifa Promedio)</p>
                <p className="text-3xl font-bold text-green-600">$145</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.8% vs mes anterior
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
                <p className="text-sm text-muted-foreground">RevPAR</p>
                <p className="text-3xl font-bold text-purple-600">$124</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +9.1% vs mes anterior
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
                <p className="text-sm text-muted-foreground">Estancia Promedio</p>
                <p className="text-3xl font-bold text-orange-600">2.3</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                  -0.2 noches vs mes anterior
                </p>
              </div>
              <Calendar className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de tendencia de ocupación */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ocupación - Últimos 30 días</CardTitle>
          <CardDescription>Evolución de indicadores clave de rendimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorOcupacion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRevpar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="ocupacion" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOcupacion)" name="Ocupación %" />
              <Area type="monotone" dataKey="revpar" stroke="#10b981" fillOpacity={1} fill="url(#colorRevpar)" name="RevPAR $" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparativo mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo Mensual - Últimos 5 meses</CardTitle>
          <CardDescription>Análisis de evolución de indicadores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ocupacion" fill="#3b82f6" name="Ocupación %" />
              <Bar dataKey="adr" fill="#10b981" name="ADR $" />
              <Bar dataKey="revpar" fill="#f59e0b" name="RevPAR $" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análisis por tipo de habitación y segmentación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por Tipo de Habitación</CardTitle>
            <CardDescription>Rendimiento por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roomTypeData.map((room, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{room.tipo}</p>
                      <p className="text-sm text-muted-foreground">
                        {room.ocupadas}/{room.total} hab. • ${room.tarifa} ADR
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{room.ocupacionPct.toFixed(1)}%</p>
                      <p className="text-sm text-green-600">${room.ingresos.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${room.ocupacionPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segmentación de Mercado</CardTitle>
            <CardDescription>Distribución de ingresos por segmento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={marketSegmentation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segmento, porcentaje }) => `${segmento} ${porcentaje}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="porcentaje"
                >
                  {marketSegmentation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {marketSegmentation.map((seg, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index]}} />
                    {seg.segmento}
                  </span>
                  <span className="font-medium">${seg.valor.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canales de distribución */}
      <Card>
        <CardHeader>
          <CardTitle>Canales de Distribución</CardTitle>
          <CardDescription>Análisis de fuentes de reservas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {distributionChannels.map((canal, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{canal.canal}</span>
                    <span className="text-sm text-muted-foreground">{canal.reservas} reservas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${canal.porcentaje}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium w-12 text-right">{canal.porcentaje}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights y recomendaciones estratégicas */}
      <Card>
        <CardHeader>
          <CardTitle>Insights y Recomendaciones Estratégicas</CardTitle>
          <CardDescription>Análisis para toma de decisiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">✓ Fortalezas Identificadas</h4>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• RevPAR creció 9.1%, superando expectativas del sector (+6%)</li>
                <li>• Habitaciones Individuales con ocupación óptima (93.3%)</li>
                <li>• Segmento corporativo mantiene estabilidad (35% del mix)</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠ Áreas de Oportunidad</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Reducción de estancia promedio (-0.2 noches) - implementar paquetes de múltiples noches</li>
                <li>• Suites con menor ocupación (80%) - considerar promociones o ajuste de tarifas</li>
                <li>• Dependencia alta de OTAs (40%) - fortalecer canal directo para mejorar margen</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Recomendaciones Accionables</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Implementar programa de fidelización para aumentar reservas directas</li>
                <li>• Crear paquetes de 3+ noches con descuento del 15-20%</li>
                <li>• Revisar estrategia de pricing dinámico para Suites en temporada baja</li>
                <li>• Evaluar expansión de segmento turismo (40%) mediante alianzas con agencias</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OccupancyReports;
