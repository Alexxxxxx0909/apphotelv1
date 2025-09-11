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
  BarChart3
} from 'lucide-react';

const OccupancyReports: React.FC = () => {
  const [period, setPeriod] = useState('month');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes de Ocupación</CardTitle>
          <CardDescription>
            Análisis de ocupación, ADR y RevPAR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Diario</SelectItem>
                <SelectItem value="week">Semanal</SelectItem>
                <SelectItem value="month">Mensual</SelectItem>
                <SelectItem value="year">Anual</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">85.4%</div>
            <div className="text-sm text-muted-foreground">Ocupación Actual</div>
            <div className="text-xs text-green-600">+3.2% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">$145</div>
            <div className="text-sm text-muted-foreground">ADR</div>
            <div className="text-xs text-green-600">+5.8% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">$124</div>
            <div className="text-sm text-muted-foreground">RevPAR</div>
            <div className="text-xs text-green-600">+9.1% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">2.3</div>
            <div className="text-sm text-muted-foreground">Estancia Promedio</div>
            <div className="text-xs text-red-600">-0.2 vs mes anterior</div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de habitaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Estado Actual de Habitaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Home className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">68</div>
              <div className="text-sm text-green-700">Ocupadas</div>
              <div className="text-xs text-muted-foreground">85.4% del total</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-blue-700">Disponibles</div>
              <div className="text-xs text-muted-foreground">12.5% del total</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Home className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-red-700">Bloqueadas</div>
              <div className="text-xs text-muted-foreground">2.5% del total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendencia de ocupación */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ocupación - Últimos 30 días</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '15 Ene', occupancy: 92, adr: 155, revpar: 143 },
              { date: '16 Ene', occupancy: 88, adr: 148, revpar: 130 },
              { date: '17 Ene', occupancy: 85, adr: 145, revpar: 123 },
              { date: '18 Ene', occupancy: 90, adr: 152, revpar: 137 },
              { date: '19 Ene', occupancy: 95, adr: 160, revpar: 152 }
            ].map((day, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="font-medium">{day.date}</div>
                <div className="flex space-x-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ocupación: </span>
                    <span className="font-medium">{day.occupancy}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ADR: </span>
                    <span className="font-medium">${day.adr}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">RevPAR: </span>
                    <span className="font-medium">${day.revpar}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis por tipo de habitación */}
      <Card>
        <CardHeader>
          <CardTitle>Ocupación por Tipo de Habitación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <div>
                <div className="font-medium">Individual</div>
                <div className="text-sm text-muted-foreground">15 habitaciones</div>
              </div>
              <div className="text-right">
                <div className="font-medium">93.3%</div>
                <div className="text-sm text-muted-foreground">14/15 ocupadas</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <div>
                <div className="font-medium">Doble</div>
                <div className="text-sm text-muted-foreground">45 habitaciones</div>
              </div>
              <div className="text-right">
                <div className="font-medium">84.4%</div>
                <div className="text-sm text-muted-foreground">38/45 ocupadas</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <div>
                <div className="font-medium">Suite</div>
                <div className="text-sm text-muted-foreground">20 habitaciones</div>
              </div>
              <div className="text-right">
                <div className="font-medium">80.0%</div>
                <div className="text-sm text-muted-foreground">16/20 ocupadas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OccupancyReports;