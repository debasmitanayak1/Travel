import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  Globe,
  Clock,
  ChevronRight,
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentSubs, setRecentSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, subsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/contact-submissions'),
        ]);

        if (statsRes.data?.success) {
          setStats(statsRes.data.data.stats);
        }
        if (subsRes.data?.success) {
          setRecentSubs(subsRes.data.data.submissions.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Compiling administrative metrics..." />;
  }

  const statCards = [
    { label: 'Destinations', val: stats?.destinations || 0, icon: MapPin, color: 'text-teal-600', bg: 'bg-teal-50', link: '/admin/destinations' },
    { label: 'Accommodations', val: stats?.hotels || 0, icon: Building, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/hotels' },
    { label: 'Dining / Restaurants', val: stats?.restaurants || 0, icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/restaurants' },
    { label: 'Tour Packages', val: stats?.packages || 0, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/packages' },
    { label: 'Activities & Tours', val: stats?.activities || 0, icon: Compass, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/activities' },
    { label: 'Travel Guides', val: stats?.articles || 0, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/guide' },
    { label: 'Inquiries Received', val: stats?.submissions || 0, unread: stats?.unreadSubmissions || 0, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50', link: '/admin/inquiries' },
    { label: 'Registered Users', val: stats?.users || 0, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50', link: '/admin/users' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-1">
            Administration Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete management over travel destinations, catalog listings, content, and traveler communications.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-teal-500 shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <span>View Live Site</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-slate-900">{card.val}</span>
                {card.unread > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {card.unread} new
                  </span>
                )}
              </div>
              <span className="block text-xs font-semibold text-slate-500 mt-1">{card.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Continents Breakdown & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Continental Distribution */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-teal-600" />
              <span>Regional Coverage</span>
            </h2>
            <Link to="/admin/destinations" className="text-xs font-semibold text-teal-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats?.destinationsByContinent?.map((item) => (
              <div key={item.continent} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{item.continent}</span>
                <span className="text-xl font-black text-slate-900">{item._count.id}</span>
                <span className="text-[11px] text-teal-600 font-medium block">Destinations</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fast Action Shortcuts */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-amber-600" />
            <span>Publish New Content</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/destinations"
              className="p-3.5 rounded-2xl bg-teal-50/60 hover:bg-teal-50 border border-teal-200/60 text-teal-900 transition-colors flex items-center space-x-2.5"
            >
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold truncate">New Destination</p>
                <p className="text-[10px] text-teal-700">Guide & Sights</p>
              </div>
            </Link>

            <Link
              to="/admin/hotels"
              className="p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-50 border border-blue-200/60 text-blue-900 transition-colors flex items-center space-x-2.5"
            >
              <Building className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold truncate">New Hotel</p>
                <p className="text-[10px] text-blue-700">Add Stay</p>
              </div>
            </Link>

            <Link
              to="/admin/restaurants"
              className="p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/60 text-emerald-900 transition-colors flex items-center space-x-2.5"
            >
              <Utensils className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold truncate">New Dining</p>
                <p className="text-[10px] text-emerald-700">Add Restaurant</p>
              </div>
            </Link>

            <Link
              to="/admin/guide"
              className="p-3.5 rounded-2xl bg-purple-50/60 hover:bg-purple-50 border border-purple-200/60 text-purple-900 transition-colors flex items-center space-x-2.5"
            >
              <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold truncate">Write Article</p>
                <p className="text-[10px] text-purple-700">Travel Journal</p>
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Contact Inquiries Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Visitor Inquiries</h2>
          </div>
          <Link to="/admin/inquiries" className="text-xs font-semibold text-teal-600 hover:underline flex items-center space-x-1">
            <span>Go to Inbox</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSubs.length === 0 ? (
          <p className="text-slate-400 text-xs py-4 text-center">No visitor inquiries received yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentSubs.map((sub) => (
              <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <span
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                      sub.isRead ? 'bg-slate-300' : 'bg-rose-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{sub.subject || 'General Inquiry'}</p>
                    <p className="text-xs text-slate-500">From {sub.name} ({sub.email})</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to="/admin/inquiries"
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
