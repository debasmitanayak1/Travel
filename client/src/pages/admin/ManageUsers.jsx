import React, { useState, useEffect } from 'react';
import { Users, Shield, ShieldCheck, Trash2, Search, Heart, User, Clock } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [msg, setMsg] = useState('');

  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data?.success) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change ${targetUser.name}'s role to ${newRole}?`)) return;

    try {
      const res = await api.patch(`/admin/users/${targetUser.id}/role`, { role: newRole });
      if (res.data?.success) {
        setUsers(users.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)));
        setMsg(`Updated ${targetUser.name} to ${newRole}`);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (id === currentUser.id) {
      alert('You cannot delete your own account while logged in.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user account "${name}"? This action is permanent.`)) return;

    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data?.success) {
        setUsers(users.filter((u) => u.id !== id));
        setMsg(`Deleted user account: ${name}`);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to delete user');
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">User Accounts & RBAC</h1>
          <p className="text-slate-500 text-sm">Monitor registered travelers, review wishlist activity, and assign administrative roles.</p>
        </div>
        <div className="px-4 py-2 bg-slate-200/70 rounded-xl text-xs font-semibold text-slate-700">
          Total Users: <strong className="text-slate-900">{users.length}</strong>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold rounded-xl animate-fade-in">
          {msg}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Role:</span>
          {['All', 'USER', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                roleFilter === r
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner label="Loading user directory..." />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
          No users match the search criteria.
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">User Profile</th>
                <th className="py-4 px-6">Assigned Role</th>
                <th className="py-4 px-6">Saved Wishlist</th>
                <th className="py-4 px-6">Registered On</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const isSelf = u.id === currentUser?.id;
                const isAdmin = u.role === 'ADMIN';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 flex items-center space-x-1.5">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isAdmin
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> : <User className="w-3.5 h-3.5" />}
                        <span>{u.role}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <span className="flex items-center space-x-1 text-xs font-semibold">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                        <span>{u._count?.wishlist || 0} saved</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {!isSelf && (
                        <button
                          onClick={() => handleToggleRole(u)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            isAdmin
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isAdmin ? 'Demote to User' : 'Make Admin'}
                        </button>
                      )}
                      {!isSelf && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 inline-block"
                          title="Delete user account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
