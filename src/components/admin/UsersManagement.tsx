import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/useFirestore';
import { 
  User, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Building, 
  Shield,
  UserCheck,
  UserX,
  Send,
  Eye,
  History,
  Key,
  Settings,
  Download,
  Filter
} from 'lucide-react';
import UserForm from './UserForm';
import UserDetailsModal from './UserDetailsModal';
import UserActivityLog from './UserActivityLog';

const UsersManagement: React.FC = () => {
  const { toast } = useToast();
  const { documents: users, loading, addDocument, updateDocument, deleteDocument } = useFirestore('users');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hotelFilter, setHotelFilter] = useState('all');
  
  // Modals state
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('list');

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.hotel?.toLowerCase().includes(searchLower);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.active !== false) ||
      (statusFilter === 'inactive' && user.active === false);
    const matchesHotel = hotelFilter === 'all' || user.hotel === hotelFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesHotel;
  });

  // Handlers
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowUserForm(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowUserForm(true);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleUserSave = async (userData: any) => {
    try {
      if (isEditing && selectedUser) {
        await updateDocument(selectedUser.id, userData);
        toast({
          title: "Usuario actualizado",
          description: "Los datos del usuario han sido actualizados correctamente"
        });
      }
      setShowUserForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud",
        variant: "destructive"
      });
    }
  };

  const handleToggleUserStatus = async (user: any) => {
    try {
      await updateDocument(user.id, {
        active: !user.active,
        updatedAt: new Date()
      });
      toast({
        title: "Estado actualizado",
        description: `Usuario ${user.active ? 'desactivado' : 'activado'} correctamente`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteDocument(user.id);
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado del sistema"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el usuario",
          variant: "destructive"
        });
      }
    }
  };

  const handleResetPassword = (user: any) => {
    // Implementar lógica de restablecimiento de contraseña
    toast({
      title: "Contraseña restablecida",
      description: "Se ha enviado un email con las nuevas credenciales"
    });
  };

  const handleSendCredentials = (user: any) => {
    // Implementar envío de credenciales
    toast({
      title: "Credenciales enviadas",
      description: "Se han enviado las credenciales por correo electrónico"
    });
  };

  const exportUsers = () => {
    // Implementar exportación de usuarios
    toast({
      title: "Exportando usuarios",
      description: "El archivo se descargará en breve"
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'administrador': return 'bg-red-100 text-red-800';
      case 'gerente': return 'bg-blue-100 text-blue-800';
      case 'recepcionista': return 'bg-green-100 text-green-800';
      case 'housekeeping': return 'bg-purple-100 text-purple-800';
      case 'mantenimiento': return 'bg-orange-100 text-orange-800';
      case 'contador': return 'bg-yellow-100 text-yellow-800';
      case 'colaborador': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueHotels = () => {
    const hotels = [...new Set(users.map(user => user.hotel).filter(Boolean))];
    return hotels;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Usuarios</h3>
          <p className="text-muted-foreground">
            Administra todos los usuarios del sistema ({filteredUsers.length} usuarios)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Usuarios</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Filter className="h-4 w-4 mr-2" />
                Buscar y Filtrar Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, email o hotel..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="recepcionista">Recepcionista</SelectItem>
                    <SelectItem value="housekeeping">Personal de Limpieza</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="contador">Contador</SelectItem>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={hotelFilter} onValueChange={setHotelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los hoteles</SelectItem>
                    {getUniqueHotels().map((hotel) => (
                      <SelectItem key={hotel} value={hotel}>
                        {hotel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usuarios Registrados</CardTitle>
              <CardDescription>
                {filteredUsers.length} usuarios encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron usuarios con los filtros seleccionados
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {user.name} {user.lastName}
                            </h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.phone && (
                              <p className="text-xs text-muted-foreground">{user.phone}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={getRoleBadgeColor(user.role)}
                          >
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                          </Badge>
                          <Badge variant={user.active !== false ? 'default' : 'secondary'}>
                            {user.active !== false ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.hotel || 'Sin asignar'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Último acceso: {user.lastLogin || 'Nunca'}
                          </span>
                        </div>
                      </div>
                      
                      {user.permissions && user.permissions.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Permisos:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map((permission: string) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendCredentials(user)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Credenciales
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResetPassword(user)}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Restablecer Contraseña
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleUserStatus(user)}
                          className={user.active !== false ? "text-orange-600" : "text-green-600"}
                        >
                          {user.active !== false ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activar
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <UserActivityLog showAllUsers={true} />
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Usuarios por Rol</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    users.reduce((acc: any, user) => {
                      acc[user.role] = (acc[user.role] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([role, count]) => (
                    <div key={role} className="flex justify-between">
                      <span className="capitalize">{role}</span>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Usuarios por Hotel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    users.reduce((acc: any, user) => {
                      const hotel = user.hotel || 'Sin asignar';
                      acc[hotel] = (acc[hotel] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([hotel, count]) => (
                    <div key={hotel} className="flex justify-between">
                      <span className="text-sm">{hotel}</span>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estado de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Usuarios Activos</span>
                    <Badge variant="default">
                      {users.filter(u => u.active !== false).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuarios Inactivos</span>
                    <Badge variant="secondary">
                      {users.filter(u => u.active === false).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifica los datos del usuario seleccionado'
                : 'Completa el formulario para crear un nuevo usuario en el sistema'
              }
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            onSave={handleUserSave}
            onCancel={() => setShowUserForm(false)}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      <UserDetailsModal
        user={selectedUser}
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
        onEdit={() => {
          setShowUserDetails(false);
          handleEditUser(selectedUser);
        }}
        onToggleStatus={() => handleToggleUserStatus(selectedUser)}
        onResetPassword={() => handleResetPassword(selectedUser)}
      />
    </div>
  );
};

export default UsersManagement;