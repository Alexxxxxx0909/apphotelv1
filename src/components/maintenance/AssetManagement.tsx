import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  Search, 
  Plus, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  QrCode,
  FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  room?: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyExpiry: string;
  lifeExpectancy: number;
  currentAge: number;
  condition: 'excelente' | 'buena' | 'regular' | 'mala';
  maintenanceCost: number;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'activo' | 'inactivo' | 'en-reparacion' | 'dado-de-baja';
}

const mockAssets: Asset[] = [
  {
    id: 'AST-001',
    name: 'Aire Acondicionado Central Zona A',
    category: 'HVAC',
    location: 'Habitaciones',
    room: 'Piso 2',
    brand: 'Carrier',
    model: 'XCV-2000',
    serialNumber: 'CR2000567890',
    purchaseDate: '2022-03-15',
    purchaseCost: 15000,
    warrantyExpiry: '2025-03-15',
    lifeExpectancy: 15,
    currentAge: 2,
    condition: 'buena',
    maintenanceCost: 850,
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-04-01',
    status: 'activo'
  },
  {
    id: 'AST-002',
    name: 'Ascensor Principal',
    category: 'Elevadores',
    location: 'Lobby',
    brand: 'Otis',
    model: 'Gen2-Prima',
    serialNumber: 'OT2023891234',
    purchaseDate: '2020-08-20',
    purchaseCost: 45000,
    warrantyExpiry: '2023-08-20',
    lifeExpectancy: 25,
    currentAge: 4,
    condition: 'excelente',
    maintenanceCost: 1200,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    status: 'activo'
  },
  {
    id: 'AST-003',
    name: 'Caldera de Agua Caliente',
    category: 'Plomería',
    location: 'Sótano',
    brand: 'Rheem',
    model: 'RH-500L',
    serialNumber: 'RH500123456',
    purchaseDate: '2019-11-10',
    purchaseCost: 8500,
    warrantyExpiry: '2024-11-10',
    lifeExpectancy: 12,
    currentAge: 5,
    condition: 'regular',
    maintenanceCost: 450,
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-02-05',
    status: 'activo'
  }
];

