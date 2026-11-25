import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { busService } from '../services/api';

export const LiveTracking: React.FC = () => {
  const navigate = useNavigate();

  const [buses, setBuses] = useState<any[]>([]);
  const [selectedBusId, setSelectedBusId] = useState('12');
  const [isRouteDropdownOpen, setIsRouteDropdownOpen] = useState(false);
  const [liveGpsData, setLiveGpsData] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [activeMessageModal, setActiveMessageModal] = useState(false);
  const [activeCallModal, setActiveCallModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSentFeedback, setMessageSentFeedback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite'>('standard');

  // Load buses initially
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const data = await busService.getAll();
        setBuses(data);
      } catch (err) {
        console.error('Failed to fetch buses:', err);
      }
    };
    fetchBuses();
  }, []);

  // Poll live simulated GPS coordinates every 3 seconds if liveSync is active
  useEffect(() => {
    let interval: any;

    const pollGPS = async () => {
      try {
        const gps = await busService.getLiveGPS();
        setLiveGpsData(gps);
      } catch (e) {
        console.error('GPS poll error:', e);
      }
    };

    pollGPS();

    if (isLiveSync) {
      interval = setInterval(pollGPS, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveSync]);

  const currentBus = buses.find((b) => b.id === selectedBusId || b.number === selectedBusId) || buses[0];
  const dynamicBusGps = liveGpsData?.buses?.find((b: any) => b.id === selectedBusId);

  // Calculate dynamic coordinates and percentage
  const currentPercent = dynamicBusGps?.currentLocation?.percentAlongRoute ?? currentBus?.currentLocation?.percentAlongRoute ?? 52;
  const currentSpeed = dynamicBusGps?.speedKmh ?? currentBus?.speedKmh ?? 28;
  const currentEta = dynamicBusGps?.etaMinutes ?? currentBus?.etaMinutes ?? 6;

  // Handle message to driver
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSentFeedback(true);
    setTimeout(() => {
      setMessageSentFeedback(false);
      setActiveMessageModal(false);
      setMessageText('');
    }, 1500);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden relative">
      {/* Driver Message Modal */}
      {activeMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
                <div>
                  <h3 className="font-headline-sm font-semibold text-on-surface">Message Driver</h3>
                  <p className="font-body-sm text-on-surface-variant">Michael Rodriguez (Bus #12)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveMessageModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {messageSentFeedback ? (
              <div className="p-4 rounded-xl bg-surface-container-low text-on-tertiary-container flex items-center gap-3 text-label-md font-semibold">
                <span className="material-symbols-outlined text-[24px]">check_circle</span>
                <span>Dispatch received! Message relayed to onboard cabin console.</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                <textarea
                  className="w-full h-28 p-3 rounded-xl bg-surface border border-surface-container text-body-md text-on-surface focus:outline-none focus:border-secondary resize-none"
                  placeholder="e.g., Holding gate for transfer at North Quad..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMessageModal(false)}
                    className="px-4 py-2 rounded-full font-label-md text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-primary hover:bg-inverse-surface text-on-primary font-label-md font-semibold shadow-xs"
                  >
                    Send to Driver
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Driver Call Modal */}
      {activeCallModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-surface-container flex flex-col items-center text-center gap-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-[32px]">phone_in_talk</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-md font-bold text-on-surface">Calling Bus Cab...</h3>
              <p className="font-body-md text-on-surface-variant">Michael Rodriguez • Fleet #BUS-774</p>
              <p className="font-mono text-label-md text-secondary font-semibold mt-1">(555) 019-2834</p>
            </div>
            <p className="font-body-sm text-on-surface-variant/80">
              Campus safety recording enabled. For emergencies, please call Campus Police dispatch directly at (555) 019-2834.
            </p>
            <button
              onClick={() => setActiveCallModal(false)}
              className="w-full py-2.5 rounded-full bg-error text-white font-label-lg font-semibold shadow-md hover:bg-error/90 transition-all"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR CONTROL PANEL */}
      <aside className="w-full md:w-[410px] lg:w-[430px] flex-shrink-0 bg-surface-container-lowest shadow-xl z-20 flex flex-col justify-between overflow-y-auto border-r border-surface-container-high/40">
        <div className="p-space-lg flex flex-col gap-space-lg">
          {/* ROUTE SELECTION & STATUS */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                Active Fleet Tracker
              </span>
              <button
                onClick={() => setIsLiveSync(!isLiveSync)}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isLiveSync ? 'bg-on-tertiary-container animate-ping' : 'bg-outline'}`}
                ></span>
                <span>{isLiveSync ? 'Live Sync' : 'Paused'}</span>
              </button>
            </div>

            {/* Dropdown / Route switcher */}
            <div className="relative">
              <div
                onClick={() => setIsRouteDropdownOpen(!isRouteDropdownOpen)}
                className="relative bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors border border-surface-container"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-xs">
                    {currentBus?.number || '12'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface leading-tight font-semibold">
                      {currentBus?.name || 'Bus #12 North Campus'}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-[220px]">
                      {currentBus?.routeTitle || 'North Quad • Science Hall • Transit Hub'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">unfold_more</span>
              </div>

              {/* Dropdown List */}
              {isRouteDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container z-30 p-2 flex flex-col gap-1">
                  {buses.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setSelectedBusId(b.id);
                        setIsRouteDropdownOpen(false);
                      }}
                      className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        selectedBusId === b.id
                          ? 'bg-surface-container text-secondary font-semibold'
                          : 'hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-primary text-white font-bold text-label-sm flex items-center justify-center">
                          {b.number}
                        </span>
                        <span className="font-label-md">{b.name}</span>
                      </div>
                      <span className="font-label-sm text-on-surface-variant">{b.etaMinutes} mins</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* LIVE ETA METRICS BANNER */}
          <div className="bg-surface-container-low rounded-2xl p-space-md shadow-xs border border-surface-container relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-secondary-container/20 pointer-events-none blur-2xl"></div>
            <div className="flex items-baseline justify-between mb-space-sm">
              <div className="flex items-baseline gap-1">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">
                  {currentEta}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-medium">mins</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
                On Schedule
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mb-3">
              <span className="material-symbols-outlined text-[18px] text-secondary">near_me</span>
              <span>
                1.4 km away • Approaching <strong>West Res Stop</strong>
              </span>
            </div>
            {/* Progress along stop chain */}
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-secondary-container h-full rounded-full transition-all duration-700"
                style={{ width: `${currentPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 font-label-sm text-label-sm text-on-surface-variant">
              <span>Engineering Hub</span>
              <span className="text-secondary font-semibold">Pickup: North Gate (Stop 4)</span>
              <span>Terminal</span>
            </div>
          </div>

          {/* REAL-TIME CAPACITY INDICATOR */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">
                  airline_seat_recline_normal
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Seat Capacity</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-tertiary-container font-label-md text-label-md font-semibold">
                {currentBus?.availableSeatsCount ?? 14} seats open
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden flex gap-0.5">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${((currentBus?.occupiedSeats?.length || 16) / (currentBus?.totalSeats || 30)) * 100}%`,
                  }}
                ></div>
                <div className="h-full bg-on-tertiary-container flex-1"></div>
              </div>
            </div>
            <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                <span>{currentBus?.occupiedSeats?.length || 16} Occupied</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container inline-block"></span>
                <span className="text-on-surface font-medium">
                  {Math.round(((currentBus?.availableSeatsCount || 14) / (currentBus?.totalSeats || 30)) * 100)}% Open
                </span>
              </div>
            </div>
          </div>

          {/* DRIVER PROFILE CARD */}
          <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-xs"
                    alt="Driver Michael Rodriguez"
                    src={
                      currentBus?.driver?.avatar ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ17gAEjx5AzpiJrvpkVQUXhG336gpLtJXkeMMWiRvfQ2qQgVlQnuwuolMhzn79_maGhpM6JL5UldYkRRvsNBQ4vzuHTEkyzQxPIDSkG_IapnbwRg61iXyQ_jAO79ozgZE429M0dyfa5ddTa63Yio2rnz9f2jhijc9Omwu9XmpqxK23rajd7EPrHpqd-FHxNXto0ljd0mc-9meKbzOEXGSjXQrC2AlTUHqqOcuHkvM'
                    }
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-on-tertiary-container ring-2 ring-surface-container-lowest"></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {currentBus?.driver?.name || 'Michael Rodriguez'}
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      <span className="material-symbols-outlined text-[16px]">star</span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold ml-0.5">
                        {currentBus?.driver?.rating || 4.9}
                      </span>
                    </div>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      • {currentBus?.driver?.tripsCount || '4,200+ Campus Trips'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-mono">
                {currentBus?.driver?.busCode || 'BUS-774'}
              </span>
            </div>

            {/* Driver actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setActiveMessageModal(true)}
                className="h-10 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Message</span>
              </button>
              <button
                onClick={() => setActiveCallModal(true)}
                className="h-10 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">phone</span>
                <span>Call Cab</span>
              </button>
            </div>
          </div>

          {/* ROUTE STOPS ACCORDION PREVIEW */}
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Immediate Next Stops
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-bright border border-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                  <span className="font-body-md text-body-md text-on-surface">West Residence Hall</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">1 min</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-high border border-secondary/30">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/20"></span>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">North Gate Shelter</span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">
                      Your Selected Pickup
                    </span>
                  </div>
                </div>
                <span className="font-label-lg text-label-lg text-secondary font-bold">{currentEta} mins</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-bright border border-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                  <span className="font-body-md text-body-md text-on-surface">Main Library Loop</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">11 mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION */}
        <div className="p-space-lg bg-surface-container-lowest shadow-[0_-8px_20px_rgba(0,0,0,0.03)] border-t border-surface-container flex flex-col gap-2 mt-auto">
          <button
            onClick={() => navigate(`/reserve?bus=${currentBus?.number || '12'}`)}
            className="w-full h-13 py-3.5 rounded-full bg-primary hover:bg-inverse-surface active:scale-[0.99] text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">event_seat</span>
            <span>Reserve Seat on Bus #{currentBus?.number || '12'}</span>
          </button>
          <p className="text-center font-label-sm text-label-sm text-on-surface-variant">
            Free with University Transit Pass • Immediate confirmation
          </p>
        </div>
      </aside>

      {/* RIGHT PANEL: FULL CAMPUS INTERACTIVE MAP VIEW */}
      <main className="flex-1 h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Vector Map Canvas */}
        <div
          className="absolute inset-0 w-full h-full relative transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel})`,
            background:
              mapLayer === 'satellite'
                ? 'radial-gradient(circle at 50% 50%, #152238 0%, #07111e 100%)'
                : 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
          }}
        >
          {/* SVG Overlaid Interactive Vector Route & Landmarks */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1200 900"
          >
            <defs>
              <filter height="140%" id="routeGlow" width="140%" x="-20%" y="-20%">
                <feDropShadow dx="0" dy="4" floodColor="#006398" floodOpacity="0.35" stdDeviation="6" />
              </filter>
              <linearGradient id="routeGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#006398" />
                <stop offset="50%" stopColor="#5bb8fe" />
                <stop offset="100%" stopColor="#006398" />
              </linearGradient>
            </defs>

            {/* Campus Transit Road Network Underlays */}
            <path
              d="M 120,450 C 300,420 480,480 650,430 S 980,380 1100,420"
              fill="none"
              stroke="#1e293b"
              strokeLinecap="round"
              strokeWidth="14"
            />
            <path
              d="M 450,150 C 500,320 460,540 520,780"
              fill="none"
              stroke="#1e293b"
              strokeLinecap="round"
              strokeWidth="14"
            />
            <path
              d="M 750,120 C 720,380 840,600 810,840"
              fill="none"
              stroke="#1e293b"
              strokeLinecap="round"
              strokeWidth="12"
            />

            {/* Active Bus Route Pathway (Sky Blue Vibrant) */}
            <path
              d="M 180,680 Q 280,620 380,560 T 560,420 T 720,310 T 890,290 T 1020,240"
              fill="none"
              filter="url(#routeGlow)"
              stroke="url(#routeGrad)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="7"
            />
            <path
              d="M 180,680 Q 280,620 380,560 T 560,420 T 720,310 T 890,290 T 1020,240"
              fill="none"
              stroke="#ffffff"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>

          {/* CAMPUS LANDMARK LABELS & MARKERS */}
          {/* Landmark 1: Main Campus Library */}
          <div className="absolute top-[28%] left-[62%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto group">
            <div className="bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 transition-transform group-hover:scale-105 cursor-pointer border border-surface-container">
              <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[17px]">local_library</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                  Main Campus Library
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Stop #6 • ETA 11m</span>
              </div>
            </div>
          </div>

          {/* Landmark 2: Science Hall */}
          <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto group">
            <div className="bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 transition-transform group-hover:scale-105 cursor-pointer border border-surface-container">
              <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[17px]">science</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                  Science & Tech Quad
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Stop #3 • Departed</span>
              </div>
            </div>
          </div>

          {/* Landmark 3: Student Union */}
          <div className="absolute top-[68%] left-[72%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto group">
            <div className="bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 transition-transform group-hover:scale-105 cursor-pointer border border-surface-container">
              <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[17px]">storefront</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                  Student Union Complex
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Cafeteria • Transit Desk</span>
              </div>
            </div>
          </div>

          {/* Landmark 4: North Dorms */}
          <div className="absolute top-[22%] left-[82%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto group">
            <div className="bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 transition-transform group-hover:scale-105 cursor-pointer border border-surface-container">
              <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[17px]">apartment</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                  North Residence Halls
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Terminal • ETA 17m</span>
              </div>
            </div>
          </div>

          {/* USER PICKUP STOP PIN (North Gate Shelter) */}
          <div className="absolute top-[38%] left-[58%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 flex flex-col items-center">
            <div className="bg-primary text-on-primary px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 mb-1 animate-bounce">
              <span className="material-symbols-outlined text-[16px] text-secondary-container">
                person_pin_circle
              </span>
              <span className="font-label-md text-label-md font-bold whitespace-nowrap">
                Your Pickup: North Gate
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center shadow-lg ring-4 ring-surface-container-lowest">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            </div>
          </div>

          {/* LIVE MOVING PULSING BUS MARKER (Bus #12) */}
          <div
            className="absolute pointer-events-auto z-20 transition-all duration-1000 ease-linear"
            style={{
              top: `${68 - (currentPercent / 100) * 44}%`,
              left: `${18 + (currentPercent / 100) * 64}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Pulsing outer signal waves */}
              <span className="absolute w-20 h-20 rounded-full bg-secondary-container/40 animate-ping"></span>
              <span className="absolute w-14 h-14 rounded-full bg-secondary/20"></span>
              {/* Bus Shield Badge */}
              <div
                onClick={() => navigate(`/reserve?bus=${currentBus?.number || '12'}`)}
                className="relative px-3.5 py-2 rounded-2xl bg-on-surface text-on-primary shadow-2xl flex items-center gap-2 cursor-pointer ring-4 ring-surface-container-lowest hover:scale-105 transition-transform"
              >
                <div className="w-7 h-7 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg font-bold leading-tight flex items-center gap-1">
                    Bus {currentBus?.number || '12'}
                    <span className="w-2 h-2 rounded-full bg-on-tertiary-container inline-block"></span>
                  </span>
                  <span className="font-label-sm text-label-sm text-surface-variant font-mono">
                    {currentSpeed} km/h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP-RIGHT MAP CONTROLS OVERLAY */}
        <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3 pointer-events-auto">
          {/* Search bar inside map */}
          <div className="bg-surface-container-lowest/95 backdrop-blur-xl shadow-lg rounded-2xl p-1.5 flex items-center gap-2 w-72 sm:w-80 border border-surface-container">
            <span className="material-symbols-outlined text-outline ml-2 text-[20px]">search</span>
            <input
              className="w-full bg-transparent border-0 font-body-sm text-body-sm text-on-surface focus:outline-none placeholder:text-outline"
              placeholder="Search campus stop or hall..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-on-surface-variant mr-1">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Layer and Navigation Floating Button Group */}
          <div className="flex flex-col rounded-2xl bg-surface-container-lowest/95 backdrop-blur-xl shadow-lg overflow-hidden border border-surface-container">
            <button
              onClick={() => setMapLayer(mapLayer === 'standard' ? 'satellite' : 'standard')}
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
              title="Toggle Satellite / Standard Layer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">layers</span>
            </button>
            <div className="w-full h-px bg-surface-container"></div>
            <button
              onClick={() => setZoomLevel(1)}
              className="w-11 h-11 flex items-center justify-center text-secondary hover:bg-surface-container transition-colors"
              title="Center on My Location"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
            <div className="w-full h-px bg-surface-container"></div>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
              title="Zoom In"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
            <div className="w-full h-px bg-surface-container"></div>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
              title="Zoom Out"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">remove</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
