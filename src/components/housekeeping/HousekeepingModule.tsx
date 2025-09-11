import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bed, 
  Users, 
  Package, 
  Clock, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import RoomStatusManagement from './RoomStatusManagement';
import TaskAssignment from './TaskAssignment';
import InventoryControl from './InventoryControl';
import EfficiencyTracking from './EfficiencyTracking';
import HousekeepingReports from './reports/HousekeepingReports';

const HousekeepingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rooms');

  // Mock data for dashboard stats
  const stats = {
    roomsReady: 45,
    roomsDirty: 12,
    roomsCleaning: 8,
    roomsBlocked: 3,
    tasksCompleted: 23,
    tasksPending: 15,
    staffWorking: 8,
    avgCleaningTime: 32
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Dashboard Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.roomsReady}</p>
                <p className="text-sm text-muted-foreground">Habitaciones Listas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.roomsCleaning}</p>
                <p className="text-sm text-muted-foreground">En Limpieza</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.roomsDirty}</p>
                <p className="text-sm text-muted-foreground">Sucias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.avgCleaningTime}</p>
                <p className="text-sm text-muted-foreground">Min Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Funciones más utilizadas en housekeeping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => setActiveTab('rooms')}>
              <Bed className="h-6 w-6" />
              <span className="text-sm">Estado Habitaciones</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => setActiveTab('tasks')}>
              <ClipboardList className="h-6 w-6" />
              <span className="text-sm">Asignar Tareas</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => setActiveTab('inventory')}>
              <Package className="h-6 w-6" />
              <span className="text-sm">Control Inventario</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => setActiveTab('reports')}>
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rooms" className="flex items-center space-x-2">
            <Bed className="h-4 w-4" />
            <span className="hidden md:inline">Habitaciones</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center space-x-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden md:inline">Tareas</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span className="hidden md:inline">Inventario</span>
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="hidden md:inline">Eficiencia</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Reportes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4">
          <RoomStatusManagement />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TaskAssignment />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryControl />
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <EfficiencyTracking />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <HousekeepingReports />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default HousekeepingModule;