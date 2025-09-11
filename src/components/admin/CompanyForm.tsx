import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Building } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Company } from '@/hooks/useCompanies';

const companySchema = z.object({
  nombreComercial: z.string().min(2, 'El nombre comercial es requerido'),
  razonSocial: z.string().min(2, 'La razón social es requerida'),
  nit: z.string().min(5, 'El NIT es requerido'),
  direccion: z.string().min(5, 'La dirección es requerida'),
  ciudad: z.string().min(2, 'La ciudad es requerida'),
  pais: z.string().min(2, 'El país es requerido'),
  telefono: z.string().min(7, 'El teléfono es requerido'),
  emailCorporativo: z.string().email('Email inválido'),
  monedaOperacion: z.string().min(2, 'La moneda es requerida'),
  configuracionImpuestos: z.object({
    iva: z.number().min(0).max(100),
    retenciones: z.number().min(0).max(100),
    otros: z.string().optional()
  }),
  estado: z.enum(['activo', 'inactivo', 'bloqueado']),
  plan: z.object({
    tipo: z.enum(['basico', 'estandar', 'premium']),
    fechaInicio: z.date(),
    fechaVencimiento: z.date(),
    modulosActivos: z.array(z.string())
  })
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const availableModules = [
  'reservas', 'recepcion', 'housekeeping', 'mantenimiento', 
  'facturacion', 'atencion_cliente', 'reportes'
];

export const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: company ? {
      ...company,
      plan: {
        ...company.plan,
        fechaInicio: company.plan.fechaInicio,
        fechaVencimiento: company.plan.fechaVencimiento
      }
    } : {
      nombreComercial: '',
      razonSocial: '',
      nit: '',
      direccion: '',
      ciudad: '',
      pais: 'Colombia',
      telefono: '',
      emailCorporativo: '',
      monedaOperacion: 'COP',
      configuracionImpuestos: {
        iva: 19,
        retenciones: 3.5,
        otros: ''
      },
      estado: 'activo',
      plan: {
        tipo: 'basico',
        fechaInicio: new Date(),
        fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        modulosActivos: ['reservas', 'recepcion']
      }
    }
  });

  const watchedPlan = watch('plan');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {company ? 'Editar Empresa' : 'Nueva Empresa'}
          </CardTitle>
          <CardDescription>
            Complete la información general de la empresa hotelera
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreComercial">Nombre Comercial *</Label>
              <Input
                id="nombreComercial"
                {...register('nombreComercial')}
                placeholder="Hotel Bella Vista"
              />
              {errors.nombreComercial && (
                <p className="text-sm text-red-500">{errors.nombreComercial.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="razonSocial">Razón Social *</Label>
              <Input
                id="razonSocial"
                {...register('razonSocial')}
                placeholder="Hoteles Bella Vista S.A.S."
              />
              {errors.razonSocial && (
                <p className="text-sm text-red-500">{errors.razonSocial.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nit">NIT / Identificación Fiscal *</Label>
              <Input
                id="nit"
                {...register('nit')}
                placeholder="900123456-7"
              />
              {errors.nit && (
                <p className="text-sm text-red-500">{errors.nit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailCorporativo">Email Corporativo *</Label>
              <Input
                id="emailCorporativo"
                type="email"
                {...register('emailCorporativo')}
                placeholder="info@hotelbellavista.com"
              />
              {errors.emailCorporativo && (
                <p className="text-sm text-red-500">{errors.emailCorporativo.message}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Ubicación y Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Textarea
                id="direccion"
                {...register('direccion')}
                placeholder="Calle 123 #45-67, Centro Histórico"
                rows={2}
              />
              {errors.direccion && (
                <p className="text-sm text-red-500">{errors.direccion.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Input
                id="ciudad"
                {...register('ciudad')}
                placeholder="Bogotá"
              />
              {errors.ciudad && (
                <p className="text-sm text-red-500">{errors.ciudad.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País *</Label>
              <Select onValueChange={(value) => setValue('pais', value)} defaultValue={watch('pais')}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Colombia">Colombia</SelectItem>
                  <SelectItem value="México">México</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="Chile">Chile</SelectItem>
                  <SelectItem value="Perú">Perú</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                {...register('telefono')}
                placeholder="+57 1 234-5678"
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monedaOperacion">Moneda de Operación *</Label>
              <Select onValueChange={(value) => setValue('monedaOperacion', value)} defaultValue={watch('monedaOperacion')}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                  <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                  <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                  <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Configuración de Impuestos */}
          <div className="space-y-4">
            <h4 className="font-medium">Configuración de Impuestos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iva">IVA (%)</Label>
                <Input
                  id="iva"
                  type="number"
                  step="0.1"
                  {...register('configuracionImpuestos.iva', { valueAsNumber: true })}
                  placeholder="19"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retenciones">Retenciones (%)</Label>
                <Input
                  id="retenciones"
                  type="number"
                  step="0.1"
                  {...register('configuracionImpuestos.retenciones', { valueAsNumber: true })}
                  placeholder="3.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otros">Otros Impuestos</Label>
                <Input
                  id="otros"
                  {...register('configuracionImpuestos.otros')}
                  placeholder="Impuesto municipal, etc."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Plan y Licencia */}
          <div className="space-y-4">
            <h4 className="font-medium">Plan y Licencia</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Plan *</Label>
                <Select onValueChange={(value) => setValue('plan.tipo', value as any)} defaultValue={watchedPlan?.tipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico - $50/mes</SelectItem>
                    <SelectItem value="estandar">Estándar - $100/mes</SelectItem>
                    <SelectItem value="premium">Premium - $200/mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select onValueChange={(value) => setValue('estado', value as any)} defaultValue={watch('estado')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="bloqueado">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Módulos Disponibles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableModules.map((modulo) => (
                  <div key={modulo} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={modulo}
                      defaultChecked={watchedPlan?.modulosActivos?.includes(modulo)}
                      onChange={(e) => {
                        const current = watchedPlan?.modulosActivos || [];
                        if (e.target.checked) {
                          setValue('plan.modulosActivos', [...current, modulo]);
                        } else {
                          setValue('plan.modulosActivos', current.filter(m => m !== modulo));
                        }
                      }}
                    />
                    <Label htmlFor={modulo} className="capitalize text-sm">
                      {modulo.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
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
          {loading ? 'Guardando...' : company ? 'Actualizar Empresa' : 'Crear Empresa'}
        </Button>
      </div>
    </form>
  );
};