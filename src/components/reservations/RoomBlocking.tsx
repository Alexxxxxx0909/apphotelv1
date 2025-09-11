import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Wrench, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RoomBlock {
  id: string;
  roomNumber: string;
  reason: string;
  type: 'maintenance' | 'event' | 'renovation' | 'other';
  startDate: Date;
  endDate: Date;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  status: 'active' | 'completed' | 'cancelled';
}

const mockBlocks: RoomBlock[] = [
  {
    id: '1',
    roomNumber: '202',
    reason: 'Reparación de aire acondicionado',
    type: 'maintenance',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-17'),
    description: 'El sistema de aire acondicionado presenta fallas',
    priority: 'high',
    createdBy: 'Admin',
    status: 'active'
  },
  {
    id: '2',
    roomNumber: '305',
    reason: 'Evento corporativo',
    type: 'event',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-22'),
    description: 'Sala reservada para reunión ejecutiva',
    priority: 'medium',
    createdBy: 'Manager',
    status: 'active'
  }
];

const blockTypes = [
  { value: 'maintenance', label: 'Mantenimiento', icon: Wrench, color: 'text-yellow-600' },
  { value: 'event', label: 'Evento', icon: CalendarIcon, color: 'text-blue-600' },
  { value: 'renovation', label: 'Renovación', icon: Settings, color: 'text-purple-600' },
  { value: 'other', label: 'Otro', icon: AlertTriangle, color: 'text-gray-600' }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const RoomBlocking: React.FC = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<RoomBlock[]>(mockBlocks);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    reason: '',
    type: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    description: '',
    priority: 'medium'
  });

  const availableRooms = ['101', '102', '103', '201', '203', '301', '302', '303'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.roomNumber || !formData.reason || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const newBlock: RoomBlock = {
      id: Date.now().toString(),
      roomNumber: formData.roomNumber,
      reason: formData.reason,
      type: formData.type as any,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      priority: formData.priority as any,
      createdBy: 'Usuario Actual',
      status: 'active'
    };

    setBlocks(prev => [...prev, newBlock]);
    setShowForm(false);
    setFormData({
      roomNumber: '',
      reason: '',
      type: '',
      startDate: undefined,
      endDate: undefined,
      description: '',
      priority: 'medium'
    });

    toast({
      title: "Bloqueo Creado",
      description: `Habitación ${formData.roomNumber} bloqueada exitosamente`,
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    toast({
      title: "Bloqueo Eliminado",
      description: "El bloqueo de habitación ha sido eliminado",
    });
  };

  const getTypeInfo = (type: string) => {
    return blockTypes.find(t => t.value === type) || blockTypes[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{blocks.length}</div>
            <div className="text-sm text-muted-foreground">Bloqueos Activos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {blocks.filter(b => b.type === 'maintenance').length}
            </div>
            <div className="text-sm text-muted-foreground">Mantenimiento</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {blocks.filter(b => b.type === 'event').length}
            </div>
            <div className="text-sm text-muted-foreground">Eventos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {blocks.filter(b => b.priority === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground">Alta Prioridad</div>
          </CardContent>
        </Card>
      </div>

      {/* Botón Nuevo Bloqueo */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Bloqueos de Habitaciones</h3>
          <p className="text-muted-foreground">Gestiona los bloqueos por mantenimiento y eventos</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Bloqueo</span>
        </Button>
      </div>

      {/* Formulario de Nuevo Bloqueo */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Nuevo Bloqueo de Habitación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Número de Habitación *</Label>
                    <Select value={formData.roomNumber} onValueChange={(value) => setFormData(prev => ({ ...prev, roomNumber: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar habitación" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room} value={room}>
                            Habitación {room}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tipo de Bloqueo *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {blockTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <type.icon className={`h-4 w-4 ${type.color}`} />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Motivo del Bloqueo *</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Ej: Reparación de aire acondicionado"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div>
                    <Label>Prioridad</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción Adicional</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detalles adicionales sobre el bloqueo..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Crear Bloqueo
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Lista de Bloqueos Activos */}
      <div className="space-y-4">
        {blocks.map((block) => {
          const typeInfo = getTypeInfo(block.type);
          const TypeIcon = typeInfo.icon;
          
          return (
            <motion.div
              key={block.id}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                        <h4 className="font-semibold text-lg">Habitación {block.roomNumber}</h4>
                        <Badge className={priorityColors[block.priority]}>
                          {block.priority === 'low' ? 'Baja' : 
                           block.priority === 'medium' ? 'Media' : 'Alta'}
                        </Badge>
                        <Badge variant="outline">
                          {typeInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="text-muted-foreground mb-2">
                        <strong>Motivo:</strong> {block.reason}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Período:</strong> {format(block.startDate, "dd/MM/yyyy")} - {format(block.endDate, "dd/MM/yyyy")}
                        </div>
                        <div>
                          <strong>Creado por:</strong> {block.createdBy}
                        </div>
                      </div>
                      
                      {block.description && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <strong>Descripción:</strong> {block.description}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBlock(block.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {blocks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay bloqueos activos</h3>
            <p className="text-muted-foreground">
              Todas las habitaciones están disponibles para reservas
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default RoomBlocking;