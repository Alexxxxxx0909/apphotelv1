import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export interface DashboardMetrics {
  ocupacionActual: number;
  ingresosHoy: number;
  checkInsHoy: number;
  satisfaccion: number;
  ocupacionSemanal: { name: string; ocupacion: number }[];
  ingresosMensuales: { name: string; ingresos: number }[];
  estadoHabitaciones: {
    ocupadas: number;
    disponibles: number;
    limpieza: number;
    mantenimiento: number;
  };
  tendencias: {
    ocupacion: number;
    ingresos: number;
    checkIns: number;
    satisfaccion: number;
  };
}

export const useDashboardMetrics = (hotelId?: string) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    ocupacionActual: 0,
    ingresosHoy: 0,
    checkInsHoy: 0,
    satisfaccion: 0,
    ocupacionSemanal: [],
    ingresosMensuales: [],
    estadoHabitaciones: {
      ocupadas: 0,
      disponibles: 0,
      limpieza: 0,
      mantenimiento: 0
    },
    tendencias: {
      ocupacion: 0,
      ingresos: 0,
      checkIns: 0,
      satisfaccion: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // Listener para habitaciones
    const roomsQuery = query(collection(db, 'rooms'), where('hotelId', '==', hotelId));
    const unsubscribeRooms = onSnapshot(roomsQuery, (snapshot) => {
      const rooms = snapshot.docs.map(doc => doc.data());
      const totalRooms = rooms.length;
      const ocupadas = rooms.filter(r => r.estado === 'ocupada').length;
      const disponibles = rooms.filter(r => r.estado === 'disponible').length;
      const limpieza = rooms.filter(r => r.estado === 'limpieza').length;
      const mantenimiento = rooms.filter(r => r.estado === 'mantenimiento').length;
      
      const ocupacionActual = totalRooms > 0 ? Math.round((ocupadas / totalRooms) * 100) : 0;

      setMetrics(prev => ({
        ...prev,
        ocupacionActual,
        estadoHabitaciones: {
          ocupadas,
          disponibles,
          limpieza,
          mantenimiento
        }
      }));
    });

    // Listener para reservas de hoy
    const reservationsQuery = query(
      collection(db, 'reservations'),
      where('hotelId', '==', hotelId),
      where('checkIn', '>=', Timestamp.fromDate(todayStart)),
      where('checkIn', '<=', Timestamp.fromDate(todayEnd))
    );

    const unsubscribeReservations = onSnapshot(reservationsQuery, (snapshot) => {
      const checkInsHoy = snapshot.size;
      const reservations = snapshot.docs.map(doc => doc.data());
      
      // Calcular ingresos de hoy
      const ingresosHoy = reservations.reduce((sum, res) => {
        const nights = res.noches || 1;
        const pricePerNight = res.pricePerNight || 0;
        return sum + (nights * pricePerNight);
      }, 0);

      setMetrics(prev => ({
        ...prev,
        checkInsHoy,
        ingresosHoy: Math.round(ingresosHoy),
        satisfaccion: 4.8 // Este valor podría venir de una colección de reviews
      }));
    });

    // Calcular ocupación semanal
    const calculateWeeklyOccupancy = async () => {
      const weekData = [];
      const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        
        // En una implementación real, consultaríamos las reservas de cada día
        // Por ahora, usamos un cálculo aproximado basado en la ocupación actual
        const randomVariation = Math.random() * 20 - 10; // Variación de ±10%
        const ocupacion = Math.max(0, Math.min(100, metrics.ocupacionActual + randomVariation));
        
        weekData.push({
          name: days[(date.getDay() + 6) % 7],
          ocupacion: Math.round(ocupacion)
        });
      }
      
      setMetrics(prev => ({
        ...prev,
        ocupacionSemanal: weekData
      }));
    };

    // Calcular ingresos mensuales
    const calculateMonthlyRevenue = () => {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
      const monthlyData = months.map((name, index) => {
        // Simulación de crecimiento progresivo
        const baseRevenue = 120000;
        const growth = index * 15000;
        return {
          name,
          ingresos: baseRevenue + growth
        };
      });
      
      setMetrics(prev => ({
        ...prev,
        ingresosMensuales: monthlyData,
        tendencias: {
          ocupacion: 5.2,
          ingresos: 12.5,
          checkIns: -2.1,
          satisfaccion: 0.3
        }
      }));
    };

    calculateWeeklyOccupancy();
    calculateMonthlyRevenue();
    setLoading(false);

    return () => {
      unsubscribeRooms();
      unsubscribeReservations();
    };
  }, [hotelId, metrics.ocupacionActual]);

  return { metrics, loading };
};
