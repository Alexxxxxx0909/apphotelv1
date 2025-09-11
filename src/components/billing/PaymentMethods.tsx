import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Banknote, 
  Building, 
  Smartphone, 
  Globe,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Receipt,
  QrCode,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';

interface Payment {
  id: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'online';
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  reference?: string;
  guestName: string;
  billId: string;
  details: any;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  enabled: boolean;
  fees: number;
  processingTime: string;
}

const PaymentMethods: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    method: 'cash' as Payment['method'],
    billId: '',
    guestName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    transferReference: '',
    onlineProvider: ''
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Efectivo',
      icon: Banknote,
      color: 'text-green-600',
      enabled: true,
      fees: 0,
      processingTime: 'Inmediato'
    },
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      color: 'text-blue-600',
      enabled: true,
      fees: 2.5,
      processingTime: '1-2 min'
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      icon: Building,
      color: 'text-purple-600',
      enabled: true,
      fees: 1.0,
      processingTime: '5-10 min'
    },
    {
      id: 'online',
      name: 'Pagos Online',
      icon: Smartphone,
      color: 'text-orange-600',
      enabled: true,
      fees: 3.0,
      processingTime: '1-3 min'
    }
  ];

  // Datos de ejemplo
  const samplePayments: Payment[] = [
    {
      id: 'PAY-001',
      amount: 523.20,
      method: 'card',
      status: 'completed',
      date: new Date('2024-01-16T14:30:00'),
      reference: 'CARD-****1234',
      guestName: 'Juan Pérez García',
      billId: 'BILL-001',
      details: {
        cardLast4: '1234',
        cardBrand: 'Visa',
        authCode: 'AUTH123'
      }
    },
    {
      id: 'PAY-002',
      amount: 1260.00,
      method: 'transfer',
      status: 'completed',
      date: new Date('2024-01-17T10:15:00'),
      reference: 'TRF-789456123',
      guestName: 'María González López',
      billId: 'BILL-002',
      details: {
        bankName: 'Banco Nacional',
        accountLast4: '5678'
      }
    },
    {
      id: 'PAY-003',
      amount: 156.50,
      method: 'cash',
      status: 'completed',
      date: new Date('2024-01-17T16:45:00'),
      reference: 'CASH-001',
      guestName: 'Carlos Rodríguez',
      billId: 'BILL-003',
      details: {
        receivedBy: 'Ana López',
        change: 43.50
      }
    },
    {
      id: 'PAY-004',
      amount: 89.90,
      method: 'online',
      status: 'pending',
      date: new Date('2024-01-17T18:20:00'),
      reference: 'PAY-LINK-456',
      guestName: 'Sofía Martínez',
      billId: 'BILL-004',
      details: {
        provider: 'PayPal',
        paymentLink: 'https://paypal.me/hotel/89.90'
      }
    }
  ];

  const [payments] = useState<Payment[]>(samplePayments);

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = {
      completed: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido'
    };
    return (
      <Badge className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getMethodIcon = (method: Payment['method']) => {
    const methodConfig = paymentMethods.find(m => m.id === method);
    if (!methodConfig) return <DollarSign className="h-5 w-5" />;
    const Icon = methodConfig.icon;
    return <Icon className={`h-5 w-5 ${methodConfig.color}`} />;
  };

  const handleProcessPayment = () => {
    if (!newPayment.amount || !newPayment.billId || !newPayment.guestName) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    // Simular procesamiento de pago
    toast.success('Pago procesado exitosamente');
    
    // Limpiar formulario
    setNewPayment({
      amount: 0,
      method: 'cash',
      billId: '',
      guestName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      transferReference: '',
      onlineProvider: ''
    });
  };

  const totalToday = payments
    .filter(p => p.date.toDateString() === new Date().toDateString())
    .reduce((sum, p) => sum + p.amount, 0);

  const completedToday = payments
    .filter(p => p.date.toDateString() === new Date().toDateString() && p.status === 'completed')
    .length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const methodPayments = payments.filter(p => p.method === method.id && p.status === 'completed');
          const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
          
          return (
            <Card key={method.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Icon className={`h-6 w-6 ${method.color}`} />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">${methodTotal.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{method.name}</div>
                    <div className="text-xs text-muted-foreground">{methodPayments.length} transacciones</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="process" className="space-y-6">
        <TabsList>
          <TabsTrigger value="process">Procesar Pago</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="methods">Configurar Métodos</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario de pago */}
            <Card>
              <CardHeader>
                <CardTitle>Procesar Nuevo Pago</CardTitle>
                <CardDescription>
                  Registrar pago recibido por cualquier método
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Huésped</Label>
                    <Input
                      id="guestName"
                      value={newPayment.guestName}
                      onChange={(e) => setNewPayment({...newPayment, guestName: e.target.value})}
                      placeholder="Nombre del huésped"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billId">Factura</Label>
                    <Input
                      id="billId"
                      value={newPayment.billId}
                      onChange={(e) => setNewPayment({...newPayment, billId: e.target.value})}
                      placeholder="ID de factura"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Monto</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="method">Método de Pago</Label>
                    <Select value={newPayment.method} onValueChange={(value) => setNewPayment({...newPayment, method: value as Payment['method']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="card">Tarjeta</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                        <SelectItem value="online">Pago Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Campos específicos por método */}
                {newPayment.method === 'card' && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium">Información de Tarjeta</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          value={newPayment.cardNumber}
                          onChange={(e) => setNewPayment({...newPayment, cardNumber: e.target.value})}
                          placeholder="**** **** **** 1234"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardExpiry">Vencimiento</Label>
                        <Input
                          id="cardExpiry"
                          value={newPayment.cardExpiry}
                          onChange={(e) => setNewPayment({...newPayment, cardExpiry: e.target.value})}
                          placeholder="MM/AA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCVV">CVV</Label>
                        <Input
                          id="cardCVV"
                          value={newPayment.cardCVV}
                          onChange={(e) => setNewPayment({...newPayment, cardCVV: e.target.value})}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {newPayment.method === 'transfer' && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium">Información de Transferencia</h4>
                    <div>
                      <Label htmlFor="transferReference">Referencia</Label>
                      <Input
                        id="transferReference"
                        value={newPayment.transferReference}
                        onChange={(e) => setNewPayment({...newPayment, transferReference: e.target.value})}
                        placeholder="Número de referencia bancaria"
                      />
                    </div>
                  </div>
                )}

                {newPayment.method === 'online' && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium">Pago Online</h4>
                    <div>
                      <Label htmlFor="onlineProvider">Proveedor</Label>
                      <Select value={newPayment.onlineProvider} onValueChange={(value) => setNewPayment({...newPayment, onlineProvider: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="mercadopago">MercadoPago</SelectItem>
                          <SelectItem value="pse">PSE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Total a procesar</div>
                    <div className="text-2xl font-bold">${newPayment.amount.toFixed(2)}</div>
                  </div>
                  <Button onClick={handleProcessPayment} size="lg">
                    <Receipt className="h-4 w-4 mr-2" />
                    Procesar Pago
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resumen del día */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Día</CardTitle>
                <CardDescription>
                  Transacciones procesadas hoy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="font-medium">Total Recaudado</div>
                        <div className="text-sm text-muted-foreground">{completedToday} transacciones</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${totalToday.toFixed(2)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Últimas Transacciones</h4>
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getMethodIcon(payment.method)}
                          <div>
                            <div className="font-medium">{payment.guestName}</div>
                            <div className="text-sm text-muted-foreground">
                              {payment.date.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${payment.amount.toFixed(2)}</div>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
              <CardDescription>
                Todas las transacciones registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <div className="flex items-center space-x-4">
                      {getMethodIcon(payment.method)}
                      <div>
                        <h4 className="font-medium">{payment.guestName}</h4>
                        <div className="text-sm text-muted-foreground">
                          {payment.reference} • {payment.date.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${payment.amount.toFixed(2)}</div>
                      {getStatusBadge(payment.status)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Métodos de Pago</CardTitle>
              <CardDescription>
                Gestionar métodos de pago disponibles y configuraciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <Icon className={`h-6 w-6 ${method.color}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            Comisión: {method.fees}% • Tiempo: {method.processingTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={method.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {method.enabled ? 'Habilitado' : 'Deshabilitado'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PaymentMethods;