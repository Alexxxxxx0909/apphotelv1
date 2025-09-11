import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  LogIn, 
  LogOut, 
  Clock, 
  Users,
  Download,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MovementReports: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('today');

  const mockMovements = [
    {
      id: '1',
      type: 'checkin',
      guestName: 'Juan Pérez García',
      roomNumber: '205',
      scheduledTime: '15:00',
      actualTime: '15:30',
      status: 'completed'
    },
    {
      id: '2',
      type: 'checkout',
      guestName: 'María González López',
      roomNumber: '301',
      scheduledTime: '11:00',
      actualTime: '10:45',
      status: 'completed'
    },
    {
      id: '3',
      type: 'checkin',
      guestName: 'Carlos Rodríguez Martín',
      roomNumber: '102',
      scheduledTime: '14:00',
      actualTime: null,
      status: 'pending'
    }
  ];

  const activeGuests = [
    { name: 'Ana López Silva', room: '203', checkIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), checkOut: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
    { name: 'Pedro Martín Cruz', room: '305', checkIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { name: 'Elena Sánchez García', room: '108', checkIn: new Date(), checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
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
          <CardTitle>Reportes de Movimientos</CardTitle>
          <CardDescription>
            Check-ins, check-outs y huéspedes activos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="yesterday">Ayer</SelectItem>
                <SelectItem value="this-week">Esta semana</SelectItem>
                <SelectItem value="custom">Fecha específica</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumen del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <LogIn className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-muted-foreground">Check-ins Hoy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <LogOut className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-muted-foreground">Check-outs Hoy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-muted-foreground">Llegadas Tardías</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">68</div>
            <div className="text-sm text-muted-foreground">Huéspedes Activos</div>
          </CardContent>
        </Card>
      </div>

      {/* Movimientos del día */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMovements.map((movement) => (
              <div key={movement.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {movement.type === 'checkin' ? (
                    <LogIn className="h-5 w-5 text-green-600" />
                  ) : (
                    <LogOut className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <div className="font-medium">{movement.guestName}</div>
                    <div className="text-sm text-muted-foreground">
                      Habitación {movement.roomNumber}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {movement.status === 'completed' ? (
                      <Badge className="bg-green-100 text-green-800">Completado</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Programado: {movement.scheduledTime}
                    {movement.actualTime && ` | Real: ${movement.actualTime}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Llegadas anticipadas y salidas tardías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Llegadas Anticipadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <div>
                  <div className="font-medium">María González</div>
                  <div className="text-sm text-muted-foreground">Habitación 301</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Llegó: 10:45</div>
                  <div className="text-xs text-yellow-600">2h 15min antes</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <div>
                  <div className="font-medium">Pedro Martín</div>
                  <div className="text-sm text-muted-foreground">Habitación 204</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Llegó: 13:30</div>
                  <div className="text-xs text-yellow-600">1h 30min antes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salidas Tardías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <div>
                  <div className="font-medium">Carlos Rodríguez</div>
                  <div className="text-sm text-muted-foreground">Habitación 102</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Salió: 13:30</div>
                  <div className="text-xs text-red-600">2h 30min tarde</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Huéspedes actualmente alojados */}
      <Card>
        <CardHeader>
          <CardTitle>Huéspedes Actualmente Alojados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeGuests.map((guest, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{guest.name}</div>
                  <div className="text-sm text-muted-foreground">Habitación {guest.room}</div>
                </div>
                <div className="text-right text-sm">
                  <div>Check-in: {format(guest.checkIn, "dd/MM/yyyy")}</div>
                  <div>Check-out: {format(guest.checkOut, "dd/MM/yyyy")}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MovementReports;