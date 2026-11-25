import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { buses, bookings } from '../data/mockData';

export const getDashboardData = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const studentId = user?.studentId || 'STU2026001';

  // Find active booking
  const activeBooking = bookings.find(
    b => b.studentId.toUpperCase() === studentId.toUpperCase() && b.status === 'confirmed'
  );

  // Bus #12 is the primary corridor shuttle
  const primaryBus = buses.find(b => b.id === '12') || buses[0];

  return res.json({
    student: {
      name: user?.name || 'Alex Chen',
      studentId: user?.studentId || 'STU2026001',
      netId: user?.netId || 'STU-2024-8891',
      passStatus: user?.passStatus || 'Valid • Zone 1-4',
      transitPassId: user?.transitPassId || 'CP-98302-AZ',
      biometricSync: user?.biometricSync || 'Active & Ready'
    },
    activeBooking: activeBooking || null,
    primaryBus: {
      ...primaryBus,
      availableSeatsCount: primaryBus.totalSeats - primaryBus.occupiedSeats.length
    },
    quickMetrics: {
      passStatus: 'Valid • Zone 1-4',
      reservedSeat: activeBooking ? `#${activeBooking.seatNumber} (${activeBooking.boardingTime})` : 'None Reserved',
      activeBusesCount: 14,
      networkStatus: 'Normal Service'
    },
    rushMatrix: [
      { busNumber: 'Bus #12', routeName: 'North Express', frequency: 'Every 6 mins', active: true },
      { busNumber: 'Bus #04', routeName: 'West Campus Link', frequency: 'Every 8 mins', active: false },
      { busNumber: 'Bus #19', routeName: 'Medical Perimeter', frequency: 'Every 10 mins', active: false }
    ],
    announcements: [
      'Spring Semester Active • High frequency on North Express',
      'Campus Blue Light Telemetry Linked with Transit Safety Dispatch'
    ]
  });
};