const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [filterCondition, setFilterCondition] = useState('todas');
  const [activeTab, setActiveTab] = useState('list');
  const { toast } = useToast();

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excelente': return 'bg-green-100 text-green-800 border-green-200';
      case 'buena': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'regular': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'mala': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactivo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'en-reparacion': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dado-de-baja': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todas' || asset.category === filterCategory;
    const matchesCondition = filterCondition === 'todas' || asset.condition === filterCondition;
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.purchaseCost, 0);
  const totalMaintenanceCost = assets.reduce((sum, asset) => sum + asset.maintenanceCost, 0);
  const assetsNeedingMaintenance = assets.filter(asset => 
    new Date(asset.nextMaintenance) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  const handleAddAsset = () => {
    toast({
      title: "Activo registrado",
      description: "El nuevo activo ha sido añadido al inventario.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalAssets}</p>
                <p className="text-sm text-muted-foreground">Total Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{assetsNeedingMaintenance}</p>
                <p className="text-sm text-muted-foreground">Próximo Mantenimiento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">${totalMaintenanceCost.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Costo Mantenimiento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="list">Lista de Activos</TabsTrigger>
            <TabsTrigger value="lifecycle">Ciclo de Vida</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nuevo Activo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Activo</DialogTitle>
                <DialogDescription>
                  Añadir un nuevo equipo o activo al inventario
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Activo</Label>
                  <Input id="name" placeholder="Ej: Aire Acondicionado Suite 101" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="elevadores">Elevadores</SelectItem>
                      <SelectItem value="plomeria">Plomería</SelectItem>
                      <SelectItem value="electricidad">Electricidad</SelectItem>
                      <SelectItem value="muebles">Muebles</SelectItem>
                      <SelectItem value="electrodomesticos">Electrodomésticos</SelectItem>
                      <SelectItem value="seguridad">Seguridad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" placeholder="Ej: Carrier, LG, Samsung" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" placeholder="Número de modelo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial">Número de Serie</Label>
                  <Input id="serial" placeholder="Número de serie del equipo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" placeholder="Ej: Habitación 205, Lobby" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                  <Input id="purchaseDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Costo de Compra</Label>
                  <Input id="cost" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty">Vencimiento Garantía</Label>
                  <Input id="warranty" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lifespan">Vida Útil (años)</Label>
                  <Input id="lifespan" type="number" placeholder="15" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={handleAddAsset}>Registrar Activo</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar activos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las categorías</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Elevadores">Elevadores</SelectItem>
                    <SelectItem value="Plomería">Plomería</SelectItem>
                    <SelectItem value="Electricidad">Electricidad</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Condición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las condiciones</SelectItem>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="buena">Buena</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="mala">Mala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventario de Activos</CardTitle>
              <CardDescription>
                Lista completa de equipos y activos del hotel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Condición</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Próximo Mant.</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {asset.brand} {asset.model}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>
                        <div>
                          <p>{asset.location}</p>
                          {asset.room && (
                            <p className="text-sm text-muted-foreground">{asset.room}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getConditionColor(asset.condition)}>
                          {asset.condition.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(asset.status)}>
                          {asset.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>${asset.purchaseCost.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{asset.nextMaintenance}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ciclo de Vida</CardTitle>
              <CardDescription>
                Estado y proyección de vida útil de los activos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => {
                  const lifePercentage = (asset.currentAge / asset.lifeExpectancy) * 100;
                  const isWarrantyValid = new Date(asset.warrantyExpiry) > new Date();
                  
                  return (
                    <Card key={asset.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm">{asset.name}</h4>
                          <Badge variant="outline" className={getConditionColor(asset.condition)}>
                            {asset.condition}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Vida útil</span>
                            <span>{lifePercentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                lifePercentage < 50 ? 'bg-green-500' :
                                lifePercentage < 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(lifePercentage, 100)}%` }}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Edad actual</p>
                              <p className="font-medium">{asset.currentAge} años</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Vida útil</p>
                              <p className="font-medium">{asset.lifeExpectancy} años</p>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t">
                            <div className="flex items-center justify-between text-xs">
                              <span>Garantía</span>
                              <Badge variant={isWarrantyValid ? "default" : "secondary"} className="text-xs">
                                {isWarrantyValid ? 'Vigente' : 'Vencida'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {asset.warrantyExpiry}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Depreciación de Activos</CardTitle>
                <CardDescription>
                  Valor actual y depreciación estimada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.map((asset) => {
                    const annualDepreciation = asset.purchaseCost / asset.lifeExpectancy;
                    const currentValue = asset.purchaseCost - (annualDepreciation * asset.currentAge);
                    const depreciationPercentage = ((asset.purchaseCost - currentValue) / asset.purchaseCost) * 100;
                    
                    return (
                      <div key={asset.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{asset.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            {depreciationPercentage.toFixed(1)}% depreciado
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Valor original</p>
                            <p className="font-medium">${asset.purchaseCost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Valor actual</p>
                            <p className="font-medium">${Math.max(0, currentValue).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Mantenimiento</p>
                            <p className="font-medium">${asset.maintenanceCost}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones</CardTitle>
                <CardDescription>
                  Acciones sugeridas basadas en el análisis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 bg-red-50 p-4">
                    <h4 className="font-medium text-red-800">Reemplazo Urgente</h4>
                    <p className="text-sm text-red-700">
                      Caldera principal: 85% de vida útil completada
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                    <h4 className="font-medium text-yellow-800">Planificar Reemplazo</h4>
                    <p className="text-sm text-yellow-700">
                      3 activos llegarán al 80% de vida útil en 12 meses
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                    <h4 className="font-medium text-blue-800">Optimización</h4>
                    <p className="text-sm text-blue-700">
                      Considerar actualización de sistema HVAC para mayor eficiencia
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 bg-green-50 p-4">
                    <h4 className="font-medium text-green-800">Presupuesto</h4>
                    <p className="text-sm text-green-700">
                      Reservar $25,000 para reemplazos en próximos 18 meses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AssetManagement;