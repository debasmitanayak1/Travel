import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Filter, ArrowRight, DollarSign, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialSearch = searchParams.get('search') || '';
  const initialContinent = searchParams.get('continent') || 'All';

  const [search, setSearch] = useState(initialSearch);
  const [continent, setContinent] = useState(initialContinent);
  const [sort, setSort] = useState('newest');
  const [maxBudget, setMaxBudget] = useState(5000);

  const continents = ['All', 'Asia', 'Europe', 'Africa', 'North America'];

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (continent !== 'All') params.set('continent', continent);
        if (maxBudget < 5000) params.set('maxBudget', maxBudget);
        if (sort === 'budget-asc') params.set('sort', 'budget-asc');
        if (sort === 'budget-desc') params.set('sort', 'budget-desc');

        const res = await api.get(`/destinations?${params.toString()}`);
        if (res.data?.success) {
          setDestinations(res.data.data.destinations);
        }
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [search, continent, maxBudget, sort]);

  const handleFilterChange = (newContinent) => {
    setContinent(newContinent);
    if (newContinent === 'All') {
      searchParams.delete('continent');
    } else {
      searchParams.set('continent', newContinent);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
          Curated Catalog
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Explore World Destinations
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Find your dream getaway by continent, travel style, and budget. Filter through verified sights, stays, and climate metrics.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
        
        {/* Search input + Sort dropdown */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, country or highlights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="newest">Sort: Default / Newest</option>
              <option value="budget-asc">Budget: Low to High</option>
              <option value="budget-desc">Budget: High to Low</option>
            </select>
          </div>
        </div>

        {/* Continent Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase mr-2">Region:</span>
          {continents.map((item) => (
            <button
              key={item}
              onClick={() => handleFilterChange(item)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                continent === item
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

      </div>

      {/* Destinations Grid */}
      {loading ? (
        <LoadingSpinner label="Searching destinations..." />
      ) : destinations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No destinations found</h3>
          <p className="text-slate-500 text-sm">
            Try adjusting your search keywords or clearing your continent filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setContinent('All');
              setMaxBudget(5000);
            }}
            className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col"
            >
              {/* Image & Badges */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 font-bold text-xs shadow-sm">
                    {dest.continent}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold text-teal-300 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{dest.country}</span>
                  </p>
                  <h3 className="text-2xl font-bold font-display">{dest.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                  {dest.tagline || dest.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Est. Budget</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ${dest.avgBudgetMin} – ${dest.avgBudgetMax}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block font-medium">Attractions</span>
                    <span className="font-bold text-teal-600 text-sm">
                      {dest._count?.attractions || 2}+ Highlights
                    </span>
                  </div>
                </div>

                <Link
                  to={`/destinations/${dest.slug}`}
                  className="w-full py-3 rounded-xl bg-slate-50 group-hover:bg-teal-600 text-slate-700 group-hover:text-white font-semibold text-sm transition-colors text-center flex items-center justify-center space-x-1.5"
                >
                  <span>Explore Destination</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
