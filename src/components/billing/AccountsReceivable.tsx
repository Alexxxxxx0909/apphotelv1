import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Phone, 
  Mail, 
  MessageSquare,
  Calendar,
  Building,
  User,
  CreditCard,
  FileText,
  Search,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';

interface Account {
  id: string;
  customerName: string;
  customerType: 'individual' | 'corporate';
  customerDocument: string;
  customerEmail: string;
  customerPhone: string;
  totalDebt: number;
  overdueDays: number;
  lastPayment: Date | null;
  bills: AccountBill[];
  creditLimit: number;
  paymentTerms: number;
  status: 'current' | 'overdue' | 'critical' | 'legal';
  lastContact: Date | null;
  contactHistory: ContactRecord[];
}

interface AccountBill {
  id: string;
  number: string;
  issueDate: Date;
  dueDate: Date;
  originalAmount: number;
  paidAmount: number;
  balance: number;
  status: 'pending' | 'partial' | 'overdue' | 'paid';
}

interface ContactRecord {
  id: string;
  date: Date;
  type: 'call' | 'email' | 'sms' | 'meeting';
  notes: string;
  result: 'contacted' | 'no-answer' | 'promised-payment' | 'dispute';
  nextFollowUp?: Date;
}

const AccountsReceivable: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newContact, setNewContact] = useState({
    type: 'call' as ContactRecord['type'],
    notes: '',
    result: 'contacted' as ContactRecord['result'],
    nextFollowUp: ''
  });

  // Datos de ejemplo
  const sampleAccounts: Account[] = [
    {
      id: 'ACC-001',
      customerName: 'Juan Pérez García',
      customerType: 'individual',
      customerDocument: '12345678-9',
      customerEmail: 'juan.perez@email.com',
      customerPhone: '+57 300 123 4567',
      totalDebt: 1580.50,
      overdueDays: 15,
      lastPayment: new Date('2024-01-05'),
      creditLimit: 5000,
      paymentTerms: 30,
      status: 'overdue',
      lastContact: new Date('2024-01-10'),
      bills: [
        {
          id: 'BILL-001',
          number: 'FE-2024-001',
          issueDate: new Date('2023-12-15'),
          dueDate: new Date('2024-01-14'),
          originalAmount: 627.84,
          paidAmount: 0,
          balance: 627.84,
          status: 'overdue'
        },
        {
          id: 'BILL-005',
          number: 'FE-2024-005',
          issueDate: new Date('2024-01-02'),
          dueDate: new Date('2024-02-01'),
          originalAmount: 952.66,
          paidAmount: 0,
          balance: 952.66,
          status: 'pending'
        }
      ],
      contactHistory: [
        {
          id: 'CONT-001',
          date: new Date('2024-01-10'),
          type: 'call',
          notes: 'Cliente prometió pagar esta semana. Tiene problemas temporales de flujo de caja.',
          result: 'promised-payment',
          nextFollowUp: new Date('2024-01-17')
        },
        {
          id: 'CONT-002',
          date: new Date('2024-01-03'),
          type: 'email',
          notes: 'Enviado recordatorio de factura vencida FE-2024-001',
          result: 'contacted'
        }
      ]
    },
    {
      id: 'ACC-002',
      customerName: 'Empresa Constructora ABC S.A.S.',
      customerType: 'corporate',
      customerDocument: '900123456-7',
      customerEmail: 'cuentaspagar@constructoraabc.com',
      customerPhone: '+57 1 234 5678',
      totalDebt: 5680.30,
      overdueDays: 45,
      lastPayment: new Date('2023-12-01'),
      creditLimit: 20000,
      paymentTerms: 45,
      status: 'critical',
      lastContact: new Date('2024-01-15'),
      bills: [
        {
          id: 'BILL-003',
          number: 'FE-2023-098',
          issueDate: new Date('2023-11-15'),
          dueDate: new Date('2023-12-30'),
          originalAmount: 3200.00,
          paidAmount: 0,
          balance: 3200.00,
          status: 'overdue'
        },
        {
          id: 'BILL-004',
          number: 'FE-2024-002',
          issueDate: new Date('2023-12-20'),
          dueDate: new Date('2024-02-03'),
          originalAmount: 2480.30,
          paidAmount: 0,
          balance: 2480.30,
          status: 'overdue'
        }
      ],
      contactHistory: [
        {
          id: 'CONT-003',
          date: new Date('2024-01-15'),
          type: 'meeting',
          notes: 'Reunión con director financiero. Negociado plan de pagos en 3 cuotas.',
          result: 'promised-payment',
          nextFollowUp: new Date('2024-01-30')
        }
      ]
    },
    {
      id: 'ACC-003',
      customerName: 'María González López',
      customerType: 'individual',
      customerDocument: '98765432-1',
      customerEmail: 'maria.gonzalez@email.com',
      customerPhone: '+57 312 987 6543',
      totalDebt: 450.00,
      overdueDays: 5,
      lastPayment: new Date('2024-01-12'),
      creditLimit: 2000,
      paymentTerms: 15,
      status: 'current',
      lastContact: null,
      bills: [
        {
          id: 'BILL-006',
          number: 'FE-2024-006',
          issueDate: new Date('2024-01-10'),
          dueDate: new Date('2024-01-25'),
          originalAmount: 450.00,
          paidAmount: 0,
          balance: 450.00,
          status: 'pending'
        }
      ],
      contactHistory: []
    }
  ];

  const [accounts] = useState<Account[]>(sampleAccounts);

  const getStatusBadge = (status: Account['status']) => {
    const styles = {
      current: 'bg-green-100 text-green-800',
      overdue: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
      legal: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      current: 'Al día',
      overdue: 'Vencido',
      critical: 'Crítico',
      legal: 'Proceso legal'
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getBillStatusBadge = (status: AccountBill['status']) => {
    const styles = {
      pending: 'bg-blue-100 text-blue-800',
      partial: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800'
    };
    const labels = {
      pending: 'Pendiente',
      partial: 'Parcial',
      overdue: 'Vencida',
      paid: 'Pagada'
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getContactIcon = (type: ContactRecord['type']) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.customerDocument.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddContact = () => {
    if (!selectedAccount || !newContact.notes) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    toast.success('Contacto registrado exitosamente');
    setNewContact({
      type: 'call',
      notes: '',
      result: 'contacted',
      nextFollowUp: ''
    });
  };

  const handleSendReminder = (account: Account) => {
    toast.success(`Recordatorio enviado a ${account.customerName}`);
  };

  const totalOutstanding = accounts.reduce((sum, acc) => sum + acc.totalDebt, 0);
  const overdueAccounts = accounts.filter(acc => acc.status === 'overdue' || acc.status === 'critical').length;
  const criticalAccounts = accounts.filter(acc => acc.status === 'critical' || acc.status === 'legal').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  ${totalOutstanding.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total por Cobrar</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{overdueAccounts}</div>
                <div className="text-sm text-muted-foreground">Cuentas Vencidas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{criticalAccounts}</div>
                <div className="text-sm text-muted-foreground">Cuentas Críticas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {accounts.filter(acc => acc.customerType === 'corporate').length}
                </div>
                <div className="text-sm text-muted-foreground">Clientes Corporativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">Cuentas por Cobrar</TabsTrigger>
          <TabsTrigger value="aging">Antigüedad de Saldos</TabsTrigger>
          <TabsTrigger value="collection">Gestión de Cobranza</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de cuentas */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Cuentas por Cobrar</CardTitle>
                  <CardDescription>
                    Gestión de pagos pendientes y morosos
                  </CardDescription>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="current">Al día</SelectItem>
                        <SelectItem value="overdue">Vencidos</SelectItem>
                        <SelectItem value="critical">Críticos</SelectItem>
                        <SelectItem value="legal">Proceso legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredAccounts.map((account) => (
                      <motion.div
                        key={account.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAccount?.id === account.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedAccount(account)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start space-x-2">
                            {account.customerType === 'corporate' ? 
                              <Building className="h-5 w-5 text-blue-600 mt-0.5" /> : 
                              <User className="h-5 w-5 text-green-600 mt-0.5" />
                            }
                            <div>
                              <h4 className="font-medium">{account.customerName}</h4>
                              <p className="text-sm text-muted-foreground">{account.customerDocument}</p>
                            </div>
                          </div>
                          {getStatusBadge(account.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-muted-foreground">Deuda: </span>
                            <span className="font-semibold text-red-600">${account.totalDebt.toFixed(2)}</span>
                          </div>
                          {account.overdueDays > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {account.overdueDays} días vencido
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detalle de cuenta */}
            <div className="lg:col-span-2">
              {selectedAccount ? (
                <div className="space-y-6">
                  {/* Información del cliente */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            {selectedAccount.customerType === 'corporate' ? 
                              <Building className="h-5 w-5" /> : 
                              <User className="h-5 w-5" />
                            }
                            <span>{selectedAccount.customerName}</span>
                          </CardTitle>
                          <CardDescription>
                            {selectedAccount.customerDocument} • Límite: ${selectedAccount.creditLimit.toFixed(2)}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleSendReminder(selectedAccount)}>
                            <Mail className="h-4 w-4 mr-1" />
                            Recordatorio
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Llamar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium">Información de Contacto</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedAccount.customerEmail}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedAccount.customerPhone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">Resumen de Deuda</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Total adeudado:</span>
                              <span className="font-semibold text-red-600">
                                ${selectedAccount.totalDebt.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Días vencido:</span>
                              <span className={selectedAccount.overdueDays > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                                {selectedAccount.overdueDays} días
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Último pago:</span>
                              <span className="text-sm">
                                {selectedAccount.lastPayment ? selectedAccount.lastPayment.toLocaleDateString() : 'Sin pagos'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Facturas pendientes */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Facturas Pendientes</CardTitle>
                      <CardDescription>
                        Detalle de facturas por cobrar
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedAccount.bills.map((bill) => (
                          <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{bill.number}</h4>
                              <div className="text-sm text-muted-foreground">
                                Emisión: {bill.issueDate.toLocaleDateString()} • 
                                Vencimiento: {bill.dueDate.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${bill.balance.toFixed(2)}</div>
                              {getBillStatusBadge(bill.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Historial de contacto */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de Gestión</CardTitle>
                      <CardDescription>
                        Seguimiento de contactos y gestiones de cobranza
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedAccount.contactHistory.length > 0 ? (
                          selectedAccount.contactHistory.map((contact) => (
                            <div key={contact.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <div className="p-2 bg-muted rounded-lg">
                                {getContactIcon(contact.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium capitalize">{contact.type}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {contact.date.toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{contact.notes}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {contact.result === 'contacted' && 'Contactado'}
                                    {contact.result === 'no-answer' && 'No contestó'}
                                    {contact.result === 'promised-payment' && 'Prometió pagar'}
                                    {contact.result === 'dispute' && 'Disputa'}
                                  </Badge>
                                  {contact.nextFollowUp && (
                                    <span className="text-xs text-muted-foreground">
                                      Próximo seguimiento: {contact.nextFollowUp.toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground py-8">
                            No hay historial de contactos registrado
                          </p>
                        )}

                        {/* Agregar nuevo contacto */}
                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium">Registrar Nueva Gestión</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="contactType">Tipo de Contacto</Label>
                              <Select value={newContact.type} onValueChange={(value: ContactRecord['type']) => setNewContact({...newContact, type: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="call">Llamada</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="sms">SMS</SelectItem>
                                  <SelectItem value="meeting">Reunión</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="contactResult">Resultado</Label>
                              <Select value={newContact.result} onValueChange={(value: ContactRecord['result']) => setNewContact({...newContact, result: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="contacted">Contactado</SelectItem>
                                  <SelectItem value="no-answer">No contestó</SelectItem>
                                  <SelectItem value="promised-payment">Prometió pagar</SelectItem>
                                  <SelectItem value="dispute">Disputa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="contactNotes">Notas</Label>
                            <Textarea
                              id="contactNotes"
                              value={newContact.notes}
                              onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                              placeholder="Describe el resultado del contacto..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="nextFollowUp">Próximo Seguimiento</Label>
                            <Input
                              type="date"
                              id="nextFollowUp"
                              value={newContact.nextFollowUp}
                              onChange={(e) => setNewContact({...newContact, nextFollowUp: e.target.value})}
                            />
                          </div>
                          <Button onClick={handleAddContact}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Registrar Contacto
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Selecciona una cuenta</h3>
                    <p className="text-muted-foreground">
                      Elige una cuenta de la lista para ver sus detalles y gestionar cobranza
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="aging" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Antigüedad de Saldos</CardTitle>
              <CardDescription>
                Análisis de cuentas por cobrar por períodos de vencimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">$2,450</div>
                    <div className="text-sm text-muted-foreground">Corriente (0-30 días)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">$1,580</div>
                    <div className="text-sm text-muted-foreground">31-60 días</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">$3,200</div>
                    <div className="text-sm text-muted-foreground">61-90 días</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">$2,480</div>
                    <div className="text-sm text-muted-foreground">Más de 90 días</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">$0</div>
                    <div className="text-sm text-muted-foreground">Proceso legal</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Detalle por Cliente y Antigüedad</h4>
                {accounts.map((account) => (
                  <div key={account.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h5 className="font-medium">{account.customerName}</h5>
                        <p className="text-sm text-muted-foreground">{account.customerDocument}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${account.totalDebt.toFixed(2)}</div>
                        {getStatusBadge(account.status)}
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium">$450.00</div>
                        <div className="text-xs text-muted-foreground">0-30 días</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-medium">$627.84</div>
                        <div className="text-xs text-muted-foreground">31-60 días</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-medium">$0.00</div>
                        <div className="text-xs text-muted-foreground">61-90 días</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-medium">$0.00</div>
                        <div className="text-xs text-muted-foreground">+90 días</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-medium">$0.00</div>
                        <div className="text-xs text-muted-foreground">Legal</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cobranza</CardTitle>
              <CardDescription>
                Herramientas para gestión proactiva de cuentas por cobrar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Acciones Automáticas</h4>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">Recordatorios por Email</h5>
                          <p className="text-sm text-muted-foreground">Envío automático 5 días antes del vencimiento</p>
                        </div>
                        <Button variant="outline" size="sm">Configurar</Button>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">Escalamiento Automático</h5>
                          <p className="text-sm text-muted-foreground">Cambio de estado según días de vencimiento</p>
                        </div>
                        <Button variant="outline" size="sm">Configurar</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Reportes de Cobranza</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Reporte de Cuentas Vencidas
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Análisis de Efectividad de Cobranza
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Cronograma de Seguimientos
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AccountsReceivable;