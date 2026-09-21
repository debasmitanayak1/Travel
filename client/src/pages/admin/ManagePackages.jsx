import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Calendar, Package, X, Check, Clock } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPackage, setEditPackage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  // Form State
  const initialForm = {
    title: '',
    durationDays: 7,
    priceMin: 1200,
    priceMax: 2200,
    summary: '',
    imageUrl: '',
    itinerary: [
      { day: 1, title: 'Arrival & Welcome Dinner', detail: 'Airport transfer and check-in.' },
      { day: 2, title: 'Historic Highlights & Sights', detail: 'Guided tour of prominent landmarks.' },
    ],
  };
  const [form, setForm] = useState(initialForm);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/packages');
      if (res.data?.success) {
        setPackages(res.data.data.packages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete ${title}?`)) return;
    try {
      await api.delete(`/admin/packages/${id}`);
      setPackages(packages.filter((p) => p.id !== id));
      setMsg(`Deleted ${title}`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/admin/packages', form);
      if (res.data?.success) {
        setShowModal(false);
        setForm(initialForm);
        fetchPackages();
        setMsg('Package created successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to add tour package');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put(`/admin/packages/${editPackage.id}`, editPackage);
      if (res.data?.success) {
        setEditPackage(null);
        fetchPackages();
        setMsg('Package updated successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update package');
    } finally {
      setSubmitting(false);
    }
  };

  // Itinerary step helpers for create form
  const addDayToCreateForm = () => {
    const nextDay = form.itinerary.length + 1;
    setForm({
      ...form,
      itinerary: [...form.itinerary, { day: nextDay, title: '', detail: '' }],
    });
  };

  const removeDayFromCreateForm = (index) => {
    const updated = form.itinerary.filter((_, i) => i !== index).map((step, i) => ({ ...step, day: i + 1 }));
    setForm({ ...form, itinerary: updated });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Manage Tour Packages</h1>
          <p className="text-slate-500 text-sm">Publish and edit multi-day curated itineraries with day-by-day scheduling.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tour Package</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold rounded-xl animate-fade-in">
          {msg}
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading tour packages..." />
      ) : packages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
          No tour packages created yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Package Title</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Price Range</th>
                <th className="py-4 px-6">Days Outlined</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={pkg.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                        alt={pkg.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{pkg.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{pkg.summary}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700">
                    {pkg.durationDays} Days
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    ${pkg.priceMin} – ${pkg.priceMax} {pkg.currency}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {pkg.itineraryList?.length || 0} itinerary steps
                  </td>
                  <td className="py-4 px-6 text-right space-x-1.5">
                    <button
                      onClick={() => setEditPackage(pkg)}
                      className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 inline-block"
                      title="Edit package"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 inline-block"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create Tour Package</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Majestic Nordic Fjords Explorer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Min Price ($)</label>
                  <input
                    type="number"
                    value={form.priceMin}
                    onChange={(e) => setForm({ ...form, priceMin: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    value={form.priceMax}
                    onChange={(e) => setForm({ ...form, priceMax: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Summary Hook</label>
                <textarea
                  rows="2"
                  placeholder="Short description of the highlights..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              {/* Day-by-day Itinerary Builder */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Day-by-Day Itinerary Builder</span>
                  <button
                    type="button"
                    onClick={addDayToCreateForm}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {form.itinerary.map((step, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-800">Day {step.day}</span>
                        {form.itinerary.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDayFromCreateForm(idx)}
                            className="text-rose-500 hover:text-rose-700 text-[10px] font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Day highlight title"
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...form.itinerary];
                          updated[idx].title = e.target.value;
                          setForm({ ...form, itinerary: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Details & activities"
                        value={step.detail}
                        onChange={(e) => {
                          const updated = [...form.itinerary];
                          updated[idx].detail = e.target.value;
                          setForm({ ...form, itinerary: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow"
                >
                  {submitting ? 'Creating...' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editPackage && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Update Itinerary</span>
                <h3 className="text-lg font-bold text-slate-900">{editPackage.title}</h3>
              </div>
              <button onClick={() => setEditPackage(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={editPackage.title}
                  onChange={(e) => setEditPackage({ ...editPackage, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={editPackage.durationDays}
                    onChange={(e) => setEditPackage({ ...editPackage, durationDays: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Min Price ($)</label>
                  <input
                    type="number"
                    value={editPackage.priceMin || 0}
                    onChange={(e) => setEditPackage({ ...editPackage, priceMin: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    value={editPackage.priceMax || 0}
                    onChange={(e) => setEditPackage({ ...editPackage, priceMax: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Summary Hook</label>
                <textarea
                  rows="2"
                  value={editPackage.summary || ''}
                  onChange={(e) => setEditPackage({ ...editPackage, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Photo URL</label>
                <input
                  type="url"
                  value={editPackage.imageUrl || ''}
                  onChange={(e) => setEditPackage({ ...editPackage, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditPackage(null)}
                  className="px-4 py-2 border rounded-xl text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow"
                >
                  {submitting ? 'Saving...' : 'Update Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
