import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Banknote, Building, Smartphone } from 'lucide-react';

const PaymentMethodReports: React.FC = () => {
  const paymentMethods = [
    { method: 'Tarjeta de Crédito/Débito', amount: 98560, percentage: 62.8, transactions: 412, icon: CreditCard },
    { method: 'Efectivo', amount: 35420, percentage: 22.6, transactions: 278, icon: Banknote },
    { method: 'Transferencia Bancaria', amount: 18750, percentage: 11.9, transactions: 89, icon: Building },
    { method: 'Pagos Online', amount: 4160, percentage: 2.7, transactions: 68, icon: Smartphone }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Reporte por Medios de Pago</CardTitle>
          <CardDescription>
            Distribución de ingresos según método de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((payment, index) => {
              const Icon = payment.icon;
              return (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{payment.method}</div>
                      <div className="text-sm text-muted-foreground">
                        {payment.transactions} transacciones
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${payment.amount.toLocaleString()}</div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {payment.percentage}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentMethodReports;