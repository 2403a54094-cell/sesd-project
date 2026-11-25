import { Request, Response } from 'express';
import { buses, allSeats } from '../data/mockData';

// Simulated GPS tick state
let simulatedTick = 0;

export const getAllBuses = (req: Request, res: Response) => {
  const result = buses.map(bus => {
    const availableSeatsCount = bus.totalSeats - bus.occupiedSeats.length;
    return {
      ...bus,
      availableSeatsCount
    };
  });
  return res.json(result);
};

export const getBusById = (req: Request, res: Response) => {
  const { id } = req.params;
  const bus = buses.find(b => b.id === id || b.number === id);

  if (!bus) {
    return res.status(404).json({ error: `Bus #${id} not found` });
  }

  const availableSeatsCount = bus.totalSeats - bus.occupiedSeats.length;
  return res.json({
    ...bus,
    availableSeatsCount
  });
};

export const getBusSeats = (req: Request, res: Response) => {
  const { id } = req.params;
  const bus = buses.find(b => b.id === id || b.number === id);

  if (!bus) {
    return res.status(404).json({ error: `Bus #${id} not found` });
  }

  const seatsWithStatus = allSeats.map(seat => {
    const isBooked = bus.occupiedSeats.includes(seat.id);
    return {
      ...seat,
      status: isBooked ? 'booked' : 'available'
    };
  });

  const availableCount = seatsWithStatus.filter(s => s.status === 'available').length;
  const bookedCount = seatsWithStatus.filter(s => s.status === 'booked').length;

  return res.json({
    busId: bus.id,
    busNumber: bus.number,
    busName: bus.name,
    totalSeats: bus.totalSeats,
    availableSeatsCount: availableCount,
    bookedSeatsCount: bookedCount,
    seats: seatsWithStatus
  });
};

export const getSimulatedGPS = (req: Request, res: Response) => {
  simulatedTick = (simulatedTick + 1) % 100;

  // Simulate smooth position updates for all active buses
  const updatedBuses = buses.map((bus, idx) => {
    // Dynamic progress calculation
    const baseProgress = bus.currentLocation.percentAlongRoute;
    const offset = (simulatedTick * 1.5 + idx * 25) % 100;
    const currentPercent = Math.round(offset);
    
    // Calculate dynamic ETA based on progress (closer to 100% means 1-2 mins, starting means ~18 mins)
    const dynamicEta = Math.max(1, Math.round(((100 - currentPercent) / 100) * 18));
    const dynamicSpeed = Math.round(24 + Math.sin(simulatedTick / 5) * 8); // fluctuates between 16 and 32 km/h
    
    // Map coordinate bounds within campus (approx Cambridge / Boston campus coords)
    const baseLat = 42.3601;
    const baseLng = -71.0942;
    const currentLat = baseLat + Math.sin((currentPercent / 100) * Math.PI * 2) * 0.006;
    const currentLng = baseLng + Math.cos((currentPercent / 100) * Math.PI * 2) * 0.008;

    return {
      id: bus.id,
      number: bus.number,
      name: bus.name,
      routeTitle: bus.routeTitle,
      speedKmh: dynamicSpeed,
      etaMinutes: dynamicEta,
      status: bus.status,
      currentLocation: {
        lat: Number(currentLat.toFixed(6)),
        lng: Number(currentLng.toFixed(6)),
        percentAlongRoute: currentPercent
      },
      availableSeatsCount: bus.totalSeats - bus.occupiedSeats.length
    };
  });

  return res.json({
    timestamp: new Date().toISOString(),
    buses: updatedBuses
  });
};
