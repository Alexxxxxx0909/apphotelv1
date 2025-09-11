import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Calendar, 
  Clock,
  Edit,
  Key,
  UserX,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserDetailsModalProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onResetPassword: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  open,
  onOpenChange,
  onEdit,
  onToggleStatus,
  onResetPassword
}) => {
  if (!user) return null;

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Detalles del Usuario</span>
          </DialogTitle>
          <DialogDescription>
            Información completa del usuario en el sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nombre Completo</span>
                </div>
                <p className="text-sm">{`${user.name} ${user.lastName || ''}`}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-sm">{user.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Teléfono</span>
                </div>
                <p className="text-sm">{user.phone || 'No especificado'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Hotel</span>
                </div>
                <p className="text-sm">{user.hotel || 'No asignado'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rol y Permisos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rol y Permisos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Rol</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={getRoleBadgeColor(user.role)}
                >
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Estado</span>
                <div>
                  <Badge variant={user.active !== false ? 'default' : 'secondary'}>
                    {user.active !== false ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Permisos</span>
              <div className="flex flex-wrap gap-2">
                {user.permissions?.map((permission: string) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                )) || <span className="text-sm text-muted-foreground">Sin permisos específicos</span>}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Autenticación de dos factores</span>
              <div>
                <Badge variant={user.twoFactorEnabled ? 'default' : 'secondary'}>
                  {user.twoFactorEnabled ? 'Habilitada' : 'Deshabilitada'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información del Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información del Sistema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Fecha de Creación</span>
                </div>
                <p className="text-sm">{formatDate(user.createdAt)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Última Actualización</span>
                </div>
                <p className="text-sm">{formatDate(user.updatedAt)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Último Acceso</span>
                </div>
                <p className="text-sm">{formatDate(user.lastLogin) || 'Nunca'}</p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">ID de Usuario</span>
                <p className="text-xs font-mono text-muted-foreground">{user.id}</p>
              </div>
            </div>
          </div>

          {user.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Notas</h3>
                <p className="text-sm text-muted-foreground">{user.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Acciones */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={onEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar Usuario
            </Button>
            
            <Button onClick={onResetPassword} variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Restablecer Contraseña
            </Button>
            
            <Button 
              onClick={onToggleStatus} 
              variant="outline"
              className={user.active !== false ? "text-orange-600" : "text-green-600"}
            >
              {user.active !== false ? (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Desactivar Usuario
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Activar Usuario
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;