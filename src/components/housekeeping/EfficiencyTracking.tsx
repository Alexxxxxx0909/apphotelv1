import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  User, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  BarChart3,
  Calendar,
  Timer,
  CheckCircle
} from 'lucide-react';

interface StaffPerformance {
  id: string;
  name: string;
  position: string;
  todayStats: {
    roomsCleaned: number;
    avgTime: number;
    targetTime: number;
    efficiency: number;
    tasksCompleted: number;
    hoursWorked: number;
  };
  weekStats: {
    roomsCleaned: number;
    avgTime: number;
    efficiency: number;
    tasksCompleted: number;
    hoursWorked: number;
  };
  monthStats: {
    roomsCleaned: number;
    avgTime: number;
    efficiency: number;
    tasksCompleted: number;
    hoursWorked: number;
  };
  qualityScore: number;
  punctuality: number;
  trend: 'up' | 'down' | 'stable';
}

interface RoomCleaningRecord {
  id: string;
  roomNumber: string;
  staffName: string;
  startTime: string;
  endTime: string;
  duration: number;
  targetTime: number;
  roomType: string;
  qualityScore: number;
  notes?: string;
  date: string;
}

const mockStaffPerformance: StaffPerformance[] = [
  {
    id: '1',
    name: 'María López',
    position: 'Supervisora',
    todayStats: {
      roomsCleaned: 8,
      avgTime: 38,
      targetTime: 45,
      efficiency: 118,
      tasksCompleted: 12,
      hoursWorked: 7.5
    },
    weekStats: {
      roomsCleaned: 45,
      avgTime: 42,
      efficiency: 107,
      tasksCompleted: 68,
      hoursWorked: 37.5
    },
    monthStats: {
      roomsCleaned: 185,
      avgTime: 43,
      efficiency: 105,
      tasksCompleted: 278,
      hoursWorked: 158
    },
    qualityScore: 96,
    punctuality: 98,
    trend: 'up'
  },
  {
    id: '2',
    name: 'Carmen Ruiz',
    position: 'Camarera Senior',
    todayStats: {
      roomsCleaned: 12,
      avgTime: 35,
      targetTime: 40,
      efficiency: 114,
      tasksCompleted: 15,
      hoursWorked: 8
    },
    weekStats: {
      roomsCleaned: 68,
      avgTime: 37,
      efficiency: 108,
      tasksCompleted: 85,
      hoursWorked: 40
    },
    monthStats: {
      roomsCleaned: 285,
      avgTime: 38,
      efficiency: 105,
      tasksCompleted: 356,
      hoursWorked: 168
    },
    qualityScore: 94,
    punctuality: 95,
    trend: 'stable'
  },
  {
    id: '3',
    name: 'Ana García',
    position: 'Camarera',
    todayStats: {
      roomsCleaned: 10,
      avgTime: 42,
      targetTime: 40,
      efficiency: 95,
      tasksCompleted: 13,
      hoursWorked: 8
    },
    weekStats: {
      roomsCleaned: 58,
      avgTime: 44,
      efficiency: 91,
      tasksCompleted: 72,
      hoursWorked: 40
    },
    monthStats: {
      roomsCleaned: 245,
      avgTime: 45,
      efficiency: 89,
      tasksCompleted: 298,
      hoursWorked: 165
    },
    qualityScore: 88,
    punctuality: 92,
    trend: 'down'
  }
];

const mockCleaningRecords: RoomCleaningRecord[] = [
  {
    id: '1',
    roomNumber: '205',
    staffName: 'Carmen Ruiz',
    startTime: '09:15',
    endTime: '09:48',
    duration: 33,
    targetTime: 40,
    roomType: 'Standard',
    qualityScore: 95,
    date: '2024-01-15'
  },
  {
    id: '2',
    roomNumber: '312',
    staffName: 'María López',
    startTime: '10:20',
    endTime: '11:05',
    duration: 45,
    targetTime: 50,
    roomType: 'Suite',
    qualityScore: 98,
    date: '2024-01-15'
  },
  {
    id: '3',
    roomNumber: '108',
    staffName: 'Ana García',
    startTime: '11:30',
    endTime: '12:25',
    duration: 55,
    targetTime: 40,
    roomType: 'Standard',
    qualityScore: 85,
    notes: 'Limpieza extra por derrame',
    date: '2024-01-15'
  }
];

