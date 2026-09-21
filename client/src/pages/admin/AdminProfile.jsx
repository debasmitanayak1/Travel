import React, { useState, useEffect } from 'react';
import { Shield, User, Mail, Calendar, Edit2, Check, X, LayoutDashboard, Settings, Compass, MapPin, Building, Utensils, Package, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) setEditName(user.name);
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data.stats);
        }
      } catch (e) {
        // handle err
      }
    };
    fetchStats();
  }, [user]);

  const handleSaveName = async () => {
    if (!editName.trim() || editName === user.name) {
      setIsEditing(false);
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await api.patch('/auth/me', { name: editName });
      if (res.data.success) {
        setUser(res.data.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2 block">Administration</span>
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Profile</h1>
        <p className="text-slate-500 mt-2">Manage your administrator account and view platform overview.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-amber-500 text-white font-bold text-4xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left">
          {isEditing ? (
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-bold text-slate-900 w-full max-w-xs"
                disabled={saving}
              />
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditName(user.name); }}
                disabled={saving}
                className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-slate-500 flex items-center justify-center sm:justify-start mb-4">
            <Mail className="w-4 h-4 mr-1.5" />
            {user?.email}
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1" />
              Administrator
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Joined {user ? new Date(user.createdAt).toLocaleDateString() : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Platform Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard icon={MapPin} label="Destinations" value={stats?.destinations || 0} color="teal" />
          <StatCard icon={Building} label="Hotels" value={stats?.hotels || 0} color="indigo" />
          <StatCard icon={Utensils} label="Restaurants" value={stats?.restaurants || 0} color="orange" />
          <StatCard icon={Package} label="Packages" value={stats?.packages || 0} color="purple" />
          <StatCard icon={Compass} label="Activities" value={stats?.activities || 0} color="blue" />
          <StatCard icon={Settings} label="Articles" value={stats?.articles || 0} color="emerald" />
          <StatCard icon={Users} label="Total Users" value={stats?.users || 0} color="pink" />
          <StatCard icon={MessageSquare} label="Submissions" value={stats?.submissions || 0} color="amber" />
        </div>
      </div>
      
      {/* Quick Admin Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-4">
            <Link to="/admin" className="px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold text-sm transition-colors flex items-center">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link to="/admin/users" className="px-6 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl font-semibold text-sm transition-colors flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Link>
            <Link to="/profile" className="px-6 py-2.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl font-semibold text-sm transition-colors flex items-center">
              <User className="w-4 h-4 mr-2" />
              Public Profile
            </Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    pink: 'bg-pink-50 text-pink-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900">{value}</p>
        <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
      </div>
    </div>
  );
};
