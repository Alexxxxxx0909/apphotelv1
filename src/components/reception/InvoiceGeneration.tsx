import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Receipt, 
  Download, 
  Mail,
  FileText,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Coffee,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'accommodation' | 'restaurant' | 'minibar' | 'spa' | 'laundry' | 'parking' | 'other';
  date: Date;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  reservationNumber: string;
  guestName: string;
  guestEmail: string;
  guestAddress?: string;
  guestTaxId?: string;
  roomNumber: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxes: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'partial' | 'pending';
  createdAt: Date;
  dueDate?: Date;
  notes?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'FAC-2024-0001',
    reservationNumber: 'RES-2024-0001',
    guestName: 'Juan Pérez García',
    guestEmail: 'juan.perez@email.com',
    guestAddress: 'Calle Mayor 123, 28001 Madrid',
    guestTaxId: '12345678A',
    roomNumber: '205',
    roomType: 'Doble',
    checkIn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    checkOut: new Date(),
    paymentMethod: 'Tarjeta de Crédito',
    paymentStatus: 'paid',
    createdAt: new Date(),
    subtotal: 535,
    taxes: 112.35,
    total: 647.35,
    items: [
      {
        id: 'i1',
        description: 'Alojamiento - Habitación Doble (3 noches)',
        quantity: 3,
        unitPrice: 120,
        total: 360,
        category: 'accommodation',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'i2',
        description: 'Cena en restaurante - 18/01',
        quantity: 2,
        unitPrice: 35,
        total: 70,
        category: 'restaurant',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'i3',
        description: 'Minibar - Bebidas y snacks',
        quantity: 1,
        unitPrice: 25,
        total: 25,
        category: 'minibar',
        date: new Date()
      },
      {
        id: 'i4',
        description: 'Spa - Masaje relajante',
        quantity: 1,
        unitPrice: 80,
        total: 80,
        category: 'spa',
        date: new Date()
      }
    ]
  }
];

const categoryLabels = {
  accommodation: 'Alojamiento',
  restaurant: 'Restaurante',
  minibar: 'Minibar',
  spa: 'Spa',
  laundry: 'Lavandería',
  parking: 'Parking',
  other: 'Otros'
};

const categoryIcons = {
  accommodation: MapPin,
  restaurant: Coffee,
  minibar: Coffee,
  spa: User,
  laundry: User,
  parking: CreditCard,
  other: FileText
};

const InvoiceGeneration: React.FC = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Descarga Iniciada",
      description: "La factura se está descargando en PDF",
    });
  };

  const handlePrintInvoice = (invoiceId: string) => {
    toast({
      title: "Impresión Iniciada",
      description: "Enviando factura a la impresora",
    });
  };

  const handleEmailInvoice = (invoiceId: string) => {
    toast({
      title: "Email Enviado",
      description: "La factura ha sido enviada por email al cliente",
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'partial':
        return 'Pago Parcial';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Generación de Facturas</CardTitle>
          <CardDescription>
            Gestiona y genera facturas consolidadas de alojamiento y servicios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente, número de factura o reserva..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagadas</SelectItem>
                  <SelectItem value="partial">Pago Parcial</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de facturas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Facturas Generadas ({filteredInvoices.length})</h3>
          {filteredInvoices.map((invoice) => (
            <motion.div
              key={invoice.id}
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedInvoice?.id === invoice.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedInvoice(invoice)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{invoice.invoiceNumber}</h4>
                      <p className="text-sm text-muted-foreground">{invoice.guestName}</p>
                    </div>
                    <Badge className={getPaymentStatusColor(invoice.paymentStatus)}>
                      {getPaymentStatusLabel(invoice.paymentStatus)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span>{invoice.reservationNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(invoice.createdAt, "dd/MM/yyyy")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{invoice.roomType} - {invoice.roomNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${invoice.total}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadInvoice(invoice.id);
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintInvoice(invoice.id);
                      }}
                    >
                      <Receipt className="h-3 w-3 mr-1" />
                      Imprimir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmailInvoice(invoice.id);
                      }}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Vista previa de factura */}
        <div>
          {selectedInvoice ? (
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa de Factura</CardTitle>
                <CardDescription>
                  {selectedInvoice.invoiceNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Información del cliente */}
                <div className="space-y-2">
                  <h4 className="font-medium">Datos del Cliente</h4>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <div><strong>{selectedInvoice.guestName}</strong></div>
                    {selectedInvoice.guestTaxId && (
                      <div>NIF/CIF: {selectedInvoice.guestTaxId}</div>
                    )}
                    {selectedInvoice.guestAddress && (
                      <div>{selectedInvoice.guestAddress}</div>
                    )}
                    <div>Email: {selectedInvoice.guestEmail}</div>
                  </div>
                </div>

                {/* Detalles de la estancia */}
                <div className="space-y-2">
                  <h4 className="font-medium">Detalles de la Estancia</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Reserva:</span>
                      <span>{selectedInvoice.reservationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Habitación:</span>
                      <span>{selectedInvoice.roomType} - {selectedInvoice.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span>{format(selectedInvoice.checkIn, "dd/MM/yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span>{format(selectedInvoice.checkOut, "dd/MM/yyyy")}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Desglose de servicios */}
                <div className="space-y-3">
                  <h4 className="font-medium">Desglose de Servicios</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedInvoice.items.map((item) => {
                      const CategoryIcon = categoryIcons[item.category];
                      return (
                        <div key={item.id} className="flex justify-between items-start p-2 border rounded text-sm">
                          <div className="flex items-start space-x-2">
                            <CategoryIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <div className="font-medium">{item.description}</div>
                              <div className="text-muted-foreground">
                                {item.quantity} x ${item.unitPrice}
                              </div>
                              <div className="text-muted-foreground">
                                {format(item.date, "dd/MM/yyyy")}
                              </div>
                            </div>
                          </div>
                          <div className="font-medium">${item.total}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Totales */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (21%):</span>
                    <span>${selectedInvoice.taxes}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${selectedInvoice.total}</span>
                  </div>
                </div>

                {/* Información de pago */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Método de pago:</span>
                      <span>{selectedInvoice.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <Badge className={getPaymentStatusColor(selectedInvoice.paymentStatus)}>
                        {getPaymentStatusLabel(selectedInvoice.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={() => handleDownloadInvoice(selectedInvoice.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleEmailInvoice(selectedInvoice.id)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecciona una factura</h3>
                <p className="text-muted-foreground">
                  Elige una factura de la lista para ver su vista previa.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceGeneration;