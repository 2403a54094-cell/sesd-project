export interface User {
  id: string;
  studentId: string;
  name: string;
  netId: string;
  email: string;
  department: string;
  role: string;
  passStatus: string;
  transitPassId: string;
  biometricSync: string;
  passwordHash: string; // In demo, plain check "student123"
}

export interface BusStop {
  id: string;
  name: string;
  time: string;
  isCurrent?: boolean;
  isPickup?: boolean;
  status: 'passed' | 'current' | 'upcoming';
  etaMinutes: number;
}

export interface Bus {
  id: string;
  number: string;
  name: string;
  routeCode: string;
  routeTitle: string;
  origin: string;
  destination: string;
  departureTime: string;
  estTransitTime: string;
  status: 'On Time' | 'Delayed' | 'Departed';
  etaMinutes: number;
  estArrivalTime: string;
  speedKmh: number;
  distanceKm: number;
  totalSeats: number;
  occupiedSeats: string[];
  driver: {
    name: string;
    avatar: string;
    rating: number;
    tripsCount: string;
    busCode: string;
    phone: string;
  };
  stops: BusStop[];
  currentLocation: {
    lat: number;
    lng: number;
    percentAlongRoute: number; // 0 to 100
  };
  features: string[];
}

export interface Booking {
  id: string;
  studentId: string;
  passengerName: string;
  busId: string;
  busNumber: string;
  busName: string;
  routeCode: string;
  routeTitle: string;
  boardingPoint: string;
  destination: string;
  boardingTime: string;
  arrivalTime: string;
  seatNumber: string;
  seatType: string;
  fare: number;
  studentDiscount: number;
  totalPaid: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  passId: string;
  qrData: string;
  driverName: string;
  createdAt: string;
}

export interface UpcomingRide {
  id: string;
  studentId: string;
  dayShort: string;
  dateNum: string;
  destination: string;
  routeCode: string;
  departureTime: string;
  pickupLocation: string;
  seat: string;
}

export interface TripHistory {
  id: string;
  studentId: string;
  date: string;
  busInfo: string;
  originationTerminus: string;
  seat: string;
  statusText: string;
  delayText: string;
}

// Initial Mock Data Store
export const users: User[] = [
  {
    id: 'user-1',
    studentId: 'STU2026001',
    name: 'Alex Chen',
    netId: 'STU-2024-8891',
    email: 'alex.chen@metro.edu',
    department: 'Undergraduate Senior • Computer Science',
    role: 'Student',
    passStatus: 'Valid • Zone 1-4',
    transitPassId: 'CP-98302-AZ',
    biometricSync: 'Active & Ready',
    passwordHash: 'student123'
  },
  {
    id: 'user-2',
    studentId: 'STU2026002',
    name: 'Marcus Vance',
    netId: 'STU-2024-9104',
    email: 'marcus.vance@metro.edu',
    department: 'Graduate Student • Electrical Engineering',
    role: 'Student',
    passStatus: 'Valid • Zone 1-4',
    transitPassId: 'CP-98303-MV',
    biometricSync: 'Active & Ready',
    passwordHash: 'student123'
  }
];

