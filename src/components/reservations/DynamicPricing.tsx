import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon, 
  Plus, 
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PricingRule {
  id: string;
  name: string;
  type: 'seasonal' | 'discount' | 'promotion' | 'event';
  roomTypes: string[];
  startDate: Date;
  endDate: Date;
  adjustmentType: 'percentage' | 'fixed';
  adjustmentValue: number;
  isActive: boolean;
  priority: number;
  description: string;
}

interface BasePrice {
  roomType: string;
  basePrice: number;
  weekendSurcharge: number;
}

const basePrices: BasePrice[] = [
  { roomType: 'individual', basePrice: 80, weekendSurcharge: 10 },
  { roomType: 'doble', basePrice: 120, weekendSurcharge: 15 },
  { roomType: 'suite', basePrice: 200, weekendSurcharge: 25 },
  { roomType: 'deluxe', basePrice: 150, weekendSurcharge: 20 },
  { roomType: 'familiar', basePrice: 180, weekendSurcharge: 22 }
];

const mockPricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Temporada Alta - Diciembre',
    type: 'seasonal',
    roomTypes: ['suite', 'deluxe'],
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-31'),
    adjustmentType: 'percentage',
    adjustmentValue: 30,
    isActive: true,
    priority: 1,
    description: 'Incremento de temporada navideña'
  },
  {
    id: '2',
    name: 'Descuento Reserva Anticipada',
    type: 'discount',
    roomTypes: ['individual', 'doble'],
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-31'),
    adjustmentType: 'percentage',
    adjustmentValue: -15,
    isActive: true,
    priority: 2,
    description: 'Descuento por reservar con 30 días de anticipación'
  }
];

const roomTypeLabels = {
  individual: 'Individual',
  doble: 'Doble',
  suite: 'Suite',
  deluxe: 'Deluxe',
  familiar: 'Familiar'
};

const ruleTypeLabels = {
  seasonal: { label: 'Temporada', color: 'bg-blue-100 text-blue-800' },
  discount: { label: 'Descuento', color: 'bg-green-100 text-green-800' },
  promotion: { label: 'Promoción', color: 'bg-purple-100 text-purple-800' },
  event: { label: 'Evento', color: 'bg-orange-100 text-orange-800' }
};

