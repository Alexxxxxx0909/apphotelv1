import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ClipboardList, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  Calendar,
  MapPin,
  Timer,
  Users
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  position: string;
  status: 'available' | 'busy' | 'break';
  currentTasks: number;
  efficiency: number;
  shift: string;
}

interface Task {
  id: string;
  roomNumber: string;
  type: 'cleaning' | 'maintenance' | 'inspection' | 'deep-clean' | 'special';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'delayed';
  assignedTo?: string;
  estimatedTime: number;
  actualTime?: number;
  deadline?: string;
  description: string;
  checklist: string[];
  completedItems: string[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'María López',
    position: 'Supervisora',
    status: 'available',
    currentTasks: 2,
    efficiency: 95,
    shift: '07:00 - 15:00'
  },
  {
    id: '2',
    name: 'Carmen Ruiz',
    position: 'Camarera Senior',
    status: 'busy',
    currentTasks: 4,
    efficiency: 88,
    shift: '07:00 - 15:00'
  },
  {
    id: '3',
    name: 'Ana García',
    position: 'Camarera',
    status: 'available',
    currentTasks: 1,
    efficiency: 92,
    shift: '08:00 - 16:00'
  },
  {
    id: '4',
    name: 'Luis Morales',
    position: 'Mantenimiento',
    status: 'break',
    currentTasks: 3,
    efficiency: 90,
    shift: '06:00 - 14:00'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    roomNumber: '205',
    type: 'cleaning',
    priority: 'high',
    status: 'assigned',
    assignedTo: 'María López',
    estimatedTime: 45,
    deadline: '14:00',
    description: 'Limpieza completa después de check-out',
    checklist: ['Cambiar ropa de cama', 'Limpiar baño', 'Aspirar', 'Reponer amenities'],
    completedItems: [],
    createdAt: '2024-01-15 12:30'
  },
  {
    id: '2',
    roomNumber: '312',
    type: 'maintenance',
    priority: 'urgent',
    status: 'pending',
    estimatedTime: 90,
    description: 'Reparación de aire acondicionado',
    checklist: ['Diagnosticar problema', 'Conseguir repuestos', 'Realizar reparación', 'Probar funcionamiento'],
    completedItems: [],
    createdAt: '2024-01-15 11:00'
  },
  {
    id: '3',
    roomNumber: '108',
    type: 'deep-clean',
    priority: 'normal',
    status: 'in-progress',
    assignedTo: 'Carmen Ruiz',
    estimatedTime: 120,
    actualTime: 85,
    startedAt: '09:00',
    description: 'Limpieza profunda mensual',
    checklist: ['Limpiar ventanas', 'Shampoo alfombras', 'Desinfección completa', 'Revisar mobiliario'],
    completedItems: ['Limpiar ventanas', 'Shampoo alfombras'],
    createdAt: '2024-01-15 08:00'
  }
];

