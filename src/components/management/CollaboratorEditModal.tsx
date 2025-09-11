import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collaborator, CollaboratorFormData } from '@/hooks/useCollaborators';
import { User, Shield, Settings } from 'lucide-react';

interface CollaboratorEditModalProps {
  collaborator: Collaborator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: Partial<CollaboratorFormData>) => Promise<void>;
  onUpdateModules: (id: string, modules: string[]) => Promise<void>;
  modulosDisponibles: Array<{ id: string; nombre: string; }>;
  cargosDisponibles: string[];
  loading: boolean;
}

const CollaboratorEditModal: React.FC<CollaboratorEditModalProps> = ({
  collaborator,
  open,
  onOpenChange,
  onSave,
  onUpdateModules,
  modulosDisponibles,
  cargosDisponibles,
  loading
}) => {
  const [formData, setFormData] = useState<Partial<CollaboratorFormData>>({});
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    if (collaborator) {
      setFormData({
        nombre: collaborator.nombre,
        documento: collaborator.documento,
        email: collaborator.email,
        telefono: collaborator.telefono,
        cargo: collaborator.cargo,
        hotelAsignado: collaborator.hotelAsignado
      });
      setSelectedModules(collaborator.modulosAsignados || []);
    }
  }, [collaborator]);

  const handleSave = async () => {
    if (!collaborator) return;
    
    try {
      await onSave(collaborator.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating collaborator:', error);
    }
  };

  const handleUpdateModules = async () => {
    if (!collaborator) return;
    
    try {
      await onUpdateModules(collaborator.id, selectedModules);
    } catch (error) {
      console.error('Error updating modules:', error);
    }
  };

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    if (checked) {
      setSelectedModules(prev => [...prev, moduleId]);
    } else {
      setSelectedModules(prev => prev.filter(id => id !== moduleId));
    }
  };

  if (!collaborator) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Editar Colaborador
          </DialogTitle>
          <DialogDescription>
            Modifica los datos de {collaborator.nombre}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="datos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="datos" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Datos Personales
            </TabsTrigger>
            <TabsTrigger value="permisos" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Permisos y Módulos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="datos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza los datos del colaborador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nombre">Nombre Completo</Label>
                    <Input
                      id="edit-nombre"
                      value={formData.nombre || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-documento">Documento</Label>
                    <Input
                      id="edit-documento"
                      value={formData.documento || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, documento: e.target.value }))}
                      placeholder="Número de documento"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@hotel.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-telefono">Teléfono</Label>
                    <Input
                      id="edit-telefono"
                      value={formData.telefono || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-cargo">Cargo</Label>
                    <Select
                      value={formData.cargo || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, cargo: value }))}
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
                    <Label htmlFor="edit-hotel">Hotel Asignado</Label>
                    <Select
                      value={formData.hotelAsignado || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, hotelAsignado: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hotel Principal">Hotel Principal</SelectItem>
                        <SelectItem value="Hotel Sucursal">Hotel Sucursal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="permisos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Módulos de Acceso</CardTitle>
                <CardDescription>
                  Selecciona los módulos a los que tendrá acceso el colaborador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modulosDisponibles.map(modulo => (
                    <div key={modulo.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`module-${modulo.id}`}
                        checked={selectedModules.includes(modulo.id)}
                        onCheckedChange={(checked) => handleModuleToggle(modulo.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`module-${modulo.id}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {modulo.nombre}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-medium">Módulos Seleccionados:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedModules.length > 0 ? (
                      selectedModules.map(moduleId => {
                        const modulo = modulosDisponibles.find(m => m.id === moduleId);
                        return modulo ? (
                          <Badge key={moduleId} variant="secondary">
                            {modulo.nombre}
                          </Badge>
                        ) : null;
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No hay módulos seleccionados
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateModules} disabled={loading}>
                {loading ? 'Guardando...' : 'Actualizar Permisos'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorEditModal;