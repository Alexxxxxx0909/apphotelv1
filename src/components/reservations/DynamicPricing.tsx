import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { usePricingRules } from '@/hooks/usePricingRules';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ruleTypeLabels = {
  temporada: { label: 'Temporada', color: 'bg-blue-500' },
  descuento: { label: 'Descuento', color: 'bg-green-500' },
  promocion: { label: 'Promoción', color: 'bg-purple-500' }
};

const DynamicPricing: React.FC = () => {
  const { user } = useAuth();
  const hotelId = user?.hotel || '';
  const { roomTypes, loading: loadingRoomTypes } = useRoomTypes(hotelId);
  const { 
    pricingRules, 
    loading: loadingRules, 
    addPricingRule, 
    updatePricingRule, 
    deletePricingRule,
    calculatePrice 
  } = usePricingRules(hotelId);

  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'temporada' as 'temporada' | 'descuento' | 'promocion',
    roomTypes: [] as string[],
    fechaInicio: '',
    fechaFin: '',
    ajuste: 0,
    prioridad: 1,
    descripcion: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || formData.roomTypes.length === 0 || !formData.fechaInicio || !formData.fechaFin) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      if (editingRule) {
        await updatePricingRule(editingRule.id, {
          ...formData,
          fechaInicio: new Date(formData.fechaInicio),
          fechaFin: new Date(formData.fechaFin)
        });
        toast.success('Regla actualizada exitosamente');
      } else {
        await addPricingRule({
          hotelId,
          ...formData,
          fechaInicio: new Date(formData.fechaInicio),
          fechaFin: new Date(formData.fechaFin),
          activa: true
        });
        toast.success('Regla creada exitosamente');
      }
      resetForm();
    } catch (error) {
      toast.error('Error al guardar la regla');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: 'temporada',
      roomTypes: [],
      fechaInicio: '',
      fechaFin: '',
      ajuste: 0,
      prioridad: 1,
      descripcion: ''
    });
    setEditingRule(null);
    setShowForm(false);
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    setFormData({
      nombre: rule.nombre,
      tipo: rule.tipo,
      roomTypes: rule.roomTypes,
      fechaInicio: format(rule.fechaInicio, 'yyyy-MM-dd'),
      fechaFin: format(rule.fechaFin, 'yyyy-MM-dd'),
      ajuste: rule.ajuste,
      prioridad: rule.prioridad,
      descripcion: rule.descripcion || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePricingRule(id);
      toast.success('Regla eliminada');
    } catch (error) {
      toast.error('Error al eliminar la regla');
    }
  };

  const toggleRuleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updatePricingRule(id, { activa: !currentStatus });
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  if (loadingRoomTypes || loadingRules) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Base Prices with Dynamic Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Precios Base por Tipo de Habitación</CardTitle>
          <CardDescription>
            Tarifas actuales con reglas de precios aplicadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((roomType) => {
              const dynamicPrice = calculatePrice(roomType.precioBase, roomType.id);
              const difference = dynamicPrice - roomType.precioBase;
              
              return (
                <Card key={roomType.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-3">
                    <CardTitle className="text-lg">{roomType.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">${dynamicPrice}</span>
                        {difference !== 0 && (
                          <Badge variant={difference > 0 ? "default" : "secondary"} className="text-xs">
                            {difference > 0 ? '+' : ''}{difference > 0 ? <TrendingUp className="h-3 w-3 mr-1 inline" /> : <TrendingDown className="h-3 w-3 mr-1 inline" />}
                            ${Math.abs(difference)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Base: ${roomType.precioBase}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reglas Totales</p>
                <p className="text-3xl font-bold">{pricingRules.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-3xl font-bold text-green-600">
                  {pricingRules.filter(r => r.activa).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temporales</p>
                <p className="text-3xl font-bold text-blue-600">
                  {pricingRules.filter(r => r.tipo === 'temporada').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Descuentos</p>
                <p className="text-3xl font-bold text-purple-600">
                  {pricingRules.filter(r => r.tipo === 'descuento').length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with New Rule Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reglas de Precios Dinámicos</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona las tarifas por temporada, descuentos y promociones
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Regla
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>{editingRule ? 'Editar' : 'Nueva'} Regla de Precios</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Regla *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Temporada Alta Verano"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Regla *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: any) => 
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temporada">Temporada</SelectItem>
                      <SelectItem value="descuento">Descuento</SelectItem>
                      <SelectItem value="promocion">Promoción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipos de Habitación *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {roomTypes.map((roomType) => (
                    <label
                      key={roomType.id}
                      className="flex items-center space-x-2 cursor-pointer p-2 rounded border hover:bg-accent"
                    >
                      <input
                        type="checkbox"
                        checked={formData.roomTypes.includes(roomType.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              roomTypes: [...formData.roomTypes, roomType.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              roomTypes: formData.roomTypes.filter(t => t !== roomType.id)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{roomType.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha Inicio *</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha Fin *</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ajuste">Ajuste de Precio (%) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ajuste"
                      type="number"
                      value={formData.ajuste}
                      onChange={(e) => setFormData({ ...formData, ajuste: Number(e.target.value) })}
                      placeholder="Ej: 30 o -15"
                    />
                    <span className="flex items-center px-3 border rounded-md bg-muted text-sm">
                      {formData.ajuste > 0 ? '+' : ''}{formData.ajuste}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valores positivos aumentan el precio, negativos lo reducen
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Input
                    id="prioridad"
                    type="number"
                    min="1"
                    value={formData.prioridad}
                    onChange={(e) => setFormData({ ...formData, prioridad: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mayor prioridad se aplica primero
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción opcional de la regla..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingRule ? 'Actualizar' : 'Crear'} Regla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pricing Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>Reglas de Precios Dinámicos</CardTitle>
          <CardDescription>
            Gestiona las tarifas por temporada, descuentos y promociones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingRules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay reglas de precios configuradas
              </div>
            ) : (
              pricingRules.map((rule) => (
                <Card key={rule.id} className={!rule.activa ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{rule.nombre}</h4>
                          <Badge className={`${ruleTypeLabels[rule.tipo].color} text-white`}>
                            {ruleTypeLabels[rule.tipo].label}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-2">
                            <span>Activa:</span>
                            <Switch
                              checked={rule.activa}
                              onCheckedChange={() => toggleRuleStatus(rule.id, rule.activa)}
                              className="scale-75"
                            />
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Período: {format(rule.fechaInicio, 'dd/MM/yyyy', { locale: es })} - {format(rule.fechaFin, 'dd/MM/yyyy', { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {rule.ajuste > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span>
                              Ajuste: <span className={rule.ajuste > 0 ? 'text-green-600' : 'text-red-600'}>
                                {rule.ajuste > 0 ? '+' : ''}{rule.ajuste}%
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Habitaciones: </span>
                          {rule.roomTypes.map(rtId => {
                            const rt = roomTypes.find(r => r.id === rtId);
                            return rt?.nombre;
                          }).filter(Boolean).join(', ')}
                        </div>

                        {rule.descripcion && (
                          <p className="text-sm text-muted-foreground italic">
                            Descripción: {rule.descripcion}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPricing;
