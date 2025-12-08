import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { useRoomFeatures } from '@/hooks/useRoomFeatures';
import { useRooms } from '@/hooks/useRooms';

import { useHotels } from '@/hooks/useHotels';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
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


const HotelManagementModule: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const hotelId = user?.hotel;
  const { hotels, loading: loadingHotels } = useHotels();
  const { roomTypes, loading: loadingTypes, addRoomType, updateRoomType, deleteRoomType } = useRoomTypes(hotelId);
  const { features, loading: loadingFeatures, addFeature, updateFeature, deleteFeature } = useRoomFeatures(hotelId);
  const { rooms, loading: loadingRooms, addRoom, updateRoom, deleteRoom } = useRooms(hotelId);
  
  
  const currentHotel = hotels.find(h => h.id === hotelId);
  
  const [hotelInfo, setHotelInfo] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    ciudad: '',
    pais: '',
    categoria: '4',
    pisos: 0
  });

  // Cargar información del hotel desde Firebase
  useEffect(() => {
    if (currentHotel) {
      setHotelInfo({
        nombre: currentHotel.nombre || '',
        direccion: currentHotel.direccion || '',
        telefono: currentHotel.telefono || '',
        email: currentHotel.email || '',
        ciudad: currentHotel.ciudad || '',
        pais: currentHotel.pais || '',
        categoria: '4',
        pisos: 0
      });
    }
  }, [currentHotel]);

  const [newRoom, setNewRoom] = useState({
    numero: '',
    tipo: '',
    tipoId: '',
    piso: 1,
    capacidad: 1,
    precio: 0
  });

  const [bulkCreate, setBulkCreate] = useState({
    tipoId: '',
    cantidad: 0,
    pisoInicio: 1,
    numeroInicio: ''
  });

  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const [showCreateTypeDialog, setShowCreateTypeDialog] = useState(false);
  const [showBulkCreateDialog, setShowBulkCreateDialog] = useState(false);
  const [showManageFeaturesDialog, setShowManageFeaturesDialog] = useState(false);
  const [showEditTypeDialog, setShowEditTypeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [newFeatureName, setNewFeatureName] = useState('');
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<any>(null);
  
  // Estados para habitaciones
  const [showRoomDetailsDialog, setShowRoomDetailsDialog] = useState(false);
  const [showEditRoomDialog, setShowEditRoomDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  
  const [newRoomType, setNewRoomType] = useState({
    nombre: '',
    descripcion: '',
    capacidad: 1,
    precioBase: 0,
    cantidad: 0,
    caracteristicas: [] as string[]
  });

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

  const handleBulkCreateRooms = async () => {
    if (!hotelId || !bulkCreate.tipoId || bulkCreate.cantidad <= 0) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedType = roomTypes.find(t => t.id === bulkCreate.tipoId);
      if (!selectedType) {
        throw new Error("Tipo de habitación no encontrado");
      }

      const baseNumber = parseInt(bulkCreate.numeroInicio) || 100;
      const promises = [];

      for (let i = 0; i < bulkCreate.cantidad; i++) {
        const roomNumber = (baseNumber + i).toString();
        const floor = bulkCreate.pisoInicio + Math.floor(i / 10);
        
        promises.push(addRoom({
          hotelId,
          numero: roomNumber,
          tipo: selectedType.nombre,
          tipoId: selectedType.id,
          estado: 'disponible',
          piso: floor,
          capacidad: selectedType.capacidad,
          precio: selectedType.precioBase,
          caracteristicas: selectedType.caracteristicas,
          ultimaLimpieza: new Date()
        }));
      }

      await Promise.all(promises);

      toast({
        title: "Habitaciones creadas",
        description: `Se han creado ${bulkCreate.cantidad} habitaciones exitosamente.`,
      });
      
      setBulkCreate({
        tipoId: '',
        cantidad: 0,
        pisoInicio: 1,
        numeroInicio: ''
      });
      setShowBulkCreateDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron crear las habitaciones.",
        variant: "destructive"
      });
    }
  };

  const handleCreateRoom = async () => {
    if (!hotelId || !newRoom.numero || !newRoom.tipoId) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedType = roomTypes.find(t => t.id === newRoom.tipoId);
      if (!selectedType) {
        throw new Error("Tipo de habitación no encontrado");
      }

      await addRoom({
        hotelId,
        numero: newRoom.numero,
        tipo: selectedType.nombre,
        tipoId: selectedType.id,
        estado: 'disponible',
        piso: newRoom.piso,
        capacidad: newRoom.capacidad || selectedType.capacidad,
        precio: newRoom.precio || selectedType.precioBase,
        caracteristicas: selectedType.caracteristicas,
        ultimaLimpieza: new Date()
      });

      toast({
        title: "Habitación creada",
        description: "La nueva habitación ha sido registrada exitosamente.",
      });
      
      setNewRoom({
        numero: '',
        tipo: '',
        tipoId: '',
        piso: 1,
        capacidad: 1,
        precio: 0
      });
      setShowCreateRoomDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la habitación.",
        variant: "destructive"
      });
    }
  };

  const handleCreateRoomType = async () => {
    if (!hotelId) {
      toast({
        title: "Error",
        description: "No se pudo identificar el hotel.",
        variant: "destructive"
      });
      return;
    }

    if (!newRoomType.nombre || !newRoomType.descripcion || newRoomType.precioBase <= 0) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addRoomType({
        hotelId,
        nombre: newRoomType.nombre,
        descripcion: newRoomType.descripcion,
        capacidad: newRoomType.capacidad,
        precioBase: newRoomType.precioBase,
        caracteristicas: newRoomType.caracteristicas,
        cantidad: newRoomType.cantidad
      });
      
      toast({
        title: "Tipo creado",
        description: "El nuevo tipo de habitación ha sido configurado.",
      });
      
      setNewRoomType({
        nombre: '',
        descripcion: '',
        capacidad: 1,
        precioBase: 0,
        cantidad: 0,
        caracteristicas: []
      });
      setShowCreateTypeDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el tipo de habitación.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRoomType = async () => {
    if (!editingType?.id) return;

    try {
      await updateRoomType(editingType.id, {
        nombre: editingType.nombre,
        descripcion: editingType.descripcion,
        capacidad: editingType.capacidad,
        precioBase: editingType.precioBase,
        caracteristicas: editingType.caracteristicas,
        cantidad: editingType.cantidad
      });
      
      toast({
        title: "Tipo actualizado",
        description: "El tipo de habitación ha sido actualizado.",
      });
      
      setEditingType(null);
      setShowEditTypeDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el tipo de habitación.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRoomType = async (id: string) => {
    try {
      await deleteRoomType(id);
      toast({
        title: "Tipo eliminado",
        description: "El tipo de habitación ha sido eliminado.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el tipo de habitación.",
        variant: "destructive"
      });
    }
  };

  const handleAddFeature = async () => {
    if (!hotelId || !newFeatureName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese un nombre para la característica.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addFeature({
        hotelId,
        nombre: newFeatureName.trim(),
        activo: true
      });
      
      toast({
        title: "Característica agregada",
        description: "La nueva característica ha sido creada.",
      });
      
      setNewFeatureName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar la característica.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFeature = async (id: string, nombre: string) => {
    try {
      await updateFeature(id, { nombre });
      toast({
        title: "Característica actualizada",
        description: "La característica ha sido actualizada.",
      });
      setEditingFeature(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la característica.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFeature = async (id: string) => {
    try {
      await deleteFeature(id);
      toast({
        title: "Característica eliminada",
        description: "La característica ha sido eliminada.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la característica.",
        variant: "destructive"
      });
    }
  };

  const toggleFeatureSelection = (featureName: string) => {
    setNewRoomType(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.includes(featureName)
        ? prev.caracteristicas.filter(f => f !== featureName)
        : [...prev.caracteristicas, featureName]
    }));
  };

  const toggleEditTypeFeature = (featureName: string) => {
    if (!editingType) return;
    setEditingType({
      ...editingType,
      caracteristicas: editingType.caracteristicas.includes(featureName)
        ? editingType.caracteristicas.filter((f: string) => f !== featureName)
        : [...editingType.caracteristicas, featureName]
    });
  };

  const handleViewRoomDetails = (room: any) => {
    setSelectedRoom(room);
    setShowRoomDetailsDialog(true);
  };

  const handleEditRoom = (room: any) => {
    const roomType = roomTypes.find(t => t.id === room.tipoId);
    setEditingRoom({
      ...room,
      tipoId: room.tipoId || roomType?.id || ''
    });
    setShowEditRoomDialog(true);
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom?.id) return;
    
    try {
      const selectedType = roomTypes.find(t => t.id === editingRoom.tipoId);
      await updateRoom(editingRoom.id, {
        numero: editingRoom.numero,
        tipo: selectedType?.nombre || editingRoom.tipo,
        tipoId: editingRoom.tipoId,
        piso: editingRoom.piso,
        capacidad: editingRoom.capacidad,
        precio: editingRoom.precio,
        caracteristicas: selectedType?.caracteristicas || editingRoom.caracteristicas
      });
      
      toast({
        title: "Habitación actualizada",
        description: "Los datos de la habitación han sido actualizados.",
      });
      
      setEditingRoom(null);
      setShowEditRoomDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la habitación.",
        variant: "destructive"
      });
    }
  };

  const handleOpenStatusDialog = (room: any) => {
    setSelectedRoom(room);
    setShowStatusDialog(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoom(roomId);
      toast({
        title: "Habitación eliminada",
        description: "La habitación ha sido eliminada del inventario.",
      });
      setShowRoomDetailsDialog(false);
      setSelectedRoom(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la habitación.",
        variant: "destructive"
      });
    }
  };

  const handleChangeRoomStatus = async (roomId: string, newStatus: string) => {
    try {
      await updateRoom(roomId, { 
        estado: newStatus as any,
        ...(newStatus === 'limpieza' && { ultimaLimpieza: new Date() })
      });
      
      toast({
        title: "Estado actualizado",
        description: `La habitación ha sido marcada como ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la habitación.",
        variant: "destructive"
      });
    }
  };


  const handleMarkOutOfService = (roomId: string) => {
    handleChangeRoomStatus(roomId, 'fuera_servicio');
  };

  const handleUpdateHotelInfo = async () => {
    if (!hotelId) {
      toast({
        title: "Error",
        description: "No se pudo identificar el hotel.",
        variant: "destructive"
      });
      return;
    }

    try {
      const hotelRef = doc(db, 'hotels', hotelId);
      await updateDoc(hotelRef, {
        nombre: hotelInfo.nombre,
        direccion: hotelInfo.direccion,
        telefono: hotelInfo.telefono,
        email: hotelInfo.email,
        ciudad: hotelInfo.ciudad,
        pais: hotelInfo.pais
      });

      toast({
        title: "Información actualizada",
        description: "Los datos del hotel han sido actualizados correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la información del hotel.",
        variant: "destructive"
      });
    }
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
                      placeholder="Hotel Bloom Suites"
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
                      placeholder="Calle 123 #45-67, Centro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      value={hotelInfo.ciudad}
                      onChange={(e) => setHotelInfo({...hotelInfo, ciudad: e.target.value})}
                      placeholder="Bogotá"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pais">País</Label>
                    <Input
                      id="pais"
                      value={hotelInfo.pais}
                      onChange={(e) => setHotelInfo({...hotelInfo, pais: e.target.value})}
                      placeholder="Colombia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={hotelInfo.telefono}
                      onChange={(e) => setHotelInfo({...hotelInfo, telefono: e.target.value})}
                      placeholder="+57 (1) 234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={hotelInfo.email}
                      onChange={(e) => setHotelInfo({...hotelInfo, email: e.target.value})}
                      placeholder="info@bloomsuites.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pisos">Número de Pisos</Label>
                    <Input
                      id="pisos"
                      type="number"
                      value={hotelInfo.pisos || ''}
                      onChange={(e) => setHotelInfo({...hotelInfo, pisos: parseInt(e.target.value) || 0})}
                      placeholder="6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalHabitaciones">Total Habitaciones</Label>
                    <Input
                      id="totalHabitaciones"
                      type="number"
                      value={rooms.length}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Calculado automáticamente desde el inventario</p>
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
                              <Select value={bulkCreate.tipoId} onValueChange={(value) => setBulkCreate({...bulkCreate, tipoId: value})}>
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
                              <Input 
                                id="cantidad" 
                                type="number" 
                                placeholder="10"
                                value={bulkCreate.cantidad || ''}
                                onChange={(e) => setBulkCreate({...bulkCreate, cantidad: parseInt(e.target.value) || 0})}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="pisoInicio">Piso de Inicio</Label>
                              <Input 
                                id="pisoInicio" 
                                type="number" 
                                placeholder="1"
                                value={bulkCreate.pisoInicio || ''}
                                onChange={(e) => setBulkCreate({...bulkCreate, pisoInicio: parseInt(e.target.value) || 1})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="numeroInicio">Número de Inicio</Label>
                              <Input 
                                id="numeroInicio" 
                                placeholder="101"
                                value={bulkCreate.numeroInicio}
                                onChange={(e) => setBulkCreate({...bulkCreate, numeroInicio: e.target.value})}
                              />
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
                              <Input 
                                id="numero" 
                                placeholder="101"
                                value={newRoom.numero}
                                onChange={(e) => setNewRoom({...newRoom, numero: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="piso">Piso</Label>
                              <Input 
                                id="piso" 
                                type="number" 
                                placeholder="1"
                                value={newRoom.piso || ''}
                                onChange={(e) => setNewRoom({...newRoom, piso: parseInt(e.target.value) || 1})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tipo">Tipo</Label>
                              <Select value={newRoom.tipoId} onValueChange={(value) => {
                                const selectedType = roomTypes.find(t => t.id === value);
                                setNewRoom({
                                  ...newRoom, 
                                  tipoId: value,
                                  tipo: selectedType?.nombre || '',
                                  capacidad: selectedType?.capacidad || 1,
                                  precio: selectedType?.precioBase || 0
                                });
                              }}>
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
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="capacidad">Capacidad</Label>
                              <Input 
                                id="capacidad" 
                                type="number" 
                                placeholder="2"
                                value={newRoom.capacidad || ''}
                                onChange={(e) => setNewRoom({...newRoom, capacidad: parseInt(e.target.value) || 1})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="precio">Precio Base</Label>
                              <Input 
                                id="precio" 
                                type="number" 
                                placeholder="180000"
                                value={newRoom.precio || ''}
                                onChange={(e) => setNewRoom({...newRoom, precio: parseInt(e.target.value) || 0})}
                              />
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
                {loadingRooms ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Cargando habitaciones...</p>
                  </div>
                ) : rooms.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay habitaciones registradas.</p>
                    <p className="text-sm text-muted-foreground mt-2">Cree la primera habitación para comenzar.</p>
                  </div>
                ) : (
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
                              onClick={() => handleViewRoomDetails(room)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              title="Editar habitación"
                              onClick={() => handleEditRoom(room)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              title="Cambiar estado"
                              onClick={() => handleOpenStatusDialog(room)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tipos de Habitación */}
        <TabsContent value="types">
          <div className="space-y-6">
            {/* Gestión de Características */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Características Disponibles</CardTitle>
                    <CardDescription>
                      Gestione las características que pueden tener los tipos de habitación
                    </CardDescription>
                  </div>
                  <Dialog open={showManageFeaturesDialog} onOpenChange={setShowManageFeaturesDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Gestionar Características
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Gestionar Características</DialogTitle>
                        <DialogDescription>
                          Agregue, edite o elimine características para los tipos de habitación
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nueva característica..."
                            value={newFeatureName}
                            onChange={(e) => setNewFeatureName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                          />
                          <Button onClick={handleAddFeature}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {loadingFeatures ? (
                            <p className="text-center text-muted-foreground py-4">Cargando...</p>
                          ) : features.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                              No hay características. Agregue la primera.
                            </p>
                          ) : (
                            features.map((feature) => (
                              <div key={feature.id} className="flex items-center justify-between p-2 border rounded">
                                {editingFeature === feature.id ? (
                                  <>
                                    <Input
                                      defaultValue={feature.nombre}
                                      onBlur={(e) => handleUpdateFeature(feature.id, e.target.value)}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleUpdateFeature(feature.id, e.currentTarget.value);
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingFeature(null)}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <span>{feature.nombre}</span>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingFeature(feature.id)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteFeature(feature.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <Badge key={feature.id} variant="secondary">
                      {feature.nombre}
                    </Badge>
                  ))}
                  {features.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No hay características configuradas. Haga clic en "Gestionar Características" para agregar.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tipos de Habitación */}
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
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                            <Input 
                              id="nombreTipo" 
                              placeholder="Ej. Suite Premium"
                              value={newRoomType.nombre}
                              onChange={(e) => setNewRoomType({...newRoomType, nombre: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="capacidadTipo">Capacidad</Label>
                            <Input 
                              id="capacidadTipo" 
                              type="number" 
                              placeholder="2"
                              value={newRoomType.capacidad}
                              onChange={(e) => setNewRoomType({...newRoomType, capacidad: parseInt(e.target.value) || 1})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="descripcionTipo">Descripción</Label>
                          <Textarea 
                            id="descripcionTipo" 
                            placeholder="Describe las características principales..."
                            value={newRoomType.descripcion}
                            onChange={(e) => setNewRoomType({...newRoomType, descripcion: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="precioBaseTipo">Precio Base</Label>
                            <Input 
                              id="precioBaseTipo" 
                              type="number" 
                              placeholder="250000"
                              value={newRoomType.precioBase}
                              onChange={(e) => setNewRoomType({...newRoomType, precioBase: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cantidadTipo">Cantidad Disponible</Label>
                            <Input 
                              id="cantidadTipo" 
                              type="number" 
                              placeholder="5"
                              value={newRoomType.cantidad}
                              onChange={(e) => setNewRoomType({...newRoomType, cantidad: parseInt(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Características Incluidas</Label>
                          {loadingFeatures ? (
                            <p className="text-muted-foreground text-sm">Cargando características...</p>
                          ) : features.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                              No hay características disponibles. Primero agregue características en "Gestionar Características".
                            </p>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded p-2">
                              {features.map(feature => (
                                <div key={feature.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`feature-${feature.id}`}
                                    checked={newRoomType.caracteristicas.includes(feature.nombre)}
                                    onCheckedChange={() => toggleFeatureSelection(feature.nombre)}
                                  />
                                  <Label htmlFor={`feature-${feature.id}`} className="text-sm cursor-pointer">
                                    {feature.nombre}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setShowCreateTypeDialog(false);
                          setNewRoomType({
                            nombre: '',
                            descripcion: '',
                            capacidad: 1,
                            precioBase: 0,
                            cantidad: 0,
                            caracteristicas: []
                          });
                        }}>
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
                {loadingTypes ? (
                  <p className="text-center text-muted-foreground py-8">Cargando tipos de habitación...</p>
                ) : roomTypes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay tipos de habitación configurados. Haga clic en "Nuevo Tipo" para agregar.
                  </p>
                ) : (
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
                                onClick={() => {
                                  setEditingType(type);
                                  setShowEditTypeDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                title="Eliminar tipo"
                                onClick={() => handleDeleteRoomType(type.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dialog para editar tipo */}
          <Dialog open={showEditTypeDialog} onOpenChange={setShowEditTypeDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Tipo de Habitación</DialogTitle>
                <DialogDescription>
                  Modifique las características del tipo de habitación
                </DialogDescription>
              </DialogHeader>
              
              {editingType && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editNombreTipo">Nombre del Tipo</Label>
                      <Input 
                        id="editNombreTipo" 
                        value={editingType.nombre}
                        onChange={(e) => setEditingType({...editingType, nombre: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editCapacidadTipo">Capacidad</Label>
                      <Input 
                        id="editCapacidadTipo" 
                        type="number"
                        value={editingType.capacidad}
                        onChange={(e) => setEditingType({...editingType, capacidad: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editDescripcionTipo">Descripción</Label>
                    <Textarea 
                      id="editDescripcionTipo" 
                      value={editingType.descripcion}
                      onChange={(e) => setEditingType({...editingType, descripcion: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editPrecioBaseTipo">Precio Base</Label>
                      <Input 
                        id="editPrecioBaseTipo" 
                        type="number"
                        value={editingType.precioBase}
                        onChange={(e) => setEditingType({...editingType, precioBase: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editCantidadTipo">Cantidad Disponible</Label>
                      <Input 
                        id="editCantidadTipo" 
                        type="number"
                        value={editingType.cantidad}
                        onChange={(e) => setEditingType({...editingType, cantidad: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Características Incluidas</Label>
                    {features.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No hay características disponibles.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded p-2">
                        {features.map(feature => (
                          <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-feature-${feature.id}`}
                              checked={editingType.caracteristicas.includes(feature.nombre)}
                              onCheckedChange={() => toggleEditTypeFeature(feature.nombre)}
                            />
                            <Label htmlFor={`edit-feature-${feature.id}`} className="text-sm cursor-pointer">
                              {feature.nombre}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setShowEditTypeDialog(false);
                  setEditingType(null);
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateRoomType}>
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

      {/* Dialog Ver Detalles de Habitación */}
      <Dialog open={showRoomDetailsDialog} onOpenChange={setShowRoomDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Habitación {selectedRoom?.numero}
            </DialogTitle>
            <DialogDescription>
              Detalles completos de la habitación
            </DialogDescription>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-medium">{selectedRoom.numero}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Piso</p>
                  <p className="font-medium">{selectedRoom.piso}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge variant="outline">{selectedRoom.tipo}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(selectedRoom.estado)}
                    <Badge className={getEstadoColor(selectedRoom.estado)}>
                      {selectedRoom.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Capacidad</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedRoom.capacidad} personas
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Precio</p>
                  <p className="font-medium flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${selectedRoom.precio?.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {selectedRoom.caracteristicas && selectedRoom.caracteristicas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Características</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedRoom.caracteristicas.map((c: string) => (
                      <Badge key={c} variant="secondary" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {selectedRoom.ultimaLimpieza && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Última limpieza</p>
                    <p className="text-sm">{new Date(selectedRoom.ultimaLimpieza).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedRoom.proximoMantenimiento && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Próximo mantenimiento</p>
                    <p className="text-sm">{new Date(selectedRoom.proximoMantenimiento).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fecha de registro</p>
                <p className="text-sm">{new Date(selectedRoom.fechaCreacion).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm('¿Está seguro de eliminar esta habitación?')) {
                  handleDeleteRoom(selectedRoom?.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setShowRoomDetailsDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Habitación */}
      <Dialog open={showEditRoomDialog} onOpenChange={setShowEditRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Habitación</DialogTitle>
            <DialogDescription>
              Modifique los datos de la habitación
            </DialogDescription>
          </DialogHeader>
          
          {editingRoom && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editNumero">Número</Label>
                  <Input 
                    id="editNumero" 
                    value={editingRoom.numero}
                    onChange={(e) => setEditingRoom({...editingRoom, numero: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPiso">Piso</Label>
                  <Input 
                    id="editPiso" 
                    type="number"
                    value={editingRoom.piso || ''}
                    onChange={(e) => setEditingRoom({...editingRoom, piso: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTipo">Tipo</Label>
                  <Select 
                    value={editingRoom.tipoId} 
                    onValueChange={(value) => {
                      const selectedType = roomTypes.find(t => t.id === value);
                      setEditingRoom({
                        ...editingRoom, 
                        tipoId: value,
                        tipo: selectedType?.nombre || editingRoom.tipo,
                        capacidad: selectedType?.capacidad || editingRoom.capacidad,
                        precio: selectedType?.precioBase || editingRoom.precio
                      });
                    }}
                  >
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editCapacidad">Capacidad</Label>
                  <Input 
                    id="editCapacidad" 
                    type="number"
                    value={editingRoom.capacidad || ''}
                    onChange={(e) => setEditingRoom({...editingRoom, capacidad: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio Base</Label>
                  <Input 
                    value={`$${(editingRoom.precio || 0).toLocaleString()}`}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Precio automático según tipo de habitación</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditRoomDialog(false);
              setEditingRoom(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRoom}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Cambiar Estado */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Estado de Habitación</DialogTitle>
            <DialogDescription>
              Habitación {selectedRoom?.numero} - Estado actual: {selectedRoom?.estado?.replace('_', ' ')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-2 py-4">
            <Button 
              variant={selectedRoom?.estado === 'disponible' ? 'default' : 'outline'}
              className="justify-start"
              onClick={() => {
                handleChangeRoomStatus(selectedRoom?.id, 'disponible');
                setShowStatusDialog(false);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Disponible
            </Button>
            <Button 
              variant={selectedRoom?.estado === 'ocupada' ? 'default' : 'outline'}
              className="justify-start"
              onClick={() => {
                handleChangeRoomStatus(selectedRoom?.id, 'ocupada');
                setShowStatusDialog(false);
              }}
            >
              <Users className="h-4 w-4 mr-2 text-red-600" />
              Ocupada
            </Button>
            <Button 
              variant={selectedRoom?.estado === 'limpieza' ? 'default' : 'outline'}
              className="justify-start"
              onClick={() => {
                handleChangeRoomStatus(selectedRoom?.id, 'limpieza');
                setShowStatusDialog(false);
              }}
            >
              <Settings className="h-4 w-4 mr-2 text-yellow-600" />
              En Limpieza
            </Button>
            <Button 
              variant={selectedRoom?.estado === 'mantenimiento' ? 'default' : 'outline'}
              className="justify-start"
              onClick={() => {
                handleChangeRoomStatus(selectedRoom?.id, 'mantenimiento');
                setShowStatusDialog(false);
              }}
            >
              <Wrench className="h-4 w-4 mr-2 text-orange-600" />
              Mantenimiento
            </Button>
            <Button 
              variant={selectedRoom?.estado === 'fuera_servicio' ? 'default' : 'outline'}
              className="justify-start"
              onClick={() => {
                handleChangeRoomStatus(selectedRoom?.id, 'fuera_servicio');
                setShowStatusDialog(false);
              }}
            >
              <XCircle className="h-4 w-4 mr-2 text-gray-600" />
              Fuera de Servicio
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelManagementModule;