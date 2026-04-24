import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export type OrderStatus = 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
export type OrderType = 'restaurante' | 'bar' | 'cafeteria' | 'room-service';

export interface OrderItem {
  menuItemId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  observaciones?: string;
}

export interface Order {
  id: string;
  numeroOrden: string;
  fechaHora: Date;
  estado: OrderStatus;
  tipo: OrderType;
  ubicacion: string; // mesa o habitación (texto libre)
  mesero: string;
  cliente: string;
  reservationId?: string; // huésped asociado (para facturación)
  pagado?: boolean; // marcado como pagado en sitio
  consumptionId?: string; // id del consumo creado para checkout
  items: OrderItem[];
  subtotal: number;
  total: number;
  observaciones?: string;
  hotelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useOrders = (hotelId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'orders'), where('hotelId', '==', hotelId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => {
          const raw = d.data() as any;
          return {
            id: d.id,
            ...raw,
            fechaHora: raw.fechaHora?.toDate?.() || new Date(),
            createdAt: raw.createdAt?.toDate?.(),
            updatedAt: raw.updatedAt?.toDate?.(),
          } as Order;
        });
        // Ordenar por fecha desc en memoria
        data.sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading orders:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hotelId]);

  const generateOrderNumber = () => {
    const year = new Date().getFullYear();
    const count = orders.length + 1;
    return `ORD-${year}-${String(count).padStart(3, '0')}`;
  };

  const addOrder = async (
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'numeroOrden' | 'fechaHora'> & {
      numeroOrden?: string;
      fechaHora?: Date;
    }
  ) => {
    try {
      const numeroOrden = data.numeroOrden || generateOrderNumber();
      const fechaHora = data.fechaHora || new Date();
      const docRef = await addDoc(collection(db, 'orders'), {
        ...data,
        numeroOrden,
        fechaHora: Timestamp.fromDate(fechaHora),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding order:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateOrder = async (id: string, data: Partial<Order>) => {
    try {
      const updateData: any = { ...data, updatedAt: Timestamp.now() };
      if (data.fechaHora) {
        updateData.fechaHora = Timestamp.fromDate(data.fechaHora);
      }
      await updateDoc(doc(db, 'orders', id), updateData);
    } catch (err: any) {
      console.error('Error updating order:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (err: any) {
      console.error('Error deleting order:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder,
    generateOrderNumber,
  };
};