const EfficiencyTracking: React.FC = () => {
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>(mockStaffPerformance);
  const [cleaningRecords, setCleaningRecords] = useState<RoomCleaningRecord[]>(mockCleaningRecords);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 110) return 'text-green-600';
    if (efficiency >= 100) return 'text-blue-600';
    if (efficiency >= 90) return 'text-orange-600';
    return 'text-red-600';
  };

  const getEfficiencyBadgeColor = (efficiency: number) => {
    if (efficiency >= 110) return 'bg-green-100 text-green-800';
    if (efficiency >= 100) return 'bg-blue-100 text-blue-800';
    if (efficiency >= 90) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (trend: StaffPerformance['trend']) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getQualityColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-blue-600';
    if (score >= 85) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredRecords = selectedStaff === 'all' 
    ? cleaningRecords 
    : cleaningRecords.filter(record => record.staffName === selectedStaff);

  // Calculate overall stats
  const overallStats = {
    avgEfficiency: Math.round(staffPerformance.reduce((sum, staff) => sum + staff.todayStats.efficiency, 0) / staffPerformance.length),
    totalRoomsCleaned: staffPerformance.reduce((sum, staff) => sum + staff.todayStats.roomsCleaned, 0),
    avgCleaningTime: Math.round(staffPerformance.reduce((sum, staff) => sum + staff.todayStats.avgTime, 0) / staffPerformance.length),
    avgQualityScore: Math.round(staffPerformance.reduce((sum, staff) => sum + staff.qualityScore, 0) / staffPerformance.length)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Registro de Tiempos y Eficiencia</h3>
        <p className="text-muted-foreground">Seguimiento del rendimiento del personal de housekeeping</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className={`text-2xl font-bold ${getEfficiencyColor(overallStats.avgEfficiency)}`}>
                  {overallStats.avgEfficiency}%
                </p>
                <p className="text-sm text-muted-foreground">Eficiencia Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{overallStats.totalRoomsCleaned}</p>
                <p className="text-sm text-muted-foreground">Habitaciones Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Timer className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{overallStats.avgCleaningTime}</p>
                <p className="text-sm text-muted-foreground">Tiempo Promedio (min)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-orange-600" />
              <div>
                <p className={`text-2xl font-bold ${getQualityColor(overallStats.avgQualityScore)}`}>
                  {overallStats.avgQualityScore}
                </p>
                <p className="text-sm text-muted-foreground">Calidad Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Ver estadísticas:</span>
            <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento del Personal</CardTitle>
          <CardDescription>Estadísticas individuales de eficiencia y productividad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffPerformance.map((staff) => {
              const stats = staff[`${selectedPeriod}Stats` as keyof StaffPerformance] as any;
              return (
                <div key={staff.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold">{staff.name}</h4>
                        {getTrendIcon(staff.trend)}
                      </div>
                      <p className="text-sm text-muted-foreground">{staff.position}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getEfficiencyBadgeColor(stats.efficiency)}>
                        {stats.efficiency}% Eficiencia
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800">
                        {staff.qualityScore} Calidad
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{stats.roomsCleaned}</p>
                      <p className="text-muted-foreground">Habitaciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{stats.avgTime}min</p>
                      <p className="text-muted-foreground">Tiempo Promedio</p>
                      <p className="text-xs text-muted-foreground">Meta: {stats.targetTime}min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.tasksCompleted}</p>
                      <p className="text-muted-foreground">Tareas Totales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{stats.hoursWorked}h</p>
                      <p className="text-muted-foreground">Horas Trabajadas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{staff.punctuality}%</p>
                      <p className="text-muted-foreground">Puntualidad</p>
                    </div>
                  </div>

                  {/* Efficiency Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Eficiencia vs Meta</span>
                      <span className={getEfficiencyColor(stats.efficiency)}>
                        {stats.efficiency}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(stats.efficiency, 120)} 
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Records */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Registros Detallados de Limpieza</CardTitle>
              <CardDescription>Historial de tiempos y calidad por habitación</CardDescription>
            </div>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el personal</SelectItem>
                {staffPerformance.map(staff => (
                  <SelectItem key={staff.id} value={staff.name}>{staff.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div key={record.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Habitación {record.roomNumber}</h4>
                    <p className="text-sm text-muted-foreground">
                      {record.staffName} - {record.roomType}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={record.duration <= record.targetTime ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {record.duration}min
                    </Badge>
                    <Badge className={getEfficiencyBadgeColor((record.targetTime / record.duration) * 100)} variant="outline">
                      Calidad: {record.qualityScore}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{record.startTime} - {record.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span>Meta: {record.targetTime}min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className={record.duration <= record.targetTime ? 'text-green-600' : 'text-red-600'}>
                      {record.duration <= record.targetTime ? 'En tiempo' : `+${record.duration - record.targetTime}min`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{record.date}</span>
                  </div>
                </div>

                {record.notes && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                    <strong>Notas:</strong> {record.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EfficiencyTracking;