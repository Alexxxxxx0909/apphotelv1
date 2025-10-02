import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ShoppingCart } from 'lucide-react';

const PurchaseOrders: React.FC = () => {
  const orders = [
    { id: 1, supplier: 'Distribuidora de Alimentos SA', orderNumber: 'ORD-001', date: '2024-01-15', total: 15000, area: 'Cocina', status: 'Entregado' },
    { id: 2, supplier: 'Licores Premium Ltda', orderNumber: 'ORD-002', date: '2024-01-18', total: 8500, area: 'Bar', status: 'En Proceso' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button><Plus className="h-4 w-4 mr-2" />Nuevo Pedido</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos y Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Pedido</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.area}</TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Entregado' ? 'default' : 'secondary'}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Ver Detalle</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrders;
