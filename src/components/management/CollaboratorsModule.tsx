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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  Users, 
  Filter, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Key, 
  Shield, 
  Clock,
  Settings,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

interface Collaborator {
  id: string;
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
  cargo: string;
  rol: string;
  estado: 'activo' | 'inactivo' | 'bloqueado';
  modulosAsignados: string[];
  fechaCreacion: Date;
  ultimoAcceso?: Date;
  hotelAsignado: string;
}

const CollaboratorsModule: React.FC = () => {
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      nombre: 'Ana García',
      documento: '12345678',
      email: 'ana.garcia@hotel.com',
      telefono: '+57 300 123 4567',
      cargo: 'Recepcionista Senior',
      rol: 'recepcionista',
      estado: 'activo',
      modulosAsignados: ['recepcion', 'reservas'],
      fechaCreacion: new Date(),
      ultimoAcceso: new Date(),
      hotelAsignado: 'Hotel Principal'
    },
    {
      id: '2',
      nombre: 'Carlos Rodríguez',
      documento: '87654321',
      email: 'carlos.rodriguez@hotel.com',
      telefono: '+57 300 987 6543',
      cargo: 'Supervisor de Housekeeping',
      rol: 'supervisor',
      estado: 'activo',
      modulosAsignados: ['housekeeping', 'mantenimiento'],
      fechaCreacion: new Date(),
      ultimoAcceso: new Date(),
      hotelAsignado: 'Hotel Principal'
    },
    {
      id: '3',
      nombre: 'María González',
      documento: '11223344',
      email: 'maria.gonzalez@hotel.com',
      telefono: '+57 300 456 7890',
      cargo: 'Camarera',
      rol: 'camarera',
      estado: 'inactivo',
      modulosAsignados: ['housekeeping'],
      fechaCreacion: new Date(),
      ultimoAcceso: undefined,
      hotelAsignado: 'Hotel Principal'
    },
    {
      id: '4',
      nombre: 'Roberto Silva',
      documento: '99887766',
      email: 'roberto.silva@hotel.com',
      telefono: '+57 300 111 2222',
      cargo: 'Conserje',
      rol: 'conserje',
      estado: 'bloqueado',
      modulosAsignados: ['atencion'],
      fechaCreacion: new Date(),
      ultimoAcceso: new Date(),
      hotelAsignado: 'Hotel Principal'
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterCargo, setFilterCargo] = useState('todos');

  const modulosDisponibles = [
    { id: 'reservas', nombre: 'Reservas' },
    { id: 'recepcion', nombre: 'Recepción' },
    { id: 'facturacion', nombre: 'Facturación' },
    { id: 'housekeeping', nombre: 'Housekeeping' },
    { id: 'atencion', nombre: 'Atención al Cliente' },
    { id: 'mantenimiento', nombre: 'Mantenimiento' }
  ];

  const cargosDisponibles = [
    'Recepcionista',
    'Recepcionista Senior',
    'Supervisor de Recepción',
    'Camarera/o',
    'Supervisor de Housekeeping',
    'Conserje',
    'Técnico de Mantenimiento',
    'Coordinador de Servicios',
    'Administrador de Turno'
  ];

  const handleCreateCollaborator = () => {
    toast({
      title: "Colaborador creado",
      description: "El nuevo colaborador ha sido registrado exitosamente. Credenciales enviadas por email.",
    });
    setShowCreateDialog(false);
  };

  const handleResetPassword = (collaboratorId: string) => {
    toast({
      title: "Contraseña restablecida",
      description: "Se ha enviado una nueva contraseña temporal por email.",
    });
  };

  const handleBlockAccess = (collaboratorId: string) => {
    setCollaborators(prev => 
      prev.map(c => 
        c.id === collaboratorId 
          ? { ...c, estado: c.estado === 'bloqueado' ? 'activo' : 'bloqueado' }
          : c
      )
    );
    toast({
      title: "Acceso modificado",
      description: "El acceso del colaborador ha sido actualizado.",
    });
  };

  const handleReassignHotel = (collaboratorId: string) => {
    toast({
      title: "Hotel reasignado",
      description: "El colaborador ha sido reasignado a otro hotel.",
    });
  };

  const handleEditPermissions = (collaboratorId: string) => {
    toast({
      title: "Permisos actualizados",
      description: "Los módulos del colaborador han sido modificados.",
    });
  };

  const handleToggleEstado = (collaboratorId: string) => {
    setCollaborators(prev => 
      prev.map(c => 
        c.id === collaboratorId 
          ? { ...c, estado: c.estado === 'activo' ? 'inactivo' : 'activo' }
          : c
      )
    );
    toast({
      title: "Estado actualizado",
      description: "El estado del colaborador ha sido modificado.",
    });
  };

  const filteredCollaborators = collaborators.filter(collaborator => {
    const matchesSearch = collaborator.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'todos' || collaborator.estado === filterEstado;
    const matchesCargo = filterCargo === 'todos' || collaborator.cargo.toLowerCase().includes(filterCargo.toLowerCase());
    
    return matchesSearch && matchesEstado && matchesCargo;
  });

  return (
    <div className="space-y-6">
      {/* Header y estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collaborators.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {collaborators.filter(c => c.estado === 'activo').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((collaborators.filter(c => c.estado === 'activo').length / collaborators.length) * 100)}% del total
            </p>
          </CardContent>
        </Card>

                        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {collaborators.filter(c => c.estado === 'inactivo').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {collaborators.filter(c => c.estado === 'bloqueado').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Acceso restringido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accesos Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collaborators.filter(c => 
                c.ultimoAcceso && 
                c.ultimoAcceso.toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Gestión de Colaboradores</CardTitle>
              <CardDescription>
                Administra el personal y sus permisos de acceso
              </CardDescription>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Colaborador
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Colaborador</DialogTitle>
                  <DialogDescription>
                    Complete los datos del nuevo colaborador y asigne los módulos correspondientes
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input id="nombre" placeholder="Ej. Ana García Pérez" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documento">Documento</Label>
                      <Input id="documento" placeholder="Número de cédula" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Corporativo</Label>
                      <Input id="email" type="email" placeholder="nombre@hotel.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" placeholder="+57 300 123 4567" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargosDisponibles.map(cargo => (
                            <SelectItem key={cargo} value={cargo.toLowerCase()}>
                              {cargo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotel">Hotel Asignado</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione hotel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principal">Hotel Principal</SelectItem>
                          <SelectItem value="sucursal">Hotel Sucursal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Módulos de Acceso</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {modulosDisponibles.map(modulo => (
                        <div key={modulo.id} className="flex items-center space-x-2">
                          <input type="checkbox" id={modulo.id} className="rounded" />
                          <Label htmlFor={modulo.id} className="text-sm">
                            {modulo.nombre}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCollaborator}>
                    Crear Colaborador
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
                <SelectItem value="bloqueado">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCargo} onValueChange={setFilterCargo}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los cargos</SelectItem>
                <SelectItem value="recepcionista">Recepcionistas</SelectItem>
                <SelectItem value="supervisor">Supervisores</SelectItem>
                <SelectItem value="camarera">Camareras/os</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Módulos</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollaborators.map((collaborator) => (
                <TableRow key={collaborator.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{collaborator.nombre}</div>
                      <div className="text-sm text-muted-foreground">{collaborator.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{collaborator.cargo}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={collaborator.estado === 'activo'}
                        onCheckedChange={() => handleToggleEstado(collaborator.id)}
                      />
                   <Badge variant={
                        collaborator.estado === 'activo' ? 'default' : 
                        collaborator.estado === 'bloqueado' ? 'destructive' : 'secondary'
                      }>
                        {collaborator.estado === 'activo' ? 'Activo' : 
                         collaborator.estado === 'bloqueado' ? 'Bloqueado' : 'Inactivo'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {collaborator.modulosAsignados.slice(0, 2).map(modulo => (
                        <Badge key={modulo} variant="outline" className="text-xs">
                          {modulosDisponibles.find(m => m.id === modulo)?.nombre}
                        </Badge>
                      ))}
                      {collaborator.modulosAsignados.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{collaborator.modulosAsignados.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {collaborator.ultimoAcceso ? (
                        <>
                          <div>{collaborator.ultimoAcceso.toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {collaborator.ultimoAcceso.toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Nunca</span>
                      )}
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
                        title="Editar colaborador"
                        onClick={() => handleEditPermissions(collaborator.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Resetear contraseña"
                        onClick={() => handleResetPassword(collaborator.id)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title={collaborator.estado === 'bloqueado' ? 'Desbloquear acceso' : 'Bloquear acceso'}
                        onClick={() => handleBlockAccess(collaborator.id)}
                      >
                        <Shield className={`h-4 w-4 ${collaborator.estado === 'bloqueado' ? 'text-red-600' : 'text-gray-600'}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Reasignar hotel"
                        onClick={() => handleReassignHotel(collaborator.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaboratorsModule;