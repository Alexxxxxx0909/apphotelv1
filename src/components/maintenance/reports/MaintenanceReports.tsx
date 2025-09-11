import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Users,
  Wrench,
  Package
} from 'lucide-react';

interface MaintenanceReportsProps {
  reportType: string;
}

const MaintenanceReports: React.FC<MaintenanceReportsProps> = ({ reportType }) => {
  const [dateRange, setDateRange] = useState('30-days');
  const [selectedArea, setSelectedArea] = useState('todas');

  // Mock data for different report types
  const generalData = {
    totalOrders: 156,
    completedOrders: 142,
    avgResolutionTime: 2.4,
    totalCost: 12450,
    efficiency: 91.2,
    mostCommonIssues: [
      { issue: 'HVAC - Mantenimiento', count: 45, percentage: 28.8 },
      { issue: 'Plomería - Fugas', count: 32, percentage: 20.5 },
      { issue: 'Electricidad - Iluminación', count: 28, percentage: 17.9 },
      { issue: 'Elevadores - Mantenimiento', count: 18, percentage: 11.5 }
    ]
  };

  const costData = {
    totalMaintenance: 12450,
    laborCosts: 8100,
    materialCosts: 4350,
    byArea: [
      { area: 'Habitaciones', cost: 5200, percentage: 41.8 },
      { area: 'Áreas Comunes', cost: 3100, percentage: 24.9 },
      { area: 'Cocina/Restaurante', cost: 2150, percentage: 17.3 },
      { area: 'Spa/Piscina', cost: 2000, percentage: 16.1 }
    ]
  };

  const efficiencyData = {
    onTimeCompletion: 85.2,
    firstTimeResolution: 78.9,
    customerSatisfaction: 92.3,
    avgResponseTime: 0.8,
    techniciansProductivity: [
      { name: 'Carlos Méndez', efficiency: 94.5, orders: 45 },
      { name: 'Miguel Torres', efficiency: 89.2, orders: 38 },
      { name: 'Ana López', efficiency: 91.8, orders: 35 },
      { name: 'Roberto Silva', efficiency: 87.6, orders: 28 }
    ]
  };

  const complianceData = {
    safetyCompliance: 96.5,
    certificationStatus: 85.7,
    auditScore: 4.3,
    pendingCertifications: [
      { certification: 'Elevadores', expires: '2024-03-15', status: 'vigente' },
      { certification: 'Calderas', expires: '2024-02-20', status: 'próximo' },
      { certification: 'Sistema Eléctrico', expires: '2024-01-30', status: 'vencido' },
      { certification: 'HVAC Central', expires: '2024-04-10', status: 'vigente' }
    ]
  };

  const renderGeneralReports = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{generalData.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Órdenes Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{generalData.completedOrders}</p>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{generalData.avgResolutionTime}h</p>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{generalData.efficiency}%</p>
                <p className="text-sm text-muted-foreground">Eficiencia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Incidencias Más Frecuentes</CardTitle>
          <CardDescription>Tipos de problemas reportados con mayor frecuencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generalData.mostCommonIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{issue.issue}</span>
                    <span className="text-sm text-muted-foreground">{issue.count} casos</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${issue.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">{issue.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCostReports = () => (
    <div className="space-y-6">
      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${costData.totalMaintenance.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Costo Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">${costData.laborCosts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Mano de Obra</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">${costData.materialCosts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Materiales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost by Area */}
      <Card>
        <CardHeader>
          <CardTitle>Costos por Área</CardTitle>
          <CardDescription>Distribución de gastos de mantenimiento por ubicación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costData.byArea.map((area, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{area.area}</span>
                    <span className="text-sm text-muted-foreground">${area.cost.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${area.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">{area.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEfficiencyReports = () => (
    <div className="space-y-6">
      {/* Efficiency KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{efficiencyData.onTimeCompletion}%</p>
              <p className="text-sm text-muted-foreground">Completadas a Tiempo</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{efficiencyData.firstTimeResolution}%</p>
              <p className="text-sm text-muted-foreground">Resolución Primera Vez</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{efficiencyData.customerSatisfaction}%</p>
              <p className="text-sm text-muted-foreground">Satisfacción Cliente</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{efficiencyData.avgResponseTime}h</p>
              <p className="text-sm text-muted-foreground">Tiempo Respuesta</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technician Productivity */}
      <Card>
        <CardHeader>
          <CardTitle>Productividad por Técnico</CardTitle>
          <CardDescription>Rendimiento individual del equipo de mantenimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {efficiencyData.techniciansProductivity.map((tech, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{tech.name}</h4>
                  <Badge variant="outline">
                    {tech.orders} órdenes
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Eficiencia</span>
                      <span className="text-sm font-medium">{tech.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          tech.efficiency >= 90 ? 'bg-green-500' :
                          tech.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${tech.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceReports = () => (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{complianceData.safetyCompliance}%</p>
              <p className="text-sm text-muted-foreground">Cumplimiento Seguridad</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{complianceData.certificationStatus}%</p>
              <p className="text-sm text-muted-foreground">Certificaciones Vigentes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{complianceData.auditScore}/5</p>
              <p className="text-sm text-muted-foreground">Puntuación Auditoría</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Certificaciones</CardTitle>
          <CardDescription>Vigencia y vencimientos de certificaciones obligatorias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceData.pendingCertifications.map((cert, index) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'vigente': return 'bg-green-100 text-green-800 border-green-200';
                  case 'próximo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                  case 'vencido': return 'bg-red-100 text-red-800 border-red-200';
                  default: return 'bg-gray-100 text-gray-800 border-gray-200';
                }
              };

              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{cert.certification}</h4>
                    <p className="text-sm text-muted-foreground">Vence: {cert.expires}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(cert.status)}>
                    {cert.status.toUpperCase()}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getReportContent = () => {
    switch (reportType) {
      case 'general-reports':
        return renderGeneralReports();
      case 'cost-reports':
        return renderCostReports();
      case 'efficiency-reports':
        return renderEfficiencyReports();
      case 'compliance-reports':
        return renderComplianceReports();
      default:
        return renderGeneralReports();
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'general-reports':
        return 'Reportes Generales de Mantenimiento';
      case 'cost-reports':
        return 'Análisis de Costos de Mantenimiento';
      case 'efficiency-reports':
        return 'Indicadores de Eficiencia';
      case 'compliance-reports':
        return 'Cumplimiento Normativo y Certificaciones';
      default:
        return 'Reportes de Mantenimiento';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">{getReportTitle()}</h3>
          <p className="text-muted-foreground">Análisis detallado de indicadores de mantenimiento</p>
        </div>
        <div className="flex space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7-days">Últimos 7 días</SelectItem>
              <SelectItem value="30-days">Últimos 30 días</SelectItem>
              <SelectItem value="90-days">Últimos 3 meses</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {getReportContent()}
    </motion.div>
  );
};

export default MaintenanceReports;