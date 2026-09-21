import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Clock, MapPin, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openItineraryId, setOpenItineraryId] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/packages');
        if (res.data?.success) {
          setPackages(res.data.data.packages);
          if (res.data.data.packages.length > 0) {
            setOpenItineraryId(res.data.data.packages[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const toggleItinerary = (id) => {
    setOpenItineraryId(openItineraryId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
          Inspirational Journeys
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Curated Tour Itineraries
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Carefully structured multi-day routes with day-by-day highlight plans and transparent estimated budget guidelines.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading tour packages..." />
      ) : (
        <div className="space-y-8">
          {packages.map((pkg) => {
            const isOpen = openItineraryId === pkg.id;

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Photo & Duration */}
                  <div className="lg:col-span-4 h-64 lg:h-auto relative overflow-hidden">
                    <img
                      src={pkg.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white font-bold text-xs flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      <span>{pkg.durationDays} Days / {pkg.durationDays - 1} Nights</span>
                    </div>
                  </div>

                  {/* Overview details */}
                  <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Curated Itinerary</span>
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          Informational Blueprint
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
                        {pkg.title}
                      </h2>

                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
                        {pkg.summary}
                      </p>
                    </div>

                    {/* Pricing & Drawer Toggle */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Estimated Pricing Per Person</span>
                        <span className="text-2xl font-extrabold text-slate-900">
                          ${pkg.priceMin} – ${pkg.priceMax}{' '}
                          <span className="text-xs font-normal text-slate-500">{pkg.currency}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => toggleItinerary(pkg.id)}
                        className="px-6 py-3 rounded-2xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-semibold text-sm transition-all flex items-center justify-center space-x-2"
                      >
                        <span>{isOpen ? 'Hide Day-by-Day Plan' : 'View Day-by-Day Plan'}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>

                </div>

                {/* Day-by-Day Accordion / Drawer */}
                {isOpen && pkg.itineraryList && pkg.itineraryList.length > 0 && (
                  <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-200 space-y-4 animate-fade-in">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                      Structured Timeline ({pkg.durationDays} Days)
                    </h4>

                    <div className="relative border-l-2 border-teal-200 ml-4 pl-6 space-y-6">
                      {pkg.itineraryList.map((step) => (
                        <div key={step.day} className="relative">
                          <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center shadow">
                            {step.day}
                          </div>
                          <div>
                            <h5 className="text-base font-bold text-slate-900">{step.title}</h5>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
