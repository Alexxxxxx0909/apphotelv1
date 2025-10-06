import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MODULOS_DISPONIBLES, Plan } from '@/hooks/usePlans';
import { Loader2 } from 'lucide-react';

const planFormSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  tipo: z.enum(['basico', 'estandar', 'premium']),
  precio: z.number().min(0, 'El precio debe ser mayor a 0'),
  periodicidad: z.enum(['mensual', 'anual']),
  descripcion: z.string().optional(),
  limites: z.object({
    usuarios: z.number().min(1, 'Debe permitir al menos 1 usuario'),
    hoteles: z.number().min(1, 'Debe permitir al menos 1 hotel'),
    transacciones: z.number().min(1, 'Debe permitir al menos 1 transacción'),
    modulosHabilitados: z.array(z.string()).min(1, 'Debe seleccionar al menos un módulo')
  }),
  estado: z.enum(['activo', 'inactivo'])
});

type PlanFormValues = z.infer<typeof planFormSchema>;

interface PlanFormProps {
  plan?: Plan;
  onSubmit: (data: PlanFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const PlanForm: React.FC<PlanFormProps> = ({ 
  plan, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: plan ? {
      nombre: plan.nombre,
      tipo: plan.tipo,
      precio: plan.precio,
      periodicidad: plan.periodicidad,
      descripcion: plan.descripcion || '',
      limites: {
        usuarios: plan.limites.usuarios,
        hoteles: plan.limites.hoteles,
        transacciones: plan.limites.transacciones,
        modulosHabilitados: plan.limites.modulosHabilitados
      },
      estado: plan.estado
    } : {
      nombre: '',
      tipo: 'basico',
      precio: 0,
      periodicidad: 'mensual',
      descripcion: '',
      limites: {
        usuarios: 1,
        hoteles: 1,
        transacciones: 100,
        modulosHabilitados: []
      },
      estado: 'activo'
    }
  });

  const handleSubmit = async (data: PlanFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Plan</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Plan Premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Plan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="estandar">Estándar</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (COP)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="99000" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="periodicidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Periodicidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona periodicidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción del plan..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle>Límites del Plan</CardTitle>
            <CardDescription>Define los límites de recursos para este plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="limites.usuarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite de Usuarios</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limites.hoteles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite de Hoteles</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limites.transacciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite de Transacciones/Mes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Módulos Habilitados</CardTitle>
            <CardDescription>Selecciona los módulos que incluirá este plan</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="limites.modulosHabilitados"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MODULOS_DISPONIBLES.map((modulo) => (
                      <FormField
                        key={modulo.id}
                        control={form.control}
                        name="limites.modulosHabilitados"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={modulo.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(modulo.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, modulo.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== modulo.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {modulo.nombre}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {plan ? 'Actualizar Plan' : 'Crear Plan'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
