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
  BarChart3
} from 'lucide-react';

const GeneralBillingReports: React.FC = () => {
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
          <CardTitle>Reporte General de Facturación</CardTitle>
          <CardDescription>
            Ingresos totales, ventas por centro de costo y facturas emitidas
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
                <SelectItem value="quarter">Trimestral</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">$156,890</div>
            <div className="text-sm text-muted-foreground">Ingresos Totales</div>
            <div className="text-xs text-green-600">+12.5% vs período anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">847</div>
            <div className="text-sm text-muted-foreground">Facturas Emitidas</div>
            <div className="text-xs text-blue-600">15 anuladas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">$185.32</div>
            <div className="text-sm text-muted-foreground">Ticket Promedio</div>
            <div className="text-xs text-green-600">+8.3% vs período anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">98.2%</div>
            <div className="text-sm text-muted-foreground">Aprobación DIAN</div>
            <div className="text-xs text-orange-600">15 rechazadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Ventas por centro de costo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Centro de Costo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-blue-50 rounded">
                <span>Alojamiento</span>
                <span className="font-medium">$89,600 (57.1%)</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded">
                <span>Restaurante</span>
                <span className="font-medium">$32,450 (20.7%)</span>
              </div>
              <div className="flex justify-between p-3 bg-purple-50 rounded">
                <span>Bar</span>
                <span className="font-medium">$18,200 (11.6%)</span>
              </div>
              <div className="flex justify-between p-3 bg-pink-50 rounded">
                <span>Spa</span>
                <span className="font-medium">$12,800 (8.2%)</span>
              </div>
              <div className="flex justify-between p-3 bg-orange-50 rounded">
                <span>Eventos</span>
                <span className="font-medium">$3,840 (2.4%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolución Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { month: 'Enero', amount: 156890, growth: 12.5 },
                { month: 'Diciembre', amount: 139420, growth: 8.3 },
                { month: 'Noviembre', amount: 128750, growth: -2.1 },
                { month: 'Octubre', amount: 131500, growth: 15.8 }
              ].map((month, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{month.month}</span>
                  <div className="text-right">
                    <div className="font-medium">${month.amount.toLocaleString()}</div>
                    <div className={`text-xs ${month.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {month.growth >= 0 ? '+' : ''}{month.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default GeneralBillingReports;