const TaskAssignment: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    roomNumber: '',
    type: 'cleaning' as Task['type'],
    priority: 'normal' as Task['priority'],
    estimatedTime: 45,
    deadline: '',
    description: '',
    checklist: ''
  });

  const assignTask = (taskId: string, staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'assigned', assignedTo: staffMember.name }
        : task
    ));

    setStaff(staff.map(s => 
      s.id === staffId 
        ? { ...s, currentTasks: s.currentTasks + 1, status: s.currentTasks >= 4 ? 'busy' : s.status }
        : s
    ));
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'in-progress') {
          updatedTask.startedAt = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } else if (newStatus === 'completed') {
          updatedTask.completedAt = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          updatedTask.actualTime = task.actualTime || task.estimatedTime;
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const createTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'pending',
      checklist: newTask.checklist.split('\n').filter(item => item.trim()),
      completedItems: [],
      createdAt: new Date().toLocaleString('es-ES')
    };
    
    setTasks([task, ...tasks]);
    setNewTask({
      roomNumber: '',
      type: 'cleaning',
      priority: 'normal',
      estimatedTime: 45,
      deadline: '',
      description: '',
      checklist: ''
    });
    setShowNewTaskDialog(false);
  };

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'delayed': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'normal': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getTypeLabel = (type: Task['type']) => {
    const labels = {
      'cleaning': 'Limpieza',
      'maintenance': 'Mantenimiento',
      'inspection': 'Inspección',
      'deep-clean': 'Limpieza Profunda',
      'special': 'Especial'
    };
    return labels[type];
  };

  const getStaffStatusColor = (status: Staff['status']) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'busy': 'bg-red-100 text-red-800',
      'break': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Asignación de Tareas</h3>
          <p className="text-muted-foreground">Gestiona y asigna tareas al personal de housekeeping</p>
        </div>
        <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Tarea</DialogTitle>
              <DialogDescription>Crea una nueva tarea para el equipo de housekeeping</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="room">Habitación</Label>
                <Input
                  id="room"
                  value={newTask.roomNumber}
                  onChange={(e) => setNewTask({...newTask, roomNumber: e.target.value})}
                  placeholder="Número de habitación"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newTask.type} onValueChange={(value: any) => setNewTask({...newTask, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning">Limpieza</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="inspection">Inspección</SelectItem>
                      <SelectItem value="deep-clean">Limpieza Profunda</SelectItem>
                      <SelectItem value="special">Especial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Tiempo Estimado (min)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value) || 45})}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Fecha límite</Label>
                  <Input
                    id="deadline"
                    type="time"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Describe la tarea..."
                />
              </div>
              <div>
                <Label htmlFor="checklist">Lista de verificación (una por línea)</Label>
                <Textarea
                  id="checklist"
                  value={newTask.checklist}
                  onChange={(e) => setNewTask({...newTask, checklist: e.target.value})}
                  placeholder="Cambiar ropa de cama&#10;Limpiar baño&#10;Aspirar habitación"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>Cancelar</Button>
              <Button onClick={createTask}>Crear Tarea</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Disponible</CardTitle>
          <CardDescription>Estado actual del equipo de housekeeping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staff.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                  <Badge className={getStaffStatusColor(member.status)}>
                    {member.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Tareas actuales:</span>
                    <span>{member.currentTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eficiencia:</span>
                    <span>{member.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turno:</span>
                    <span>{member.shift}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Tareas Activas</h4>
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Habitación {task.roomNumber}</span>
                  </CardTitle>
                  <CardDescription>{getTypeLabel(task.type)} - {task.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span>Estimado: {task.estimatedTime} min</span>
                </div>
                {task.deadline && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Límite: {task.deadline}</span>
                  </div>
                )}
                {task.assignedTo && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Asignada a: {task.assignedTo}</span>
                  </div>
                )}
              </div>

              {/* Progress */}
              {task.checklist.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progreso</span>
                    <span className="text-sm text-muted-foreground">
                      {task.completedItems.length}/{task.checklist.length}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {task.checklist.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle 
                          className={`h-4 w-4 ${
                            task.completedItems.includes(item) 
                              ? 'text-green-600' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                        <span className={task.completedItems.includes(item) ? 'line-through text-muted-foreground' : ''}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {task.status === 'pending' && (
                  <>
                    {staff.filter(s => s.status === 'available').map(staffMember => (
                      <Button 
                        key={staffMember.id}
                        size="sm" 
                        variant="outline"
                        onClick={() => assignTask(task.id, staffMember.id)}
                      >
                        Asignar a {staffMember.name}
                      </Button>
                    ))}
                  </>
                )}
                {task.status === 'assigned' && (
                  <Button size="sm" onClick={() => updateTaskStatus(task.id, 'in-progress')}>
                    Iniciar Tarea
                  </Button>
                )}
                {task.status === 'in-progress' && (
                  <Button size="sm" onClick={() => updateTaskStatus(task.id, 'completed')}>
                    Completar Tarea
                  </Button>
                )}
                {task.status === 'completed' && (
                  <Badge className="bg-green-100 text-green-800">
                    Completada {task.completedAt && `a las ${task.completedAt}`}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default TaskAssignment;