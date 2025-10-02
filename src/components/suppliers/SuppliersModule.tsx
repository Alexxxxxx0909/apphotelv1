import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  FileText, 
  ShoppingCart, 
  DollarSign, 
  Star, 
  BarChart3,
  Bell
} from 'lucide-react';
import SuppliersManagement from './SuppliersManagement';
import ContractsAgreements from './ContractsAgreements';
import PurchaseOrders from './PurchaseOrders';
import PaymentsFinance from './PaymentsFinance';
import QualityEvaluation from './QualityEvaluation';
import SuppliersReports from './SuppliersReports';
import NotificationsAlerts from './NotificationsAlerts';

const SuppliersModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gestion');

  const tabs = [
    { id: 'gestion', label: 'Gestión de Proveedores', icon: Building2 },
    { id: 'contratos', label: 'Contratos y Acuerdos', icon: FileText },
    { id: 'pedidos', label: 'Pedidos y Compras', icon: ShoppingCart },
    { id: 'pagos', label: 'Pagos y Finanzas', icon: DollarSign },
    { id: 'evaluacion', label: 'Evaluación de Calidad', icon: Star },
    { id: 'reportes', label: 'Reportes Gerenciales', icon: BarChart3 },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Módulo de Proveedores
          </CardTitle>
          <CardDescription>
            Gestión integral de proveedores, contratos, pedidos y evaluación de calidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="gestion">
              <SuppliersManagement />
            </TabsContent>

            <TabsContent value="contratos">
              <ContractsAgreements />
            </TabsContent>

            <TabsContent value="pedidos">
              <PurchaseOrders />
            </TabsContent>

            <TabsContent value="pagos">
              <PaymentsFinance />
            </TabsContent>

            <TabsContent value="evaluacion">
              <QualityEvaluation />
            </TabsContent>

            <TabsContent value="reportes">
              <SuppliersReports />
            </TabsContent>

            <TabsContent value="notificaciones">
              <NotificationsAlerts />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersModule;
