import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Hotel, 
  Calendar, 
  Users, 
  CreditCard, 
  HeadphonesIcon, 
  Bed, 
  Settings, 
  UtensilsCrossed,
  BarChart3,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Globe,
  Zap
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: "Gestión de Reservas",
      description: "Control total de disponibilidad y reservaciones"
    },
    {
      icon: Users,
      title: "Recepción Digital",
      description: "Check-in y check-out automatizados"
    },
    {
      icon: CreditCard,
      title: "Facturación Inteligente",
      description: "Gestión de pagos y cuentas de huéspedes"
    },
    {
      icon: HeadphonesIcon,
      title: "Atención al Cliente",
      description: "Solicitudes y servicios en tiempo real"
    },
    {
      icon: Bed,
      title: "Housekeeping",
      description: "Control de limpieza y estado de habitaciones"
    },
    {
      icon: Settings,
      title: "Mantenimiento",
      description: "Órdenes de trabajo y gestión de activos"
    },
    {
      icon: UtensilsCrossed,
      title: "Alimentos & Bebidas",
      description: "Gestión de restaurante y servicios gastronómicos"
    },
    {
      icon: BarChart3,
      title: "Reportes Gerenciales",
      description: "Analytics e indicadores de rendimiento"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Ahorro de Tiempo",
      description: "Automatiza procesos operativos diarios"
    },
    {
      icon: Star,
      title: "Mejor Experiencia",
      description: "Servicios más rápidos y personalizados"
    },
    {
      icon: Shield,
      title: "Seguridad Total",
      description: "Protección de datos y transacciones"
    }
  ];

  const stats = [
    { value: "99.9%", label: "Disponibilidad", icon: Zap },
    { value: "+50%", label: "Productividad", icon: TrendingUp },
    { value: "24/7", label: "Soporte", icon: Globe },
    { value: "100%", label: "Cloud", icon: Sparkles }
  ];

  const handleLoginClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-login'));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-8"
          >
            <Hotel className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Sistema de Gestión
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Hotelera
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plataforma integral que revoluciona la administración hotelera con tecnología avanzada, 
            automatización inteligente y análisis en tiempo real.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={handleLoginClick}
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-white px-8 py-6 text-lg font-semibold"
            >
              Acceder al Sistema
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="hotel-card p-6 hover:shadow-floating hotel-transition">
                  <CardContent className="p-0">
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Módulos Principales
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Todo lo que necesitas para gestionar tu hotel de manera eficiente en una sola plataforma
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="hotel-card p-6 text-center hover:shadow-floating hotel-transition">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 hotel-transition">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Beneficios Clave
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Descubre cómo nuestra plataforma puede transformar las operaciones de tu hotel
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            ¿Cómo Funciona?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Empieza a usar el sistema en 3 simples pasos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Inicia Sesión", description: "Accede con tus credenciales de usuario proporcionadas por tu administrador" },
              { step: "2", title: "Explora los Módulos", description: "Navega por los diferentes módulos según tus permisos y rol asignado" },
              { step: "3", title: "Gestiona tu Hotel", description: "Administra reservas, huéspedes, habitaciones y más desde un solo lugar" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.15 }}
                className="relative"
              >
                <Card className="hotel-card p-6 text-center hover:shadow-floating hotel-transition h-full">
                  <CardContent className="p-0">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center bg-gradient-primary rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Transforma tu Hotel Hoy
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a los hoteles que ya optimizaron sus operaciones
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Fácil implementación</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Actualizaciones gratuitas</span>
            </div>
          </div>

          <Button 
            onClick={handleLoginClick}
            variant="secondary" 
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
          >
            Comenzar Ahora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
