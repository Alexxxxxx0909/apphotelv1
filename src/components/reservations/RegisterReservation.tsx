import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Save, Plus, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { useRooms } from '@/hooks/useRooms';
import { useMealPlans } from '@/hooks/useMealPlans';
import { useReservations } from '@/hooks/useReservations';
import { usePricingRules } from '@/hooks/usePricingRules';

interface ReservationData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  roomTypeId: string;
  roomId: string;
  adults: number;
  children: number;
  planId: string;
  pricePerNight: number;
  paymentMethod: string;
  status: string;
  specialRequests: string;
}

const RegisterReservation: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const hotelId = user?.hotel || '';
  
  const { roomTypes, loading: loadingTypes } = useRoomTypes(hotelId);
  const { rooms, loading: loadingRooms } = useRooms(hotelId);
  const { plans, loading: loadingPlans } = useMealPlans(hotelId);
  const { addReservation } = useReservations(hotelId);
  const { calculatePrice } = usePricingRules(hotelId);

  const [reservationData, setReservationData] = useState<ReservationData>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: undefined,
    checkOut: undefined,
    roomTypeId: '',
    roomId: '',
    adults: 1,
    children: 0,
    planId: '',
    pricePerNight: 0,
    paymentMethod: '',
    status: 'pendiente',
    specialRequests: ''
  });

  const [reservationNumber] = useState(() => 
    `RES-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
  );

  const [availableRooms, setAvailableRooms] = useState(rooms);
  const [totalPrice, setTotalPrice] = useState(0);

  // Filtrar habitaciones disponibles según el tipo seleccionado
  useEffect(() => {
    if (reservationData.roomTypeId) {
      const selectedType = roomTypes.find(t => t.id === reservationData.roomTypeId);
      const filtered = rooms.filter(
        r => r.tipoId === reservationData.roomTypeId && r.estado === 'disponible'
      );
      setAvailableRooms(filtered);
      
      // Actualizar precio base según el tipo de habitación con reglas dinámicas
      if (selectedType) {
        const basePrice = selectedType.precioBase;
        const planPrice = reservationData.planId ? (plans.find(p => p.id === reservationData.planId)?.precioAdicional || 0) : 0;
        const dynamicPrice = calculatePrice(basePrice + planPrice, reservationData.roomTypeId, reservationData.checkIn || new Date());
        
        setReservationData(prev => ({
          ...prev,
          pricePerNight: dynamicPrice
        }));
      }
    } else {
      setAvailableRooms(rooms.filter(r => r.estado === 'disponible'));
    }
  }, [reservationData.roomTypeId, reservationData.planId, reservationData.checkIn, rooms, roomTypes, plans, calculatePrice]);

  // Calcular precio total
  useEffect(() => {
    if (reservationData.checkIn && reservationData.checkOut) {
      const nights = differenceInDays(reservationData.checkOut, reservationData.checkIn);
      if (nights > 0) {
        const selectedPlan = plans.find(p => p.id === reservationData.planId);
        const planPrice = selectedPlan ? selectedPlan.precioAdicional : 0;
        const pricePerNight = reservationData.pricePerNight + planPrice;
        setTotalPrice(pricePerNight * nights);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [reservationData.checkIn, reservationData.checkOut, reservationData.pricePerNight, reservationData.planId, plans]);

  const paymentMethods = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
    { value: 'transferencia', label: 'Transferencia Bancaria' },
    { value: 'cheque', label: 'Cheque' }
  ];

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente', color: 'text-yellow-600' },
    { value: 'confirmada', label: 'Confirmada', color: 'text-green-600' },
    { value: 'cancelada', label: 'Cancelada', color: 'text-red-600' }
  ];

  const handleRoomTypeChange = (value: string) => {
    const selectedType = roomTypes.find(t => t.id === value);
    setReservationData(prev => ({
      ...prev,
      roomTypeId: value,
      roomId: '', // Reset room selection
      pricePerNight: selectedType?.precioBase || 0
    }));
  };

  const handleRoomChange = (value: string) => {
    const selectedRoom = rooms.find(r => r.id === value);
    setReservationData(prev => ({
      ...prev,
      roomId: value,
      pricePerNight: selectedRoom?.precio || prev.pricePerNight
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservationData.guestName || !reservationData.checkIn || !reservationData.checkOut) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios (nombre, check-in, check-out)",
        variant: "destructive"
      });
      return;
    }

    if (!reservationData.roomTypeId || !reservationData.roomId) {
      toast({
        title: "Error",
        description: "Por favor seleccione el tipo de habitación y número de habitación",
        variant: "destructive"
      });
      return;
    }


    try {
      const selectedType = roomTypes.find(t => t.id === reservationData.roomTypeId);
      const selectedRoom = rooms.find(r => r.id === reservationData.roomId);
      const selectedPlan = plans.find(p => p.id === reservationData.planId);

      await addReservation({
        hotelId,
        reservationNumber,
        guestName: reservationData.guestName,
        guestEmail: reservationData.guestEmail,
        guestPhone: reservationData.guestPhone,
        checkIn: reservationData.checkIn!,
        checkOut: reservationData.checkOut!,
        adults: reservationData.adults,
        children: reservationData.children,
        roomType: selectedType?.nombre || '',
        roomTypeId: reservationData.roomTypeId,
        roomNumber: selectedRoom?.numero || '',
        roomId: reservationData.roomId,
        pricePerNight: reservationData.pricePerNight + (selectedPlan?.precioAdicional || 0),
        totalPrice,
        plan: selectedPlan?.nombre || '',
        planId: reservationData.planId,
        paymentMethod: reservationData.paymentMethod,
        status: reservationData.status as any,
        specialRequests: reservationData.specialRequests
      });

      toast({
        title: "Reserva Registrada",
        description: `Reserva ${reservationNumber} creada exitosamente`,
      });

      // Reset form
      setReservationData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkIn: undefined,
        checkOut: undefined,
        roomTypeId: '',
        roomId: '',
        adults: 1,
        children: 0,
        planId: '',
        pricePerNight: 0,
        paymentMethod: '',
        status: 'pendiente',
        specialRequests: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la reserva. Intente nuevamente.",
        variant: "destructive"
      });
    }
  };

  if (loadingTypes || loadingRooms || loadingPlans) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Nueva Reserva</span>
          </CardTitle>
          <CardDescription>
            Número de Reserva: <span className="font-mono font-semibold">{reservationNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del Huésped */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Datos del Huésped</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="guestName">Nombre Completo *</Label>
                    <Input
                      id="guestName"
                      value={reservationData.guestName}
                      onChange={(e) => setReservationData(prev => ({ ...prev, guestName: e.target.value }))}
                      placeholder="Nombre del huésped"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={reservationData.guestEmail}
                      onChange={(e) => setReservationData(prev => ({ ...prev, guestEmail: e.target.value }))}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestPhone">Teléfono</Label>
                    <Input
                      id="guestPhone"
                      value={reservationData.guestPhone}
                      onChange={(e) => setReservationData(prev => ({ ...prev, guestPhone: e.target.value }))}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Detalles de la Reserva */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Detalles de Estancia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !reservationData.checkIn && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reservationData.checkIn ? (
                              format(reservationData.checkIn, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reservationData.checkIn}
                            onSelect={(date) => setReservationData(prev => ({ ...prev, checkIn: date }))}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                            disabled={(date) => startOfDay(date) < startOfDay(new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Check-out *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !reservationData.checkOut && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reservationData.checkOut ? (
                              format(reservationData.checkOut, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reservationData.checkOut}
                            onSelect={(date) => setReservationData(prev => ({ ...prev, checkOut: date }))}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                            disabled={(date) => !reservationData.checkIn || date <= reservationData.checkIn}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adults">Adultos</Label>
                      <Input
                        id="adults"
                        type="number"
                        min="1"
                        value={reservationData.adults}
                        onChange={(e) => setReservationData(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="children">Niños</Label>
                      <Input
                        id="children"
                        type="number"
                        min="0"
                        value={reservationData.children}
                        onChange={(e) => setReservationData(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Habitación y Tarifas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Habitación y Tarifas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tipo de Habitación *</Label>
                    <Select value={reservationData.roomTypeId} onValueChange={handleRoomTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.nombre} - ${type.precioBase.toLocaleString()}/noche
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Número de Habitación *</Label>
                    <Select 
                      value={reservationData.roomId} 
                      onValueChange={handleRoomChange}
                      disabled={!reservationData.roomTypeId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar habitación" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No hay habitaciones disponibles
                          </SelectItem>
                        ) : (
                          availableRooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              Hab. {room.numero} - Piso {room.piso}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pricePerNight">Precio por Noche ($)</Label>
                    <Input
                      id="pricePerNight"
                      type="number"
                      value={reservationData.pricePerNight}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Plan Contratado</Label>
                    <Select value={reservationData.planId} onValueChange={(value) => setReservationData(prev => ({ ...prev, planId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.filter(p => p.activo).map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.nombre} {plan.precioAdicional > 0 && `(+$${plan.precioAdicional.toLocaleString()})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Forma de Pago</Label>
                    <Select value={reservationData.paymentMethod} onValueChange={(value) => setReservationData(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estado de la Reserva</Label>
                    <Select value={reservationData.status} onValueChange={(value) => setReservationData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <span className={status.color}>{status.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Precio Total */}
                {totalPrice > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Precio Total</p>
                        {reservationData.checkIn && reservationData.checkOut && (
                          <p className="text-xs text-muted-foreground">
                            {differenceInDays(reservationData.checkOut, reservationData.checkIn)} noches
                          </p>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        ${totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Guardar Reserva</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterReservation;
