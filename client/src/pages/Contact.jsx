import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import api from '../services/api';

export const Contact = () => {
  const [searchParams] = useSearchParams();
  const defaultSubject = searchParams.get('subject') || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: defaultSubject,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/contact', form);
      if (res.data?.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Does TravelExplore process payments or flight bookings directly?',
      a: 'TravelExplore is an independent showcase and travel discovery platform. We provide curated research, estimated budgets, and verified listings without transactional booking engines or markups.',
    },
    {
      q: 'How are the estimated budget guidelines calculated?',
      a: 'Our budget estimator synthesizes real accommodation rates, median local food/dining costs, transit averages, and regional activity entry fees to deliver realistic weekly trip estimates.',
    },
    {
      q: 'Can I save destinations for offline planning?',
      a: 'Yes! Create a free TravelExplore account and tap the heart icon on any destination to save it directly to your personal Wishlist portal.',
    },
    {
      q: 'How frequently is the destination climate information updated?',
      a: 'Our climate service synchronizes real-time atmospheric data every 30 minutes, giving you up-to-date conditions and 3-day temperature previews.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-display">
          We’re Here to Help Your Journey
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Have an inquiry, feedback on destination guides, or a custom partnership request? Drop our team a note below.
        </p>
      </div>

      {/* Main Grid: Form + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
              <h3 className="text-lg font-bold text-teal-900">Inquiry Received!</h3>
              <p className="text-sm text-teal-700">
                Thank you for reaching out. Our destination intelligence team has received your message and will respond promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Custom route advice for Kyoto"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows="5"
                  placeholder="How can we assist your travel plans?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Card & Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold font-display">Contact Intelligence</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We respond to all traveler inquiries within 24 business hours. Connect with our dedicated research desk:
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold block">Email Inquiries</span>
                  <span className="text-sm font-semibold text-slate-100">contact@travelexplore.com</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold block">Toll-Free Support</span>
                  <span className="text-sm font-semibold text-slate-100">+1 (800) 555-VOYAGE</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold block">Global Headquarters</span>
                  <span className="text-sm font-semibold text-slate-100">500 Howard Street, Suite 400, San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6 text-teal-950 space-y-2">
            <h4 className="font-bold text-sm">Are you a hotelier or tourism board?</h4>
            <p className="text-xs text-teal-800 leading-relaxed">
              To request a feature review or update destination facts in our directory, contact our editorial curation desk directly at <strong className="underline">editorial@travelexplore.com</strong>.
            </p>
          </div>
        </div>

      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto space-y-6 pt-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-teal-600">Quick Answers</span>
          <h2 className="text-3xl font-bold text-slate-900 font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between space-x-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-800">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
