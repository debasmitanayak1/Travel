import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Check, Clock, Eye, Trash2, X, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ManageInquiries = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread' | 'Read'
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/contact-submissions');
      if (res.data?.success) {
        setSubmissions(res.data.data.submissions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const toggleRead = async (id) => {
    try {
      const res = await api.patch(`/admin/contact-submissions/${id}/toggle-read`);
      if (res.data?.success) {
        setSubmissions(
          submissions.map((s) => (s.id === id ? { ...s, isRead: !s.isRead } : s))
        );
        if (selectedSub && selectedSub.id === id) {
          setSelectedSub((s) => ({ ...s, isRead: !s.isRead }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      await api.delete(`/admin/contact-submissions/${id}`);
      setSubmissions(submissions.filter((s) => s.id !== id));
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub(null);
      }
      setMsg('Inquiry deleted.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.email.toLowerCase().includes(search.toLowerCase()) ||
      sub.subject?.toLowerCase().includes(search.toLowerCase()) ||
      sub.message.toLowerCase().includes(search.toLowerCase());
    const matchesRead =
      filter === 'All' || (filter === 'Unread' ? !sub.isRead : sub.isRead);
    return matchesSearch && matchesRead;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Contact Inquiries Inbox
          </h1>
          <p className="text-slate-500 text-sm">
            Review traveler inquiries, route questions, custom planning requests, and visitor feedback.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
          <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
            {submissions.filter((s) => !s.isRead).length} Unread
          </span>
          <span className="px-3 py-1.5 bg-slate-200/70 text-slate-700 rounded-xl">
            {submissions.length} Total Messages
          </span>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold rounded-xl animate-fade-in">
          {msg}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sender, email, subject, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {['All', 'Unread', 'Read'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === item
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      {loading ? (
        <LoadingSpinner label="Loading inquiries inbox..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
          <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No inquiries match the current filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Sender Details</th>
                <th className="py-4 px-6">Subject / Topic</th>
                <th className="py-4 px-6">Received</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    !sub.isRead ? 'bg-teal-50/20 font-medium' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        sub.isRead
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {sub.isRead ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{sub.name}</p>
                    <p className="text-xs text-slate-500">{sub.email}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-800">
                    <p className="font-semibold line-clamp-1">{sub.subject || 'General Inquiry'}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{sub.message}</p>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedSub(sub);
                        if (!sub.isRead) toggleRead(sub.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-xs font-semibold text-slate-700 transition-colors"
                    >
                      Read
                    </button>
                    <button
                      onClick={() => toggleRead(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 inline-block"
                      title={sub.isRead ? 'Mark unread' : 'Mark read'}
                    >
                      <Check className={`w-4 h-4 ${sub.isRead ? 'text-teal-600' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 inline-block"
                      title="Delete inquiry"
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

      {/* VIEW MESSAGE MODAL */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Visitor Inquiry</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedSub.subject}</h3>
              </div>
              <button onClick={() => setSelectedSub(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-1">
              <p><strong className="text-slate-700">From:</strong> {selectedSub.name} ({selectedSub.email})</p>
              <p><strong className="text-slate-700">Date:</strong> {new Date(selectedSub.createdAt).toLocaleString()}</p>
            </div>

            <div className="py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</p>
              <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                {selectedSub.message}
              </p>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <a
                href={`mailto:${selectedSub.email}?subject=Re: ${encodeURIComponent(selectedSub.subject || 'TravelExplore Inquiry')}`}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>
              <button
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
