import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, Sun, Compass, Star, Heart, Calendar } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, pkgRes] = await Promise.all([
          api.get('/destinations/featured'),
          api.get('/packages'),
        ]);
        if (destRes.data?.success) setFeatured(destRes.data.data.destinations);
        if (pkgRes.data?.success) setPackages(pkgRes.data.data.packages.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedContinent !== 'All') params.set('continent', selectedContinent);
    navigate(`/destinations?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center text-white overflow-hidden">
        {/* Hero Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2000&q=85"
            alt="Scenic tropical beach and turquoise ocean"
            className="w-full h-full object-cover scale-105 animate-pulse-subtle"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/50 to-slate-950/90 backdrop-blur-[2px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-12 pb-20 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover The World With Confidence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.1] text-white drop-shadow-md">
            Journey Beyond The Ordinary
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-200 font-light leading-relaxed">
            Uncover earth’s most breathtaking landscapes, historic wonders, luxury sanctuaries, and local culinary culture. 
            All in one curated discovery platform.
          </p>

          {/* Search Bar Widget */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-3xl shadow-2xl border border-white/20 text-slate-800 mt-8 flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="flex-1 flex items-center space-x-3 px-3.5 w-full">
              <Search className="w-5 h-5 text-teal-600 shrink-0" />
              <input
                type="text"
                placeholder="Where to? (e.g. Bali, Paris, Swiss Alps, Kyoto...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Continent select */}
            <div className="w-full sm:w-auto px-3.5">
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Continents</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Africa">Africa</option>
                <option value="North America">North America</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-teal-600/30 flex items-center justify-center space-x-2 transition-all shrink-0 hover:scale-[1.02]"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular quick tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Popular searches:</span>
            {['Bali', 'Paris', 'Zermatt', 'Kyoto', 'Santorini', 'Rome'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/destinations?search=${tag}`)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* STATS BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-teal-600">8+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Curated Global Gems</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">100%</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Independent Research</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-teal-600">30+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Verified Accommodations</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">24/7</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Live Climate & Itineraries</p>
          </div>
        </div>
      </div>

      {/* FEATURED DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
              World Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
              Featured Destinations
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
              Hand-picked wonderlands offering iconic culture, scenic marvels, and authentic encounters.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 mt-4 sm:mt-0 group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading featured destinations..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((dest) => (
              <div
                key={dest.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col"
              >
                {/* Image & Badges */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={dest.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                        {dest._count?.attractions || 3}+ Sights
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="w-full py-3 rounded-xl bg-slate-50 group-hover:bg-teal-600 text-slate-700 group-hover:text-white font-semibold text-sm transition-colors text-center flex items-center justify-center space-x-1.5"
                  >
                    <span>Discover Destination</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CURATED TOUR PACKAGES */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
                Inspirational Journeys
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
                Curated Travel Itineraries
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                Multi-day blueprints crafted with optimal pacing, scenic logistics, and top experiences.
              </p>
            </div>
            <Link
              to="/packages"
              className="inline-flex items-center space-x-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 mt-4 sm:mt-0 group"
            >
              <span>Explore All Packages</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={pkg.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                    alt={pkg.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>{pkg.durationDays} Days</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 hover:text-teal-600 transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                      {pkg.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold uppercase block">Est. Cost Range</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        ${pkg.priceMin} – ${pkg.priceMax}
                      </span>
                    </div>
                    <Link
                      to={`/packages`}
                      className="px-4 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white font-semibold text-xs transition-colors"
                    >
                      View Itinerary
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE TRAVELEXPLORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
            The TravelExplore Edge
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
            Built For Curious Explorers
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            No biased booking promotions or hidden fees. Just pure destination research and travel intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Live Dynamic Weather</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Plan what to pack and when to visit with real-time temperature, wind, humidity, and multi-day climate forecasting.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Sights & Stays</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Curated lists of top attractions, renowned culinary trattorias, boutique hotels, and convenient transit solutions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Budget Modeling</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Interactive cost estimator lets you calculate personalized expenses across stays, food, transit, and excursions.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight">
              Ready to Plan Your Next Adventure?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light">
              Create a free account to bookmark your favorite destinations, compare travel budgets, and craft your dream wishlist.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/destinations"
                className="w-full sm:w-auto px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all"
              >
                Browse All Destinations
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