export const buses: Bus[] = [
  {
    id: '12',
    number: '12',
    name: 'Bus #12 North Campus',
    routeCode: '#12-NC',
    routeTitle: 'Main Campus → Research Hub',
    origin: 'North Dorms Gate',
    destination: 'Student Center Terminal',
    departureTime: '08:30 AM',
    estTransitTime: '18 min',
    status: 'On Time',
    etaMinutes: 6,
    estArrivalTime: '8:38 AM',
    speedKmh: 28,
    distanceKm: 1.4,
    totalSeats: 30,
    occupiedSeats: ['1C', '1D', '3A', '3D', '4B', '5A', '5B', '6C', '6D'],
    driver: {
      name: 'Michael Rodriguez',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ17gAEjx5AzpiJrvpkVQUXhG336gpLtJXkeMMWiRvfQ2qQgVlQnuwuolMhzn79_maGhpM6JL5UldYkRRvsNBQ4vzuHTEkyzQxPIDSkG_IapnbwRg61iXyQ_jAO79ozgZE429M0dyfa5ddTa63Yio2rnz9f2jhijc9Omwu9XmpqxK23rajd7EPrHpqd-FHxNXto0ljd0mc-9meKbzOEXGSjXQrC2AlTUHqqOcuHkvM',
      rating: 4.9,
      tripsCount: '4,200+ Campus Trips',
      busCode: 'BUS-774',
      phone: '(555) 019-2834'
    },
    stops: [
      { id: 's1', name: 'West Residence Hall', time: '8:32 AM', status: 'passed', etaMinutes: 1 },
      { id: 's2', name: 'North Gate Shelter', time: '8:38 AM', isPickup: true, isCurrent: true, status: 'current', etaMinutes: 6 },
      { id: 's3', name: 'Main Library Loop', time: '8:44 AM', status: 'upcoming', etaMinutes: 11 },
      { id: 's4', name: 'Student Center Terminal', time: '8:50 AM', status: 'upcoming', etaMinutes: 17 }
    ],
    currentLocation: {
      lat: 42.3601,
      lng: -71.0942,
      percentAlongRoute: 52
    },
    features: ['High-Speed WiFi 6', 'USB-C Fast Ports', 'Climate Controlled', 'Zero Emissions Bus']
  },
  {
    id: '04',
    number: '04',
    name: 'Bus #04 West Campus Link',
    routeCode: '#04-WC',
    routeTitle: 'Engineering Quad → Student Union',
    origin: 'Engineering Quad',
    destination: 'Student Union',
    departureTime: '08:45 AM',
    estTransitTime: '14 min',
    status: 'On Time',
    etaMinutes: 12,
    estArrivalTime: '8:55 AM',
    speedKmh: 32,
    distanceKm: 2.8,
    totalSeats: 30,
    occupiedSeats: ['2B', '2C', '4A', '5C'],
    driver: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      rating: 4.8,
      tripsCount: '2,900+ Campus Trips',
      busCode: 'BUS-312',
      phone: '(555) 019-3382'
    },
    stops: [
      { id: 's10', name: 'Engineering Quad', time: '8:45 AM', status: 'current', etaMinutes: 0 },
      { id: 's11', name: 'BioTech Center', time: '8:52 AM', status: 'upcoming', etaMinutes: 7 },
      { id: 's12', name: 'Student Union', time: '8:59 AM', status: 'upcoming', etaMinutes: 14 }
    ],
    currentLocation: {
      lat: 42.3615,
      lng: -71.0988,
      percentAlongRoute: 25
    },
    features: ['WiFi 6', 'Climate Controlled', 'Wheelchair Ramp']
  },
  {
    id: '08',
    number: '08',
    name: 'Bus #08 Evening Science Express',
    routeCode: '#08-SE',
    routeTitle: 'Science Library → South Dorms',
    origin: 'Science Library',
    destination: 'South Dorms',
    departureTime: '04:15 PM',
    estTransitTime: '15 min',
    status: 'On Time',
    etaMinutes: 20,
    estArrivalTime: '4:30 PM',
    speedKmh: 24,
    distanceKm: 3.5,
    totalSeats: 30,
    occupiedSeats: ['1A', '2A', '3B'],
    driver: {
      name: 'David Kowalski',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.95,
      tripsCount: '5,100+ Campus Trips',
      busCode: 'BUS-819',
      phone: '(555) 019-9482'
    },
    stops: [
      { id: 's20', name: 'Science Library', time: '4:15 PM', status: 'current', etaMinutes: 0 },
      { id: 's21', name: 'Innovation Hub', time: '4:22 PM', status: 'upcoming', etaMinutes: 7 },
      { id: 's22', name: 'South Dorms Terminal', time: '4:30 PM', status: 'upcoming', etaMinutes: 15 }
    ],
    currentLocation: {
      lat: 42.3582,
      lng: -71.0911,
      percentAlongRoute: 10
    },
    features: ['USB-C Ports', 'Climate Controlled']
  }
];

