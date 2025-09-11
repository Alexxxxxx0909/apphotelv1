import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Home,
  DollarSign,
  Calendar,
  Download,
  Target,
  Award,
  Globe
} from 'lucide-react';

const GeneralReports: React.FC = () => {
  const [period, setPeriod] = useState('month');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte General de Reservas + Recepción</CardTitle>
          <CardDescription>
            Resumen ejecutivo con KPIs y indicadores estratégicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte Completo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Home className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">85.4%</div>
            <div className="text-sm text-muted-foreground">Ocupación Global</div>
            <div className="text-xs text-green-600">+3.2% vs período anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">$145</div>
            <div className="text-sm text-muted-foreground">ADR</div>
            <div className="text-xs text-green-600">+5.8% vs período anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">$124</div>
            <div className="text-sm text-muted-foreground">RevPAR</div>
            <div className="text-xs text-green-600">+9.1% vs período anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">68</div>
            <div className="text-sm text-muted-foreground">Huéspedes Activos</div>
            <div className="text-xs text-blue-600">↑ 12 hoy</div>
          </CardContent>
        </Card>
      </div>

      {/* Ocupación Global */}
      <Card>
        <CardHeader>
          <CardTitle>Ocupación Global</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">68</div>
              <div className="text-sm text-green-700">Habitaciones Ocupadas</div>
              <div className="text-xs text-muted-foreground">85.4% del total</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-blue-700">Habitaciones Disponibles</div>
              <div className="text-xs text-muted-foreground">12.5% del total</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-red-700">Habitaciones Bloqueadas</div>
              <div className="text-xs text-muted-foreground">2.5% del total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movimientos y Reservas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Movimientos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span>Check-ins Hoy</span>
                </div>
                <Badge className="bg-green-100 text-green-800">12</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Check-outs Hoy</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">8</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>Reservas Nuevas</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800">15</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span>Modificaciones</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">6</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <span>Cancelaciones</span>
                </div>
                <Badge className="bg-red-100 text-red-800">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingresos Principales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Facturado (Hospedaje)</span>
                <span className="font-semibold">$56,800</span>
              </div>
              <div className="flex justify-between">
                <span>Servicios Extras</span>
                <span className="font-semibold">$15,400</span>
              </div>
              <div className="flex justify-between">
                <span>Anticipos Recibidos</span>
                <span className="font-semibold">$12,300</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Saldos Pendientes</span>
                <span className="font-semibold">$4,580</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Período</span>
                <span>$80,920</span>
              </div>
              
              <div className="mt-4 space-y-2">
                <h5 className="font-medium">Métodos de Pago Más Usados</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Tarjeta de Crédito</span>
                    <span>65.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Efectivo</span>
                    <span>21.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transferencia</span>
                    <span>13.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Perfil de Huéspedes */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Huéspedes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Distribución</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>Huéspedes Totales</span>
                  <Badge>175</Badge>
                </div>
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>Clientes Recurrentes</span>
                  <Badge>78%</Badge>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 rounded">
                  <span>Clientes Nuevos</span>
                  <Badge>22%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Nacionalidades Top</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span>Españoles</span>
                  </div>
                  <Badge>58%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span>Franceses</span>
                  </div>
                  <Badge>17%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <span>Alemanes</span>
                  </div>
                  <Badge>14%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Segmentación</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span>Familias</span>
                  <Badge>45%</Badge>
                </div>
                <div className="flex justify-between p-2 bg-cyan-50 rounded">
                  <span>Parejas</span>
                  <Badge>35%</Badge>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 rounded">
                  <span>Negocios</span>
                  <Badge>20%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores Estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Estratégicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Tendencia de Ocupación (7 días)</h4>
              <div className="space-y-2">
                {[
                  { date: '13 Ene', occupancy: 88 },
                  { date: '14 Ene', occupancy: 92 },
                  { date: '15 Ene', occupancy: 85 },
                  { date: '16 Ene', occupancy: 90 },
                  { date: '17 Ene', occupancy: 87 },
                  { date: '18 Ene', occupancy: 93 },
                  { date: '19 Ene', occupancy: 85 }
                ].map((day, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">{day.date}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${day.occupancy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{day.occupancy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Objetivos vs Realidad</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Ocupación Objetivo</span>
                    <span className="font-medium">80%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ocupación Real</span>
                    <Badge className="bg-green-100 text-green-800">85.4% ✓</Badge>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>ADR Objetivo</span>
                    <span className="font-medium">$140</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ADR Real</span>
                    <Badge className="bg-green-100 text-green-800">$145 ✓</Badge>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Ingresos Objetivo</span>
                    <span className="font-medium">$75,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ingresos Real</span>
                    <Badge className="bg-green-100 text-green-800">$80,920 ✓</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GeneralReports;