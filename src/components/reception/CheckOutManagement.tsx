import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign,
  Receipt,
  Coffee,
  Wifi,
  Car,
  Phone,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ActiveGuest {
  id: string;
  reservationNumber: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  plan: string;
  totalAmount: number;
  consumptions: Consumption[];
  paymentStatus: 'paid' | 'partial' | 'pending';
}

interface Consumption {
  id: string;
  service: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: Date;
  category: 'restaurant' | 'minibar' | 'spa' | 'laundry' | 'parking' | 'phone' | 'other';
}

const mockActiveGuests: ActiveGuest[] = [
  {
    id: '1',
    reservationNumber: 'RES-2024-0001',
    guestName: 'Juan Pérez García',
    roomNumber: '205',
    roomType: 'Doble',
    checkIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    checkOut: new Date(),
    adults: 2,
    children: 0,
    plan: 'Alojamiento + Desayuno',
    totalAmount: 360,
    paymentStatus: 'paid',
    consumptions: [
      {
        id: 'c1',
        service: 'Restaurante',
        description: 'Cena del 18/01',
        quantity: 2,
        unitPrice: 35,
        total: 70,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        category: 'restaurant'
      },
      {
        id: 'c2',
        service: 'Minibar',
        description: 'Bebidas y snacks',
        quantity: 1,
        unitPrice: 25,
        total: 25,
        date: new Date(),
        category: 'minibar'
      },
      {
        id: 'c3',
        service: 'Spa',
        description: 'Masaje relajante',
        quantity: 1,
        unitPrice: 80,
        total: 80,
        date: new Date(),
        category: 'spa'
      }
    ]
  },
  {
    id: '2',
    reservationNumber: 'RES-2024-0003',
    guestName: 'Carlos Rodríguez Martín',
    roomNumber: '102',
    roomType: 'Individual',
    checkIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    checkOut: new Date(),
    adults: 1,
    children: 0,
    plan: 'Solo Alojamiento',
    totalAmount: 160,
    paymentStatus: 'pending',
    consumptions: [
      {
        id: 'c4',
        service: 'Desayuno',
        description: 'Desayuno continental',
        quantity: 2,
        unitPrice: 15,
        total: 30,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        category: 'restaurant'
      }
    ]
  }
];

const categoryIcons = {
  restaurant: Coffee,
  minibar: Coffee,
  spa: User,
  laundry: User,
  parking: Car,
  phone: Phone,
  other: Receipt
};

const CheckOutManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeGuests, setActiveGuests] = useState<ActiveGuest[]>(mockActiveGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<ActiveGuest | null>(null);
  const [checkOutForm, setCheckOutForm] = useState({
    actualCheckOutTime: '',
    roomCondition: '',
    finalNotes: '',
    paymentMethod: 'cash'
  });

  const filteredGuests = activeGuests.filter(guest =>
    guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.roomNumber.includes(searchTerm)
  );

  const calculateTotalConsumptions = (consumptions: Consumption[]) => {
    return consumptions.reduce((total, consumption) => total + consumption.total, 0);
  };

  const calculateFinalTotal = (guest: ActiveGuest) => {
    return guest.totalAmount + calculateTotalConsumptions(guest.consumptions);
  };

  const handleCheckOut = async (guestId: string) => {
    const guest = activeGuests.find(g => g.id === guestId);
    if (!guest) return;

    // Simular proceso de check-out
    setActiveGuests(prev => prev.filter(g => g.id !== guestId));
    setSelectedGuest(null);
    
    toast({
      title: "Check-out Completado",
      description: `${guest.guestName} ha completado su estancia. Factura generada.`,
    });
  };

  const isCheckOutToday = (checkOutDate: Date) => {
    const today = new Date();
    return checkOutDate.toDateString() === today.toDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Check-out de Huéspedes</CardTitle>
          <CardDescription>
            Gestiona las salidas programadas y procesa facturas consolidadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, número de reserva o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de huéspedes activos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Huéspedes Activos ({filteredGuests.length})</h3>
          {filteredGuests.map((guest) => {
            const totalConsumptions = calculateTotalConsumptions(guest.consumptions);
            const finalTotal = calculateFinalTotal(guest);
            
            return (
              <motion.div
                key={guest.id}
                whileHover={{ scale: 1.02 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedGuest?.id === guest.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedGuest(guest)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{guest.guestName}</h4>
                        <p className="text-sm text-muted-foreground">{guest.reservationNumber}</p>
                      </div>
                      <div className="flex space-x-2">
                        {isCheckOutToday(guest.checkOut) && (
                          <Badge variant="default">
                            <Calendar className="h-3 w-3 mr-1" />
                            Salida Hoy
                          </Badge>
                        )}
                        <Badge variant={guest.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                          {guest.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{guest.roomType} - {guest.roomNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(guest.checkOut, "dd/MM/yyyy")}</span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Alojamiento:</span>
                        <span>${guest.totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consumos extras:</span>
                        <span>${totalConsumptions}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total final:</span>
                        <span>${finalTotal}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Detalle y check-out */}
        <div>
          {selectedGuest ? (
            <Card>
              <CardHeader>
                <CardTitle>Procesar Check-out</CardTitle>
                <CardDescription>
                  {selectedGuest.guestName} - Habitación {selectedGuest.roomNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Desglose de consumos */}
                <div>
                  <h4 className="font-medium mb-3">Desglose de Consumos</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Alojamiento ({selectedGuest.plan})</span>
                      <span>${selectedGuest.totalAmount}</span>
                    </div>
                    
                    {selectedGuest.consumptions.map((consumption) => {
                      const CategoryIcon = categoryIcons[consumption.category];
                      return (
                        <div key={consumption.id} className="flex justify-between items-center p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{consumption.service}</div>
                              <div className="text-sm text-muted-foreground">
                                {consumption.description} - {format(consumption.date, "dd/MM")}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${consumption.total}</div>
                            <div className="text-sm text-muted-foreground">
                              {consumption.quantity} x ${consumption.unitPrice}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Final:</span>
                    <span>${calculateFinalTotal(selectedGuest)}</span>
                  </div>
                </div>

                {/* Formulario de check-out */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkout-time">Hora de salida</Label>
                      <Input
                        id="checkout-time"
                        type="time"
                        value={checkOutForm.actualCheckOutTime}
                        onChange={(e) => setCheckOutForm(prev => ({
                          ...prev,
                          actualCheckOutTime: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-method">Método de pago</Label>
                      <Select 
                        value={checkOutForm.paymentMethod}
                        onValueChange={(value) => setCheckOutForm(prev => ({
                          ...prev,
                          paymentMethod: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Efectivo</SelectItem>
                          <SelectItem value="card">Tarjeta</SelectItem>
                          <SelectItem value="transfer">Transferencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="room-condition">Estado de habitación</Label>
                    <Select 
                      value={checkOutForm.roomCondition}
                      onValueChange={(value) => setCheckOutForm(prev => ({
                        ...prev,
                        roomCondition: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Buen estado</SelectItem>
                        <SelectItem value="cleaning">Requiere limpieza</SelectItem>
                        <SelectItem value="maintenance">Requiere mantenimiento</SelectItem>
                        <SelectItem value="damage">Daños reportados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="final-notes">Notas finales</Label>
                    <Textarea
                      id="final-notes"
                      placeholder="Observaciones del check-out..."
                      value={checkOutForm.finalNotes}
                      onChange={(e) => setCheckOutForm(prev => ({
                        ...prev,
                        finalNotes: e.target.value
                      }))}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleCheckOut(selectedGuest.id)}
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Completar Check-out
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedGuest(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecciona un huésped</h3>
                <p className="text-muted-foreground">
                  Elige un huésped de la lista para procesar su check-out.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CheckOutManagement;