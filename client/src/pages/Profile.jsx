import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Calendar, Mail, Shield, Edit2, Check, X, Compass, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Profile = () => {
  const { user, setUser, loading, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (user) {
      setEditName(user.name);
    }
  }, [user, loading, navigate]);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-2 block">My Account</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display">User Profile</h1>
        <p className="text-slate-500 mt-2">Manage your account settings and preferences.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-teal-600 text-white font-bold text-4xl flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left">
          {isEditing ? (
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg font-bold text-slate-900 w-full max-w-xs"
                disabled={saving}
              />
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
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
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-slate-500 flex items-center justify-center sm:justify-start mb-4">
            <Mail className="w-4 h-4 mr-1.5" />
            {user.email}
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center">
              <User className="w-3.5 h-3.5 mr-1" />
              {user.role}
            </span>
            {isAdmin && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1" />
                Admin Privileges
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
            <p className="font-semibold text-slate-900">
              {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Items</p>
            <p className="font-semibold text-slate-900">
              {user._count?.wishlist || 0} destinations
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/wishlist" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-teal-600">My Wishlist</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link to="/destinations" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-teal-600">Explore Destinations</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center justify-between p-4 rounded-2xl border border-amber-100 bg-amber-50/50 hover:border-amber-300 hover:shadow-md transition-all group sm:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-medium text-amber-900">Admin Dashboard</span>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
