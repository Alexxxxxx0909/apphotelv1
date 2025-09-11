import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Phone, 
  Globe,
  Building,
  Download,
  Filter
} from 'lucide-react';

const ReservationReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('this-month');
  const [reportType, setReportType] = useState('status');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes de Reservas</CardTitle>
          <CardDescription>
            Análisis detallado de reservas activas, canceladas, no-show y origen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="this-week">Esta semana</SelectItem>
                <SelectItem value="this-month">Este mes</SelectItem>
                <SelectItem value="last-month">Mes anterior</SelectItem>
                <SelectItem value="custom">Rango personalizado</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Por estado</SelectItem>
                <SelectItem value="origin">Por origen</SelectItem>
                <SelectItem value="room-type">Por tipo habitación</SelectItem>
                <SelectItem value="client-history">Historial cliente</SelectItem>
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
            <div className="text-2xl font-bold text-green-600">145</div>
            <div className="text-sm text-muted-foreground">Reservas Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">23</div>
            <div className="text-sm text-muted-foreground">Canceladas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">7</div>
            <div className="text-sm text-muted-foreground">No-Show</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">175</div>
            <div className="text-sm text-muted-foreground">Total Mes</div>
          </CardContent>
        </Card>
      </div>

      {/* Reportes específicos */}
      {reportType === 'status' && (
        <Card>
          <CardHeader>
            <CardTitle>Reservas por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <div className="font-medium">Confirmadas</div>
                  <div className="text-sm text-muted-foreground">120 reservas</div>
                </div>
                <Badge className="bg-green-100 text-green-800">68.6%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <div>
                  <div className="font-medium">En Curso</div>
                  <div className="text-sm text-muted-foreground">25 reservas</div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">14.3%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <div>
                  <div className="font-medium">Canceladas</div>
                  <div className="text-sm text-muted-foreground">23 reservas</div>
                </div>
                <Badge className="bg-red-100 text-red-800">13.1%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'origin' && (
        <Card>
          <CardHeader>
            <CardTitle>Origen de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Web</div>
                    <div className="text-sm text-muted-foreground">85 reservas</div>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">48.6%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Telefónica</div>
                    <div className="text-sm text-muted-foreground">45 reservas</div>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-800">25.7%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyan-50 rounded">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-cyan-600" />
                  <div>
                    <div className="font-medium">Walk-in</div>
                    <div className="text-sm text-muted-foreground">30 reservas</div>
                  </div>
                </div>
                <Badge className="bg-cyan-100 text-cyan-800">17.1%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="font-medium">Agencia</div>
                    <div className="text-sm text-muted-foreground">15 reservas</div>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">8.6%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ReservationReports;