const DynamicPricing: React.FC = () => {
  const { toast } = useToast();
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(mockPricingRules);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    roomTypes: [] as string[],
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    adjustmentType: 'percentage',
    adjustmentValue: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const newRule: PricingRule = {
      id: editingRule?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type as any,
      roomTypes: formData.roomTypes,
      startDate: formData.startDate,
      endDate: formData.endDate,
      adjustmentType: formData.adjustmentType as any,
      adjustmentValue: formData.adjustmentValue,
      isActive: true,
      priority: pricingRules.length + 1,
      description: formData.description
    };

    if (editingRule) {
      setPricingRules(prev => prev.map(rule => rule.id === editingRule.id ? newRule : rule));
      toast({
        title: "Regla Actualizada",
        description: "La regla de precios ha sido actualizada exitosamente",
      });
    } else {
      setPricingRules(prev => [...prev, newRule]);
      toast({
        title: "Regla Creada",
        description: "Nueva regla de precios creada exitosamente",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      roomTypes: [],
      startDate: undefined,
      endDate: undefined,
      adjustmentType: 'percentage',
      adjustmentValue: 0,
      description: ''
    });
    setShowForm(false);
    setEditingRule(null);
  };

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      type: rule.type,
      roomTypes: rule.roomTypes,
      startDate: rule.startDate,
      endDate: rule.endDate,
      adjustmentType: rule.adjustmentType,
      adjustmentValue: rule.adjustmentValue,
      description: rule.description
    });
    setShowForm(true);
  };

  const handleDelete = (ruleId: string) => {
    setPricingRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({
      title: "Regla Eliminada",
      description: "La regla de precios ha sido eliminada",
    });
  };

  const toggleRuleStatus = (ruleId: string) => {
    setPricingRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const calculatePrice = (roomType: string, basePrice: number, rules: PricingRule[]) => {
    let finalPrice = basePrice;
    const applicableRules = rules.filter(rule => 
      rule.isActive && rule.roomTypes.includes(roomType)
    ).sort((a, b) => a.priority - b.priority);

    applicableRules.forEach(rule => {
      if (rule.adjustmentType === 'percentage') {
        finalPrice += (basePrice * rule.adjustmentValue / 100);
      } else {
        finalPrice += rule.adjustmentValue;
      }
    });

    return Math.max(0, finalPrice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Precios Base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Precios Base por Tipo de Habitación</span>
          </CardTitle>
          <CardDescription>
            Tarifas actuales con reglas de precios aplicadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {basePrices.map((room) => {
              const currentPrice = calculatePrice(room.roomType, room.basePrice, pricingRules);
              const difference = currentPrice - room.basePrice;
              
              return (
                <Card key={room.roomType} className="text-center">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">
                      {roomTypeLabels[room.roomType as keyof typeof roomTypeLabels]}
                    </h4>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        ${currentPrice.toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Base: ${room.basePrice}
                      </div>
                      {difference !== 0 && (
                        <div className={`text-xs flex items-center justify-center space-x-1 ${
                          difference > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {difference > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>
                            {difference > 0 ? '+' : ''}${difference.toFixed(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{pricingRules.length}</div>
            <div className="text-sm text-muted-foreground">Reglas Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {pricingRules.filter(r => r.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pricingRules.filter(r => r.type === 'seasonal').length}
            </div>
            <div className="text-sm text-muted-foreground">Temporales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {pricingRules.filter(r => r.adjustmentValue < 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Descuentos</div>
          </CardContent>
        </Card>
      </div>

      {/* Botón Nueva Regla */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Reglas de Precios Dinámicos</h3>
          <p className="text-muted-foreground">Gestiona las tarifas por temporada, descuentos y promociones</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Regla</span>
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>{editingRule ? 'Editar' : 'Nueva'} Regla de Precios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre de la Regla *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Temporada Alta Verano"
                    />
                  </div>
                  <div>
                    <Label>Tipo de Regla *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seasonal">Temporada</SelectItem>
                        <SelectItem value="discount">Descuento</SelectItem>
                        <SelectItem value="promotion">Promoción</SelectItem>
                        <SelectItem value="event">Evento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha de Inicio *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(formData.startDate, "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Fecha de Fin *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(formData.endDate, "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Ajuste</Label>
                    <Select value={formData.adjustmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, adjustmentType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentaje</SelectItem>
                        <SelectItem value="fixed">Monto Fijo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="adjustmentValue">
                      Valor del Ajuste {formData.adjustmentType === 'percentage' ? '(%)' : '($)'}
                    </Label>
                    <Input
                      id="adjustmentValue"
                      type="number"
                      value={formData.adjustmentValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, adjustmentValue: parseFloat(e.target.value) }))}
                      placeholder={formData.adjustmentType === 'percentage' ? 'Ej: 20 o -15' : 'Ej: 50 o -25'}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
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
        </motion.div>
      )}

      {/* Lista de Reglas */}
      <div className="space-y-4">
        {pricingRules.map((rule) => {
          const typeInfo = ruleTypeLabels[rule.type];
          
          return (
            <motion.div
              key={rule.id}
              whileHover={{ scale: 1.01 }}
            >
              <Card className={`border-l-4 ${rule.isActive ? 'border-l-green-500' : 'border-l-gray-400'}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-lg">{rule.name}</h4>
                        <Badge className={typeInfo.color}>
                          {typeInfo.label}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Activa:</span>
                          <Switch 
                            checked={rule.isActive}
                            onCheckedChange={() => toggleRuleStatus(rule.id)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-2">
                        <div>
                          <strong>Período:</strong> {format(rule.startDate, "dd/MM/yyyy")} - {format(rule.endDate, "dd/MM/yyyy")}
                        </div>
                        <div>
                          <strong>Ajuste:</strong> 
                          {rule.adjustmentType === 'percentage' ? (
                            <span className={rule.adjustmentValue > 0 ? 'text-red-600' : 'text-green-600'}>
                              {rule.adjustmentValue > 0 ? '+' : ''}{rule.adjustmentValue}%
                            </span>
                          ) : (
                            <span className={rule.adjustmentValue > 0 ? 'text-red-600' : 'text-green-600'}>
                              {rule.adjustmentValue > 0 ? '+' : ''}${rule.adjustmentValue}
                            </span>
                          )}
                        </div>
                        <div>
                          <strong>Habitaciones:</strong> {rule.roomTypes.map(type => 
                            roomTypeLabels[type as keyof typeof roomTypeLabels]
                          ).join(', ')}
                        </div>
                      </div>
                      
                      {rule.description && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Descripción:</strong> {rule.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {pricingRules.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay reglas de precios configuradas</h3>
            <p className="text-muted-foreground">
              Crea reglas para ajustar automáticamente los precios según temporadas o promociones
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default DynamicPricing;