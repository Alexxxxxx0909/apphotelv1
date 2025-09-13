import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Package, 
  Users,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import MenuManagement from './MenuManagement';
import OrdersConsumption from './OrdersConsumption';
import SuppliesInventory from './SuppliesInventory';
import TablesAreasManagement from './TablesAreasManagement';
import FoodBeverageReports from './FoodBeverageReports';

interface SubModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const subModules: SubModule[] = [
  {
    id: 'menu-management',
    name: 'Gestión de Menús',
    description: 'Crear, editar platos, bebidas y menús especiales',
    icon: UtensilsCrossed,
    color: 'text-orange-600'
  },
  {
    id: 'orders-consumption',
    name: 'Órdenes y Consumos',
    description: 'Registrar pedidos de restaurante, bar y room service',
    icon: ShoppingCart,
    color: 'text-blue-600'
  },
  {
    id: 'supplies-inventory',
    name: 'Inventario de Insumos',
    description: 'Control de ingredientes y stock de productos',
    icon: Package,
    color: 'text-green-600'
  },
  {
    id: 'tables-areas',
    name: 'Gestión de Mesas y Áreas',
    description: 'Reservas de mesas y asignación de meseros',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    id: 'reports',
    name: 'Reportes del Área',
    description: 'Ventas por punto, productos más vendidos y consumos',
    icon: BarChart3,
    color: 'text-red-600'
  }
];

const FoodBeverageModule: React.FC = () => {
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);

  const renderSubModuleContent = () => {
    switch (activeSubModule) {
      case 'menu-management':
        return <MenuManagement />;
      case 'orders-consumption':
        return <OrdersConsumption />;
      case 'supplies-inventory':
        return <SuppliesInventory />;
      case 'tables-areas':
        return <TablesAreasManagement />;
      case 'reports':
        return <FoodBeverageReports />;
      default:
        return null;
    }
  };

  if (activeSubModule) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setActiveSubModule(null)}
            className="hover:bg-muted"
          >
            ← Volver a Alimentos y Bebidas
          </Button>
          <div>
            <h3 className="text-2xl font-semibold">
              {subModules.find(m => m.id === activeSubModule)?.name}
            </h3>
            <p className="text-muted-foreground">
              {subModules.find(m => m.id === activeSubModule)?.description}
            </p>
          </div>
        </div>
        {renderSubModuleContent()}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subModules.map((module) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-hotel transition-all duration-300 border-l-4 border-l-primary"
                onClick={() => setActiveSubModule(module.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className={`h-6 w-6 ${module.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-sm text-muted-foreground">Órdenes Hoy</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$2,350</div>
              <div className="text-sm text-muted-foreground">Ventas Restaurante</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-muted-foreground">Mesas Ocupadas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">8</div>
              <div className="text-sm text-muted-foreground">Productos Bajo Stock</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default FoodBeverageModule;