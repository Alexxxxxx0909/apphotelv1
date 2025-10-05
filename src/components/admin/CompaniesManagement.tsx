import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin, 
  UserPlus,
  BarChart3,
  Calendar,
  Crown,
  Shield,
  Activity
} from 'lucide-react';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { useUsersByHotel } from '@/hooks/useUsersByHotel';
import { CompanyForm } from './CompanyForm';
import { ManagerForm } from './ManagerForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type DialogMode = 'none' | 'create-company' | 'edit-company' | 'create-manager' | 'view-details';

const CompaniesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogMode, setDialogMode] = useState<DialogMode>('none');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'activo' | 'inactivo' | 'bloqueado'>('all');

  const {
    companies,
    managers,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    createManager,
    getCompanyStatistics
  } = useCompanies();

  const { getUserCountForHotel } = useUsersByHotel();

  const statistics = getCompanyStatistics();

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.nit.includes(searchTerm) ||
      company.razonSocial.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || company.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateCompany = async (data: any) => {
    try {
      await createCompany(data);
      setDialogMode('none');
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleUpdateCompany = async (data: any) => {
    try {
      if (selectedCompany) {
        await updateCompany(selectedCompany.id, data);
        setDialogMode('none');
        setSelectedCompany(null);
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleCreateManager = async (data: any) => {
    try {
      await createManager({
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        companyId: data.companyId,
        hotelesAsignados: ['Hotel Principal', 'Hotel Sucursal'], // Asignar hoteles por defecto
        estado: 'activo'
      }, data.password);
      setDialogMode('none');
    } catch (error) {
      console.error('Error creating manager:', error);
    }
  };

  const getManagerForCompany = (companyId: string) => {
    return managers.find(manager => manager.companyId === companyId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-gray-100 text-gray-800';
      case 'bloqueado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basico': return 'bg-blue-100 text-blue-800';
      case 'estandar': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalEmpresas}</p>
                <p className="text-sm text-muted-foreground">Total Empresas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.empresasActivas}</p>
                <p className="text-sm text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalUsuarios}</p>
                <p className="text-sm text-muted-foreground">Usuarios Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.planDistribution.premium}</p>
                <p className="text-sm text-muted-foreground">Plan Premium</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header and Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Hoteles</h3>
          <p className="text-muted-foreground">Administra los hoteles registrados en el sistema</p>
        </div>
        <Button onClick={() => setDialogMode('create-company')}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Hotel
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, NIT o razón social..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {(['all', 'activo', 'inactivo', 'bloqueado'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Empresas Registradas</CardTitle>
          <CardDescription>
            {filteredCompanies.length} empresas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
              Error: {error}
            </div>
          )}
          
          <div className="space-y-4">
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No se encontraron empresas</p>
              </div>
            ) : (
              filteredCompanies.map((company) => {
                const manager = getManagerForCompany(company.id);
                return (
                  <div key={company.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{company.nombreComercial}</h4>
                          <p className="text-sm text-muted-foreground">
                            {company.razonSocial} - NIT: {company.nit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(company.estado)}>
                          {company.estado.charAt(0).toUpperCase() + company.estado.slice(1)}
                        </Badge>
                        <Badge className={getPlanColor(company.plan.tipo)}>
                          {company.plan.tipo.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{company.direccion}, {company.ciudad}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {company.hotelId ? getUserCountForHotel(company.hotelId) : company.estadisticas.usuarios} usuarios
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Plan hasta: {format(company.plan.fechaVencimiento, 'dd/MM/yyyy', { locale: es })}
                        </span>
                      </div>
                    </div>

                    {manager && (
                      <div className="mt-2 p-2 bg-green-50 rounded border-l-4 border-green-400">
                        <p className="text-sm">
                          <strong>Gerente:</strong> {manager.nombre} ({manager.email})
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedCompany(company);
                          setDialogMode('edit-company');
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedCompany(company);
                          setDialogMode('view-details');
                        }}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                      {!manager && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company);
                            setDialogMode('create-manager');
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Asignar Gerente
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteCompany(company.id)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Desactivar
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={dialogMode !== 'none'} onOpenChange={() => setDialogMode('none')}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-company' && 'Nuevo Hotel'}
              {dialogMode === 'edit-company' && 'Editar Hotel'}
              {dialogMode === 'create-manager' && 'Crear Gerente General'}
              {dialogMode === 'view-details' && 'Detalles del Hotel'}
            </DialogTitle>
          </DialogHeader>
          
          {(dialogMode === 'create-company' || dialogMode === 'edit-company') && (
            <CompanyForm
              company={dialogMode === 'edit-company' ? selectedCompany || undefined : undefined}
              onSubmit={dialogMode === 'create-company' ? handleCreateCompany : handleUpdateCompany}
              onCancel={() => setDialogMode('none')}
              loading={loading}
            />
          )}
          
          {dialogMode === 'create-manager' && (
            <ManagerForm
              companies={companies.filter(c => c.estado === 'activo')}
              onSubmit={handleCreateManager}
              onCancel={() => setDialogMode('none')}
              loading={loading}
            />
          )}

          {dialogMode === 'view-details' && selectedCompany && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Nombre:</strong> {selectedCompany.nombreComercial}</p>
                    <p><strong>Razón Social:</strong> {selectedCompany.razonSocial}</p>
                    <p><strong>NIT:</strong> {selectedCompany.nit}</p>
                    <p><strong>Email:</strong> {selectedCompany.emailCorporativo}</p>
                    <p><strong>Teléfono:</strong> {selectedCompany.telefono}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Plan y Licencia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Plan:</strong> {selectedCompany.plan.tipo.toUpperCase()}</p>
                    <p><strong>Inicio:</strong> {format(selectedCompany.plan.fechaInicio, 'dd/MM/yyyy')}</p>
                    <p><strong>Vencimiento:</strong> {format(selectedCompany.plan.fechaVencimiento, 'dd/MM/yyyy')}</p>
                    <p><strong>Módulos:</strong> {selectedCompany.plan.modulosActivos.join(', ')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesManagement;