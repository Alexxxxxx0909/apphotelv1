import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  BedDouble,
  Coffee,
  Pencil,
  Trash2,
  Minus,
  ChevronsUpDown,
  Check,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, Order, OrderItem, OrderStatus, OrderType } from '@/hooks/useOrders';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useReservations } from '@/hooks/useReservations';
import { useConsumptions } from '@/hooks/useConsumptions';
import { useToast } from '@/hooks/use-toast';

interface FormState {
  tipo: OrderType;
  ubicacion: string;
  cliente: string;
  reservationId: string;
  mesero: string;
  observaciones: string;
  estado: OrderStatus;
  pagado: boolean;
  items: OrderItem[];
}

const emptyForm: FormState = {
  tipo: 'restaurante',
  ubicacion: '',
  cliente: '',
  reservationId: '',
  mesero: '',
  observaciones: '',
  estado: 'pendiente',
  pagado: false,
  items: [],
};

const mapOrderTypeToCategory = (
  tipo: OrderType
): 'restaurant' | 'minibar' | 'other' => {
  if (tipo === 'restaurante' || tipo === 'cafeteria') return 'restaurant';
  if (tipo === 'bar' || tipo === 'room-service') return 'minibar';
  return 'other';
};

const OrdersConsumption: React.FC = () => {
  const { user } = useAuth();
  const hotelId = user?.hotel;
  const { toast } = useToast();
  const { orders, loading, addOrder, updateOrder, deleteOrder, generateOrderNumber } = useOrders(hotelId);
  const { menuItems } = useMenuItems(hotelId);
  const { reservations } = useReservations(hotelId);
  // hook con reservationId opcional - lo usamos solo para crear consumos puntuales
  const { addConsumption, deleteConsumption } = useConsumptions(undefined as any);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false);

  const activeMenuItems = useMemo(
    () => menuItems.filter((m) => m.activo !== false),
    [menuItems]
  );

  // Solo huéspedes con reserva activa (confirmada o pendiente)
  const availableGuests = useMemo(() => {
    return reservations
      .filter((r) => r.status === 'confirmada' || r.status === 'pendiente')
      .sort((a, b) => a.guestName.localeCompare(b.guestName));
  }, [reservations]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !searchTerm ||
        o.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'todos' || o.estado === filterStatus;
      const matchesType = filterType === 'todos' || o.tipo === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, searchTerm, filterStatus, filterType]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => o.fechaHora >= today);
    return {
      pendientes: orders.filter((o) => o.estado === 'pendiente').length,
      preparando: orders.filter((o) => o.estado === 'preparando').length,
      entregadasHoy: todayOrders.filter((o) => o.estado === 'entregado').length,
      ventasHoy: todayOrders
        .filter((o) => o.estado !== 'cancelado')
        .reduce((acc, o) => acc + (o.total || 0), 0),
    };
  }, [orders]);

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
    return { subtotal, total: subtotal };
  }, [form.items]);

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedMenuId('');
    setEditingOrder(null);
  };

  const openCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setForm({
      tipo: order.tipo,
      ubicacion: order.ubicacion,
      cliente: order.cliente,
      reservationId: order.reservationId || '',
      mesero: order.mesero,
      observaciones: order.observaciones || '',
      estado: order.estado,
      pagado: order.pagado || false,
      items: order.items.map((i) => ({ ...i })),
    });
    setIsDialogOpen(true);
  };

  const handleSelectGuest = (reservationId: string) => {
    const guest = availableGuests.find((g) => g.id === reservationId);
    if (!guest) return;
    setForm((prev) => ({
      ...prev,
      reservationId: guest.id,
      cliente: guest.guestName,
      // Si es room-service y aún no hay ubicación, prellenar con la habitación
      ubicacion:
        prev.tipo === 'room-service' && !prev.ubicacion
          ? `Habitación ${guest.roomNumber}`
          : prev.ubicacion,
    }));
    setClientPopoverOpen(false);
  };

  const handleAddItem = () => {
    if (!selectedMenuId) return;
    const menu = activeMenuItems.find((m) => m.id === selectedMenuId);
    if (!menu) return;
    setForm((prev) => {
      const existing = prev.items.find((i) => i.menuItemId === menu.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.menuItemId === menu.id ? { ...i, cantidad: i.cantidad + 1 } : i
          ),
        };
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            menuItemId: menu.id,
            nombre: menu.nombre,
            precio: menu.precio,
            cantidad: 1,
          },
        ],
      };
    });
    setSelectedMenuId('');
  };

  const handleQty = (menuItemId: string, delta: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items
        .map((i) =>
          i.menuItemId === menuItemId ? { ...i, cantidad: i.cantidad + delta } : i
        )
        .filter((i) => i.cantidad > 0),
    }));
  };

  const handleRemoveItem = (menuItemId: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.menuItemId !== menuItemId),
    }));
  };

  // Crea registro de consumo asociado a la reserva (para checkout)
  const createConsumptionForOrder = async (
    order: Pick<Order, 'reservationId' | 'numeroOrden' | 'tipo' | 'items' | 'total' | 'hotelId'>
  ) => {
    if (!order.reservationId) return undefined;
    try {
      const description = `${order.numeroOrden} - ${order.items
        .map((i) => `${i.cantidad}x ${i.nombre}`)
        .join(', ')}`;
      const id = await addConsumption({
        reservationId: order.reservationId,
        hotelId: order.hotelId,
        service: `F&B ${order.tipo}`,
        description,
        quantity: 1,
        unitPrice: order.total,
        total: order.total,
        date: new Date(),
        category: mapOrderTypeToCategory(order.tipo),
      });
      return id;
    } catch (err) {
      console.error('Error creando consumo asociado:', err);
      return undefined;
    }
  };

  const handleSubmit = async () => {
    if (!hotelId) {
      toast({ title: 'Error', description: 'No hay hotel asignado', variant: 'destructive' });
      return;
    }
    if (!form.cliente.trim() || !form.reservationId) {
      toast({
        title: 'Cliente requerido',
        description: 'Selecciona un huésped con reserva activa',
        variant: 'destructive',
      });
      return;
    }
    if (!form.mesero.trim() || !form.ubicacion.trim()) {
      toast({
        title: 'Campos requeridos',
        description: 'Completa mesero y mesa/habitación',
        variant: 'destructive',
      });
      return;
    }
    if (form.items.length === 0) {
      toast({
        title: 'Sin productos',
        description: 'Agrega al menos un producto del menú',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const basePayload = {
        tipo: form.tipo,
        ubicacion: form.ubicacion.trim(),
        cliente: form.cliente.trim(),
        reservationId: form.reservationId,
        mesero: form.mesero.trim(),
        observaciones: form.observaciones.trim(),
        estado: form.estado,
        pagado: form.pagado,
        items: form.items,
        subtotal: totals.subtotal,
        total: totals.total,
        hotelId,
      };

      if (editingOrder) {
        // Sincronizar consumo según estado de pago
        let consumptionId = editingOrder.consumptionId;
        // Si estaba sin pagar y ahora está pagado -> eliminar consumo asociado
        if (form.pagado && consumptionId) {
          await deleteConsumption(consumptionId).catch(() => {});
          consumptionId = undefined;
        }
        // Si no está pagado y no tiene consumo y no fue cancelado -> crear consumo
        if (!form.pagado && !consumptionId && form.estado !== 'cancelado') {
          consumptionId = await createConsumptionForOrder(basePayload);
        }
        // Si fue cancelado y existe consumo -> eliminar
        if (form.estado === 'cancelado' && consumptionId) {
          await deleteConsumption(consumptionId).catch(() => {});
          consumptionId = undefined;
        }
        await updateOrder(editingOrder.id, { ...basePayload, consumptionId });
        toast({ title: 'Orden actualizada', description: 'Los cambios se guardaron' });
      } else {
        // Crear consumo si no está pagado y no fue cancelado al crearse
        let consumptionId: string | undefined;
        if (!form.pagado && form.estado !== 'cancelado') {
          consumptionId = await createConsumptionForOrder(basePayload);
        }
        await addOrder({ ...basePayload, consumptionId });
        toast({
          title: 'Orden creada',
          description: form.pagado
            ? 'Orden registrada como pagada en sitio'
            : 'Cargo agregado a la cuenta del huésped',
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo guardar la orden',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (order: Order, estado: OrderStatus) => {
    try {
      // Si se cancela, eliminar consumo asociado
      let consumptionId = order.consumptionId;
      if (estado === 'cancelado' && consumptionId) {
        await deleteConsumption(consumptionId).catch(() => {});
        consumptionId = undefined;
      }
      await updateOrder(order.id, { estado, consumptionId });
      toast({ title: 'Estado actualizado', description: `Orden ${order.numeroOrden}: ${estado}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleTogglePaid = async (order: Order) => {
    try {
      const nuevoPagado = !order.pagado;
      let consumptionId = order.consumptionId;

      if (nuevoPagado) {
        // Marcar como pagado -> retirar de la cuenta del huésped
        if (consumptionId) {
          await deleteConsumption(consumptionId).catch(() => {});
          consumptionId = undefined;
        }
      } else {
        // Quitar pagado -> volver a cargar a la cuenta del huésped
        if (!consumptionId && order.reservationId && order.estado !== 'cancelado') {
          consumptionId = await createConsumptionForOrder(order);
        }
      }

      await updateOrder(order.id, { pagado: nuevoPagado, consumptionId });
      toast({
        title: nuevoPagado ? 'Marcada como pagada' : 'Marcada como pendiente de pago',
        description: nuevoPagado
          ? 'El pedido fue retirado de la cuenta del huésped'
          : 'El pedido se agregó a la cuenta del huésped',
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deletingOrder) return;
    try {
      // Eliminar consumo asociado si existe
      if (deletingOrder.consumptionId) {
        await deleteConsumption(deletingOrder.consumptionId).catch(() => {});
      }
      await deleteOrder(deletingOrder.id);
      toast({ title: 'Orden eliminada', description: deletingOrder.numeroOrden });
      setDeletingOrder(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-500';
      case 'preparando':
        return 'bg-blue-500';
      case 'listo':
        return 'bg-green-500';
      case 'entregado':
        return 'bg-gray-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
      case 'preparando':
        return <Clock className="h-4 w-4" />;
      case 'listo':
      case 'entregado':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurante':
        return <Users className="h-4 w-4" />;
      case 'bar':
      case 'cafeteria':
        return <Coffee className="h-4 w-4" />;
      case 'room-service':
        return <BedDouble className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  const selectedGuest = availableGuests.find((g) => g.id === form.reservationId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por número, cliente o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="preparando">Preparando</SelectItem>
              <SelectItem value="listo">Listo</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Tipo de servicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los servicios</SelectItem>
              <SelectItem value="restaurante">Restaurante</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="cafeteria">Cafetería</SelectItem>
              <SelectItem value="room-service">Room Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate} className="w-full lg:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Orden
        </Button>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando órdenes...</div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay órdenes registradas. Haz clic en "Nueva Orden" para crear la primera.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <motion.div key={order.id} whileHover={{ scale: 1.02 }} className="group">
              <Card className="h-full hover:shadow-hotel transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <CardTitle className="text-lg">{order.numeroOrden}</CardTitle>
                        <Badge className={`${getStatusColor(order.estado)} text-white`}>
                          {getStatusIcon(order.estado)}
                          <span className="ml-1 capitalize">{order.estado}</span>
                        </Badge>
                        {order.pagado ? (
                          <Badge className="bg-emerald-600 text-white">
                            <DollarSign className="h-3 w-3 mr-0.5" />
                            Pagada
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500 text-amber-600">
                            A cuenta
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getTypeIcon(order.tipo)}
                        <span className="capitalize">{order.tipo}</span>
                        <span>•</span>
                        <span>{formatTime(order.fechaHora)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEdit(order)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeletingOrder(order)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium">{order.cliente}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mesero:</span>
                      <span>{order.mesero}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.tipo === 'room-service' ? 'Habitación:' : 'Mesa:'}
                      </span>
                      <span>{order.ubicacion}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.cantidad}x {item.nombre}
                          </span>
                          <span>{formatCurrency(item.precio * item.cantidad)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  {order.observaciones && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <strong>Observaciones:</strong> {order.observaciones}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {order.estado === 'pendiente' && (
                      <Button
                        size="sm"
                        className="flex-1 min-w-[120px]"
                        onClick={() => handleStatusChange(order, 'preparando')}
                      >
                        Iniciar Preparación
                      </Button>
                    )}
                    {order.estado === 'preparando' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 min-w-[120px]"
                        onClick={() => handleStatusChange(order, 'listo')}
                      >
                        Marcar Listo
                      </Button>
                    )}
                    {order.estado === 'listo' && (
                      <Button
                        size="sm"
                        className="flex-1 min-w-[120px]"
                        onClick={() => handleStatusChange(order, 'entregado')}
                      >
                        Entregar
                      </Button>
                    )}
                    {order.estado !== 'cancelado' && (
                      <Button
                        size="sm"
                        variant={order.pagado ? 'outline' : 'secondary'}
                        className="flex-1 min-w-[120px]"
                        onClick={() => handleTogglePaid(order)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        {order.pagado ? 'Marcar No Pagada' : 'Marcar Pagada'}
                      </Button>
                    )}
                    {(order.estado === 'pendiente' || order.estado === 'preparando') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleStatusChange(order, 'cancelado')}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
            <div className="text-sm text-muted-foreground">Órdenes Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.preparando}</div>
            <div className="text-sm text-muted-foreground">En Preparación</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.entregadasHoy}</div>
            <div className="text-sm text-muted-foreground">Entregadas Hoy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.ventasHoy)}
            </div>
            <div className="text-sm text-muted-foreground">Ventas del Día</div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Order Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOrder ? 'Editar Orden' : 'Nueva Orden'}</DialogTitle>
            <DialogDescription>
              {editingOrder
                ? `Modifica los datos de ${editingOrder.numeroOrden}`
                : 'Registra una nueva orden de consumo'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Tipo de Servicio</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(v: OrderType) => setForm({ ...form, tipo: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurante">Restaurante</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="cafeteria">Cafetería</SelectItem>
                    <SelectItem value="room-service">Room Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cliente (Huésped) *</Label>
                <Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      {selectedGuest
                        ? `${selectedGuest.guestName} — Hab. ${selectedGuest.roomNumber}`
                        : 'Selecciona un huésped...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar huésped..." />
                      <CommandList>
                        <CommandEmpty>
                          {availableGuests.length === 0
                            ? 'No hay reservas activas en este hotel'
                            : 'Sin coincidencias'}
                        </CommandEmpty>
                        <CommandGroup>
                          {availableGuests.map((guest) => (
                            <CommandItem
                              key={guest.id}
                              value={`${guest.guestName} ${guest.roomNumber} ${guest.reservationNumber}`}
                              onSelect={() => handleSelectGuest(guest.id)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  form.reservationId === guest.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{guest.guestName}</span>
                                <span className="text-xs text-muted-foreground">
                                  Hab. {guest.roomNumber} · {guest.reservationNumber}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground mt-1">
                  Solo se muestran huéspedes con reserva activa
                </p>
              </div>

              <div>
                <Label htmlFor="mesero">Mesero / Responsable *</Label>
                <Input
                  id="mesero"
                  placeholder="Nombre del mesero"
                  value={form.mesero}
                  onChange={(e) => setForm({ ...form, mesero: e.target.value })}
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select
                  value={form.estado}
                  onValueChange={(v: OrderStatus) => setForm({ ...form, estado: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="preparando">Preparando</SelectItem>
                    <SelectItem value="listo">Listo</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="ubicacion">
                  {form.tipo === 'room-service' ? 'Habitación *' : 'Mesa / Ubicación *'}
                </Label>
                <Input
                  id="ubicacion"
                  placeholder={
                    form.tipo === 'room-service' ? 'Ej: Habitación 205' : 'Ej: Mesa 12'
                  }
                  value={form.ubicacion}
                  onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Instrucciones especiales"
                  value={form.observaciones}
                  onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-start gap-3 rounded-md border p-3 bg-muted/30">
                <Checkbox
                  id="pagado"
                  checked={form.pagado}
                  onCheckedChange={(v) => setForm({ ...form, pagado: !!v })}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="pagado" className="cursor-pointer font-medium">
                    Pagado en sitio
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Si está marcado, el pedido NO se cargará a la cuenta del huésped al hacer
                    check-out. Si no se marca, se sumará automáticamente como consumo en la
                    facturación final.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items selector */}
          <div className="space-y-3 border-t pt-4">
            <Label>Productos del Menú *</Label>
            <div className="flex gap-2">
              <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar plato o bebida del menú" />
                </SelectTrigger>
                <SelectContent>
                  {activeMenuItems.length === 0 ? (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No hay productos en el menú. Crea menús en "Gestión de Menús".
                    </div>
                  ) : (
                    activeMenuItems.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nombre} — {formatCurrency(m.precio)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddItem} disabled={!selectedMenuId}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>

            {form.items.length > 0 && (
              <div className="border rounded-md divide-y">
                {form.items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center justify-between p-3 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.nombre}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(item.precio)} c/u
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => handleQty(item.menuItemId, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.cantidad}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => handleQty(item.menuItemId, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="w-24 text-right font-medium">
                      {formatCurrency(item.precio * item.cantidad)}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleRemoveItem(item.menuItemId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-muted/50 font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? 'Guardando...'
                : editingOrder
                ? 'Guardar Cambios'
                : 'Crear Orden'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar orden?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la orden{' '}
              <strong>{deletingOrder?.numeroOrden}</strong> permanentemente.
              {deletingOrder?.consumptionId && (
                <span className="block mt-2 text-amber-600">
                  También se retirará el cargo asociado de la cuenta del huésped.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default OrdersConsumption;
