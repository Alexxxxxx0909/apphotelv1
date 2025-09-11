import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Star, 
  Globe, 
  User,
  Download,
  Heart,
  TrendingUp,
  Calendar
} from 'lucide-react';

const ClientReports: React.FC = () => {
  const [reportType, setReportType] = useState('frequent');

  const frequentClients = [
    { name: 'Juan Pérez García', visits: 12, totalSpent: 4500, lastVisit: '15 Ene 2024', preference: 'Habitación con vista al mar' },
    { name: 'María González López', visits: 8, totalSpent: 3200, lastVisit: '10 Ene 2024', preference: 'Suite con jacuzzi' },
    { name: 'Carlos Rodríguez Martín', visits: 6, totalSpent: 2800, lastVisit: '8 Ene 2024', preference: 'Habitación silenciosa' }
  ];

  const demographics = [
    { segment: 'Españoles', count: 145, percentage: 58.0 },
    { segment: 'Franceses', count: 42, percentage: 16.8 },
    { segment: 'Alemanes', count: 35, percentage: 14.0 },
    { segment: 'Británicos', count: 18, percentage: 7.2 },
    { segment: 'Otros', count: 10, percentage: 4.0 }
  ];

  const ageGroups = [
    { range: '25-34 años', count: 85, percentage: 34.0 },
    { range: '35-44 años', count: 72, percentage: 28.8 },
    { range: '45-54 años', count: 48, percentage: 19.2 },
    { range: '55-64 años', count: 30, percentage: 12.0 },
    { range: '65+ años', count: 15, percentage: 6.0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Informes de Clientes</CardTitle>
          <CardDescription>
            Análisis de clientes frecuentes, segmentación y preferencias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frequent">Clientes frecuentes</SelectItem>
                <SelectItem value="demographics">Segmentación</SelectItem>
                <SelectItem value="preferences">Preferencias</SelectItem>
                <SelectItem value="history">Historia de estancias</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">156</div>
            <div className="text-sm text-muted-foreground">Clientes VIP</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">78%</div>
            <div className="text-sm text-muted-foreground">Clientes Recurrentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">$145</div>
            <div className="text-sm text-muted-foreground">Gasto Promedio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">2.3</div>
            <div className="text-sm text-muted-foreground">Estancias Promedio</div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido según tipo de reporte */}
      {reportType === 'frequent' && (
        <Card>
          <CardHeader>
            <CardTitle>Clientes Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {frequentClients.map((client, index) => (
                <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="font-medium">{client.name}</div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Última visita: {client.lastVisit}</div>
                      <div>Preferencia: {client.preference}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{client.visits} visitas</div>
                    <div className="text-sm text-muted-foreground">${client.totalSpent} gastado</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'demographics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Segmentación por Nacionalidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demographics.map((segment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{segment.segment}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{segment.count} clientes</div>
                      <div className="text-sm text-muted-foreground">{segment.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segmentación por Edad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ageGroups.map((group, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{group.range}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{group.count} clientes</div>
                      <div className="text-sm text-muted-foreground">{group.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'preferences' && (
        <Card>
          <CardHeader>
            <CardTitle>Preferencias de Alojamiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Tipos de Habitación Preferidos</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-blue-50 rounded">
                    <span>Suite con vista al mar</span>
                    <Badge>45%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span>Habitación doble estándar</span>
                    <Badge>32%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-purple-50 rounded">
                    <span>Suite junior</span>
                    <Badge>18%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-orange-50 rounded">
                    <span>Habitación individual</span>
                    <Badge>5%</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Servicios Más Solicitados</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-red-50 rounded">
                    <span>Desayuno incluido</span>
                    <Badge>68%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-cyan-50 rounded">
                    <span>WiFi gratuito</span>
                    <Badge>95%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-yellow-50 rounded">
                    <span>Servicio de spa</span>
                    <Badge>34%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-50 rounded">
                    <span>Parking incluido</span>
                    <Badge>52%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Historia de Estancias y Consumos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { client: 'Juan Pérez García', stays: 12, totalSpent: 4500, avgStay: 3.2, lastYear: 2800 },
                { client: 'María González López', stays: 8, totalSpent: 3200, avgStay: 2.8, lastYear: 2100 },
                { client: 'Carlos Rodríguez Martín', stays: 6, totalSpent: 2800, avgStay: 2.5, lastYear: 1800 }
              ].map((client, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{client.client}</h4>
                    <Badge className="bg-blue-100 text-blue-800">Cliente VIP</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Estancias</div>
                      <div className="font-medium">{client.stays}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Gasto Total</div>
                      <div className="font-medium">${client.totalSpent}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Estancia Promedio</div>
                      <div className="font-medium">{client.avgStay} días</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Año Anterior</div>
                      <div className="font-medium">${client.lastYear}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ClientReports;