import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  History, 
  Search, 
  Calendar as CalendarIcon,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  actionType: 'login' | 'logout' | 'create' | 'edit' | 'delete' | 'admin' | 'error';
  details: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface UserActivityLogProps {
  userId?: string;
  showAllUsers?: boolean;
}

const UserActivityLog: React.FC<UserActivityLogProps> = ({ userId, showAllUsers = false }) => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(true);

  // Mock data - En producción esto vendría de Firestore
  useEffect(() => {
    const mockActivities: ActivityLogEntry[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Carlos Rodríguez',
        action: 'Inicio de sesión',
        actionType: 'login',
        details: 'Acceso desde navegador Chrome',
        timestamp: new Date('2024-01-15T10:30:00'),
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome/96.0'
      },
      {
        id: '2',
        userId: 'user1',
        userName: 'Carlos Rodríguez',
        action: 'Creó nueva reserva',
        actionType: 'create',
        details: 'Reserva #12345 para John Doe',
        timestamp: new Date('2024-01-15T11:15:00')
      },
      {
        id: '3',
        userId: 'user2',
        userName: 'Ana Martínez',
        action: 'Editó usuario',
        actionType: 'edit',
        details: 'Modificó permisos del usuario María González',
        timestamp: new Date('2024-01-15T09:45:00')
      },
      {
        id: '4',
        userId: 'user1',
        userName: 'Carlos Rodríguez',
        action: 'Intento fallido de acceso',
        actionType: 'error',
        details: 'Contraseña incorrecta',
        timestamp: new Date('2024-01-14T16:30:00'),
        ipAddress: '192.168.1.100'
      },
      {
        id: '5',
        userId: 'user3',
        userName: 'Luis García',
        action: 'Cerró sesión',
        actionType: 'logout',
        details: 'Sesión terminada normalmente',
        timestamp: new Date('2024-01-14T18:00:00')
      }
    ];

    setActivities(mockActivities);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = activities;

    // Filtrar por usuario si se especifica
    if (userId && !showAllUsers) {
      filtered = filtered.filter(activity => activity.userId === userId);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo de acción
    if (actionFilter !== 'all') {
      filtered = filtered.filter(activity => activity.actionType === actionFilter);
    }

    // Filtrar por rango de fechas
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= dateRange.from! && activityDate <= dateRange.to!;
      });
    }

    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredActivities(filtered);
  }, [activities, searchTerm, actionFilter, dateRange, userId, showAllUsers]);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'login': return LogIn;
      case 'logout': return LogOut;
      case 'create': return Plus;
      case 'edit': return Edit;
      case 'delete': return Trash2;
      case 'admin': return Settings;
      case 'error': return AlertTriangle;
      default: return History;
    }
  };

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case 'login': return 'bg-green-100 text-green-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      case 'create': return 'bg-blue-100 text-blue-800';
      case 'edit': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Filtros de Actividad</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar actividad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                <SelectItem value="login">Inicios de sesión</SelectItem>
                <SelectItem value="logout">Cierres de sesión</SelectItem>
                <SelectItem value="create">Creaciones</SelectItem>
                <SelectItem value="edit">Ediciones</SelectItem>
                <SelectItem value="delete">Eliminaciones</SelectItem>
                <SelectItem value="admin">Administrativas</SelectItem>
                <SelectItem value="error">Errores</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Seleccionar fechas"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setActionFilter('all');
                setDateRange(undefined);
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Actividades */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
          <CardDescription>
            {filteredActivities.length} actividades encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron actividades con los filtros seleccionados
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const ActionIcon = getActionIcon(activity.actionType);
                return (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ActionIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{activity.action}</h4>
                            <Badge 
                              variant="outline" 
                              className={getActionBadgeColor(activity.actionType)}
                            >
                              {activity.actionType}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(activity.timestamp, 'dd/MM/yyyy HH:mm', { locale: es })}
                          </span>
                        </div>
                        
                        {showAllUsers && (
                          <p className="text-sm font-medium text-blue-600">
                            Usuario: {activity.userName}
                          </p>
                        )}
                        
                        <p className="text-sm text-muted-foreground">
                          {activity.details}
                        </p>
                        
                        {activity.ipAddress && (
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>IP: {activity.ipAddress}</span>
                            {activity.userAgent && (
                              <span>Navegador: {activity.userAgent}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityLog;