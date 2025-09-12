import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserPlus, 
  Users, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Key, 
  Shield, 
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Building2,
  RefreshCw,
  UserX
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollaborators, CollaboratorFormData } from '@/hooks/useCollaborators';
import { useCurrentManager } from '@/hooks/useCurrentManager';
import CollaboratorDetailsModal from './CollaboratorDetailsModal';
import CollaboratorEditModal from './CollaboratorEditModal';

const CollaboratorsModule: React.FC = () => {
  const { 
    collaborators, 
    loading, 
    error,
    createCollaborator, 
    updateCollaborator,
    deleteCollaborator,
    toggleEstado,
    blockCollaborator,
    updateModules,
    resetPassword,
    reassignHotel
  } = useCollaborators();
  
  const { hotelesAsignados } = useCurrentManager();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterCargo, setFilterCargo] = useState('todos');
  
  // Form data para crear colaborador
  const [newCollaborator, setNewCollaborator] = useState<CollaboratorFormData>({
    nombre: '',
    documento: '',
    email: '',
    telefono: '',
    cargo: '',
    hotelAsignado: '',
    modulosAsignados: [],
    password: generateRandomPassword()
  });

  function generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  const modulosDisponibles = [
    { id: 'reservas', nombre: 'Reservas' },
    { id: 'recepcion', nombre: 'Recepción' },
    { id: 'facturacion', nombre: 'Facturación' },
    { id: 'housekeeping', nombre: 'Housekeeping' },
    { id: 'atencion', nombre: 'Atención al Cliente' },
    { id: 'mantenimiento', nombre: 'Mantenimiento' },
    { id: 'alimentos', nombre: 'Alimentos y Bebidas' },
    { id: 'financiera', nombre: 'Gestión Financiera' },
    { id: 'rrhh', nombre: 'Recursos Humanos' },
    { id: 'reportes', nombre: 'Reportes Gerenciales' }
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
    'Administrador de Turno',
    'Cajero',
    'Auditor Nocturno',
    'Botones',
    'Valet Parking'
  ];

  const handleCreateCollaborator = async () => {
    try {
      await createCollaborator(newCollaborator);
      setNewCollaborator({
        nombre: '',
        documento: '',
        email: '',
        telefono: '',
        cargo: '',
        hotelAsignado: '',
        modulosAsignados: [],
        password: generateRandomPassword()
      });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating collaborator:', error);
    }
  };

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    if (checked) {
      setNewCollaborator(prev => ({
        ...prev,
        modulosAsignados: [...prev.modulosAsignados, moduleId]
      }));
    } else {
      setNewCollaborator(prev => ({
        ...prev,
        modulosAsignados: prev.modulosAsignados.filter(id => id !== moduleId)
      }));
    }
  };

  const handleViewDetails = (collaborator: any) => {
    setSelectedCollaborator(collaborator);
    setShowDetailsModal(true);
  };

  const handleEditCollaborator = (collaborator: any) => {
    setSelectedCollaborator(collaborator);
    setShowEditModal(true);
  };

  const handleDeleteCollaborator = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este colaborador?')) {
      await deleteCollaborator(id);
    }
  };

  const filteredCollaborators = collaborators.filter(collaborator => {
    const matchesSearch = collaborator.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.cargo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'todos' || collaborator.estado === filterEstado;
    const matchesCargo = filterCargo === 'todos' || collaborator.cargo?.toLowerCase().includes(filterCargo.toLowerCase());
    
    return matchesSearch && matchesEstado && matchesCargo;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Nunca';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-CO');
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error al cargar los colaboradores: {error}
        </AlertDescription>
      </Alert>
    );
  }

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
              Personal registrado
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
              {collaborators.length > 0 ? Math.round((collaborators.filter(c => c.estado === 'activo').length / collaborators.length) * 100) : 0}% del total
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
              {collaborators.filter(c => {
                if (!c.ultimoAcceso) return false;
                const date = c.ultimoAcceso.toDate ? c.ultimoAcceso.toDate() : new Date(c.ultimoAcceso);
                return date.toDateString() === new Date().toDateString();
              }).length}
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
                <Button disabled={loading}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Colaborador
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                      <Input 
                        id="nombre" 
                        placeholder="Ej. Ana García Pérez"
                        value={newCollaborator.nombre}
                        onChange={(e) => setNewCollaborator(prev => ({ ...prev, nombre: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documento">Documento</Label>
                      <Input 
                        id="documento" 
                        placeholder="Número de cédula"
                        value={newCollaborator.documento}
                        onChange={(e) => setNewCollaborator(prev => ({ ...prev, documento: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Corporativo</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="nombre@hotel.com"
                        value={newCollaborator.email}
                        onChange={(e) => setNewCollaborator(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input 
                        id="telefono" 
                        placeholder="+57 300 123 4567"
                        value={newCollaborator.telefono}
                        onChange={(e) => setNewCollaborator(prev => ({ ...prev, telefono: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Select 
                        value={newCollaborator.cargo} 
                        onValueChange={(value) => setNewCollaborator(prev => ({ ...prev, cargo: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargosDisponibles.map(cargo => (
                            <SelectItem key={cargo} value={cargo}>
                              {cargo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotel">Hotel Asignado</Label>
                      <Select 
                        value={newCollaborator.hotelAsignado}
                        onValueChange={(value) => setNewCollaborator(prev => ({ ...prev, hotelAsignado: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione hotel" />
                        </SelectTrigger>
                        <SelectContent>
                          {hotelesAsignados.map(hotel => (
                            <SelectItem key={hotel} value={hotel}>{hotel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                   <div className="space-y-2">
                     <Label htmlFor="password">Contraseña Temporal</Label>
                     <div className="flex space-x-2">
                       <Input
                         id="password"
                         type="text"
                         value={newCollaborator.password}
                         readOnly
                       />
                       <Button 
                         type="button" 
                         variant="outline"
                         onClick={() => setNewCollaborator(prev => ({ ...prev, password: generateRandomPassword() }))}
                       >
                         Generar Nueva
                       </Button>
                     </div>
                     <p className="text-xs text-muted-foreground">
                       Esta contraseña será proporcionada al colaborador para su primer acceso
                     </p>
                   </div>
                   
                   <div className="space-y-2">
                     <Label>Módulos de Acceso</Label>
                     <div className="grid grid-cols-2 gap-2">
                       {modulosDisponibles.map(modulo => (
                         <div key={modulo.id} className="flex items-center space-x-2">
                           <Checkbox 
                             id={modulo.id} 
                             checked={newCollaborator.modulosAsignados.includes(modulo.id)}
                             onCheckedChange={(checked) => handleModuleToggle(modulo.id, checked as boolean)}
                           />
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
                  <Button onClick={handleCreateCollaborator} disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Colaborador'}
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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Cargando colaboradores...
            </div>
          ) : (
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
                {filteredCollaborators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {collaborators.length === 0 
                        ? 'No hay colaboradores registrados. Crea el primero haciendo clic en "Nuevo Colaborador".'
                        : 'No se encontraron colaboradores con los filtros seleccionados.'
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCollaborators.map((collaborator) => (
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
                            onCheckedChange={() => toggleEstado(collaborator.id, collaborator.estado)}
                            disabled={loading}
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
                          {collaborator.modulosAsignados?.slice(0, 2).map((moduloId) => {
                            const modulo = modulosDisponibles.find(m => m.id === moduloId);
                            return modulo ? (
                              <Badge key={moduloId} variant="secondary" className="text-xs">
                                {modulo.nombre}
                              </Badge>
                            ) : null;
                          })}
                          {collaborator.modulosAsignados?.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{collaborator.modulosAsignados.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(collaborator.ultimoAcceso)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(collaborator)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCollaborator(collaborator)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => resetPassword(collaborator.id)}>
                              <Key className="mr-2 h-4 w-4" />
                              Resetear contraseña
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => blockCollaborator(collaborator.id, collaborator.estado)}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {collaborator.estado === 'bloqueado' ? 'Desbloquear' : 'Bloquear'} acceso
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCollaborator(collaborator.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <CollaboratorDetailsModal
        collaborator={selectedCollaborator}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        modulosDisponibles={modulosDisponibles}
      />

      <CollaboratorEditModal
        collaborator={selectedCollaborator}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSave={updateCollaborator}
        onUpdateModules={updateModules}
        modulosDisponibles={modulosDisponibles}
        cargosDisponibles={cargosDisponibles}
        loading={loading}
      />
    </div>
  );
};

export default CollaboratorsModule;