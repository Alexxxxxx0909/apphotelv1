import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Mail, Building2 } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { useHotels } from '@/hooks/useHotels';
import { Checkbox } from '@/components/ui/checkbox';

const managerSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(7, 'El teléfono es requerido'),
  companyId: z.string().min(1, 'Debe seleccionar una empresa'),
  hotelesAsignados: z.array(z.string()).min(1, 'Debe seleccionar al menos un hotel'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

type ManagerFormData = z.infer<typeof managerSchema>;

interface ManagerFormProps {
  companies: Company[];
  onSubmit: (data: ManagerFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ManagerForm: React.FC<ManagerFormProps> = ({
  companies,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      companyId: '',
      hotelesAsignados: [],
      password: generateRandomPassword()
    }
  });

  const selectedCompanyId = watch('companyId');
  const selectedHotels = watch('hotelesAsignados') || [];
  const { hotels } = useHotels(selectedCompanyId);

  function generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  const selectedCompany = companies.find(c => c.id === watch('companyId'));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Crear Gerente General
          </CardTitle>
          <CardDescription>
            Complete la información del gerente. Se enviará un email automático con las credenciales.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información Personal */}
          <div className="space-y-4">
            <h4 className="font-medium">Información Personal</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  {...register('nombre')}
                  placeholder="Carlos Rodríguez"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  {...register('telefono')}
                  placeholder="+57 300 123-4567"
                />
                {errors.telefono && (
                  <p className="text-sm text-red-500">{errors.telefono.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="gerente@hotelbellavista.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Asignación de Empresa */}
          <div className="space-y-4">
            <h4 className="font-medium">Asignación de Empresa</h4>
            
            <div className="space-y-2">
              <Label>Empresa/Hotel *</Label>
              <Select onValueChange={(value) => setValue('companyId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies
                    .filter(company => company.estado === 'activo')
                    .map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{company.nombreComercial}</span>
                        <span className="text-xs text-muted-foreground">
                          {company.ciudad}, {company.pais}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companyId && (
                <p className="text-sm text-red-500">{errors.companyId.message}</p>
              )}
            </div>

            {selectedCompany && (
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Información de la Empresa</h5>
                <div className="text-sm space-y-1">
                  <p><strong>NIT:</strong> {selectedCompany.nit}</p>
                  <p><strong>Dirección:</strong> {selectedCompany.direccion}</p>
                  <p><strong>Plan:</strong> {selectedCompany.plan.tipo.toUpperCase()}</p>
                  <p><strong>Email:</strong> {selectedCompany.emailCorporativo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Asignación de Hoteles */}
          {selectedCompanyId && (
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Hoteles Asignados
              </h4>
              
              <div className="space-y-2">
                <Label>Seleccionar hoteles *</Label>
                {hotels.length > 0 ? (
                  <div className="space-y-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                    {hotels
                      .filter(hotel => hotel.estado === 'activo')
                      .map((hotel) => (
                        <div key={hotel.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={hotel.id}
                            checked={selectedHotels.includes(hotel.id)}
                            onCheckedChange={(checked) => {
                              const newHotels = checked
                                ? [...selectedHotels, hotel.id]
                                : selectedHotels.filter(id => id !== hotel.id);
                              setValue('hotelesAsignados', newHotels);
                            }}
                          />
                          <label
                            htmlFor={hotel.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            <div className="flex flex-col">
                              <span>{hotel.nombre}</span>
                              {hotel.ciudad && (
                                <span className="text-xs text-muted-foreground">
                                  {hotel.ciudad}{hotel.pais ? `, ${hotel.pais}` : ''}
                                </span>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                    No hay hoteles disponibles para esta empresa
                  </div>
                )}
                {errors.hotelesAsignados && (
                  <p className="text-sm text-red-500">{errors.hotelesAsignados.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Seleccione uno o más hoteles para asignar al gerente
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">

          {/* Credenciales de Acceso */}
          <div className="space-y-4">
            <h4 className="font-medium">Credenciales de Acceso</h4>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña Temporal</Label>
              <div className="flex space-x-2">
                <Input
                  id="password"
                  type="text"
                  {...register('password')}
                  readOnly
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setValue('password', generateRandomPassword())}
                >
                  Generar Nueva
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Esta contraseña será enviada por email al gerente
              </p>
            </div>
          </div>

          {/* Información del Email */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900">Email Automático</h5>
                <p className="text-sm text-blue-700">
                  Al crear el gerente, se enviará automáticamente un email formal con:
                </p>
                <ul className="text-sm text-blue-700 mt-1 ml-4 list-disc">
                  <li>Credenciales de acceso (usuario y contraseña)</li>
                  <li>Información de la empresa asignada</li>
                  <li>Instrucciones para el primer ingreso</li>
                  <li>URL del sistema</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando Gerente...' : 'Crear Gerente y Enviar Email'}
        </Button>
      </div>
    </form>
  );
};