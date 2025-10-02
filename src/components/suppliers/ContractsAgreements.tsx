import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText, Download, AlertCircle } from 'lucide-react';

const ContractsAgreements: React.FC = () => {
  const contracts = [
    { id: 1, supplier: 'Distribuidora de Alimentos SA', type: 'Contrato Anual', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Vigente', daysToExpire: 90 },
    { id: 2, supplier: 'Licores Premium Ltda', type: 'Contrato Semestral', startDate: '2024-06-01', endDate: '2024-11-30', status: 'Por Vencer', daysToExpire: 15 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button><Plus className="h-4 w-4 mr-2" />Nuevo Contrato</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contratos y Acuerdos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>Tipo de Contrato</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Días para Vencer</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.supplier}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={contract.status === 'Vigente' ? 'default' : 'destructive'}>
                      {contract.status === 'Por Vencer' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.daysToExpire} días</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-2" />Descargar</Button>
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

export default ContractsAgreements;
