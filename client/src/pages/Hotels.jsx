import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Search, MapPin, Building, Filter } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState(0);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (starFilter > 0) params.set('starRating', starFilter);

        const res = await api.get(`/hotels?${params.toString()}`);
        if (res.data?.success) {
          setHotels(res.data.data.hotels);
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [search, starFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
          Curated Accommodations
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Boutique & Luxury Stays
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Browse verified hotels, alpine chalets, oceanfront retreats, and heritage ryokans selected for character and comfort.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hotels by name or amenities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Star Rating Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1">Rating:</span>
          {[0, 3, 4, 5].map((stars) => (
            <button
              key={stars}
              onClick={() => setStarFilter(stars)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
                starFilter === stars
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{stars === 0 ? 'All' : `${stars}★ & up`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hotels Grid */}
      {loading ? (
        <LoadingSpinner label="Loading curated hotel catalog..." />
      ) : hotels.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <Building className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No hotels match your filters</h3>
          <p className="text-xs text-slate-500">Try resetting your star rating or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all flex flex-col"
            >
              <div className="h-56 relative overflow-hidden">
                <img
                  src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 font-bold text-xs flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{hotel.starRating} Stars</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {hotel.destination && (
                    <Link
                      to={`/destinations/${hotel.destination.slug}`}
                      className="text-xs font-bold text-teal-600 hover:underline flex items-center space-x-1 mb-1"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{hotel.destination.name}, {hotel.destination.country}</span>
                    </Link>
                  )}
                  <h3 className="text-xl font-bold text-slate-900">{hotel.name}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-2">
                    {hotel.description}
                  </p>
                </div>

                {hotel.amenitiesList && hotel.amenitiesList.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenitiesList.slice(0, 3).map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {a}
                      </span>
                    ))}
                    {hotel.amenitiesList.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-medium">
                        +{hotel.amenitiesList.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Price</span>
                    <span className="text-lg font-bold text-slate-900">
                      ${hotel.pricePerNight} <span className="text-xs font-normal text-slate-500">/ night</span>
                    </span>
                  </div>
                  {hotel.destination && (
                    <Link
                      to={`/destinations/${hotel.destination.slug}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white font-semibold text-xs transition-colors"
                    >
                      Explore Area
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
