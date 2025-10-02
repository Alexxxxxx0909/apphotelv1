import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign } from 'lucide-react';

const PaymentsFinance: React.FC = () => {
  const payments = [
    { id: 1, supplier: 'Distribuidora de Alimentos SA', invoice: 'FAC-001', amount: 15000, dueDate: '2024-02-15', status: 'Pendiente' },
    { id: 2, supplier: 'Licores Premium Ltda', invoice: 'FAC-002', amount: 8500, dueDate: '2024-01-30', status: 'Pagado' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos y Finanzas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead>Nº Factura</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha Vencimiento</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.supplier}</TableCell>
                <TableCell>{payment.invoice}</TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>{payment.dueDate}</TableCell>
                <TableCell>
                  <Badge variant={payment.status === 'Pagado' ? 'default' : 'secondary'}>{payment.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentsFinance;
