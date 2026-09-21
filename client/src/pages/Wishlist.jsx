import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, MapPin, ArrowRight, Compass } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        if (res.data?.success) {
          setItems(res.data.data.wishlist);
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate]);

  const handleRemove = async (destinationId) => {
    try {
      await api.delete(`/wishlist/${destinationId}`);
      setItems(items.filter((item) => item.destinationId !== destinationId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
            <Heart className="w-4 h-4 text-rose-500 fill-current" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
            My Saved Wishlist
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {items.length} {items.length === 1 ? 'destination' : 'destinations'} bookmarked for your future travel plans
          </p>
        </div>

        <Link
          to="/destinations"
          className="px-5 py-2.5 bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 font-semibold rounded-2xl text-xs transition-colors self-start sm:self-auto"
        >
          Explore More Destinations
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner label="Loading your wishlist..." />
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Your wishlist is currently empty</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Explore our curated catalog and click the heart icon on any destination to save it here for future reference.
          </p>
          <Link
            to="/destinations"
            className="inline-block px-6 py-3 rounded-2xl bg-teal-600 text-white font-semibold text-sm shadow-md hover:bg-teal-700 transition-colors"
          >
            Start Exploring Destinations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(({ id, destination }) => (
            <div
              key={id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all flex flex-col"
            >
              <div className="h-60 relative overflow-hidden">
                <img
                  src={destination.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 font-bold text-xs shadow-sm">
                    {destination.continent}
                  </span>
                </div>

                <button
                  onClick={() => handleRemove(destination.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold text-teal-300 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{destination.country}</span>
                  </p>
                  <h3 className="text-2xl font-bold font-display">{destination.name}</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-slate-600 text-sm line-clamp-2">
                  {destination.tagline || destination.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Est. Budget</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ${destination.avgBudgetMin} – ${destination.avgBudgetMax}
                    </span>
                  </div>
                  <Link
                    to={`/destinations/${destination.slug}`}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1"
                  >
                    <span>View Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
