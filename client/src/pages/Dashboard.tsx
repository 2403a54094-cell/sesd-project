import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [selectedReturnSlot, setSelectedReturnSlot] = useState('5:30 PM');
  const [selectedSeatPref, setSelectedSeatPref] = useState('Window');
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite' | 'transit'>('standard');
  const [pingAlertActive, setPingAlertActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [busProgress, setBusProgress] = useState(58);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

    // Subtle simulated telematics tick
    const interval = setInterval(() => {
      setBusProgress((prev) => (prev >= 85 ? 45 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePingToggle = () => {
    setPingAlertActive(!pingAlertActive);
  };

  const activeBooking = dashboardData?.activeBooking;

  return (
    <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 flex flex-col gap-8">
      {/* Top Greeting & Status Strip */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Spring Semester Active
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm">• Updated just now</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Good Morning, {user?.name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Your morning commute from <span className="font-semibold text-on-surface">North Dorms</span> to{' '}
            <span className="font-semibold text-on-surface">Engineering Hall</span> is currently running on normal
            schedule.
          </p>
        </div>

        {/* Quick Metrics Badge Matrix */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Pass Status</span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">Valid • Zone 1-4</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/bookings')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container cursor-pointer hover:border-secondary transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-tertiary-container">
              <span className="material-symbols-outlined text-[18px]">airline_seat_recline_normal</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Reserved Seat</span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                {activeBooking ? `#${activeBooking.seatNumber} (${activeBooking.boardingTime})` : '#4B (8:30 AM)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Multi-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 of 12 columns = 2/3 width) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Priority Card: Next Scheduled Departure */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 shadow-sm border border-surface-container relative overflow-hidden flex flex-col gap-6">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-secondary-fixed/30 blur-2xl pointer-events-none"></div>

            {/* Header of Departure Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[26px]">directions_bus</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold">Bus #12</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                      North Express
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Operated by University Campus Transit Service
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-full bg-surface-container-low text-secondary font-label-md text-label-md font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                  On Time
                </div>
                <div className="text-right">
                  <div className="font-headline-lg text-headline-lg text-on-surface font-bold leading-none tracking-tight">
                    8 mins
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    Est. Arrival 8:38 AM
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Corridor Milestones Visualizer */}
            <div className="bg-surface rounded-xl p-5 relative z-10 flex flex-col gap-4 border border-surface-container-low">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Boarding From
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Engineering Quad (Stop 4B)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Destination
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Student Center Hub
                  </span>
                </div>
              </div>

              {/* Route Stop Stepper */}
              <div className="relative pt-2 pb-1">
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-secondary-container rounded-full transition-all duration-700"
                    style={{ width: `${busProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-center mt-3">
                  <div className="flex flex-col items-start gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-secondary flex items-center justify-center ring-4 ring-surface"></span>
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">North Dorms</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">8:30 AM</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-secondary-container flex items-center justify-center ring-4 ring-surface shadow-sm animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Engineering Quad
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">8:38 AM (Current)</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-outline-variant flex items-center justify-center ring-4 ring-surface"></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Science Library
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">8:46 AM</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-outline-variant flex items-center justify-center ring-4 ring-surface"></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Student Center
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">8:54 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Details in Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 relative z-10">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Driver</span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    Michael R.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-tertiary-container">
                  <span className="material-symbols-outlined text-[20px]">event_seat</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Capacity</span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    18 Seats Available
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">speed</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Traffic Density
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    Light • Clear
                  </span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Live telemetry streaming via onboard GPS
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePingToggle}
                  className={`px-5 py-2.5 rounded-full font-label-lg text-label-lg transition-colors flex items-center gap-2 ${
                    pingAlertActive
                      ? 'bg-secondary text-white'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                  <span>{pingAlertActive ? 'Departure Ping Set!' : 'Get Departure Ping'}</span>
                </button>
                <button
                  onClick={() => navigate('/bookings')}
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-label-lg text-label-lg transition-transform active:scale-95 shadow-sm flex items-center gap-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code</span>
                  <span>View My Ticket</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Route Corridor Map Visualization */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Corridor Transit Map
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    Active Feed
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Live position of North Route shuttles and campus pedestrian lanes
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <div className="flex items-center bg-surface-container p-1 rounded-xl">
                  <button
                    onClick={() => setMapLayer('standard')}
                    className={`px-3 py-1 rounded-lg font-label-sm text-label-sm shadow-xs font-semibold transition-all ${
                      mapLayer === 'standard'
                        ? 'bg-surface-container-lowest text-on-surface'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setMapLayer('satellite')}
                    className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                      mapLayer === 'satellite'
                        ? 'bg-surface-container-lowest text-on-surface font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Satellite
                  </button>
                  <button
                    onClick={() => setMapLayer('transit')}
                    className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                      mapLayer === 'transit'
                        ? 'bg-surface-container-lowest text-on-surface font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Transit Path
                  </button>
                </div>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                  }}
                  className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                  title="Center on My Location"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">my_location</span>
                </button>
              </div>
            </div>

            {/* Interactive Vector Map Canvas */}
            <div className="relative w-full h-[380px] rounded-xl overflow-hidden bg-slate-900 border border-surface-container">
              {/* Map background grid & styling */}
              <div
                className="w-full h-full relative"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.3s ease',
                  background:
                    mapLayer === 'satellite'
                      ? 'linear-gradient(135deg, #0b1c30 0%, #17283c 50%, #0e1d2e 100%)'
                      : 'linear-gradient(135deg, #131b2e 0%, #1e293b 50%, #0f172a 100%)',
                }}
              >
                {/* SVG Route Corridor */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400">
                  <defs>
                    <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#006398" />
                      <stop offset="50%" stopColor="#5bb8fe" />
                      <stop offset="100%" stopColor="#006398" />
                    </linearGradient>
                  </defs>
                  {/* Road Grid */}
                  <path
                    d="M 50,200 Q 200,100 400,200 T 750,220"
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 150,50 Q 250,250 450,350"
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 500,50 Q 550,220 700,350"
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Active Bus Route Path */}
                  <path
                    d="M 100,280 C 250,240 350,140 500,170 S 680,240 720,160"
                    fill="none"
                    stroke="url(#corridorGlow)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 100,280 C 250,240 350,140 500,170 S 680,240 720,160"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                </svg>

                {/* Stop 1: North Dorms Gate */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary-container"></div>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">North Dorms Gate</span>
                </div>

                {/* Stop 2: Student Center Terminal */}
                <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    Student Center Terminal
                  </span>
                </div>

                {/* Live Active Bus Indicator (Bus 12) */}
                <div
                  className="absolute z-20 flex flex-col items-center transition-all duration-1000"
                  style={{
                    top: `${48 - Math.sin((busProgress / 100) * Math.PI) * 12}%`,
                    left: `${busProgress}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-xl flex items-center gap-1.5 mb-1.5 animate-bounce">
                    <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                    <span>Bus #12 • 24 mph</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shadow-lg ring-4 ring-on-primary">
                    <span className="material-symbols-outlined text-on-surface text-[18px]">navigation</span>
                  </div>
                </div>
              </div>

              {/* Map Floating Controls & Legend */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-1 shadow-md flex flex-col">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                    className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface font-semibold"
                    title="Zoom in"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                  <div className="w-full h-px bg-surface-container"></div>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                    className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface font-semibold"
                    title="Zoom out"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                </div>
                <button
                  onClick={() => navigate('/tracking')}
                  className="w-10 h-10 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
                  title="Full screen view"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                </button>
              </div>

              {/* Map Bottom Quick Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-3.5 shadow-md flex flex-wrap items-center justify-between gap-3 z-20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1.5 rounded bg-secondary-container"></span>
                    <span className="font-label-sm text-label-sm text-on-surface">Route #12 Corridor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                    <span className="font-label-sm text-label-sm text-on-surface">Express Stop</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Scheduled Transfer Point</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/tracking')}
                  className="font-label-sm text-label-sm text-secondary hover:underline font-semibold flex items-center gap-1"
                >
                  View Full Network Grid
                  <span className="material-symbols-outlined text-[14px]">north_east</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12 columns = 1/3 width) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Action: Track My Bus Live */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">radar</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">
                Active Push Alerts
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Track My Bus Live</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Receive automated proximity warnings when your shuttle is within 400m of the station platform.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface flex items-center justify-between border border-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Arriving Soon Alert</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Triggers at 3 mins out</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  checked={alertEnabled}
                  onChange={(e) => setAlertEnabled(e.target.checked)}
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
            <button
              onClick={() => navigate('/tracking')}
              className="w-full py-3 px-4 rounded-full bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim font-label-lg text-label-lg font-semibold transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">navigation</span>
              <span>Launch Live Radar View</span>
            </button>
          </div>

          {/* Quick Action: Book My Seat for Returns */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[24px]">bookmark_add</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Book Return Trip</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Today's Evening Schedule</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                Guaranteed
              </span>
            </div>

            {/* Selector Elements */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">
                  Select Return Window
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedReturnSlot('4:15 PM')}
                    className={`py-2.5 px-3 rounded-xl font-label-md text-label-md text-left flex flex-col transition-all ${
                      selectedReturnSlot === '4:15 PM'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface'
                    }`}
                    type="button"
                  >
                    <span className="font-semibold">4:15 PM</span>
                    <span
                      className={`font-label-sm text-label-sm ${
                        selectedReturnSlot === '4:15 PM' ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      Bus #08 • 9 open
                    </span>
                  </button>
                  <button
                    onClick={() => setSelectedReturnSlot('5:30 PM')}
                    className={`py-2.5 px-3 rounded-xl font-label-md text-label-md text-left flex flex-col transition-all ${
                      selectedReturnSlot === '5:30 PM'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface'
                    }`}
                    type="button"
                  >
                    <span className="font-semibold">5:30 PM (Peak)</span>
                    <span
                      className={`font-label-sm text-label-sm ${
                        selectedReturnSlot === '5:30 PM' ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      Bus #12 • 4 open
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">
                  Preferred Seating Area
                </label>
                <div className="flex items-center gap-2">
                  {['Window', 'Front Priority', 'Near Power Outlet'].map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setSelectedSeatPref(pref)}
                      className={`flex-1 py-2 px-2.5 rounded-lg font-label-sm text-label-sm font-medium flex items-center justify-center gap-1 transition-all ${
                        selectedSeatPref === pref
                          ? 'bg-secondary text-white shadow-xs'
                          : 'bg-surface hover:bg-surface-container text-on-surface'
                      }`}
                      type="button"
                    >
                      <span>{pref}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/reserve')}
              className="w-full py-3.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-label-lg text-label-lg font-semibold transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-2"
              type="button"
            >
              <span>Reserve Return Seat</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* 1-Tap QR Transit Pass Summary */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[22px]">contactless</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold leading-tight">
                    Digital Pass
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Tap-and-Go Ready</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                NFC Enabled
              </span>
            </div>

            {/* Student Card Visual */}
            <div className="p-5 rounded-xl bg-surface flex flex-col gap-4 relative overflow-hidden border border-surface-container-low">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Student Transit ID
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface font-bold uppercase">
                    {user?.name || 'ALEX CHEN'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
              </div>

              {/* Minimal QR Simulation */}
              <div
                onClick={() => navigate('/bookings')}
                className="flex items-center justify-center py-2 px-3 bg-surface-container-lowest rounded-lg border border-surface-container-high/40 cursor-pointer hover:border-secondary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[36px] text-on-surface">qr_code_2</span>
                  <div className="flex flex-col font-mono text-label-sm text-label-sm text-on-surface-variant">
                    <span>ID: {user?.transitPassId || 'CP-98302-AZ'}</span>
                    <span className="text-secondary font-semibold">VALID THRU: 06/26</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-on-surface-variant pt-1 font-body-sm text-body-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  Autopass Enabled
                </span>
                <span className="font-label-sm text-label-sm text-secondary hover:underline font-semibold cursor-pointer">
                  Add to Apple Wallet
                </span>
              </div>
            </div>
          </div>

          {/* Stats Card: Peak Morning Rush Schedule */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Peak Rush Matrix</h4>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">7:30 AM – 10:00 AM</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Campus shuttles run every 6-8 minutes on all main academic spines during the morning lecture window.
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Bus #12 (North Express)
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">Every 6 mins</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant"></span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Bus #04 (West Campus Link)
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Every 8 mins</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant"></span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Bus #19 (Medical Perimeter)
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Every 10 mins</span>
              </div>
            </div>
            <div className="pt-1 flex items-center justify-between text-on-surface-variant">
              <span className="font-label-sm text-label-sm">Next shift change: 11:30 AM</span>
              <a className="font-label-sm text-label-sm text-secondary hover:underline font-semibold" href="#schedule">
                Timetable PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
