import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCheck, Menu, X, Bell } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchAccount = async (targetId: string) => {
    try {
      await login(targetId, 'student123');
      setProfileDropdownOpen(false);
      setNotificationToast(`Switched account to ${targetId}`);
      setTimeout(() => setNotificationToast(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tracking', label: 'Live Tracking' },
    { path: '/reserve', label: 'Seat Reservation' },
    { path: '/bookings', label: 'My Bookings' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-label-md">
          <span className="material-symbols-outlined text-secondary-container text-[20px]">info</span>
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-space-lg">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-space-sm text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-on-primary text-[20px]">directions_bus</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight tracking-tight font-semibold">
                  CampusRide
                </span>
                <span className="font-label-sm text-label-sm text-secondary leading-none uppercase font-semibold">
                  Transit Portal
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-space-md py-space-sm rounded-xl font-label-lg text-label-lg transition-all ${
                      isActive
                        ? 'bg-surface-container text-on-surface font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Header Area */}
          <div className="flex items-center gap-space-md">
            {/* Live Service Indicator */}
            <div className="hidden xl:flex items-center gap-2 px-space-md py-1.5 rounded-full bg-surface-container-low">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-secondary font-medium">
                Service Active • 14 Buses En Route
              </span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => {
                setNotificationToast('Route #12 North Express is arriving on schedule at 8:38 AM.');
                setTimeout(() => setNotificationToast(null), 4000);
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors relative"
              type="button"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 pl-space-sm py-1 pr-2 rounded-xl hover:bg-surface-container-low transition-colors text-left"
                type="button"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-label-lg text-label-lg text-on-surface leading-none font-semibold">
                    {user?.name || 'Alex Chen'}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                    {user?.studentId || 'STU2026001'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px] hidden sm:inline">
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-container-lowest shadow-2xl border border-surface-container-high/60 p-3 z-50 flex flex-col gap-2">
                  <div className="px-3 py-2 border-b border-surface-container-high/60">
                    <p className="font-label-lg text-on-surface font-semibold">{user?.name}</p>
                    <p className="font-body-sm text-on-surface-variant">{user?.department}</p>
                    <p className="font-label-sm text-secondary mt-1">{user?.passStatus}</p>
                  </div>

                  <div className="flex flex-col gap-1 py-1">
                    <span className="px-3 text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                      Demo Switch Account
                    </span>
                    <button
                      onClick={() => handleSwitchAccount('STU2026001')}
                      className={`px-3 py-2 rounded-xl text-left font-label-md flex items-center justify-between transition-colors ${
                        user?.studentId === 'STU2026001'
                          ? 'bg-surface-container text-secondary font-semibold'
                          : 'hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span>STU2026001 (Alex Chen)</span>
                      {user?.studentId === 'STU2026001' && <UserCheck className="w-4 h-4 text-secondary" />}
                    </button>
                    <button
                      onClick={() => handleSwitchAccount('STU2026002')}
                      className={`px-3 py-2 rounded-xl text-left font-label-md flex items-center justify-between transition-colors ${
                        user?.studentId === 'STU2026002'
                          ? 'bg-surface-container text-secondary font-semibold'
                          : 'hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span>STU2026002 (Marcus Vance)</span>
                      {user?.studentId === 'STU2026002' && <UserCheck className="w-4 h-4 text-secondary" />}
                    </button>
                  </div>

                  <div className="border-t border-surface-container-high/60 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 rounded-xl text-left font-label-md text-error hover:bg-error-container hover:text-on-error-container flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface-container-lowest border-t border-surface-container px-6 py-4 flex flex-col gap-2 shadow-lg">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-label-lg transition-colors ${
                    isActive
                      ? 'bg-surface-container text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.02)] border-t border-surface-container-high/40 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <div className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface text-[14px]">directions_bus</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              CampusRide Dispatch & Transit Network
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-label-md text-label-md">
            <a className="hover:text-on-surface transition-colors" href="#schedule">
              Campus Transit Schedule
            </a>
            <a className="hover:text-on-surface transition-colors" href="#map">
              Terminal Map
            </a>
            <a className="hover:text-on-surface transition-colors" href="#safety">
              Safety Guidelines
            </a>
            <a className="hover:text-on-surface transition-colors" href="#support">
              Support Desk
            </a>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 University Transit Authority. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
