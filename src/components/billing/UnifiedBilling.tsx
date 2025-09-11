import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Plus, 
  Minus, 
  Receipt, 
  Bed, 
  Coffee, 
  Wine, 
  Sparkles, 
  Calendar,
  DollarSign,
  User,
  Calculator,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface ConsumptionItem {
  id: string;
  service: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: Date;
  icon: React.ComponentType<any>;
  category: 'alojamiento' | 'restaurante' | 'bar' | 'spa' | 'eventos';
}

interface Bill {
  id: string;
  guestName: string;
  room: string;
  checkIn: Date;
  checkOut: Date | null;
  items: ConsumptionItem[];
  subtotal: number;
  taxes: number;
  total: number;
  status: 'open' | 'closed' | 'paid';
}

const UnifiedBilling: React.FC = () => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Datos de ejemplo
  const sampleBills: Bill[] = [
    {
      id: 'BILL-001',
      guestName: 'Juan Pérez García',
      room: '205',
      checkIn: new Date('2024-01-15'),
      checkOut: null,
      status: 'open',
      items: [
        {
          id: '1',
          service: 'Habitación Superior',
          description: 'Estadía 2 noches',
          quantity: 2,
          unitPrice: 150,
          total: 300,
          date: new Date('2024-01-15'),
          icon: Bed,
          category: 'alojamiento'
        },
        {
          id: '2',
          service: 'Desayuno Buffet',
          description: 'Desayuno continental',
          quantity: 4,
          unitPrice: 25,
          total: 100,
          date: new Date('2024-01-16'),
          icon: Coffee,
          category: 'restaurante'
        },
        {
          id: '3',
          service: 'Cocktail Premium',
          description: 'Mojito y Piña Colada',
          quantity: 2,
          unitPrice: 18,
          total: 36,
          date: new Date('2024-01-16'),
          icon: Wine,
          category: 'bar'
        }
      ],
      subtotal: 436,
      taxes: 87.2,
      total: 523.2
    },
    {
      id: 'BILL-002',
      guestName: 'María González López',
      room: '301',
      checkIn: new Date('2024-01-14'),
      checkOut: new Date('2024-01-17'),
      status: 'paid',
      items: [
        {
          id: '4',
          service: 'Suite Ejecutiva',
          description: 'Estadía 3 noches',
          quantity: 3,
          unitPrice: 250,
          total: 750,
          date: new Date('2024-01-14'),
          icon: Bed,
          category: 'alojamiento'
        },
        {
          id: '5',
          service: 'Masaje Relajante',
          description: 'Tratamiento spa 90 min',
          quantity: 1,
          unitPrice: 120,
          total: 120,
          date: new Date('2024-01-15'),
          icon: Sparkles,
          category: 'spa'
        },
        {
          id: '6',
          service: 'Cena Romántica',
          description: 'Menú degustación para 2',
          quantity: 1,
          unitPrice: 180,
          total: 180,
          date: new Date('2024-01-16'),
          icon: Coffee,
          category: 'restaurante'
        }
      ],
      subtotal: 1050,
      taxes: 210,
      total: 1260
    }
  ];

  const [bills] = useState<Bill[]>(sampleBills);
  const [newItem, setNewItem] = useState({
    service: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    category: 'restaurante' as ConsumptionItem['category']
  });

  const categoryIcons = {
    alojamiento: Bed,
    restaurante: Coffee,
    bar: Wine,
    spa: Sparkles,
    eventos: Calendar
  };

  const categoryColors = {
    alojamiento: 'bg-blue-100 text-blue-800',
    restaurante: 'bg-green-100 text-green-800',
    bar: 'bg-purple-100 text-purple-800',
    spa: 'bg-pink-100 text-pink-800',
    eventos: 'bg-orange-100 text-orange-800'
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.room.includes(searchTerm) ||
                         bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           bill.items.some(item => item.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (!selectedBill || !newItem.service || newItem.unitPrice <= 0) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    const item: ConsumptionItem = {
      id: Date.now().toString(),
      service: newItem.service,
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      total: newItem.quantity * newItem.unitPrice,
      date: new Date(),
      icon: categoryIcons[newItem.category],
      category: newItem.category
    };

    // Actualizar la factura con el nuevo item
    const updatedBill = {
      ...selectedBill,
      items: [...selectedBill.items, item]
    };
    
    // Recalcular totales
    updatedBill.subtotal = updatedBill.items.reduce((sum, item) => sum + item.total, 0);
    updatedBill.taxes = updatedBill.subtotal * 0.2; // 20% de impuestos
    updatedBill.total = updatedBill.subtotal + updatedBill.taxes;

    setSelectedBill(updatedBill);
    setNewItem({
      service: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      category: 'restaurante'
    });

    toast.success('Consumo agregado exitosamente');
  };

  const handleGenerateBill = () => {
    if (!selectedBill) return;
    
    toast.success('Factura generada y enviada por email');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de facturas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Facturas Activas</CardTitle>
              <CardDescription>
                Gestión de consumos por huésped
              </CardDescription>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por huésped, habitación o factura..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    <SelectItem value="alojamiento">Alojamiento</SelectItem>
                    <SelectItem value="restaurante">Restaurante</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="spa">Spa</SelectItem>
                    <SelectItem value="eventos">Eventos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredBills.map((bill) => (
                  <motion.div
                    key={bill.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedBill?.id === bill.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedBill(bill)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{bill.guestName}</h4>
                        <p className="text-sm text-muted-foreground">Hab. {bill.room}</p>
                      </div>
                      <Badge className={bill.status === 'open' ? 'bg-green-100 text-green-800' : bill.status === 'paid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                        {bill.status === 'open' ? 'Abierta' : bill.status === 'paid' ? 'Pagada' : 'Cerrada'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{bill.items.length} consumos</span>
                      <span className="font-semibold">${bill.total.toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalle de factura */}
        <div className="lg:col-span-2">
          {selectedBill ? (
            <div className="space-y-6">
              {/* Información del huésped */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>{selectedBill.guestName}</span>
                      </CardTitle>
                      <CardDescription>
                        Factura {selectedBill.id} - Habitación {selectedBill.room}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Check-in</div>
                      <div className="font-medium">{selectedBill.checkIn.toLocaleDateString()}</div>
                      {selectedBill.checkOut && (
                        <>
                          <div className="text-sm text-muted-foreground mt-2">Check-out</div>
                          <div className="font-medium">{selectedBill.checkOut.toLocaleDateString()}</div>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Consumos */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalle de Consumos</CardTitle>
                  <CardDescription>
                    Todos los servicios y productos consumidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedBill.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-muted rounded-lg">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.service}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={categoryColors[item.category]}>
                                  {item.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {item.date.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${item.total.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} × ${item.unitPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-6" />

                  {/* Agregar nuevo consumo */}
                  {selectedBill.status === 'open' && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium">Agregar Consumo</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="service">Servicio/Producto</Label>
                          <Input
                            id="service"
                            value={newItem.service}
                            onChange={(e) => setNewItem({...newItem, service: e.target.value})}
                            placeholder="Nombre del servicio"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoría</Label>
                          <Select value={newItem.category} onValueChange={(value: ConsumptionItem['category']) => setNewItem({...newItem, category: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="alojamiento">Alojamiento</SelectItem>
                              <SelectItem value="restaurante">Restaurante</SelectItem>
                              <SelectItem value="bar">Bar</SelectItem>
                              <SelectItem value="spa">Spa</SelectItem>
                              <SelectItem value="eventos">Eventos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Descripción</Label>
                          <Input
                            id="description"
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            placeholder="Descripción opcional"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quantity">Cantidad</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="unitPrice">Precio Unitario</Label>
                          <Input
                            id="unitPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newItem.unitPrice}
                            onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button onClick={handleAddItem} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Totales */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">${selectedBill.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos (20%):</span>
                      <span className="font-medium">${selectedBill.taxes.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${selectedBill.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-4 mt-6">
                    <Button onClick={handleGenerateBill} className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Generar Factura
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calculator className="h-4 w-4 mr-2" />
                      Procesar Pago
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecciona una factura</h3>
                <p className="text-muted-foreground">
                  Elige una factura de la lista para ver sus detalles y gestionar consumos
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedBilling;