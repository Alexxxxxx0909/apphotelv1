import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit, 
  Eye,
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GroupMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  documentType: string;
  documentNumber: string;
  relationship: string;
  age?: number;
}

interface GuestGroup {
  id: string;
  reservationNumber: string;
  mainGuestName: string;
  mainGuestEmail: string;
  mainGuestPhone: string;
  roomNumber: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  members: GroupMember[];
  groupType: 'family' | 'friends' | 'business' | 'event';
  status: 'pending' | 'checked-in' | 'checked-out';
}

const mockGroups: GuestGroup[] = [
  {
    id: '1',
    reservationNumber: 'RES-2024-0001',
    mainGuestName: 'Juan Pérez García',
    mainGuestEmail: 'juan.perez@email.com',
    mainGuestPhone: '+34 666 123 456',
    roomNumber: '205',
    roomType: 'Suite Familiar',
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    groupType: 'family',
    status: 'checked-in',
    members: [
      {
        id: 'm1',
        name: 'María Pérez López',
        email: 'maria.perez@email.com',
        phone: '+34 666 123 457',
        documentType: 'DNI',
        documentNumber: '12345678B',
        relationship: 'Esposa',
        age: 35
      },
      {
        id: 'm2',
        name: 'Pablo Pérez López',
        documentType: 'DNI',
        documentNumber: '12345678C',
        relationship: 'Hijo',
        age: 8
      },
      {
        id: 'm3',
        name: 'Ana Pérez López',
        documentType: 'DNI',
        documentNumber: '12345678D',
        relationship: 'Hija',
        age: 12
      }
    ]
  },
  {
    id: '2',
    reservationNumber: 'RES-2024-0005',
    mainGuestName: 'Carlos Rodríguez Martín',
    mainGuestEmail: 'carlos.rodriguez@empresa.com',
    mainGuestPhone: '+34 677 888 999',
    roomNumber: '301-302',
    roomType: 'Habitaciones Conectadas',
    checkIn: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    groupType: 'business',
    status: 'pending',
    members: [
      {
        id: 'm4',
        name: 'Elena Sánchez García',
        email: 'elena.sanchez@empresa.com',
        phone: '+34 677 888 998',
        documentType: 'DNI',
        documentNumber: '87654321A',
        relationship: 'Colega',
        age: 30
      },
      {
        id: 'm5',
        name: 'Miguel Torres Ruiz',
        email: 'miguel.torres@empresa.com',
        phone: '+34 677 888 997',
        documentType: 'DNI',
        documentNumber: '87654321B',
        relationship: 'Colega',
        age: 28
      }
    ]
  }
];

const groupTypeLabels = {
  family: 'Familia',
  friends: 'Amigos',
  business: 'Negocios',
  event: 'Evento'
};

const statusLabels = {
  pending: 'Pendiente',
  'checked-in': 'Registrado',
  'checked-out': 'Salida'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'checked-in': 'bg-green-100 text-green-800',
  'checked-out': 'bg-gray-100 text-gray-800'
};

const GuestGroupManagement: React.FC = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<GuestGroup[]>(mockGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GuestGroup | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<GroupMember>>({
    name: '',
    email: '',
    phone: '',
    documentType: 'DNI',
    documentNumber: '',
    relationship: '',
    age: undefined
  });

  const filteredGroups = groups.filter(group =>
    group.mainGuestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.roomNumber.includes(searchTerm)
  );

  const handleAddMember = () => {
    if (!selectedGroup || !newMember.name || !newMember.documentNumber) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const memberToAdd: GroupMember = {
      id: `m${Date.now()}`,
      name: newMember.name!,
      email: newMember.email,
      phone: newMember.phone,
      documentType: newMember.documentType!,
      documentNumber: newMember.documentNumber!,
      relationship: newMember.relationship!,
      age: newMember.age
    };

    setGroups(prev => prev.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, members: [...group.members, memberToAdd] }
        : group
    ));

    setSelectedGroup(prev => prev ? { ...prev, members: [...prev.members, memberToAdd] } : null);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      documentType: 'DNI',
      documentNumber: '',
      relationship: '',
      age: undefined
    });
    setIsAddingMember(false);

    toast({
      title: "Miembro Agregado",
      description: `${memberToAdd.name} ha sido agregado al grupo`,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedGroup) return;

    setGroups(prev => prev.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, members: group.members.filter(m => m.id !== memberId) }
        : group
    ));

    setSelectedGroup(prev => prev ? 
      { ...prev, members: prev.members.filter(m => m.id !== memberId) } 
      : null
    );

    toast({
      title: "Miembro Eliminado",
      description: "El miembro ha sido eliminado del grupo",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Grupos y Acompañantes</CardTitle>
          <CardDescription>
            Administra grupos familiares, empresariales y de eventos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por huésped principal, reserva o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de grupos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Grupos Registrados ({filteredGroups.length})</h3>
          {filteredGroups.map((group) => (
            <motion.div
              key={group.id}
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedGroup?.id === group.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedGroup(group)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{group.mainGuestName}</h4>
                      <p className="text-sm text-muted-foreground">{group.reservationNumber}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        {groupTypeLabels[group.groupType]}
                      </Badge>
                      <Badge className={statusColors[group.status]}>
                        {statusLabels[group.status]}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{group.roomType} - {group.roomNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{group.members.length + 1} personas</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {group.mainGuestName.split(' ')[0]} (Principal)
                    </Badge>
                    {group.members.slice(0, 3).map((member) => (
                      <Badge key={member.id} variant="secondary" className="text-xs">
                        {member.name.split(' ')[0]}
                      </Badge>
                    ))}
                    {group.members.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{group.members.length - 3} más
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detalle del grupo */}
        <div>
          {selectedGroup ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Detalle del Grupo</CardTitle>
                    <CardDescription>
                      {selectedGroup.reservationNumber} - {selectedGroup.roomNumber}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsAddingMember(true)}
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Huésped principal */}
                <div className="p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">Huésped Principal</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div><strong>{selectedGroup.mainGuestName}</strong></div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>{selectedGroup.mainGuestEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>{selectedGroup.mainGuestPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Miembros del grupo */}
                <div>
                  <h4 className="font-medium mb-3">Acompañantes ({selectedGroup.members.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedGroup.members.map((member) => (
                      <div key={member.id} className="flex justify-between items-start p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.relationship} {member.age && `(${member.age} años)`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.documentType}: {member.documentNumber}
                          </div>
                          {member.email && (
                            <div className="text-sm text-muted-foreground">
                              📧 {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="text-sm text-muted-foreground">
                              📞 {member.phone}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formulario para agregar miembro */}
                {isAddingMember && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-3">Agregar Acompañante</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="member-name">Nombre completo *</Label>
                          <Input
                            id="member-name"
                            value={newMember.name || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="member-relationship">Relación</Label>
                          <Input
                            id="member-relationship"
                            placeholder="Esposo/a, Hijo/a, Amigo/a..."
                            value={newMember.relationship || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, relationship: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="member-doc-type">Tipo documento</Label>
                          <Select 
                            value={newMember.documentType}
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, documentType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DNI">DNI</SelectItem>
                              <SelectItem value="NIE">NIE</SelectItem>
                              <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="member-doc-number">Número *</Label>
                          <Input
                            id="member-doc-number"
                            value={newMember.documentNumber || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, documentNumber: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="member-age">Edad</Label>
                          <Input
                            id="member-age"
                            type="number"
                            value={newMember.age || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : undefined }))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="member-email">Email</Label>
                          <Input
                            id="member-email"
                            type="email"
                            value={newMember.email || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="member-phone">Teléfono</Label>
                          <Input
                            id="member-phone"
                            value={newMember.phone || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button onClick={handleAddMember}>
                          Agregar Acompañante
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setIsAddingMember(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecciona un grupo</h3>
                <p className="text-muted-foreground">
                  Elige un grupo de la lista para ver y gestionar sus acompañantes.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GuestGroupManagement;