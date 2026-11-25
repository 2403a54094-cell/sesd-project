import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [studentId, setStudentId] = useState('STU2026001');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(studentId, password);
      setSuccessMessage('Welcome aboard!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Failed to authenticate. Please ensure you enter valid credentials (STU2026001 / student123).'
      );
      setIsLoading(false);
    }
  };

  const handleQuickFill = (id: string) => {
    setStudentId(id);
    setPassword('student123');
    setError(null);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center p-space-md md:p-space-xl relative overflow-hidden bg-surface">
      {/* Ambient atmospheric background gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-surface-container-high/60 blur-3xl pointer-events-none"></div>

      {/* Central Grid Layout Container */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-surface-container-lowest shadow-2xl overflow-hidden border border-surface-container-high/50 my-6">
        {/* Visual & Campus Status Aside (Desktop Split Panel) */}
        <div className="relative lg:col-span-5 bg-primary-container text-on-primary flex flex-col justify-between p-space-lg lg:p-space-xl overflow-hidden min-h-[520px]">
          {/* Visual Backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJlvOcgHFumtoXi1KHd3dXCtdY39qH41pv7wd8Q7bRJVfEzFkM-4HQH24-Q-8seWkKG9yCjXYx2GQFG6UCdv6cuuAYqTNnZNMGvw8_0HWjFvOJuqi-eCyg-1dHOBgiUVBOCjovfFzni96OCgJc_rATvMok2YMI9tAjg9fvwUYDcmrg4hUJ2U4rk4ciBdFTXuMrT87NV9-myFFUY9vnJus2j0muQ8iNfrn0rEjme4X8')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/85 to-primary-container/60"></div>

          {/* Header Info within Aside */}
          <div className="relative z-10 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary text-on-secondary shadow-md">
                <span className="material-symbols-outlined text-headline-sm">directions_bus</span>
              </span>
              <div>
                <span className="font-headline-sm text-headline-sm tracking-tight text-white block leading-tight font-semibold">
                  CampusRide
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed tracking-wide uppercase font-medium">
                  University Transit System
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-fixed"></span>
              </span>
              <span className="font-label-sm text-label-sm text-white">Central Loop • Normal Frequency</span>
            </div>
          </div>

          {/* Live Next Shuttle Departure Widget */}
          <div className="relative z-10 my-8 bg-white/10 backdrop-blur-md rounded-xl p-space-md flex flex-col gap-space-sm text-white shadow-sm border border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">
                Next Stop Departure
              </span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary text-white font-medium">
                Route A
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <div>
                <span className="font-headline-lg text-headline-lg font-bold tracking-tight text-white">
                  04 min
                </span>
                <p className="font-body-sm text-body-sm text-surface-container-high">
                  Science Quad → South Quad
                </p>
              </div>
              <div className="flex items-center gap-1 text-tertiary-fixed font-label-md text-label-md">
                <span className="material-symbols-outlined text-label-lg">event_seat</span>
                <span>18 seats open</span>
              </div>
            </div>
            {/* Micro Progress Bar */}
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-secondary-container h-full rounded-full w-3/4 animate-pulse"></div>
            </div>
          </div>

          {/* Footer Notice within Aside */}
          <div className="relative z-10 flex flex-col gap-1 text-primary-fixed-dim font-body-sm text-body-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-label-lg text-secondary-fixed">verified_user</span>
              <span className="font-label-md text-label-md text-white font-medium">Single Sign-On Security</span>
            </div>
            <p className="text-white/70 leading-relaxed font-body-sm text-body-sm">
              Valid active university credentials required. Reserved for verified students, faculty, and administrative staff.
            </p>
          </div>
        </div>

        {/* Institutional Sign-in Portal Form Panel */}
        <div className="relative lg:col-span-7 p-space-lg md:p-space-xl flex flex-col justify-between bg-surface-container-lowest">
          {/* Top Institutional Credential Badge */}
          <div className="flex items-center justify-between pb-space-md border-b border-surface-container-low">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-headline-sm">account_balance</span>
              </div>
              <div>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold block leading-none">
                  Metro University
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Department of Transportation & Parking
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-secondary-container">
              <span className="material-symbols-outlined text-label-md text-secondary">shield</span>
              <span className="font-label-sm text-label-sm font-semibold tracking-wide uppercase">Secured</span>
            </div>
          </div>

          {/* Main Form Body */}
          <div className="my-auto py-space-sm flex flex-col gap-space-md">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Access Your Transit Pass
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Reserve campus express seats, track live shuttle telematics, and validate electronic boarding passes.
              </p>
            </div>

            {/* Demo Credentials Quick Switcher Banner */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">badge</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Demo Accounts:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleQuickFill('STU2026001')}
                  className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                    studentId === 'STU2026001'
                      ? 'bg-secondary text-white font-semibold shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  STU2026001 (Alex)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('STU2026002')}
                  className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                    studentId === 'STU2026002'
                      ? 'bg-secondary text-white font-semibold shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  STU2026002 (Marcus)
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container text-body-sm flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-error text-[20px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
              {/* Student ID Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-lg text-label-lg text-on-surface font-semibold" htmlFor="studentId">
                    Student Registration ID / NetID
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">e.g. STU2026001</span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-label-lg pointer-events-none">
                    badge
                  </span>
                  <input
                    className="w-full h-12 pl-11 pr-20 bg-surface rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline border border-transparent focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all shadow-xs"
                    id="studentId"
                    name="studentId"
                    placeholder="STU2026001"
                    required
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                  <button
                    className="absolute right-3 text-secondary text-label-sm font-semibold hover:opacity-80"
                    onClick={() => handleQuickFill('STU2026001')}
                    type="button"
                  >
                    Default
                  </button>
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-lg text-label-lg text-on-surface font-semibold" htmlFor="securityPin">
                    Password / Transit Security PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword('student123')}
                    className="font-label-md text-label-md text-secondary hover:underline focus:outline-none"
                  >
                    Reset (student123)
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-label-lg pointer-events-none">
                    lock
                  </span>
                  <input
                    className="w-full h-12 pl-11 pr-11 bg-surface rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline border border-transparent focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all shadow-xs tracking-wider"
                    id="securityPin"
                    name="securityPin"
                    placeholder="Enter campus password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-3.5 text-on-surface-variant hover:text-on-surface focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-label-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me & Fast Boarding Checks */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-secondary focus:ring-0 accent-secondary cursor-pointer"
                    id="rememberMe"
                    type="checkbox"
                  />
                  <span className="font-body-md text-body-md text-on-surface">Remember this device</span>
                </label>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-tertiary-container bg-surface-container-low px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-label-sm">offline_pin</span>
                  <span>Fast Boarding Active</span>
                </span>
              </div>

              {/* Primary Submit Action Button */}
              <div className="pt-space-sm flex flex-col gap-space-sm">
                <button
                  className={`w-full h-[52px] rounded-full text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-all ${
                    successMessage
                      ? 'bg-secondary'
                      : 'bg-primary hover:bg-inverse-surface active:scale-[0.99]'
                  }`}
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-label-lg">progress_activity</span>
                      <span>Authenticating Campus Pass...</span>
                    </>
                  ) : successMessage ? (
                    <>
                      <span className="material-symbols-outlined text-label-lg">check_circle</span>
                      <span>{successMessage}</span>
                    </>
                  ) : (
                    <>
                      <span>Log In to CampusRide</span>
                      <span className="material-symbols-outlined text-label-lg">arrow_forward</span>
                    </>
                  )}
                </button>

                {/* Secondary SSO Option */}
                <button
                  onClick={() => {
                    handleQuickFill('STU2026001');
                    navigate('/dashboard');
                  }}
                  className="w-full h-11 rounded-full bg-surface-container-low text-secondary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-label-md">vpn_key</span>
                  <span>Sign in with University SSO (Canvas / Okta)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Institutional Accreditation & Security Footer */}
          <div className="pt-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container-low mt-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-label-md text-secondary">verified</span>
              <span>NIST 800-53 Compliant • 256-bit TLS</span>
            </div>
            <div className="flex items-center gap-4">
              <a className="hover:text-on-surface hover:underline" href="#help">
                Transit Dispatch Desk
              </a>
              <span className="text-outline-variant">•</span>
              <a className="hover:text-on-surface hover:underline" href="#terms">
                Safety Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Security Accreditation Badge Bar below Main Shell */}
      <div className="w-full max-w-5xl px-space-sm flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
          <span>Campus Emergency Blue Light Telemetry Linked</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Campus Police Dispatch: <strong>(555) 019-2834</strong>
          </span>
          <span>•</span>
          <span>Fleet Services v4.12</span>
        </div>
      </div>
    </div>
  );
};
