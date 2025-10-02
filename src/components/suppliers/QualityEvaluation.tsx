import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

const QualityEvaluation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluación y Control de Calidad</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Sistema de calificación de proveedores en desarrollo</p>
      </CardContent>
    </Card>
  );
};

export default QualityEvaluation;
