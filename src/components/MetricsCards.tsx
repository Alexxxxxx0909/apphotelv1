import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Bed,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
// Charts will be implemented in future iterations

const occupancyData = [
  { name: 'Lun', ocupacion: 85 },
  { name: 'Mar', ocupacion: 92 },
  { name: 'Mie', ocupacion: 78 },
  { name: 'Jue', ocupacion: 88 },
  { name: 'Vie', ocupacion: 95 },
  { name: 'Sab', ocupacion: 100 },
  { name: 'Dom', ocupacion: 87 },
];

const revenueData = [
  { name: 'Ene', ingresos: 120000 },
  { name: 'Feb', ingresos: 135000 },
  { name: 'Mar', ingresos: 148000 },
  { name: 'Abr', ingresos: 162000 },
  { name: 'May', ingresos: 175000 },
  { name: 'Jun', ingresos: 188000 },
];

const roomStatusData = [
  { name: 'Ocupadas', value: 42, color: '#ef4444' },
  { name: 'Disponibles', value: 28, color: '#22c55e' },
  { name: 'Mantenimiento', value: 5, color: '#f59e0b' },
  { name: 'Limpieza', value: 15, color: '#3b82f6' },
];

const MetricsCards: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
          <Card className="hover:shadow-hotel transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupación Actual</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                <span className="inline-flex items-center text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +5.2%
                </span>
                {" "}vs. semana anterior
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-hotel transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,580</div>
              <p className="text-xs text-muted-foreground">
                <span className="inline-flex items-center text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12.5%
                </span>
                {" "}vs. ayer
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-hotel transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check-ins Hoy</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                <span className="inline-flex items-center text-warning">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  -2.1%
                </span>
                {" "}vs. promedio
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-hotel transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                <span className="inline-flex items-center text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +0.3
                </span>
                {" "}este mes
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Ocupación Semanal</CardTitle>
              <CardDescription>
                Porcentaje de ocupación de los últimos 7 días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Gráfico de ocupación</p>
                  <p className="text-sm text-muted-foreground">Próximamente disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Estado de Habitaciones</CardTitle>
              <CardDescription>
                Distribución actual de habitaciones por estado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-subtle rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {roomStatusData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-2xl font-bold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ingresos</CardTitle>
            <CardDescription>
              Evolución de ingresos mensuales de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-subtle rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-accent mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">Tendencia Ascendente</p>
                <p className="text-muted-foreground">+15.2% vs. período anterior</p>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  {revenueData.slice(-3).map((item, index) => (
                    <div key={index}>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                      <p className="text-lg font-bold">${(item.ingresos / 1000).toFixed(0)}K</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MetricsCards;