import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Building2, 
  Shield,
  Key
} from 'lucide-react';
import { Collaborator } from '@/hooks/useCollaborators';

interface CollaboratorDetailsModalProps {
  collaborator: Collaborator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modulosDisponibles: Array<{ id: string; nombre: string; }>;
}

const CollaboratorDetailsModal: React.FC<CollaboratorDetailsModalProps> = ({
  collaborator,
  open,
  onOpenChange,
  modulosDisponibles
}) => {
  if (!collaborator) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No disponible';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModuloNombre = (id: string) => {
    const modulo = modulosDisponibles.find(m => m.id === id);
    return modulo ? modulo.nombre : id;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalles del Colaborador
          </DialogTitle>
          <DialogDescription>
            Información completa de {collaborator.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Nombre Completo</div>
                  <div className="text-sm">{collaborator.nombre}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Documento</div>
                  <div className="text-sm">{collaborator.documento}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </div>
                  <div className="text-sm">{collaborator.email}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Teléfono
                  </div>
                  <div className="text-sm">{collaborator.telefono}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Laboral */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Información Laboral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Cargo</div>
                  <Badge variant="outline">{collaborator.cargo}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Estado</div>
                  <Badge variant={
                    collaborator.estado === 'activo' ? 'default' : 
                    collaborator.estado === 'bloqueado' ? 'destructive' : 'secondary'
                  }>
                    {collaborator.estado === 'activo' ? 'Activo' : 
                     collaborator.estado === 'bloqueado' ? 'Bloqueado' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Hotel Asignado</div>
                  <div className="text-sm">{collaborator.hotelAsignado}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Rol</div>
                  <div className="text-sm capitalize">{collaborator.rol?.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Módulos Asignados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-4 w-4" />
                Módulos de Acceso
              </CardTitle>
              <CardDescription>
                Módulos del sistema a los que tiene acceso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {collaborator.modulosAsignados && collaborator.modulosAsignados.length > 0 ? (
                  collaborator.modulosAsignados.map((moduloId) => (
                    <Badge key={moduloId} variant="secondary">
                      {getModuloNombre(moduloId)}
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No tiene módulos asignados
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de Actividad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Actividad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha de Creación
                  </div>
                  <div className="text-sm">{formatDate(collaborator.fechaCreacion)}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Último Acceso
                  </div>
                  <div className="text-sm">
                    {collaborator.ultimoAcceso ? formatDate(collaborator.ultimoAcceso) : 'Nunca'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorDetailsModal;