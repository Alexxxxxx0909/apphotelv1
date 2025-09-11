import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

const ComparativeReports: React.FC = () => {
  const comparativeData = [
    { period: 'Enero 2024 vs Enero 2023', current: 156890, previous: 140230, growth: 11.9 },
    { period: 'Trimestre vs Anterior', current: 425680, previous: 398450, growth: 6.8 },
    { period: 'YTD vs Año Anterior', current: 156890, previous: 140230, growth: 11.9 }
  ];

  const projections = [
    { month: 'Febrero', projected: 168450, confirmed: 142300 },
    { month: 'Marzo', projected: 175200, confirmed: 89500 },
    { month: 'Abril', projected: 189600, confirmed: 45200 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Análisis Comparativo</CardTitle>
            <CardDescription>
              Ingresos actuales vs períodos anteriores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparativeData.map((data, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{data.period}</span>
                    <div className="flex items-center space-x-1">
                      {data.growth >= 0 ? 
                        <TrendingUp className="h-4 w-4 text-green-600" /> : 
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      }
                      <span className={`font-medium ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.growth >= 0 ? '+' : ''}{data.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Actual</div>
                      <div className="font-semibold">${data.current.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Anterior</div>
                      <div className="font-semibold">${data.previous.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyecciones</CardTitle>
            <CardDescription>
              Facturación proyectada vs reservas confirmadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projections.map((projection, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{projection.month}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((projection.confirmed / projection.projected) * 100).toFixed(1)}% confirmado
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Proyectado</div>
                      <div className="font-semibold text-blue-600">${projection.projected.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Confirmado</div>
                      <div className="font-semibold text-green-600">${projection.confirmed.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(projection.confirmed / projection.projected) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rentabilidad por Centro de Costo</CardTitle>
          <CardDescription>
            Análisis de ingresos vs costos operativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { center: 'Alojamiento', revenue: 89600, cost: 35840, margin: 60.0 },
              { center: 'Restaurante', revenue: 32450, cost: 19470, margin: 40.0 },
              { center: 'Bar', revenue: 18200, cost: 9100, margin: 50.0 },
              { center: 'Spa', revenue: 12800, cost: 7680, margin: 40.0 },
              { center: 'Eventos', revenue: 3840, cost: 2304, margin: 40.0 }
            ].map((center, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <div className="font-medium mb-2">{center.center}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Ingresos:</span>
                    <span className="font-medium text-green-600">${center.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costos:</span>
                    <span className="font-medium text-red-600">${center.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Margen:</span>
                    <span className="font-bold text-blue-600">{center.margin}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparativeReports;