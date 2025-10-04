import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { useHotels } from '@/hooks/useHotels';
import { useRoles } from '@/hooks/useRoles';
import { initializeRoles } from '@/scripts/initializeRoles';

interface UserFormProps {
  user?: any;
  onSave: (userData: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel, isEditing = false }) => {
  const { toast } = useToast();
  const { hotels, loading: hotelsLoading } = useHotels();
  const { roles, loading: rolesLoading } = useRoles();
  
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    identificacion: '',
    direccion: '',
    role: '',
    hotel: '',
    active: true,
    permissions: [] as string[],
    password: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  // Initialize roles on component mount
  React.useEffect(() => {
    initializeRoles().catch(console.error);
  }, []);

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        identificacion: user.identificacion || '',
        direccion: user.direccion || '',
        role: user.role || '',
        hotel: user.hotel || '',
        active: user.active !== false,
        permissions: user.permissions || [],
        password: '',
        confirmPassword: '',
        twoFactorEnabled: user.twoFactorEnabled || false,
        notes: user.notes || ''
      });
    }
  }, [user, isEditing]);

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles.find(r => r.id === roleId);
    setFormData(prev => ({
      ...prev,
      role: roleId,
      permissions: selectedRole ? selectedRole.permisos : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isEditing) {
        // Validaciones para nuevo usuario
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Las contraseñas no coinciden",
            variant: "destructive"
          });
          return;
        }

        if (formData.password.length < 6) {
          toast({
            title: "Error", 
            description: "La contraseña debe tener al menos 6 caracteres",
            variant: "destructive"
          });
          return;
        }

        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Guardar datos adicionales en Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          identificacion: formData.identificacion,
          direccion: formData.direccion,
          role: formData.role,
          hotel: formData.hotel,
          active: formData.active,
          permissions: formData.permissions,
          twoFactorEnabled: formData.twoFactorEnabled,
          notes: formData.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: auth.currentUser?.uid
        });

        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado exitosamente"
        });
      } else {
        // Actualizar usuario existente
        onSave({
          ...formData,
          updatedAt: new Date(),
          updatedBy: auth.currentUser?.uid
        });
      }

      onCancel();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al procesar la solicitud",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={isEditing}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="identificacion">Número de Identificación *</Label>
          <Input
            id="identificacion"
            value={formData.identificacion}
            onChange={(e) => setFormData(prev => ({ ...prev, identificacion: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rol *</Label>
          <Select 
            value={formData.role} 
            onValueChange={handleRoleChange}
            disabled={rolesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={rolesLoading ? "Cargando roles..." : "Seleccionar rol"} />
            </SelectTrigger>
            <SelectContent>
              {roles
                .filter(role => role.estado === 'activo')
                .map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.nombre}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hotel">Hotel *</Label>
          <Select 
            value={formData.hotel} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, hotel: value }))}
            disabled={hotelsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={hotelsLoading ? "Cargando hoteles..." : "Seleccionar hotel"} />
            </SelectTrigger>
            <SelectContent>
              {hotels
                .filter(hotel => hotel.estado === 'activo')
                .map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    <div className="flex flex-col">
                      <span>{hotel.nombre}</span>
                      {hotel.ciudad && (
                        <span className="text-xs text-muted-foreground">
                          {hotel.ciudad}{hotel.pais ? `, ${hotel.pais}` : ''}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
          />
          <Label htmlFor="active">Usuario activo</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="twoFactor"
            checked={formData.twoFactorEnabled}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, twoFactorEnabled: checked }))}
          />
          <Label htmlFor="twoFactor">Habilitar autenticación de dos factores</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="permissions">Permisos</Label>
        <div className="grid grid-cols-2 gap-2">
          {formData.permissions.map((permission) => (
            <div key={permission} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
              {permission}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Notas adicionales sobre el usuario..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;