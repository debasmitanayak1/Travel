import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Layers,
  MapPin,
  X,
  ExternalLink,
  Search,
  Check,
  Image as ImageIcon,
  Compass,
  Utensils,
  Car,
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ManageDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [continentFilter, setContinentFilter] = useState('All');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editDestination, setEditDestination] = useState(null);
  const [subEntityManager, setSubEntityManager] = useState(null); // destination object
  const [activeSubTab, setActiveSubTab] = useState('attractions'); // 'attractions' | 'restaurants' | 'transport' | 'images'

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  // Create Form State
  const initialForm = {
    name: '',
    country: '',
    continent: 'Asia',
    tagline: '',
    description: '',
    bestTimeToVisit: '',
    avgBudgetMin: 1000,
    avgBudgetMax: 2500,
    imageUrl: '',
    latitude: '',
    longitude: '',
  };
  const [form, setForm] = useState(initialForm);

  // Sub-entity Form States
  const [newAttraction, setNewAttraction] = useState({ name: '', description: '', category: 'culture', imageUrl: '' });
  const [newRestaurant, setNewRestaurant] = useState({ name: '', cuisine: '', priceRange: '$$', imageUrl: '' });
  const [newTransport, setNewTransport] = useState({ type: '', description: '', estCost: 15 });
  const [newImage, setNewImage] = useState({ url: '', altText: '' });

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/destinations');
      if (res.data?.success) {
        setDestinations(res.data.data.destinations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will remove all associated hotels, sights, and restaurants.`)) return;
    try {
      await api.delete(`/admin/destinations/${id}`);
      setDestinations(destinations.filter((d) => d.id !== id));
      setMsg(`Deleted ${name}`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Create Destination
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/admin/destinations', form);
      if (res.data?.success) {
        setShowCreateModal(false);
        setForm(initialForm);
        fetchDestinations();
        setMsg('Destination created successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to create destination');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Destination
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put(`/admin/destinations/${editDestination.id}`, editDestination);
      if (res.data?.success) {
        setEditDestination(null);
        fetchDestinations();
        setMsg('Destination updated successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update destination');
    } finally {
      setSubmitting(false);
    }
  };

  // Sub-Entity: Add Attraction
  const handleAddAttraction = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/attractions', {
        ...newAttraction,
        destinationId: subEntityManager.id,
      });
      if (res.data?.success) {
        const added = res.data.data.attraction;
        setSubEntityManager({
          ...subEntityManager,
          attractions: [...(subEntityManager.attractions || []), added],
        });
        setNewAttraction({ name: '', description: '', category: 'culture', imageUrl: '' });
        fetchDestinations();
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to add attraction');
    }
  };

  const handleDeleteAttraction = async (id) => {
    try {
      await api.delete(`/admin/attractions/${id}`);
      setSubEntityManager({
        ...subEntityManager,
        attractions: subEntityManager.attractions.filter((a) => a.id !== id),
      });
      fetchDestinations();
    } catch (err) {
      console.error(err);
    }
  };

  // Sub-Entity: Add Restaurant
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/restaurants', {
        ...newRestaurant,
        destinationId: subEntityManager.id,
      });
      if (res.data?.success) {
        const added = res.data.data.restaurant;
        setSubEntityManager({
          ...subEntityManager,
          restaurants: [...(subEntityManager.restaurants || []), added],
        });
        setNewRestaurant({ name: '', cuisine: '', priceRange: '$$', imageUrl: '' });
        fetchDestinations();
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to add restaurant');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      await api.delete(`/admin/restaurants/${id}`);
      setSubEntityManager({
        ...subEntityManager,
        restaurants: subEntityManager.restaurants.filter((r) => r.id !== id),
      });
      fetchDestinations();
    } catch (err) {
      console.error(err);
    }
  };

  // Sub-Entity: Add Transport
  const handleAddTransport = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/transport', {
        ...newTransport,
        destinationId: subEntityManager.id,
      });
      if (res.data?.success) {
        const added = res.data.data.transport;
        setSubEntityManager({
          ...subEntityManager,
          transportOptions: [...(subEntityManager.transportOptions || []), added],
        });
        setNewTransport({ type: '', description: '', estCost: 15 });
        fetchDestinations();
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to add transport');
    }
  };

  const handleDeleteTransport = async (id) => {
    try {
      await api.delete(`/admin/transport/${id}`);
      setSubEntityManager({
        ...subEntityManager,
        transportOptions: subEntityManager.transportOptions.filter((t) => t.id !== id),
      });
      fetchDestinations();
    } catch (err) {
      console.error(err);
    }
  };

  // Sub-Entity: Add Image
  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/destination-images', {
        ...newImage,
        destinationId: subEntityManager.id,
      });
      if (res.data?.success) {
        const added = res.data.data.image;
        setSubEntityManager({
          ...subEntityManager,
          images: [...(subEntityManager.images || []), added],
        });
        setNewImage({ url: '', altText: '' });
        fetchDestinations();
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to add image');
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await api.delete(`/admin/destination-images/${id}`);
      setSubEntityManager({
        ...subEntityManager,
        images: subEntityManager.images.filter((img) => img.id !== id),
      });
      fetchDestinations();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering
  const filtered = destinations.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase());
    const matchesContinent = continentFilter === 'All' || d.continent === continentFilter;
    return matchesSearch && matchesContinent;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Manage Destinations
          </h1>
          <p className="text-slate-500 text-sm">
            Create and edit destination guides, coordinates, photo galleries, sights, and transit options.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
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
            placeholder="Search destinations by name or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Asia', 'Europe', 'Africa', 'North America'].map((cont) => (
            <button
              key={cont}
              onClick={() => setContinentFilter(cont)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                continentFilter === cont
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cont}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner label="Loading destinations inventory..." />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
          No destinations match the current filters.
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Region</th>
                <th className="py-4 px-6">Est. Budget</th>
                <th className="py-4 px-6">Sub-Entities</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={d.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
                        alt={d.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{d.name}</p>
                        <p className="text-xs text-slate-500">{d.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      {d.continent}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    ${d.avgBudgetMin} – ${d.avgBudgetMax} {d.currency}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSubEntityManager(d)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-colors"
                      title="Manage sights, dining, transit, and photos"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>
                        {d._count?.attractions || 0} Sights • {d._count?.restaurants || 0} Dining • {d._count?.hotels || 0} Stays
                      </span>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1.5">
                    <button
                      onClick={() => setEditDestination(d)}
                      className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 inline-block"
                      title="Edit Destination details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`/destinations/${d.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 inline-block"
                      title="Preview public page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(d.id, d.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 inline-block"
                      title="Delete destination"
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

      {/* MODAL 1: CREATE DESTINATION */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900 font-display">Add New Destination</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Destination Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barcelona"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spain"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Continent *</label>
                  <select
                    value={form.continent}
                    onChange={(e) => setForm({ ...form, continent: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Africa">Africa</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Oceania">Oceania</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Best Time to Visit</label>
                  <input
                    type="text"
                    placeholder="e.g. May to October"
                    value={form.bestTimeToVisit}
                    onChange={(e) => setForm({ ...form, bestTimeToVisit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Gothic architecture, Mediterranean beaches, and tapas"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Comprehensive destination overview..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Avg Budget Min ($)</label>
                  <input
                    type="number"
                    value={form.avgBudgetMin}
                    onChange={(e) => setForm({ ...form, avgBudgetMin: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Avg Budget Max ($)</label>
                  <input
                    type="number"
                    value={form.avgBudgetMax}
                    onChange={(e) => setForm({ ...form, avgBudgetMax: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT DESTINATION */}
      {editDestination && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Update Entity</span>
                <h3 className="text-xl font-bold text-slate-900 font-display">Edit {editDestination.name}</h3>
              </div>
              <button onClick={() => setEditDestination(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    value={editDestination.name}
                    onChange={(e) => setEditDestination({ ...editDestination, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={editDestination.country}
                    onChange={(e) => setEditDestination({ ...editDestination, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Continent</label>
                  <select
                    value={editDestination.continent}
                    onChange={(e) => setEditDestination({ ...editDestination, continent: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Africa">Africa</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Oceania">Oceania</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Best Time to Visit</label>
                  <input
                    type="text"
                    value={editDestination.bestTimeToVisit || ''}
                    onChange={(e) => setEditDestination({ ...editDestination, bestTimeToVisit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={editDestination.tagline || ''}
                  onChange={(e) => setEditDestination({ ...editDestination, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editDestination.description || ''}
                  onChange={(e) => setEditDestination({ ...editDestination, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Avg Budget Min ($)</label>
                  <input
                    type="number"
                    value={editDestination.avgBudgetMin || 0}
                    onChange={(e) => setEditDestination({ ...editDestination, avgBudgetMin: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Avg Budget Max ($)</label>
                  <input
                    type="number"
                    value={editDestination.avgBudgetMax || 0}
                    onChange={(e) => setEditDestination({ ...editDestination, avgBudgetMax: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editDestination.latitude || ''}
                    onChange={(e) => setEditDestination({ ...editDestination, latitude: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editDestination.longitude || ''}
                    onChange={(e) => setEditDestination({ ...editDestination, longitude: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedToggle"
                  checked={editDestination.isPublished}
                  onChange={(e) => setEditDestination({ ...editDestination, isPublished: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="publishedToggle" className="text-xs font-bold text-slate-700">
                  Published (Visible to public visitors)
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditDestination(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SUB-ENTITY MANAGER (Attractions, Restaurants, Transport, Images) */}
      {subEntityManager && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Sub-Entities Manager</span>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {subEntityManager.name}, {subEntityManager.country}
                </h3>
              </div>
              <button onClick={() => setSubEntityManager(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setActiveSubTab('attractions')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeSubTab === 'attractions' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Attractions ({subEntityManager.attractions?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('restaurants')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeSubTab === 'restaurants' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Dining ({subEntityManager.restaurants?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('transport')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeSubTab === 'transport' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Transit ({subEntityManager.transportOptions?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('images')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeSubTab === 'images' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gallery ({subEntityManager.images?.length || 0})</span>
              </button>
            </div>

            {/* TAB 1: ATTRACTIONS */}
            {activeSubTab === 'attractions' && (
              <div className="space-y-6">
                <form onSubmit={handleAddAttraction} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-700">Add New Attraction</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Attraction name"
                      value={newAttraction.name}
                      onChange={(e) => setNewAttraction({ ...newAttraction, name: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <select
                      value={newAttraction.category}
                      onChange={(e) => setNewAttraction({ ...newAttraction, category: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="culture">Culture / Heritage</option>
                      <option value="nature">Nature / Park</option>
                      <option value="landmark">Landmark / Monument</option>
                      <option value="adventure">Adventure</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Short description"
                    value={newAttraction.description}
                    onChange={(e) => setNewAttraction({ ...newAttraction, description: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={newAttraction.imageUrl}
                      onChange={(e) => setNewAttraction({ ...newAttraction, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold">
                      Add
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {subEntityManager.attractions?.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center space-x-3">
                        {att.imageUrl && <img src={att.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <p className="text-xs font-bold text-slate-800">{att.name}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{att.description}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteAttraction(att.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: RESTAURANTS */}
            {activeSubTab === 'restaurants' && (
              <div className="space-y-6">
                <form onSubmit={handleAddRestaurant} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-700">Add New Dining Venue</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Restaurant name"
                      value={newRestaurant.name}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Cuisine style"
                      value={newRestaurant.cuisine}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <select
                      value={newRestaurant.priceRange}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, priceRange: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="$">$ (Budget)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Fine Dining)</option>
                      <option value="$$$$">$$$$ (Michelin / Luxury)</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Photo URL"
                      value={newRestaurant.imageUrl}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold">
                      Add
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {subEntityManager.restaurants?.map((rest) => (
                    <div key={rest.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center space-x-3">
                        {rest.imageUrl && <img src={rest.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <p className="text-xs font-bold text-slate-800">{rest.name} ({rest.priceRange})</p>
                          <p className="text-[11px] text-slate-500">{rest.cuisine}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteRestaurant(rest.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TRANSPORT */}
            {activeSubTab === 'transport' && (
              <div className="space-y-6">
                <form onSubmit={handleAddTransport} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-700">Add Transit Option</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Type (e.g. Metro Pass, Scooter Rental)"
                      value={newTransport.type}
                      onChange={(e) => setNewTransport({ ...newTransport, type: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Est Cost ($)"
                      value={newTransport.estCost}
                      onChange={(e) => setNewTransport({ ...newTransport, estCost: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Description & advice"
                      value={newTransport.description}
                      onChange={(e) => setNewTransport({ ...newTransport, description: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold">
                      Add
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {subEntityManager.transportOptions?.map((tr) => (
                    <div key={tr.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{tr.type} — ~${tr.estCost}</p>
                        <p className="text-[11px] text-slate-500">{tr.description}</p>
                      </div>
                      <button onClick={() => handleDeleteTransport(tr.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: IMAGES */}
            {activeSubTab === 'images' && (
              <div className="space-y-6">
                <form onSubmit={handleAddImage} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-700">Add Photo to Gallery</h4>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      placeholder="Image URL"
                      value={newImage.url}
                      onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Caption / Alt Text"
                      value={newImage.altText}
                      onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })}
                      className="w-48 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold">
                      Add
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {subEntityManager.images?.map((img) => (
                    <div key={img.id} className="relative rounded-xl overflow-hidden border border-slate-200 group h-28">
                      <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
