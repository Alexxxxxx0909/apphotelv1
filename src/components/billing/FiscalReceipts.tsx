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
  FileText, 
  Download, 
  Send, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  Printer,
  Mail,
  Building,
  User,
  Calendar,
  DollarSign,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface FiscalReceipt {
  id: string;
  number: string;
  type: 'factura' | 'nota-credito' | 'nota-debito';
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled';
  customerName: string;
  customerDocument: string;
  customerEmail: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxes: number;
  total: number;
  items: ReceiptItem[];
  dianResponse?: {
    cufe: string;
    qrCode: string;
    pdfUrl: string;
  };
}

interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
}

const FiscalReceipts: React.FC = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<FiscalReceipt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Datos de ejemplo
  const sampleReceipts: FiscalReceipt[] = [
    {
      id: 'FR-001',
      number: 'FE-2024-001',
      type: 'factura',
      status: 'approved',
      customerName: 'Juan Pérez García',
      customerDocument: '12345678-9',
      customerEmail: 'juan.perez@email.com',
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-14'),
      subtotal: 523.20,
      taxes: 104.64,
      total: 627.84,
      items: [
        {
          id: '1',
          description: 'Hospedaje Habitación Superior (2 noches)',
          quantity: 2,
          unitPrice: 150,
          total: 300,
          taxRate: 20
        },
        {
          id: '2',
          description: 'Servicio de Restaurante',
          quantity: 1,
          unitPrice: 100,
          total: 100,
          taxRate: 20
        },
        {
          id: '3',
          description: 'Consumo de Bar',
          quantity: 1,
          unitPrice: 123.20,
          total: 123.20,
          taxRate: 20
        }
      ],
      dianResponse: {
        cufe: 'ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        pdfUrl: '/invoices/FE-2024-001.pdf'
      }
    },
    {
      id: 'FR-002',
      number: 'FE-2024-002',
      type: 'factura',
      status: 'sent',
      customerName: 'María González López',
      customerDocument: '98765432-1',
      customerEmail: 'maria.gonzalez@email.com',
      issueDate: new Date('2024-01-16'),
      dueDate: new Date('2024-02-15'),
      subtotal: 1050,
      taxes: 210,
      total: 1260,
      items: [
        {
          id: '4',
          description: 'Suite Ejecutiva (3 noches)',
          quantity: 3,
          unitPrice: 250,
          total: 750,
          taxRate: 20
        },
        {
          id: '5',
          description: 'Tratamiento Spa',
          quantity: 1,
          unitPrice: 120,
          total: 120,
          taxRate: 20
        },
        {
          id: '6',
          description: 'Cena Especial',
          quantity: 1,
          unitPrice: 180,
          total: 180,
          taxRate: 20
        }
      ]
    },
    {
      id: 'FR-003',
      number: 'FE-2024-003',
      type: 'nota-credito',
      status: 'draft',
      customerName: 'Carlos Rodríguez Martín',
      customerDocument: '11223344-5',
      customerEmail: 'carlos.rodriguez@email.com',
      issueDate: new Date('2024-01-17'),
      dueDate: new Date('2024-02-16'),
      subtotal: -50,
      taxes: -10,
      total: -60,
      items: [
        {
          id: '7',
          description: 'Descuento por inconveniente en el servicio',
          quantity: 1,
          unitPrice: -50,
          total: -50,
          taxRate: 20
        }
      ]
    }
  ];

  const [receipts] = useState<FiscalReceipt[]>(sampleReceipts);

  const getStatusIcon = (status: FiscalReceipt['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'draft':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: FiscalReceipt['status']) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      sent: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      approved: 'Aprobada DIAN',
      sent: 'Enviada DIAN',
      rejected: 'Rechazada',
      cancelled: 'Anulada',
      draft: 'Borrador'
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getTypeIcon = (type: FiscalReceipt['type']) => {
    switch (type) {
      case 'factura':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'nota-credito':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'nota-debito':
        return <FileText className="h-5 w-5 text-red-600" />;
    }
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.customerDocument.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendToDian = (receipt: FiscalReceipt) => {
    toast.success(`Factura ${receipt.number} enviada a la DIAN exitosamente`);
  };

  const handleDownloadPdf = (receipt: FiscalReceipt) => {
    toast.success(`Descargando factura ${receipt.number}`);
  };

  const handleSendByEmail = (receipt: FiscalReceipt) => {
    toast.success(`Factura ${receipt.number} enviada por email a ${receipt.customerEmail}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {receipts.filter(r => r.status === 'approved').length}
            </div>
            <div className="text-sm text-muted-foreground">Aprobadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {receipts.filter(r => r.status === 'sent').length}
            </div>
            <div className="text-sm text-muted-foreground">Enviadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {receipts.filter(r => r.status === 'draft').length}
            </div>
            <div className="text-sm text-muted-foreground">Borradores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {receipts.filter(r => r.status === 'rejected').length}
            </div>
            <div className="text-sm text-muted-foreground">Rechazadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              ${receipts.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.total, 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Aprobado</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Lista de Comprobantes</TabsTrigger>
          <TabsTrigger value="create">Crear Comprobante</TabsTrigger>
          <TabsTrigger value="settings">Configuración DIAN</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprobantes Fiscales Electrónicos</CardTitle>
              <CardDescription>
                Gestión de facturas electrónicas y documentos fiscales
              </CardDescription>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, número o documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="draft">Borradores</SelectItem>
                    <SelectItem value="sent">Enviadas</SelectItem>
                    <SelectItem value="approved">Aprobadas</SelectItem>
                    <SelectItem value="rejected">Rechazadas</SelectItem>
                    <SelectItem value="cancelled">Anuladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReceipts.map((receipt) => (
                  <motion.div
                    key={receipt.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer"
                    onClick={() => setSelectedReceipt(receipt)}
                  >
                    <div className="flex items-center space-x-4">
                      {getTypeIcon(receipt.type)}
                      <div>
                        <h4 className="font-medium">{receipt.number}</h4>
                        <div className="text-sm text-muted-foreground">
                          {receipt.customerName} • {receipt.customerDocument}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {receipt.issueDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${receipt.total.toFixed(2)}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(receipt.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Modal de detalle */}
          {selectedReceipt && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {getTypeIcon(selectedReceipt.type)}
                      <span>{selectedReceipt.number}</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedReceipt.customerName} • {selectedReceipt.issueDate.toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(selectedReceipt)}>
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSendByEmail(selectedReceipt)}>
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    {selectedReceipt.status === 'draft' && (
                      <Button size="sm" onClick={() => handleSendToDian(selectedReceipt)}>
                        <Send className="h-4 w-4 mr-1" />
                        Enviar DIAN
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información del cliente */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Información del Cliente</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nombre:</span>
                        <span>{selectedReceipt.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Documento:</span>
                        <span>{selectedReceipt.customerDocument}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{selectedReceipt.customerEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Información fiscal */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Información Fiscal</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha emisión:</span>
                        <span>{selectedReceipt.issueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha vencimiento:</span>
                        <span>{selectedReceipt.dueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        {getStatusBadge(selectedReceipt.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Detalle de Items</h4>
                  <div className="space-y-3">
                    {selectedReceipt.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <div className="font-medium">{item.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} × ${item.unitPrice.toFixed(2)} (IVA {item.taxRate}%)
                          </div>
                        </div>
                        <div className="font-medium">${item.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Totales */}
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${selectedReceipt.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos:</span>
                      <span>${selectedReceipt.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${selectedReceipt.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Información DIAN */}
                {selectedReceipt.dianResponse && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Información DIAN</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>CUFE:</strong> {selectedReceipt.dianResponse.cufe}</div>
                      <div className="flex items-center space-x-2">
                        <strong>Código QR:</strong>
                        <img src={selectedReceipt.dianResponse.qrCode} alt="QR Code" className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nuevo Comprobante</CardTitle>
              <CardDescription>
                Generar factura electrónica o nota de crédito/débito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="receiptType">Tipo de Comprobante</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="factura">Factura de Venta</SelectItem>
                        <SelectItem value="nota-credito">Nota de Crédito</SelectItem>
                        <SelectItem value="nota-debito">Nota de Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="issueDate">Fecha de Emisión</Label>
                    <Input type="date" id="issueDate" />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                    <Input type="date" id="dueDate" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Nombre del Cliente</Label>
                    <Input id="customerName" placeholder="Nombre completo" />
                  </div>
                  <div>
                    <Label htmlFor="customerDocument">Documento</Label>
                    <Input id="customerDocument" placeholder="Cédula o NIT" />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input type="email" id="customerEmail" placeholder="correo@ejemplo.com" />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Teléfono</Label>
                    <Input id="customerPhone" placeholder="Número de teléfono" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customerAddress">Dirección</Label>
                  <Textarea id="customerAddress" placeholder="Dirección completa" />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Items del Comprobante</h4>
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                    <div className="col-span-4">Descripción</div>
                    <div className="col-span-2">Cantidad</div>
                    <div className="col-span-2">Precio Unit.</div>
                    <div className="col-span-2">IVA (%)</div>
                    <div className="col-span-2">Total</div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Input placeholder="Descripción del producto/servicio" />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" min="1" defaultValue="1" />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" min="0" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="col-span-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="19">19%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input readOnly placeholder="0.00" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Item
                  </Button>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Guardar Borrador</Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Crear y Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración DIAN</CardTitle>
              <CardDescription>
                Configurar conexión con la DIAN para facturación electrónica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nit">NIT de la Empresa</Label>
                    <Input id="nit" placeholder="900123456-7" />
                  </div>
                  <div>
                    <Label htmlFor="dv">Dígito de Verificación</Label>
                    <Input id="dv" placeholder="7" />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Razón Social</Label>
                    <Input id="companyName" placeholder="Hotel Example S.A.S." />
                  </div>
                  <div>
                    <Label htmlFor="environment">Ambiente</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ambiente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">Pruebas (Habilitación)</SelectItem>
                        <SelectItem value="production">Producción</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="certificate">Certificado Digital (.p12)</Label>
                  <Input type="file" id="certificate" accept=".p12" />
                </div>

                <div>
                  <Label htmlFor="certificatePassword">Contraseña del Certificado</Label>
                  <Input type="password" id="certificatePassword" />
                </div>

                <div className="flex space-x-4">
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Probar Conexión
                  </Button>
                  <Button variant="outline">Guardar Configuración</Button>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Conexión DIAN Activa</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Última sincronización: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default FiscalReceipts;