import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Globe, 
  DollarSign, 
  Mail, 
  CreditCard,
  Database,
  Palette,
  Languages,
  Receipt,
  Link,
  Bell,
  Shield,
  Server,
  Cloud,
  Smartphone,
  Edit,
  Save,
  Upload,
  Download
} from 'lucide-react';

const GlobalConfigModule: React.FC = () => {
  const [currency, setCurrency] = useState('COP');
  const [language, setLanguage] = useState('es');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const platformData = {
    name: 'Sistema Hotelero Premium',
    version: '2.1.0',
    currency: 'COP',
    defaultTax: '19',
    languages: ['Español', 'Inglés'],
    timezone: 'America/Bogota'
  };

  const subscriptionPlans = [
    {
      name: 'Básico',
      price: '$50.000',
      users: 5,
      modules: 3,
      transactions: 1000,
      active: 8,
      features: ['Reservas', 'Recepción', 'Reportes básicos']
    },
    {
      name: 'Estándar',
      price: '$120.000',
      users: 15,
      modules: 6,
      transactions: 5000,
      active: 15,
      features: ['Todos los módulos', 'Reportes avanzados', 'Soporte email']
    },
    {
      name: 'Premium',
      price: '$250.000',
      users: 'Ilimitado',
      modules: 'Todos',
      transactions: 'Ilimitado',
      active: 3,
      features: ['Funcionalidad completa', 'Soporte prioritario', 'Integraciones API', 'Respaldos automáticos']
    }
  ];

  const emailTemplates = [
    { name: 'Bienvenida Usuario', status: 'active', lastModified: '2024-01-10' },
    { name: 'Factura Electrónica', status: 'active', lastModified: '2024-01-08' },
    { name: 'Confirmación Reserva', status: 'active', lastModified: '2024-01-05' },
    { name: 'Alerta de Seguridad', status: 'draft', lastModified: '2024-01-03' },
    { name: 'Recordatorio Pago', status: 'active', lastModified: '2024-01-01' }
  ];

  const integrations = [
    { 
      name: 'PayU', 
      type: 'Pasarela de Pago', 
      status: 'connected', 
      description: 'Procesamiento de pagos con tarjetas'
    },
    { 
      name: 'Wompi', 
      type: 'Pasarela de Pago', 
      status: 'connected', 
      description: 'Pagos PSE y Nequi'
    },
    { 
      name: 'DIAN', 
      type: 'Facturación', 
      status: 'connected', 
      description: 'Facturación electrónica'
    },
    { 
      name: 'Booking.com', 
      type: 'Channel Manager', 
      status: 'available', 
      description: 'Gestión de reservas externas'
    },
    { 
      name: 'Expedia', 
      type: 'Channel Manager', 
      status: 'available', 
      description: 'Distribución de inventario'
    },
    { 
      name: 'WhatsApp Business', 
      type: 'Comunicaciones', 
      status: 'available', 
      description: 'Notificaciones y soporte'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Configuración Global</h3>
        <p className="text-muted-foreground">Parámetros generales aplicables a toda la plataforma</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="plans">Planes y Licencias</TabsTrigger>
          <TabsTrigger value="email">Correo y Notificaciones</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Datos Generales de la Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Nombre de la Plataforma</Label>
                  <Input 
                    id="platform-name" 
                    value={platformData.name}
                    placeholder="Nombre del sistema"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-version">Versión</Label>
                  <Input 
                    id="platform-version" 
                    value={platformData.version}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="america-bogota">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-bogota">America/Bogotá (UTC-5)</SelectItem>
                      <SelectItem value="america-mexico">America/Mexico_City (UTC-6)</SelectItem>
                      <SelectItem value="america-lima">America/Lima (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Configuración Financiera
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-currency">Moneda Base</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-tax">IVA por Defecto (%)</Label>
                  <Input 
                    id="default-tax" 
                    type="number"
                    value={platformData.defaultTax}
                    placeholder="19"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention">Retención por Defecto (%)</Label>
                  <Input 
                    id="retention" 
                    type="number"
                    placeholder="3.5"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-tax" />
                  <Label htmlFor="auto-tax">Aplicar impuestos automáticamente</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Languages className="h-5 w-5 mr-2" />
                  Idiomas y Localización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-language">Idioma por Defecto</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                      <SelectItem value="pt">Portugués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Idiomas Disponibles</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Español</Badge>
                    <Badge variant="outline">Inglés</Badge>
                    <Button variant="ghost" size="sm">
                      + Agregar Idioma
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de Fecha</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Branding y Apariencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo de la Plataforma</Label>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Globe className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Logo
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Color Primario</Label>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded border"></div>
                    <Input id="primary-color" value="#3B82F6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nombre de la Empresa</Label>
                  <Input 
                    id="company-name" 
                    placeholder="Tu Empresa S.A.S."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-medium">Gestión de Planes y Licencias</h4>
              <p className="text-sm text-muted-foreground">Controla suscripciones y límites del sistema</p>
            </div>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Crear Nuevo Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.name}>
                <CardHeader>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    {plan.price}/mes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usuarios:</span>
                      <span className="font-medium">{plan.users}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Módulos:</span>
                      <span className="font-medium">{plan.modules}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Transacciones:</span>
                      <span className="font-medium">{plan.transactions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hoteles activos:</span>
                      <Badge variant="outline">{plan.active}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Características:</Label>
                    <ul className="text-xs space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver Hoteles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gestión de Licencias</CardTitle>
              <CardDescription>Control de suscripciones activas y vencidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">26</p>
                  <p className="text-sm text-muted-foreground">Licencias Activas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">3</p>
                  <p className="text-sm text-muted-foreground">Por Vencer (30 días)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-muted-foreground">Vencidas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">$8.5M</p>
                  <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Ver Reportes de Facturación</Button>
                <Button variant="outline">Gestionar Renovaciones</Button>
                <Button>Configurar Recordatorios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Configuración SMTP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input 
                    id="smtp-host" 
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">Puerto</Label>
                    <Input 
                      id="smtp-port" 
                      placeholder="587"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-security">Seguridad</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">Ninguna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Usuario</Label>
                  <Input 
                    id="smtp-user" 
                    placeholder="sistema@tuempresa.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-pass">Contraseña</Label>
                  <Input 
                    id="smtp-pass" 
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline">
                    Probar Conexión
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Configuración de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificaciones por Email</Label>
                      <p className="text-xs text-muted-foreground">Enviar alertas por correo</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificaciones Push</Label>
                      <p className="text-xs text-muted-foreground">Notificaciones en navegador</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">SMS (WhatsApp)</Label>
                      <p className="text-xs text-muted-foreground">Mensajes de texto</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">Frecuencia de Resúmenes</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instantáneo</SelectItem>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Configurar WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plantillas de Correo</CardTitle>
              <CardDescription>Configura plantillas para diferentes tipos de notificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Última modificación: {template.lastModified}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                        {template.status === 'active' ? 'Activa' : 'Borrador'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-medium">Integraciones Externas</h4>
              <p className="text-sm text-muted-foreground">Conecta con servicios de terceros</p>
            </div>
            <Button>
              <Link className="h-4 w-4 mr-2" />
              Explorar Integraciones
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Link className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.type}</p>
                      </div>
                    </div>
                    <Badge variant={integration.status === 'connected' ? 'default' : 'outline'}>
                      {integration.status === 'connected' ? 'Conectado' : 'Disponible'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                  <div className="flex space-x-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          Configurar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Desconectar
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="flex-1">
                        Conectar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Keys y Webhooks</CardTitle>
              <CardDescription>Gestiona claves de API y configuración de webhooks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">API Key Principal</h4>
                    <p className="text-sm text-muted-foreground font-mono">sk_live_••••••••••••••••</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Ver</Button>
                    <Button variant="outline" size="sm">Regenerar</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">Webhook Endpoint</h4>
                    <p className="text-sm text-muted-foreground">https://api.tudominio.com/webhooks</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Respaldos Automáticos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Respaldo Automático</Label>
                    <p className="text-xs text-muted-foreground">Ejecutar respaldos programados</p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>
                <div className="space-y-2">
                  <Label>Frecuencia de Respaldos</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Retención de Respaldos</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="365">1 año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Cloud className="h-4 w-4 mr-2" />
                    Ejecutar Respaldo
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Sistema y Disponibilidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Modo Mantenimiento</Label>
                    <p className="text-xs text-muted-foreground">Bloquear acceso temporal</p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance-message">Mensaje de Mantenimiento</Label>
                  <Textarea 
                    id="maintenance-message"
                    placeholder="El sistema está en mantenimiento. Estará disponible en breve."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado del Sistema</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Base de Datos</span>
                      <Badge variant="outline" className="text-green-600">Operativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Services</span>
                      <Badge variant="outline" className="text-green-600">Operativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Storage</span>
                      <Badge variant="outline" className="text-green-600">Operativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>CDN</span>
                      <Badge variant="outline" className="text-green-600">Operativo</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Ver Logs del Sistema
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gestión de Logs</CardTitle>
              <CardDescription>Configuración y limpieza de registros del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">2.4 GB</p>
                  <p className="text-sm text-muted-foreground">Tamaño Total de Logs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">30 días</p>
                  <p className="text-sm text-muted-foreground">Retención Actual</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">156,847</p>
                  <p className="text-sm text-muted-foreground">Entradas Totales</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Descargar Logs</Button>
                <Button variant="outline">Limpiar Logs Antiguos</Button>
                <Button>Configurar Retención</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalConfigModule;