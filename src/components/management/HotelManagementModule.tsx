import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Hotel, 
  Building, 
  Bed, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Settings,
  MapPin,
  Phone,
  Mail,
  Star,
  Users,
  Calendar,
  DollarSign,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface Room {
  id: string;
  numero: string;
  tipo: string;
  estado: 'disponible' | 'ocupada' | 'limpieza' | 'mantenimiento' | 'fuera_servicio';
  piso: number;
  capacidad: number;
  precio: number;
  caracteristicas: string[];
  ultimaLimpieza?: Date;
  proximoMantenimiento?: Date;
}

interface RoomType {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  precioBase: number;
  caracteristicas: string[];
  cantidad: number;
}

const HotelManagementModule: React.FC = () => {
  const { toast } = useToast();
  
  const [hotelInfo, setHotelInfo] = useState({
    nombre: 'Hotel Bloom Suites',
    direccion: 'Calle 123 #45-67, Centro',
    telefono: '+57 (1) 234-5678',
    email: 'info@bloomsuites.com',
    categoria: '4',
    totalHabitaciones: 48,
    pisos: 6
  });

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      numero: '101',
      tipo: 'Individual',
      estado: 'disponible',
      piso: 1,
      capacidad: 1,
      precio: 120000,
      caracteristicas: ['TV', 'WiFi', 'Aire Acondicionado', 'Baño Privado'],
      ultimaLimpieza: new Date()
    },
    {
      id: '2',
      numero: '102',
      tipo: 'Doble',
      estado: 'ocupada',
      piso: 1,
      capacidad: 2,
      precio: 180000,
      caracteristicas: ['TV', 'WiFi', 'Aire Acondicionado', 'Baño Privado', 'Balcón'],
      ultimaLimpieza: new Date()
    }
  ]);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      id: '1',
      nombre: 'Individual',
      descripcion: 'Habitación cómoda para una persona',
      capacidad: 1,
      precioBase: 120000,
      caracteristicas: ['Cama individual', 'TV', 'WiFi', 'Aire Acondicionado', 'Baño Privado'],
      cantidad: 20
    },
    {
      id: '2',
      nombre: 'Doble',
      descripcion: 'Habitación espaciosa para dos personas',
      capacidad: 2,
      precioBase: 180000,
      caracteristicas: ['Cama matrimonial', 'TV', 'WiFi', 'Aire Acondicionado', 'Baño Privado', 'Balcón'],
      cantidad: 15
    },
    {
      id: '3',
      nombre: 'Suite',
      descripcion: 'Suite de lujo con sala separada',
      capacidad: 3,
      precioBase: 320000,
      caracteristicas: ['Cama king', 'Sala', 'TV Smart', 'WiFi Premium', 'Aire Acondicionado', 'Jacuzzi', 'Balcón con vista'],
      cantidad: 8
    },
    {
      id: '4',
      nombre: 'Familiar',
      descripcion: 'Amplia habitación para familias',
      capacidad: 4,
      precioBase: 250000,
      caracteristicas: ['Cama matrimonial', 'Cama auxiliar', 'TV', 'WiFi', 'Aire Acondicionado', 'Baño Privado', 'Minibar'],
      cantidad: 5
    }
  ]);

  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const [showCreateTypeDialog, setShowCreateTypeDialog] = useState(false);
  const [showBulkCreateDialog, setShowBulkCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'ocupada': return 'bg-red-100 text-red-800';
      case 'limpieza': return 'bg-yellow-100 text-yellow-800';
      case 'mantenimiento': return 'bg-orange-100 text-orange-800';
      case 'fuera_servicio': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'disponible': return <CheckCircle className="h-4 w-4" />;
      case 'ocupada': return <Users className="h-4 w-4" />;
      case 'limpieza': return <Settings className="h-4 w-4" />;
      case 'mantenimiento': return <Wrench className="h-4 w-4" />;
      case 'fuera_servicio': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const estadisticasHabitaciones = {
    total: rooms.length,
    disponibles: rooms.filter(r => r.estado === 'disponible').length,
    ocupadas: rooms.filter(r => r.estado === 'ocupada').length,
    limpieza: rooms.filter(r => r.estado === 'limpieza').length,
    mantenimiento: rooms.filter(r => r.estado === 'mantenimiento').length,
    ocupacionPorcentaje: Math.round((rooms.filter(r => r.estado === 'ocupada').length / rooms.length) * 100)
  };

  const handleBulkCreateRooms = () => {
    toast({
      title: "Habitaciones creadas",
      description: "Las habitaciones han sido generadas exitosamente con numeración correlativa.",
    });
    setShowBulkCreateDialog(false);
  };

  const handleCreateRoom = () => {
    toast({
      title: "Habitación creada",
      description: "La nueva habitación ha sido registrada exitosamente.",
    });
    setShowCreateRoomDialog(false);
  };

  const handleCreateRoomType = () => {
    toast({
      title: "Tipo creado",
      description: "El nuevo tipo de habitación ha sido configurado.",
    });
    setShowCreateTypeDialog(false);
  };

  const handleEditRoom = (roomId: string) => {
    toast({
      title: "Habitación actualizada",
      description: "Los datos de la habitación han sido modificados.",
    });
  };

  const handleChangeRoomStatus = (roomId: string, newStatus: string) => {
    setRooms(prev => 
      prev.map(r => 
        r.id === roomId 
          ? { ...r, estado: newStatus as any }
          : r
      )
    );
    toast({
      title: "Estado actualizado",
      description: `La habitación ha sido marcada como ${newStatus}.`,
    });
  };

  const handleMarkOutOfService = (roomId: string) => {
    handleChangeRoomStatus(roomId, 'fuera_servicio');
  };

  const handleUpdateHotelInfo = () => {
    toast({
      title: "Información actualizada",
      description: "Los datos del hotel han sido actualizados correctamente.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="rooms">Habitaciones</TabsTrigger>
          <TabsTrigger value="types">Tipos de Habitación</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        {/* Información General */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5" />
                  Información del Hotel
                </CardTitle>
                <CardDescription>
                  Administre los datos básicos y configuración del establecimiento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Hotel</Label>
                    <Input
                      id="nombre"
                      value={hotelInfo.nombre}
                      onChange={(e) => setHotelInfo({...hotelInfo, nombre: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select value={hotelInfo.categoria} onValueChange={(value) => setHotelInfo({...hotelInfo, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Estrellas</SelectItem>
                        <SelectItem value="4">4 Estrellas</SelectItem>
                        <SelectItem value="5">5 Estrellas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={hotelInfo.direccion}
                      onChange={(e) => setHotelInfo({...hotelInfo, direccion: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={hotelInfo.telefono}
                      onChange={(e) => setHotelInfo({...hotelInfo, telefono: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={hotelInfo.email}
                      onChange={(e) => setHotelInfo({...hotelInfo, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pisos">Número de Pisos</Label>
                    <Input
                      id="pisos"
                      type="number"
                      value={hotelInfo.pisos}
                      onChange={(e) => setHotelInfo({...hotelInfo, pisos: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalHabitaciones">Total Habitaciones</Label>
                    <Input
                      id="totalHabitaciones"
                      type="number"
                      value={hotelInfo.totalHabitaciones}
                      onChange={(e) => setHotelInfo({...hotelInfo, totalHabitaciones: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleUpdateHotelInfo}>
                  Actualizar Información
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestión de Habitaciones */}
        <TabsContent value="rooms">
          <div className="space-y-6">
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{estadisticasHabitaciones.total}</p>
                    </div>
                    <Bed className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Disponibles</p>
                      <p className="text-2xl font-bold text-green-600">{estadisticasHabitaciones.disponibles}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Ocupadas</p>
                      <p className="text-2xl font-bold text-red-600">{estadisticasHabitaciones.ocupadas}</p>
                    </div>
                    <Users className="h-4 w-4 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Limpieza</p>
                      <p className="text-2xl font-bold text-yellow-600">{estadisticasHabitaciones.limpieza}</p>
                    </div>
                    <Settings className="h-4 w-4 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Mantenimiento</p>
                      <p className="text-2xl font-bold text-orange-600">{estadisticasHabitaciones.mantenimiento}</p>
                    </div>
                    <Wrench className="h-4 w-4 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gestión de habitaciones */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Habitaciones del Hotel</CardTitle>
                    <CardDescription>
                      Gestione el inventario y estado de las habitaciones
                    </CardDescription>
                  </div>
                  <div className="space-x-2">
                    <Dialog open={showBulkCreateDialog} onOpenChange={setShowBulkCreateDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Building className="h-4 w-4 mr-2" />
                          Crear Masivo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crear Habitaciones Masivamente</DialogTitle>
                          <DialogDescription>
                            Genere múltiples habitaciones automáticamente con numeración correlativa
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="tipoHab">Tipo de Habitación</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roomTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cantidad">Cantidad</Label>
                              <Input id="cantidad" type="number" placeholder="10" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="pisoInicio">Piso de Inicio</Label>
                              <Input id="pisoInicio" type="number" placeholder="1" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="numeroInicio">Número de Inicio</Label>
                              <Input id="numeroInicio" placeholder="101" />
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowBulkCreateDialog(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleBulkCreateRooms}>
                            Generar Habitaciones
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={showCreateRoomDialog} onOpenChange={setShowCreateRoomDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Nueva Habitación
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Nueva Habitación</DialogTitle>
                          <DialogDescription>
                            Agregue una habitación individual al inventario
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="numero">Número</Label>
                              <Input id="numero" placeholder="101" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="piso">Piso</Label>
                              <Input id="piso" type="number" placeholder="1" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tipo">Tipo</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {roomTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="capacidad">Capacidad</Label>
                              <Input id="capacidad" type="number" placeholder="2" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="precio">Precio Base</Label>
                              <Input id="precio" type="number" placeholder="180000" />
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowCreateRoomDialog(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleCreateRoom}>
                            Crear Habitación
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Habitación</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Capacidad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{room.numero}</div>
                            <div className="text-sm text-muted-foreground">Piso {room.piso}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{room.tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getEstadoIcon(room.estado)}
                            <Badge className={getEstadoColor(room.estado)}>
                              {room.estado.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {room.capacidad}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${room.precio.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              title="Editar habitación"
                              onClick={() => handleEditRoom(room.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Select onValueChange={(value) => handleChangeRoomStatus(room.id, value)}>
                              <SelectTrigger className="w-32 h-8">
                                <Settings className="h-4 w-4" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="disponible">Disponible</SelectItem>
                                <SelectItem value="ocupada">Ocupada</SelectItem>
                                <SelectItem value="limpieza">En Limpieza</SelectItem>
                                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                                <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tipos de Habitación */}
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tipos de Habitación</CardTitle>
                  <CardDescription>
                    Configure los diferentes tipos y sus características
                  </CardDescription>
                </div>
                <Dialog open={showCreateTypeDialog} onOpenChange={setShowCreateTypeDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Tipo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Tipo de Habitación</DialogTitle>
                      <DialogDescription>
                        Defina las características de un nuevo tipo de habitación
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombreTipo">Nombre del Tipo</Label>
                          <Input id="nombreTipo" placeholder="Ej. Suite Premium" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="capacidadTipo">Capacidad</Label>
                          <Input id="capacidadTipo" type="number" placeholder="2" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="descripcionTipo">Descripción</Label>
                        <Textarea id="descripcionTipo" placeholder="Describe las características principales..." />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="precioBaseTipo">Precio Base</Label>
                          <Input id="precioBaseTipo" type="number" placeholder="250000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cantidadTipo">Cantidad Disponible</Label>
                          <Input id="cantidadTipo" type="number" placeholder="5" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Características Incluidas</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['TV', 'WiFi', 'Aire Acondicionado', 'Baño Privado', 'Balcón', 'Jacuzzi', 'Minibar', 'Vista al Mar'].map(caracteristica => (
                            <div key={caracteristica} className="flex items-center space-x-2">
                              <input type="checkbox" id={caracteristica} className="rounded" />
                              <Label htmlFor={caracteristica} className="text-sm">
                                {caracteristica}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateTypeDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateRoomType}>
                        Crear Tipo
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-4">
                {roomTypes.map((type) => (
                  <Card key={type.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">{type.nombre}</h3>
                            <Badge variant="outline">
                              {type.cantidad} habitaciones
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{type.descripcion}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {type.capacidad} personas
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              ${type.precioBase.toLocaleString()}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {type.caracteristicas.map(caracteristica => (
                              <Badge key={caracteristica} variant="secondary" className="text-xs">
                                {caracteristica}
                              </Badge>
                            ))}
                          </div>
                        </div>
                         <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title="Editar tipo"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title="Eliminar tipo"
                            onClick={() => {
                              toast({
                                title: "Tipo eliminado",
                                description: "El tipo de habitación ha sido eliminado.",
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estadísticas */}
        <TabsContent value="stats">
          <div className="grid gap-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ocupación Actual</p>
                      <p className="text-3xl font-bold text-primary">
                        {estadisticasHabitaciones.ocupacionPorcentaje}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {estadisticasHabitaciones.ocupadas} de {estadisticasHabitaciones.total}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ingresos Diarios</p>
                      <p className="text-3xl font-bold text-green-600">
                        ${(rooms.filter(r => r.estado === 'ocupada').reduce((sum, r) => sum + r.precio, 0)).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Revenue per day
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Habitaciones Disponibles</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {estadisticasHabitaciones.disponibles}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Listas para check-in
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Promedio por Habitación</p>
                      <p className="text-3xl font-bold text-purple-600">
                        ${Math.round(rooms.reduce((sum, r) => sum + r.precio, 0) / rooms.length).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Precio promedio
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reportes detallados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Tipo</CardTitle>
                  <CardDescription>
                    Análisis de habitaciones por tipo y ocupación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roomTypes.map(type => {
                      const roomsOfType = rooms.filter(r => r.tipo === type.nombre);
                      const occupiedOfType = roomsOfType.filter(r => r.estado === 'ocupada').length;
                      const occupancyRate = roomsOfType.length > 0 ? Math.round((occupiedOfType / roomsOfType.length) * 100) : 0;
                      
                      return (
                        <div key={type.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{type.nombre}</div>
                            <div className="text-sm text-muted-foreground">
                              {occupiedOfType}/{roomsOfType.length} ocupadas
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{occupancyRate}%</div>
                            <div className="text-xs text-muted-foreground">Ocupación</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de Habitaciones</CardTitle>
                  <CardDescription>
                    Vista general del estado operativo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="font-medium">Disponibles</span>
                      </div>
                      <span className="font-bold text-green-600">{estadisticasHabitaciones.disponibles}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-red-600 mr-3" />
                        <span className="font-medium">Ocupadas</span>
                      </div>
                      <span className="font-bold text-red-600">{estadisticasHabitaciones.ocupadas}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-yellow-600 mr-3" />
                        <span className="font-medium">En Limpieza</span>
                      </div>
                      <span className="font-bold text-yellow-600">{estadisticasHabitaciones.limpieza}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded">
                      <div className="flex items-center">
                        <Wrench className="h-5 w-5 text-orange-600 mr-3" />
                        <span className="font-medium">Mantenimiento</span>
                      </div>
                      <span className="font-bold text-orange-600">{estadisticasHabitaciones.mantenimiento}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas y mantenimiento */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Mantenimiento</CardTitle>
                <CardDescription>
                  Habitaciones que requieren atención inmediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rooms.filter(r => r.estado === 'mantenimiento' || r.estado === 'fuera_servicio').length > 0 ? (
                  <div className="space-y-3">
                    {rooms.filter(r => r.estado === 'mantenimiento' || r.estado === 'fuera_servicio').map(room => (
                      <div key={room.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
                          <div>
                            <div className="font-medium">Habitación {room.numero}</div>
                            <div className="text-sm text-muted-foreground">
                              {room.estado === 'mantenimiento' ? 'Requiere mantenimiento' : 'Fuera de servicio'} - Piso {room.piso}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleChangeRoomStatus(room.id, 'disponible')}
                          >
                            Marcar Lista
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-lg font-medium text-green-600">¡Excelente!</p>
                    <p className="text-muted-foreground">No hay alertas de mantenimiento pendientes.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotelManagementModule;