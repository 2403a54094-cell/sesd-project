import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';

export const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookingsData, setBookingsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [countdownMinutes, setCountdownMinutes] = useState<number>(22);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [activeSlipModal, setActiveSlipModal] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookingsData(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const timer = setInterval(() => {
      setCountdownMinutes((prev) => (prev > 1 ? prev - 1 : 25));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleConfirmCancel = async () => {
    if (!bookingsData?.activeBooking) return;
    setIsCancelling(true);

    try {
      const res = await bookingService.cancelBooking(bookingsData.activeBooking.id);
      setCancelFeedback(res.message || 'Reservation cancelled successfully.');
      setShowCancelModal(false);
      await fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  const activeBooking = bookingsData?.activeBooking;
  const upcomingRides = bookingsData?.upcomingRides || [];
  const tripHistory = bookingsData?.tripHistory || [];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 flex flex-col gap-8">
      {/* Cancellation Success Feedback Banner */}
      {cancelFeedback && (
        <div className="p-4 rounded-xl bg-surface-container-low text-on-tertiary-container text-body-md flex items-center justify-between shadow-lg animate-fade-in font-semibold border border-on-tertiary-container/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
            <span>{cancelFeedback}</span>
          </div>
          <button onClick={() => setCancelFeedback(null)} className="text-on-surface">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-scale-up">
            <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-md font-bold text-on-surface">Cancel Bus Reservation?</h3>
              <p className="font-body-md text-on-surface-variant">
                Are you sure you want to cancel your seat for{' '}
                <strong>
                  {activeBooking?.busName} (Seat {activeBooking?.seatNumber})
                </strong>
                ? This will immediately release the seat for other waiting students.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-5 py-2.5 rounded-full font-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-6 py-2.5 rounded-full bg-error hover:bg-error/90 text-white font-label-md font-bold shadow-md transition-all flex items-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    <span>Releasing Seat...</span>
                  </>
                ) : (
                  <span>Yes, Cancel & Refund</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pass Slip Modal */}
      {activeSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">receipt_long</span>
                <h3 className="font-headline-sm font-semibold text-on-surface">Transit Pass Slip</h3>
              </div>
              <button onClick={() => setActiveSlipModal(null)} className="text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 font-mono text-body-sm bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Date:</span>
                <span className="font-semibold text-on-surface">{activeSlipModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Trip:</span>
                <span className="font-semibold text-on-surface">{activeSlipModal.originationTerminus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Seat:</span>
                <span className="font-semibold text-on-surface">{activeSlipModal.seat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Fare:</span>
                <span className="font-semibold text-on-surface">$0.00 (Pass Activated)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status:</span>
                <span className="font-semibold text-secondary">{activeSlipModal.statusText}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveSlipModal(null)}
              className="w-full py-2.5 rounded-full bg-primary text-white font-label-md font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Top Context & Live Operational Ribbon */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">
              Active Transit Pass & Schedule
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Bookings & Passes
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Validated for student {user?.name || 'Alex Chen'} • University ID #{user?.studentId || 'STU2026001'} • Spring Semester 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-surface-container flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Biometric Gate Sync
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Active & Ready</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/reserve')}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-2 hover:bg-on-surface-variant transition-all shadow-sm font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Reserve New Ride</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Active Digital Boarding Pass Ticket (Lg: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {activeBooking ? (
            /* Ticket Wrapper with Card Elevation */
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden flex flex-col border border-surface-container">
              {/* Top Bus Status Banner */}
              <div className="bg-primary text-on-primary p-6 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-surface-container-highest/10 pointer-events-none"></div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-ping"></span>
                    Confirmed & Active
                  </span>
                  <div className="flex items-center gap-1 text-on-primary/80 font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">timer</span>
                    <span className="font-semibold text-on-primary" id="countdown-timer">
                      Departs in {countdownMinutes} mins
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-primary/70 uppercase tracking-wider block">
                      Express Shuttle
                    </span>
                    <h2 className="font-headline-lg text-headline-lg text-on-primary tracking-tight font-bold">
                      {activeBooking.busName}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-secondary-container text-on-secondary-container font-headline-sm text-headline-sm font-bold">
                    {activeBooking.routeCode || '#12-NC'}
                  </span>
                </div>
              </div>

              {/* Ticket Core Body */}
              <div className="p-6 flex flex-col gap-6">
                {/* Quick Boarding Metric Matrix */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-surface-container-low text-center border border-surface-container">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Boarding</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {activeBooking.boardingTime}
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary">Gate 4-B</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Seat Number</span>
                    <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                      {activeBooking.seatNumber}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Window • Mid</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Est. Travel</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">18 min</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Direct Run</span>
                  </div>
                </div>

                {/* Route Milestones & Progress Graphic */}
                <div className="flex flex-col gap-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Itinerary • Morning Commute
                  </span>
                  <div className="relative pl-6 flex flex-col gap-6">
                    {/* Vertical Progress Line */}
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-surface-container-high"></div>
                    {/* Station 1 */}
                    <div className="relative flex items-start justify-between">
                      <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-secondary shadow-[0_0_0_4px_#eff4ff]"></span>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                          {activeBooking.boardingPoint}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Platform Bay 2 • Boarding Area East
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        {activeBooking.boardingTime}
                      </span>
                    </div>
                    {/* Intermediate waypoint */}
                    <div className="relative flex items-center justify-between text-on-surface-variant/80">
                      <span className="absolute -left-5 top-1.5 w-1.5 h-1.5 rounded-full bg-outline"></span>
                      <span className="font-label-sm text-label-sm italic">Perimeter Loop • Non-stop Bypass</span>
                      <span className="font-label-sm text-label-sm">~6 min transit</span>
                    </div>
                    {/* Station 2 (Destination) */}
                    <div className="relative flex items-start justify-between">
                      <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-on-surface shadow-[0_0_0_4px_#eff4ff]"></span>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                          {activeBooking.destination}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Alighting Zone South • Adjacent STEM Annex
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        {activeBooking.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scannable High-Res QR Pass Panel */}
                <div className="p-5 rounded-2xl bg-surface-container flex flex-col items-center gap-4 text-center border border-surface-container-high/60">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                      Scannable Boarding Code
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-mono font-bold">
                      {activeBooking.passId || 'PASS #STU-2024-8891'}
                    </span>
                  </div>
                  {/* Crisp Vector QR Code Mockup */}
                  <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs flex items-center justify-center border border-surface-container">
                    <svg className="w-40 h-40 text-on-surface" fill="currentColor" viewBox="0 0 160 160">
                      <rect height="40" rx="4" width="40" x="10" y="10"></rect>
                      <rect fill="#ffffff" height="24" rx="2" width="24" x="18" y="18"></rect>
                      <rect height="12" rx="1" width="12" x="24" y="24"></rect>
                      <rect height="40" rx="4" width="40" x="110" y="10"></rect>
                      <rect fill="#ffffff" height="24" rx="2" width="24" x="118" y="18"></rect>
                      <rect height="12" rx="1" width="12" x="124" y="24"></rect>
                      <rect height="40" rx="4" width="40" x="10" y="110"></rect>
                      <rect fill="#ffffff" height="24" rx="2" width="24" x="18" y="118"></rect>
                      <rect height="12" rx="1" width="12" x="24" y="124"></rect>
                      <rect height="8" rx="1" width="8" x="60" y="14"></rect>
                      <rect height="6" rx="1" width="6" x="74" y="14"></rect>
                      <rect height="8" rx="1" width="10" x="88" y="14"></rect>
                      <rect height="6" rx="1" width="14" x="62" y="30"></rect>
                      <rect height="10" rx="1" width="12" x="84" y="28"></rect>
                      <rect height="10" rx="1" width="10" x="16" y="60"></rect>
                      <rect height="8" rx="1" width="8" x="34" y="60"></rect>
                      <rect height="14" rx="1" width="12" x="52" y="52"></rect>
                      <rect height="8" rx="1" width="16" x="72" y="48"></rect>
                      <rect height="12" rx="1" width="10" x="96" y="52"></rect>
                      <rect height="8" rx="1" width="16" x="114" y="60"></rect>
                      <rect height="12" rx="1" width="8" x="138" y="60"></rect>
                      <rect height="14" rx="1" width="8" x="20" y="80"></rect>
                      <rect height="8" rx="1" width="12" x="38" y="78"></rect>
                      <rect height="16" rx="1" width="8" x="58" y="74"></rect>
                      <rect height="14" rx="1" width="14" x="76" y="70"></rect>
                      <rect height="12" rx="1" width="8" x="98" y="74"></rect>
                      <rect height="6" rx="1" width="14" x="116" y="80"></rect>
                      <rect height="8" rx="1" width="10" x="136" y="82"></rect>
                      <rect height="8" rx="1" width="12" x="60" y="96"></rect>
                      <rect height="14" rx="1" width="8" x="80" y="94"></rect>
                      <rect height="6" rx="1" width="16" x="96" y="98"></rect>
                      <rect height="8" rx="1" width="14" x="62" y="114"></rect>
                      <rect height="10" rx="1" width="10" x="84" y="118"></rect>
                      <rect height="16" rx="1" width="8" x="102" y="112"></rect>
                      <rect height="8" rx="1" width="12" x="118" y="114"></rect>
                      <rect height="14" rx="1" width="10" x="138" y="118"></rect>
                      <rect height="14" rx="1" width="8" x="62" y="132"></rect>
                      <rect height="8" rx="1" width="16" x="78" y="138"></rect>
                      <rect height="10" rx="1" width="12" x="104" y="136"></rect>
                      <rect height="12" rx="1" width="10" x="126" y="132"></rect>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[16px] text-secondary">contactless</span>
                    <span>Hold near turnstile or bus driver optic validator</span>
                  </div>
                </div>

                {/* Driver Card & Vehicle Specs */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-11 h-11 rounded-full object-cover shadow-xs"
                      alt="Driver Michael R."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfPL0EB_CLYqux0XzIWqv1-e0ad-2PJL5KEpbsBbOlJOUQW3u2mKvnvtlauDEhCF-6Td7NmSkh3rz-Y0M1NaNvg1BLOqjusJL_aJhMJcGOw6-SaY63uDHmPfwdKNAOG_9kutL_3MaNseItvuSY2LzXhWQuaR3VPQTzKf_YRopYpnHlOwSBWTDK6XuttraEUEb3uRhLdUg4mi18i8HgGSvDmt0Sv_aHxaMqHJ9DhKoU"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                        {activeBooking.driverName || 'Michael R.'}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Senior Driver • 99.4% Safety Rating
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate('/tracking')}
                      className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-xs"
                      title="Call Dispatch / Driver"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">phone</span>
                    </button>
                    <button
                      onClick={() => navigate('/tracking')}
                      className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-xs"
                      title="Send Transit Note"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => navigate('/tracking')}
                    className="flex-1 h-[48px] rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-secondary hover:text-on-secondary transition-all shadow-xs font-semibold"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">near_me</span>
                    <span>Track Bus Live</span>
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="h-[48px] px-6 rounded-full bg-surface-container text-error font-label-lg text-label-lg flex items-center justify-center gap-1.5 hover:bg-error-container hover:text-on-error-container transition-all font-semibold"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    <span>Cancel Booking</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State when no active booking */
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-container flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[32px]">event_seat</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-md font-bold text-on-surface">No Active Reservation</h3>
                <p className="font-body-md text-on-surface-variant max-w-xs">
                  You do not have any active shuttle reservations at the moment. Browse routes and pick your seat!
                </p>
              </div>
              <button
                onClick={() => navigate('/reserve')}
                className="mt-2 px-6 py-3 rounded-full bg-primary hover:bg-inverse-surface text-on-primary font-label-lg font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                <span>Reserve a Seat Now</span>
              </button>
            </div>
          )}

          {/* Real-Time Notification Quick Callout */}
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary">
              <span className="material-symbols-outlined text-[20px]">info</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Priority Boarding Activated
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Seat 4B includes overhead locker storage & dedicated Type-C charging port. Please arrive at Gate 4-B by
                08:25 AM.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Schedules, Travel History & Policies (Lg: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* UPCOMING WEEK RIDES SECTION */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">calendar_month</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Upcoming Reserved Rides
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-secondary-container font-label-sm text-label-sm font-semibold">
                {upcomingRides.length} Future Trips
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {upcomingRides.map((ride: any) => (
                <div
                  key={ride.id}
                  className="p-4 rounded-xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-surface-container"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low flex flex-col items-center justify-center shrink-0 text-on-surface">
                      <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary">
                        {ride.dayShort}
                      </span>
                      <span className="font-headline-sm text-headline-sm leading-none font-bold">
                        {ride.dateNum}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                          {ride.destination}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
                          {ride.routeCode}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {ride.departureTime} • Pickup: {ride.pickupLocation}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:border-l sm:border-surface-container sm:pl-4">
                    <div className="flex flex-col text-left sm:text-right">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Seat</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">{ride.seat}</span>
                    </div>
                    <button
                      onClick={() => navigate('/reserve')}
                      className="w-8 h-8 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PAST RIDE HISTORY TABLE SECTION */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">history</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Recent Trip History
                </h2>
              </div>
              <button
                onClick={() => alert('Full archive: 14 total completed campus trips this academic semester.')}
                className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Full Archive</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase border-b border-surface-container">
                    <th className="py-3.5 px-4 font-semibold">Date & Route</th>
                    <th className="py-3.5 px-4 font-semibold">Origination • Terminus</th>
                    <th className="py-3.5 px-4 font-semibold">Seat</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {tripHistory.map((item: any) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg text-on-surface font-semibold">{item.date}</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{item.busInfo}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-body-md text-body-md text-on-surface">
                        {item.originationTerminus}
                      </td>
                      <td className="py-3.5 px-4 font-label-md text-label-md text-on-surface font-medium">{item.seat}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-tertiary-container font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                          {item.statusText} ({item.delayText})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveSlipModal(item)}
                          className="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm underline"
                          type="button"
                        >
                          Pass Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* UNIVERSITY TRANSIT POLICY & CAMPUS RIDE GUIDANCE */}
          <div className="p-6 rounded-2xl bg-surface-container flex flex-col gap-4 border border-surface-container-high/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface text-[20px]">policy</span>
              <span className="font-label-lg text-label-lg text-on-surface font-bold">
                University Transit Rider Conduct & Policies
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    5-Minute Grace Release
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Unclaimed reserved seats are released for standby walk-up students 5 minutes prior to scheduled
                    departure.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                  qr_code_scanner
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Contactless Boarding Only
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Keep your QR pass or synced student RFID tag ready at the turnstile validator prior to stepping into
                    the bus aisle.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">restart_alt</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Cancellation Policy
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Trips can be cancelled fee-free up to 15 minutes before route departure without transit point
                    reduction.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                  support_agent
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Campus Safety Escort
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    For rides arriving after 9:00 PM, request a certified Student Safety escort from your destination
                    station via dispatch.
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <span>Questions or special boarding accommodations?</span>
              <a className="text-secondary font-label-md text-label-md font-semibold hover:underline" href="#contact">
                Contact Campus Dispatch Office (Ext. 409) →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
