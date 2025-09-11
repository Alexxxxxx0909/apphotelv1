import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Download,
  Calendar,
  Receipt,
  Banknote
} from 'lucide-react';

const FinancialReports: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('revenue');

  const paymentMethods = [
    { method: 'Tarjeta de Crédito', amount: 45600, percentage: 65.2, transactions: 145 },
    { method: 'Efectivo', amount: 15200, percentage: 21.7, transactions: 78 },
    { method: 'Transferencia', amount: 9200, percentage: 13.1, transactions: 23 }
  ];

  const openAccounts = [
    { guest: 'Juan Pérez García', room: '205', amount: 580, days: 2, status: 'active' },
    { guest: 'María González López', room: '301', amount: 1250, days: 1, status: 'active' },
    { guest: 'Carlos Rodríguez Martín', room: '102', amount: 340, days: 3, status: 'overdue' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Financieros</CardTitle>
          <CardDescription>
            Ingresos por hospedaje, anticipos y métodos de pago
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
            
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Ingresos</SelectItem>
                <SelectItem value="payments">Métodos de pago</SelectItem>
                <SelectItem value="accounts">Cuentas abiertas</SelectItem>
                <SelectItem value="advances">Anticipos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs financieros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">$78,450</div>
            <div className="text-sm text-muted-foreground">Ingresos Mes</div>
            <div className="text-xs text-green-600">+12.5% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Receipt className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">$12,300</div>
            <div className="text-sm text-muted-foreground">Anticipos Recibidos</div>
            <div className="text-xs text-blue-600">+8.3% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">$4,580</div>
            <div className="text-sm text-muted-foreground">Pagos Pendientes</div>
            <div className="text-xs text-red-600">+15.2% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">$245</div>
            <div className="text-sm text-muted-foreground">Ticket Promedio</div>
            <div className="text-xs text-green-600">+5.8% vs mes anterior</div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido según tipo de reporte */}
      {reportType === 'revenue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Hospedaje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-green-50 rounded">
                  <span>Alojamiento</span>
                  <span className="font-medium">$56,800</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded">
                  <span>Servicios Extras</span>
                  <span className="font-medium">$15,400</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 rounded">
                  <span>Restaurante</span>
                  <span className="font-medium">$6,250</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-100 rounded font-semibold">
                  <span>Total</span>
                  <span>$78,450</span>
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
                  { month: 'Enero', amount: 78450, growth: 12.5 },
                  { month: 'Diciembre', amount: 69780, growth: 8.3 },
                  { month: 'Noviembre', amount: 64420, growth: -2.1 },
                  { month: 'Octubre', amount: 65800, growth: 15.8 }
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
      )}

      {reportType === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago Utilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((payment, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'accounts' && (
        <Card>
          <CardHeader>
            <CardTitle>Cuentas Abiertas de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openAccounts.map((account, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{account.guest}</div>
                    <div className="text-sm text-muted-foreground">
                      Habitación {account.room} - {account.days} días
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${account.amount}</div>
                    <Badge className={account.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {account.status === 'overdue' ? 'Vencida' : 'Activa'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'advances' && (
        <Card>
          <CardHeader>
            <CardTitle>Anticipos y Saldos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Anticipos Recibidos</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-green-50 rounded">
                    <span>Reservas futuras</span>
                    <span className="font-medium">$8,200</span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-50 rounded">
                    <span>Depósitos de garantía</span>
                    <span className="font-medium">$4,100</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-100 rounded font-semibold">
                    <span>Total Anticipos</span>
                    <span>$12,300</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Saldos Pendientes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-yellow-50 rounded">
                    <span>Facturas vencidas</span>
                    <span className="font-medium">$2,800</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded">
                    <span>Pagos parciales</span>
                    <span className="font-medium">$1,780</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-100 rounded font-semibold">
                    <span>Total Pendiente</span>
                    <span>$4,580</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default FinancialReports;