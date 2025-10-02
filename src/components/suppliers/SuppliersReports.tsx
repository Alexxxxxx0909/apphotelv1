import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SuppliersReports: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes Gerenciales</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Reportes de proveedores en desarrollo</p>
      </CardContent>
    </Card>
  );
};

export default SuppliersReports;