export const allSeats = [
  // Row 1 (Priority)
  { id: '1A', row: 1, col: 'A', isPriority: true, label: 'Window' },
  { id: '1B', row: 1, col: 'B', isPriority: true, label: 'Aisle' },
  { id: '1C', row: 1, col: 'C', isPriority: true, label: 'Aisle' },
  { id: '1D', row: 1, col: 'D', isPriority: true, label: 'Window' },
  // Row 2
  { id: '2A', row: 2, col: 'A', isPriority: false, label: 'Window' },
  { id: '2B', row: 2, col: 'B', isPriority: false, label: 'Aisle' },
  { id: '2C', row: 2, col: 'C', isPriority: false, label: 'Aisle' },
  { id: '2D', row: 2, col: 'D', isPriority: false, label: 'Window' },
  // Row 3
  { id: '3A', row: 3, col: 'A', isPriority: false, label: 'Window' },
  { id: '3B', row: 3, col: 'B', isPriority: false, label: 'Aisle' },
  { id: '3C', row: 3, col: 'C', isPriority: false, label: 'Aisle' },
  { id: '3D', row: 3, col: 'D', isPriority: false, label: 'Window' },
  // Row 4
  { id: '4A', row: 4, col: 'A', isPriority: false, label: 'Window' },
  { id: '4B', row: 4, col: 'B', isPriority: false, label: 'Aisle' },
  { id: '4C', row: 4, col: 'C', isPriority: false, label: 'Aisle' },
  { id: '4D', row: 4, col: 'D', isPriority: false, label: 'Window' },
  // Row 5
  { id: '5A', row: 5, col: 'A', isPriority: false, label: 'Window' },
  { id: '5B', row: 5, col: 'B', isPriority: false, label: 'Aisle' },
  { id: '5C', row: 5, col: 'C', isPriority: false, label: 'Aisle' },
  { id: '5D', row: 5, col: 'D', isPriority: false, label: 'Window' },
  // Row 6
  { id: '6A', row: 6, col: 'A', isPriority: false, label: 'Window' },
  { id: '6B', row: 6, col: 'B', isPriority: false, label: 'Aisle' },
  { id: '6C', row: 6, col: 'C', isPriority: false, label: 'Aisle' },
  { id: '6D', row: 6, col: 'D', isPriority: false, label: 'Window' },
  // Row 7 (Back Row - 5 across)
  { id: '7A', row: 7, col: 'A', isPriority: false, label: 'Window' },
  { id: '7B', row: 7, col: 'B', isPriority: false, label: 'Middle-Left' },
  { id: '7C', row: 7, col: 'C', isPriority: false, label: 'Center' },
  { id: '7D', row: 7, col: 'D', isPriority: false, label: 'Middle-Right' },
  { id: '7E', row: 7, col: 'E', isPriority: false, label: 'Window' }
];

export let bookings: Booking[] = [
  {
    id: 'BK-2025-08492',
    studentId: 'STU2026001',
    passengerName: 'Alex Chen',
    busId: '12',
    busNumber: '12',
    busName: 'Bus #12 North Campus',
    routeCode: '#12-NC',
    routeTitle: 'Main Campus → Research Hub',
    boardingPoint: 'North Gate Transit Terminal (Gate 4-B)',
    destination: 'Main Academic Quad • Library Plaza',
    boardingTime: '08:30 AM',
    arrivalTime: '08:48 AM',
    seatNumber: '4B',
    seatType: 'Window • Mid-Cabin',
    fare: 2.50,
    studentDiscount: 2.50,
    totalPaid: 0.00,
    status: 'confirmed',
    passId: 'PASS #STU-2024-8891',
    qrData: 'CAMPUSRIDE://VERIFY/STU2026001/BUS12/SEAT4B/HASH_84920',
    driverName: 'Michael R.',
    createdAt: new Date().toISOString()
  }
];

export const upcomingRides: UpcomingRide[] = [
  {
    id: 'up-1',
    studentId: 'STU2026001',
    dayShort: 'Wed',
    dateNum: '16',
    destination: 'South Campus • Engineering Hub',
    routeCode: 'Route #04',
    departureTime: 'Departs 10:15 AM',
    pickupLocation: 'Student Center North',
    seat: '12A (Aisle)'
  },
  {
    id: 'up-2',
    studentId: 'STU2026001',
    dayShort: 'Thu',
    dateNum: '17',
    destination: 'Athletic Complex • Stadium Station',
    routeCode: 'Route #09',
    departureTime: 'Departs 02:45 PM',
    pickupLocation: 'Main Academic Quad',
    seat: '02C (Front)'
  },
  {
    id: 'up-3',
    studentId: 'STU2026001',
    dayShort: 'Fri',
    dateNum: '18',
    destination: 'Metro Connector • Downtown Link',
    routeCode: 'Route #01',
    departureTime: 'Departs 05:20 PM',
    pickupLocation: 'North Gate Transit Terminal',
    seat: '08B (Window)'
  }
];

export const tripHistory: TripHistory[] = [
  {
    id: 'hist-1',
    studentId: 'STU2026001',
    date: 'Oct 14, 2025',
    busInfo: 'Bus #12 • 08:30 AM',
    originationTerminus: 'North Gate → Main Quad',
    seat: '4B',
    statusText: 'On-Time',
    delayText: '+0m'
  },
  {
    id: 'hist-2',
    studentId: 'STU2026001',
    date: 'Oct 13, 2025',
    busInfo: 'Bus #04 • 04:15 PM',
    originationTerminus: 'Engineering → North Gate',
    seat: '9A',
    statusText: 'On-Time',
    delayText: '+1m'
  },
  {
    id: 'hist-3',
    studentId: 'STU2026001',
    date: 'Oct 11, 2025',
    busInfo: 'Bus #01 • 06:00 PM',
    originationTerminus: 'Downtown Metro → Main Quad',
    seat: '1C',
    statusText: 'On-Time',
    delayText: '+3m'
  }
];
