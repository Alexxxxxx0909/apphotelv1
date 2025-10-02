import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationsAlerts: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificaciones y Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Sistema de notificaciones en desarrollo</p>
      </CardContent>
    </Card>
  );
};

export default NotificationsAlerts;
