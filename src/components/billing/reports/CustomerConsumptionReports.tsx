import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, TrendingUp } from 'lucide-react';

const CustomerConsumptionReports: React.FC = () => {
  const topCustomers = [
    { name: 'María González López', room: '301', total: 1260.00, services: 3, avgStay: 3.2 },
    { name: 'Carlos Empresarial S.A.S.', room: '505', total: 2340.00, services: 5, avgStay: 2.8 },
    { name: 'Juan Pérez García', room: '205', total: 627.84, services: 3, avgStay: 2.0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Consumos por Cliente</CardTitle>
          <CardDescription>
            Detalle de cargos por huésped y análisis de consumo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">$185.32</div>
                <div className="text-sm text-muted-foreground">Consumo Promedio</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <User className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">2.6</div>
                <div className="text-sm text-muted-foreground">Servicios por Cliente</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">2.7</div>
                <div className="text-sm text-muted-foreground">Noches Promedio</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Top Clientes por Facturación</h4>
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Hab. {customer.room} • {customer.services} servicios • {customer.avgStay} noches promedio
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${customer.total.toFixed(2)}</div>
                  <Badge className="bg-green-100 text-green-800">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomerConsumptionReports;