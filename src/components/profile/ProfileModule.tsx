import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Lock, 
  Shield, 
  Bell, 
  Globe, 
  Sun, 
  Moon,
  Camera,
  Clock,
  Monitor,
  Smartphone,
  Save,
  FileText,
  HelpCircle,
  MessageSquare,
  Download,
  CheckCircle,
  AlertTriangle,
  Settings,
  Key,
  LogOut as LogOutIcon,
  History,
  UserCheck,
  FileSignature
} from 'lucide-react';
import { toast } from 'sonner';

interface LoginHistoryEntry {
  id: string;
  date: Date;
  time: string;
  device: string;
  ip: string;
  location: string;
  status: 'success' | 'failed';
}

interface NotificationPreference {
  id: string;
  name: string;
  email: boolean;
  sms: boolean;
  system: boolean;
}

const ProfileModule: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('es');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Mock data - En producción vendría de la base de datos
  const loginHistory: LoginHistoryEntry[] = [
    {
      id: '1',
      date: new Date('2024-12-20T10:30:00'),
      time: '10:30 AM',
      device: 'Chrome en Windows',
      ip: '192.168.1.100',
      location: 'Bogotá, Colombia',
      status: 'success'
    },
    {
      id: '2',
      date: new Date('2024-12-19T14:15:00'),
      time: '2:15 PM',
      device: 'Safari en iPhone',
      ip: '192.168.1.105',
      location: 'Bogotá, Colombia',
      status: 'success'
    },
    {
      id: '3',
      date: new Date('2024-12-18T09:45:00'),
      time: '9:45 AM',
      device: 'Chrome en Windows',
      ip: '192.168.1.100',
      location: 'Bogotá, Colombia',
      status: 'success'
    }
  ];

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
    { id: '1', name: 'Reservas nuevas', email: true, sms: false, system: true },
    { id: '2', name: 'Check-ins/Check-outs', email: true, sms: false, system: true },
    { id: '3', name: 'Mantenimiento programado', email: false, sms: false, system: true },
    { id: '4', name: 'Alertas de seguridad', email: true, sms: true, system: true },
    { id: '5', name: 'Reportes diarios', email: true, sms: false, system: false }
  ]);

  const modules = [
    { name: 'Dashboard', description: 'Acceso al panel principal', access: true },
    { name: 'Reservas', description: 'Gestión de reservaciones', access: true },
    { name: 'Recepción', description: 'Check-in/Check-out', access: true },
    { name: 'Facturación', description: 'Gestión financiera', access: user?.role === 'administrador' || user?.role === 'gerente' },
    { name: 'Housekeeping', description: 'Limpieza y mantenimiento', access: true },
    { name: 'Reportes', description: 'Análisis y estadísticas', access: user?.role === 'administrador' || user?.role === 'gerente' },
    { name: 'Administración', description: 'Gestión del sistema', access: user?.role === 'administrador' }
  ];

  const handleSavePersonalInfo = () => {
    toast.success('Información personal actualizada correctamente');
  };

  const handleChangePassword = () => {
    toast.success('Contraseña actualizada correctamente');
  };

  const handleToggleNotification = (id: string, type: 'email' | 'sms' | 'system') => {
    setNotificationPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, [type]: !pref[type] } : pref
      )
    );
  };

  const handleCloseAllSessions = () => {
    toast.success('Todas las sesiones remotas han sido cerradas');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'administrador':
        return <Badge className="bg-purple-100 text-purple-800"><Shield className="h-3 w-3 mr-1" />Administrador</Badge>;
      case 'gerente':
        return <Badge className="bg-blue-100 text-blue-800"><UserCheck className="h-3 w-3 mr-1" />Gerente</Badge>;
      case 'colaborador':
        return <Badge className="bg-green-100 text-green-800"><User className="h-3 w-3 mr-1" />Colaborador</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                {getRoleBadge(user?.role || '')}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>Hotel Bloom Suites</span>
                </div>
                {user?.role === 'colaborador' && (
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4" />
                    <span>Gerente asignado: Carlos Rodríguez</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          <TabsTrigger value="soporte">Soporte</TabsTrigger>
        </TabsList>

        {/* Información Personal */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tu información básica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="document">Documento</Label>
                  <Input id="document" defaultValue="123456789" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" defaultValue="+57 300 123 4567" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" defaultValue="Calle 123 #45-67, Bogotá" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" defaultValue={user?.role} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel">Hotel Asignado</Label>
                  <Input id="hotel" defaultValue="Hotel Bloom Suites" disabled />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSavePersonalInfo}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguridad y Acceso */}
        <TabsContent value="seguridad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button onClick={handleChangePassword}>
                <Key className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Autenticación de Dos Factores (2FA)</CardTitle>
              <CardDescription>Aumenta la seguridad de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">Habilitar 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Requiere código de verificación al iniciar sesión
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              {twoFactorEnabled && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm mb-2">
                    Escanea este código QR con tu aplicación de autenticación:
                  </p>
                  <div className="w-48 h-48 bg-white border rounded flex items-center justify-center">
                    <Settings className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Historial de Inicio de Sesión</span>
              </CardTitle>
              <CardDescription>Últimas actividades de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      {entry.device.includes('iPhone') ? (
                        <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      ) : (
                        <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{entry.device}</p>
                        <p className="text-sm text-muted-foreground">{entry.location}</p>
                        <p className="text-xs text-muted-foreground">IP: {entry.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={entry.status === 'success' ? 'default' : 'destructive'} className="mb-1">
                        {entry.status === 'success' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                        {entry.status === 'success' ? 'Exitoso' : 'Fallido'}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {entry.date.toLocaleDateString()} {entry.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <Button variant="destructive" onClick={handleCloseAllSessions}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                Cerrar Todas las Sesiones Activas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferencias */}
        <TabsContent value="preferencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="col-span-1"></div>
                  <div className="text-center text-sm font-medium">Email</div>
                  <div className="text-center text-sm font-medium">SMS</div>
                  <div className="text-center text-sm font-medium">Sistema</div>
                </div>

                {notificationPreferences.map((pref) => (
                  <div key={pref.id} className="grid grid-cols-4 gap-4 items-center">
                    <div className="col-span-1">
                      <Label>{pref.name}</Label>
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={pref.email}
                        onCheckedChange={() => handleToggleNotification(pref.id, 'email')}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={pref.sms}
                        onCheckedChange={() => handleToggleNotification(pref.id, 'sms')}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={pref.system}
                        onCheckedChange={() => handleToggleNotification(pref.id, 'system')}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Horario de Notificaciones</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">De 8:00 AM a 6:00 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>Personaliza la interfaz del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema Visual</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Claro
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Oscuro
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Zona Horaria</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="America/Bogota">Bogotá (GMT-5)</option>
                  <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                  <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {user?.role === 'administrador' && (
            <Card>
              <CardHeader>
                <CardTitle>Firma Digital</CardTitle>
                <CardDescription>Configura tu firma para documentos oficiales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <FileSignature className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Haz clic para cargar o dibujar tu firma digital
                  </p>
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Configurar Firma
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Módulos y Permisos */}
        <TabsContent value="modulos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Módulos Asignados</CardTitle>
              <CardDescription>
                Módulos a los que tienes acceso según tu rol: {user?.role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {modules.map((module) => (
                  <div
                    key={module.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{module.name}</p>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    {module.access ? (
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Acceso Habilitado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Sin Acceso
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {user?.role !== 'administrador' && (
                <>
                  <Separator className="my-6" />
                  
                  <div>
                    <h4 className="font-medium mb-2">Solicitar Acceso Adicional</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      ¿Necesitas acceso a un módulo adicional? Solicítalo a tu gerente o administrador.
                    </p>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Solicitar Acceso
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {user?.role === 'gerente' && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen de tu Cuenta</CardTitle>
                <CardDescription>Estadísticas de tu gestión</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-sm text-muted-foreground">Colaboradores Asignados</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-sm text-muted-foreground">Proveedores Activos</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-sm text-muted-foreground">Hotel Asignado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documentación y Soporte */}
        <TabsContent value="soporte" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Centro de Ayuda</CardTitle>
              <CardDescription>Encuentra respuestas a tus preguntas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Preguntas Frecuentes (FAQ)
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Guías de Usuario por Módulo
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Descargar Manual Completo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soporte Técnico</CardTitle>
              <CardDescription>¿Necesitas ayuda? Contáctanos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email de Soporte</Label>
                <p className="text-sm">soporte@bloomsuites.com</p>
              </div>

              <div className="space-y-2">
                <Label>Teléfono</Label>
                <p className="text-sm">+57 (1) 234-5678</p>
              </div>

              <div className="space-y-2">
                <Label>Horario de Atención</Label>
                <p className="text-sm">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p className="text-sm">Sábados: 9:00 AM - 1:00 PM</p>
              </div>

              <Separator />

              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Ticket de Soporte
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Versión del Sistema:</span>
                  <span className="font-medium">v2.5.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última Actualización:</span>
                  <span className="font-medium">15 Dic 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Navegador:</span>
                  <span className="font-medium">Chrome 120.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileModule;
