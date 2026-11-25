import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { bookings, buses, upcomingRides, tripHistory, allSeats, Booking } from '../data/mockData';

export const getMyBookings = (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user?.studentId || 'STU2026001';

  // Find active booking for this student
  const activeBooking = bookings.find(
    b => b.studentId.toUpperCase() === studentId.toUpperCase() && b.status === 'confirmed'
  );

  const studentUpcoming = upcomingRides.filter(
    u => u.studentId.toUpperCase() === studentId.toUpperCase()
  );

  const studentHistory = tripHistory.filter(
    h => h.studentId.toUpperCase() === studentId.toUpperCase()
  );

  return res.json({
    activeBooking: activeBooking || null,
    upcomingRides: studentUpcoming,
    tripHistory: studentHistory
  });
};

export const createBooking = (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user?.studentId || 'STU2026001';
  const passengerName = req.user?.name || 'Alex Chen';
  const { busId, seatNumber, boardingPoint, destination } = req.body;

  if (!seatNumber) {
    return res.status(400).json({ error: 'Seat number is required' });
  }

  const bus = buses.find(b => b.id === (busId || '12') || b.number === (busId || '12'));
  if (!bus) {
    return res.status(404).json({ error: 'Selected bus route not found' });
  }

  const cleanSeat = String(seatNumber).trim().toUpperCase();
  const validSeat = allSeats.find(s => s.id === cleanSeat);
  if (!validSeat) {
    return res.status(400).json({ error: `Invalid seat number ${cleanSeat}. Must be 1A-6D or 7A-7E.` });
  }

  // 1. DUPLICATE SEAT PREVENTION
  if (bus.occupiedSeats.includes(cleanSeat)) {
    return res.status(409).json({
      error: `Seat ${cleanSeat} is already occupied. Duplicate reservation prevented. Please select another seat.`
    });
  }

  // 2. CHECK IF USER ALREADY HAS AN ACTIVE BOOKING ON THIS BUS
  const existingActive = bookings.find(
    b => b.studentId.toUpperCase() === studentId.toUpperCase() && 
         b.busId === bus.id && 
         b.status === 'confirmed'
  );

  if (existingActive) {
    // Release previous seat if user is switching or re-booking
    bus.occupiedSeats = bus.occupiedSeats.filter(s => s !== existingActive.seatNumber);
    existingActive.status = 'cancelled';
  }

  // Reserve the seat
  bus.occupiedSeats.push(cleanSeat);

  const newBookingId = `BK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const passId = `PASS #${req.user?.netId || 'STU-2024-8891'}`;

  const newBooking: Booking = {
    id: newBookingId,
    studentId,
    passengerName,
    busId: bus.id,
    busNumber: bus.number,
    busName: bus.name,
    routeCode: bus.routeCode,
    routeTitle: bus.routeTitle,
    boardingPoint: boardingPoint || 'North Gate Transit Terminal (Gate 4-B)',
    destination: destination || 'Main Academic Quad • Library Plaza',
    boardingTime: bus.departureTime || '08:30 AM',
    arrivalTime: bus.estArrivalTime || '08:48 AM',
    seatNumber: cleanSeat,
    seatType: `${validSeat.label} • ${validSeat.isPriority ? 'Priority Accessible' : 'Standard'}`,
    fare: 2.50,
    studentDiscount: 2.50,
    totalPaid: 0.00,
    status: 'confirmed',
    passId,
    qrData: `CAMPUSRIDE://VERIFY/${studentId}/BUS${bus.number}/SEAT${cleanSeat}/${newBookingId}`,
    driverName: bus.driver.name,
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  return res.status(201).json({
    message: `Seat ${cleanSeat} reserved successfully! Boarding pass generated.`,
    booking: newBooking,
    availableSeatsCount: bus.totalSeats - bus.occupiedSeats.length
  });
};

export const cancelBooking = (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user?.studentId || 'STU2026001';
  const { id } = req.params;

  const bookingIndex = bookings.findIndex(b => b.id === id);
  if (bookingIndex === -1) {
    return res.status(404).json({ error: `Booking ${id} not found` });
  }

  const booking = bookings[bookingIndex];

  // Verify ownership
  if (booking.studentId.toUpperCase() !== studentId.toUpperCase()) {
    return res.status(403).json({ error: 'You are not authorized to cancel this booking' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ error: 'This booking is already cancelled' });
  }

  // Cancel booking
  booking.status = 'cancelled';

  // Release seat in bus occupiedSeats
  const bus = buses.find(b => b.id === booking.busId || b.number === booking.busNumber);
  if (bus) {
    bus.occupiedSeats = bus.occupiedSeats.filter(s => s !== booking.seatNumber);
  }

  return res.json({
    message: `Reservation for ${booking.busName} (Seat ${booking.seatNumber}) cancelled successfully. Seat has been released back to the available pool.`,
    bookingId: booking.id,
    releasedSeat: booking.seatNumber,
    availableSeatsCount: bus ? (bus.totalSeats - bus.occupiedSeats.length) : undefined
  });
};
