import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Building,
  Utensils,
  Package,
  Compass,
  BookOpen,
  MessageSquare,
  Users,
  Shield,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../services/api';

export const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data?.success) {
          setUnreadCount(res.data.data.stats.unreadSubmissions || 0);
        }
      } catch (e) {
        // silent
      }
    };
    if (isAdmin) fetchUnread();
  }, [isAdmin, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner label="Verifying administrator privileges..." />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Administrator privileges required. Please sign in with an admin account.',
        }}
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Access denied. You must be signed in with an administrator account to view the admin panel.',
        }}
        replace
      />
    );
  }

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Destinations', path: '/admin/destinations', icon: MapPin },
    { name: 'Accommodations', path: '/admin/hotels', icon: Building },
    { name: 'Dining & Food', path: '/admin/restaurants', icon: Utensils },
    { name: 'Tour Packages', path: '/admin/packages', icon: Package },
    { name: 'Activities & Tours', path: '/admin/activities', icon: Compass },
    { name: 'Travel Guides', path: '/admin/guide', icon: BookOpen },
    { name: 'Inquiries Inbox', path: '/admin/inquiries', icon: MessageSquare, badge: unreadCount },
    { name: 'User Accounts', path: '/admin/users', icon: Users },
    { name: 'My Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight">TravelExplore CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:flex w-full md:w-64 bg-slate-900 text-slate-300 flex-col justify-between shrink-0 p-5 md:min-h-screen space-y-6 z-40 transition-all`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="hidden md:flex items-center space-x-3 pb-5 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base block tracking-tight">TravelExplore</span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">CMS Administration</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {links.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] shadow">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs text-slate-400 px-2">
            <p className="font-semibold text-slate-200 truncate">{user.name}</p>
            <p className="truncate text-[11px] text-slate-500">{user.email}</p>
          </div>
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-semibold text-teal-400 hover:text-teal-300 px-2 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-auto min-w-0">
        <Outlet />
      </main>

    </div>
  );
};
