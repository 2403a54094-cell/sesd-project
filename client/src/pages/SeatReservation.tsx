import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { busService, bookingService } from '../services/api';

export const SeatReservation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const busParam = searchParams.get('bus') || '12';

  const [seatsData, setSeatsData] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('4B');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch live seats from backend
  const fetchSeats = async () => {
    try {
      const data = await busService.getSeats(busParam);
      setSeatsData(data);
      // If selected seat is booked, switch to first available
      if (data.seats) {
        const isCurrentSelectedBooked = data.seats.some(
          (s: any) => s.id === selectedSeat && s.status === 'booked'
        );
        if (isCurrentSelectedBooked) {
          const firstAvailable = data.seats.find((s: any) => s.status === 'available');
          if (firstAvailable) setSelectedSeat(firstAvailable.id);
        }
      }
    } catch (err) {
      console.error('Failed to load seats:', err);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [busParam]);

  const handleSeatClick = (seat: any) => {
    if (seat.status === 'booked') {
      setErrorMessage(`Seat ${seat.id} is already occupied. Please select an available green-marked seat.`);
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }
    setSelectedSeat(seat.id);
    setErrorMessage(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeat) {
      setErrorMessage('Please select a seat on the floorplan first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await bookingService.createBooking({
        busId: busParam,
        seatNumber: selectedSeat,
        boardingPoint: 'North Gate Station',
        destination: 'Research Hub Terminal',
      });

      setSuccessMessage(res.message || `Seat ${selectedSeat} confirmed!`);
      // Re-fetch seats to reflect new occupancy
      await fetchSeats();

      setTimeout(() => {
        navigate('/bookings');
      }, 1200);
    } catch (err: any) {
      const errorText =
        err.response?.data?.error ||
        'Booking error: Duplicate reservation or seat unavailable. Please select another seat.';
      setErrorMessage(errorText);
      setIsSubmitting(false);
    }
  };

  const seatsList = seatsData?.seats || [];
  const getSeat = (id: string) => seatsList.find((s: any) => s.id === id);

  const selectedSeatObj = getSeat(selectedSeat);
  const isSelectedPriority = selectedSeatObj?.isPriority;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full flex flex-col gap-6">
      {/* Toast Error/Success Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-error-container text-on-error-container text-body-md flex items-center justify-between shadow-lg animate-shake">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error">error</span>
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-on-error-container">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-surface-container-low text-on-tertiary-container text-body-md flex items-center gap-2 shadow-lg animate-fade-in font-semibold">
          <span className="material-symbols-outlined text-[22px]">check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Transit Micro Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <span onClick={() => navigate('/dashboard')} className="hover:text-on-surface cursor-pointer transition-colors">
            Routes
          </span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span onClick={() => navigate('/tracking')} className="hover:text-on-surface cursor-pointer transition-colors">
            Line {busParam} North Express
          </span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-secondary font-semibold">Seat Selection</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            <span>Live Sync • {seatsData?.availableSeatsCount ?? 19} Seats Remaining</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
            AC Shuttle • EcoElectric Vol. 4
          </div>
        </div>
      </div>

      {/* Main Asymmetric Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Route Brief, Color Key, & Bus Architecture Floorplan */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Header Route Summary Banner */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-on-primary text-[28px]">directions_bus</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold tracking-wide">
                    BUS #{busParam}
                  </span>
                  <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                    North Express Line
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  Main Campus → Research Hub
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 flex items-center gap-2">
                  <span>08:30 AM Departure</span>
                  <span>•</span>
                  <span>Est. 18 min transit</span>
                  <span>•</span>
                  <span className="text-secondary font-medium">Non-stop express</span>
                </p>
              </div>
            </div>
            <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 gap-1 text-right">
              <div className="font-headline-md text-headline-md font-bold text-on-surface">
                18 <span className="font-label-md text-label-md text-on-surface-variant font-normal">MIN</span>
              </div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">Gate 4 • Bay C</div>
            </div>
          </div>

          {/* Seating Legend */}
          <div className="bg-surface-container-lowest rounded-2xl px-6 py-4 shadow-sm border border-surface-container flex flex-wrap items-center justify-between gap-4">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">Seat Status</span>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-surface-container-lowest border border-surface-container shadow-xs flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-secondary text-on-secondary shadow-xs flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-[14px]">block</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">accessible</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">Priority Access</span>
              </div>
            </div>
          </div>

          {/* Architectural Realistic 2x2 Bus Floorplan Canvas */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-container flex flex-col items-center relative">
            {/* Aerodynamic Nose Silhouette */}
            <div className="w-full max-w-md flex flex-col items-center mb-6">
              <div className="w-72 h-8 bg-surface-container-high rounded-t-[40px] flex items-center justify-center shadow-inner">
                <div className="w-20 h-1.5 bg-surface-dim rounded-full"></div>
              </div>

              {/* Front Windshield Glass */}
              <div className="w-80 h-12 bg-gradient-to-b from-secondary-fixed/40 to-surface-container-low rounded-t-xl flex items-center justify-between px-6 shadow-xs border-x border-t border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm text-secondary font-bold tracking-widest uppercase">
                    HD WIDE GLASS
                  </span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">sensors</span>
                  <span className="font-label-sm text-label-sm font-mono">LIDAR ACTIVE</span>
                </div>
              </div>

              {/* Driver Cockpit Area & Entry Door */}
              <div className="w-80 bg-surface-container-low p-4 rounded-b-xl flex items-center justify-between mb-8 shadow-xs border border-surface-container">
                {/* Driver Side */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[20px]">airline_seat_recline_normal</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase">
                      Operator Cabin
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Captain K. Diaz</span>
                  </div>
                </div>

                {/* Entry Hatch */}
                <div className="flex flex-col items-end">
                  <div className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">door_front</span>
                    <span>Entry Door</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-0.5 font-label-sm">Touch-to-pay sensor</span>
                </div>
              </div>

              {/* Central Bus Cabin Frame (2x2 Layout, 7 Rows) */}
              <div className="w-full max-w-sm flex flex-col gap-3.5 relative">
                {/* Column Lettering Header */}
                <div className="grid grid-cols-5 text-center font-label-md text-label-md text-on-surface-variant font-semibold mb-1">
                  <div>A (Window)</div>
                  <div>B (Aisle)</div>
                  <div className="text-secondary font-label-sm text-label-sm flex items-center justify-center font-bold">
                    AISLE
                  </div>
                  <div>C (Aisle)</div>
                  <div>D (Window)</div>
                </div>

                {/* Render Rows 1 to 6 */}
                {[1, 2, 3, 4, 5, 6].map((rowNum) => {
                  const seatA = getSeat(`${rowNum}A`);
                  const seatB = getSeat(`${rowNum}B`);
                  const seatC = getSeat(`${rowNum}C`);
                  const seatD = getSeat(`${rowNum}D`);

                  const renderSeatButton = (s: any) => {
                    if (!s) return <div className="h-11 rounded-xl bg-transparent"></div>;

                    const isBooked = s.status === 'booked';
                    const isSelected = selectedSeat === s.id;
                    const isPriority = s.isPriority;

                    let btnClass = 'h-11 rounded-xl flex flex-col items-center justify-center transition-all ';

                    if (isBooked) {
                      btnClass +=
                        'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed shadow-none';
                    } else if (isSelected) {
                      btnClass += 'bg-secondary text-white ring-2 ring-secondary ring-offset-2 shadow-md scale-105';
                    } else if (isPriority) {
                      btnClass +=
                        'bg-surface-container-high text-secondary hover:bg-secondary-fixed/50 shadow-xs cursor-pointer';
                    } else {
                      btnClass +=
                        'bg-surface-container-low text-on-surface hover:bg-secondary-fixed/40 shadow-xs cursor-pointer';
                    }

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSeatClick(s)}
                        disabled={isBooked}
                        title={`Seat ${s.id} - ${s.label} (${s.status})`}
                        className={btnClass}
                      >
                        {isBooked ? (
                          <>
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            <span className="font-label-sm text-label-sm">{s.id}</span>
                          </>
                        ) : isSelected ? (
                          <>
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            <span className="font-label-sm text-label-sm font-bold">{s.id}</span>
                          </>
                        ) : isPriority ? (
                          <>
                            <span className="material-symbols-outlined text-[16px]">accessible</span>
                            <span className="font-label-sm text-label-sm font-semibold">{s.id}</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim mb-0.5"></span>
                            <span className="font-label-sm text-label-sm font-semibold">{s.id}</span>
                          </>
                        )}
                      </button>
                    );
                  };

                  return (
                    <React.Fragment key={rowNum}>
                      <div className="grid grid-cols-5 gap-2 items-center">
                        {renderSeatButton(seatA)}
                        {renderSeatButton(seatB)}
                        <div className="h-full flex items-center justify-center">
                          <span className="font-label-sm text-label-sm text-on-surface-variant/40 font-mono">
                            R{rowNum}
                          </span>
                        </div>
                        {renderSeatButton(seatC)}
                        {renderSeatButton(seatD)}
                      </div>

                      {/* Emergency Exit Marker between Row 4 and 5 */}
                      {rowNum === 4 && (
                        <div className="py-1 flex items-center justify-between text-[11px] text-on-surface-variant font-label-sm px-2">
                          <span className="flex items-center gap-1 font-semibold text-error">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Emergency Exit Left
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-error">
                            Emergency Exit Right <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Row 7 (Back Row - 5 across) */}
                <div className="grid grid-cols-5 gap-2 items-center pt-2">
                  {['7A', '7B', '7C', '7D', '7E'].map((seatId) => {
                    const s = getSeat(seatId);
                    if (!s) return null;
                    const isBooked = s.status === 'booked';
                    const isSelected = selectedSeat === s.id;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSeatClick(s)}
                        disabled={isBooked}
                        className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
                          isBooked
                            ? 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-secondary text-white ring-2 ring-secondary ring-offset-2 shadow-md scale-105'
                            : 'bg-surface-container-low text-on-surface hover:bg-secondary-fixed/40 shadow-xs'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            <span className="font-label-sm text-label-sm font-bold">{s.id}</span>
                          </>
                        ) : isBooked ? (
                          <>
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            <span className="font-label-sm text-label-sm">{s.id}</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim mb-0.5"></span>
                            <span className="font-label-sm text-label-sm font-semibold">{s.id}</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rear Engine Compartment Sill */}
              <div className="w-72 h-4 bg-surface-container-high rounded-b-2xl mt-6 flex items-center justify-center">
                <span className="text-[9px] font-label-sm text-on-surface-variant uppercase tracking-widest font-mono">
                  REAR POWERTRAIN EV
                </span>
              </div>
            </div>

            {/* Bottom Comfort Specs Indicators */}
            <div className="w-full pt-4 border-t border-surface-container-high/60 flex flex-wrap items-center justify-between text-on-surface-variant font-label-sm text-label-sm gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">wifi</span> High-Speed WiFi 6
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">power</span> USB-C Fast Ports
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">hvac</span> Climate Controlled
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant/70 font-mono">
                Vehicle ID: CR-VOLT-409
              </span>
            </div>
          </div>

          {/* Campus Transit Guarantee & Safety Bar */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex items-center justify-between gap-4 border border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Live GPS Auto-Dispatch
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Real-time telematics keep you updated if traffic affects ETA by more than 2 minutes.
                </span>
              </div>
            </div>
            <span className="hidden md:inline-flex px-3 py-1 bg-surface-container-lowest rounded-full font-label-sm text-label-sm text-on-surface font-medium shadow-xs">
              Zero Emissions Bus
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Dedicated Booking Checkout Card */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          {/* Reservation Pass Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold uppercase tracking-wider">
                  Booking Checkout
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-bold">
                Step 2 of 2
              </span>
            </div>

            {/* Highlighted Selected Seat Panel */}
            <div className="bg-surface-container-low rounded-xl p-5 flex items-center justify-between shadow-inner border border-surface-container">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Seat Assignment
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-headline-xl text-headline-xl font-bold text-on-surface leading-none">
                    {selectedSeat}
                  </span>
                  <span className="font-label-md text-label-md text-secondary font-semibold">
                    {isSelectedPriority ? 'Priority Accessible' : 'Window, Left Bay'}
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Mid-Cabin • Quiet Zone
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[24px]">chair</span>
              </div>
            </div>

            {/* Booking Specifics Summary */}
            <div className="flex flex-col gap-4">
              {/* Passenger Record */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Passenger Name</span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    {user?.name || 'Alex Chen'}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    ID: {user?.studentId || 'STU2026001'} • {user?.role || 'Student'}
                  </span>
                </div>
              </div>

              {/* Boarding Point & Schedule */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Boarding Point & Time
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">North Gate Station</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Today at 08:30 AM (In 24 mins)</span>
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">flag</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Destination Arrival
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Research Hub Terminal
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Est. 08:48 AM • Bay 2</span>
                </div>
              </div>
            </div>

            {/* Fare Breakdown Box */}
            <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2">
              <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
                <span>Standard Transit Fare</span>
                <span className="line-through text-outline font-mono">$2.50</span>
              </div>
              <div className="flex items-center justify-between font-label-md text-label-md text-secondary font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  Student Transit Privilege
                </span>
                <span className="font-mono">-$2.50</span>
              </div>
              <div className="h-px bg-surface-container-high/80 my-1"></div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">Total Payable</span>
                  <span className="text-[11px] font-label-sm text-on-surface-variant">Semester Pass Activated</span>
                </div>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">
                  $0.00 <span className="font-label-sm text-label-sm font-semibold uppercase text-secondary">Free</span>
                </span>
              </div>
            </div>

            {/* Digital Guarantee Badge & CTA Action */}
            <div className="flex flex-col gap-3">
              <button
                id="confirm-booking-btn"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="w-full h-13 py-3.5 px-6 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
                type="button"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                    <span>Confirming Reservation...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Seat {selectedSeat} Booking</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/tracking')}
                className="w-full py-2.5 rounded-full hover:bg-surface-container-low text-on-surface-variant font-label-md text-label-md font-medium transition-colors"
                type="button"
              >
                Choose Another Route
              </button>
            </div>

            {/* Instant Digital Pass Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">qr_code_2</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                Instant digital boarding pass with dynamic QR code will be generated and synchronized to your Campus
                Wallet immediately.
              </p>
            </div>
          </div>

          {/* Live Route Map Thumbnail Widget */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">
                Live Path Tracking
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">Active GPS</span>
            </div>
            <div
              onClick={() => navigate('/tracking')}
              className="w-full h-36 bg-slate-900 rounded-xl relative overflow-hidden shadow-inner flex items-end p-3 cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              {/* Thumbnail route map */}
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 300 150">
                <path d="M 20,120 Q 150,20 280,100" fill="none" stroke="#5bb8fe" strokeWidth="4" />
                <circle cx="150" cy="65" r="6" fill="#006398" />
              </svg>
              <div className="relative z-20 flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed animate-ping"></span>
                  <span className="font-label-sm text-label-sm font-semibold">Bus #{busParam} is 1.4 mi away</span>
                </div>
                <span className="font-label-sm text-label-sm bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white">
                  ETA 08:26 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
