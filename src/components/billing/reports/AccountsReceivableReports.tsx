import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Building, User } from 'lucide-react';

const AccountsReceivableReports: React.FC = () => {
  const overdueAccounts = [
    { customer: 'Empresa Constructora ABC S.A.S.', amount: 5680.30, days: 45, type: 'corporate' },
    { customer: 'Juan Pérez García', amount: 1580.50, days: 15, type: 'individual' },
    { customer: 'Hotel Partner Ltd.', amount: 2340.00, days: 25, type: 'corporate' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Cuentas por Cobrar</CardTitle>
          <CardDescription>
            Facturas pendientes, vencidas y anticipos registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">$9,600.80</div>
                <div className="text-sm text-muted-foreground">Total Vencido</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Building className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">$8,020.30</div>
                <div className="text-sm text-muted-foreground">Clientes Corporativos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <User className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">$1,580.50</div>
                <div className="text-sm text-muted-foreground">Clientes Individuales</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Cuentas Vencidas</h4>
            {overdueAccounts.map((account, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {account.type === 'corporate' ? 
                    <Building className="h-5 w-5 text-blue-600" /> : 
                    <User className="h-5 w-5 text-green-600" />
                  }
                  <div>
                    <div className="font-medium">{account.customer}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.days} días de vencimiento
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-red-600">${account.amount.toFixed(2)}</div>
                  <Badge className={account.days > 30 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                    {account.days > 30 ? 'Crítico' : 'Vencido'}
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

export default AccountsReceivableReports;