import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Heart,
  DollarSign,
  Compass,
  Star,
  Utensils,
  Car,
  CheckCircle2,
  Share2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WeatherCard } from '../components/common/WeatherCard';
import { BudgetEstimator } from '../components/common/BudgetEstimator';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DestinationDetail = () => {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [destRes, weatherRes] = await Promise.all([
          api.get(`/destinations/${slug}`),
          api.get(`/weather/${slug}`).catch(() => null),
        ]);

        if (destRes.data?.success) {
          const dest = destRes.data.data.destination;
          setDestination(dest);
          if (dest.images?.length > 0) {
            setSelectedImage(dest.images[0].url);
          }
        }

        if (weatherRes?.data?.success) {
          setWeather(weatherRes.data.data.weather);
        }

        // Check if user has this in wishlist
        if (user) {
          const wishRes = await api.get('/wishlist').catch(() => null);
          if (wishRes?.data?.success) {
            const hasItem = wishRes.data.data.wishlist.some(
              (item) => item.destinationId === destRes.data.data.destination.id
            );
            setIsWishlisted(hasItem);
          }
        }
      } catch (err) {
        console.error('Error fetching destination details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug, user]);

  const handleWishlistToggle = async () => {
    if (!user) {
      setToastMsg('Please log in to save to your wishlist.');
      setTimeout(() => setToastMsg(''), 3500);
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${destination.id}`);
        setIsWishlisted(false);
        setToastMsg('Removed from your wishlist.');
      } else {
        await api.post(`/wishlist/${destination.id}`);
        setIsWishlisted(true);
        setToastMsg('Added to your wishlist!');
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
    setTimeout(() => setToastMsg(''), 3000);
  };

  if (loading) {
    return <LoadingSpinner label={`Loading destination insights for ${slug}...`} />;
  }

  if (!destination) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">Destination Not Found</h2>
        <p className="text-slate-500">The destination you requested may have been relocated or unpublished.</p>
        <Link to="/destinations" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold">
          Return to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/50 flex items-center space-x-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HERO BANNER & GALLERY */}
      <section className="relative">
        <div className="h-[420px] sm:h-[520px] w-full relative overflow-hidden bg-slate-950">
          <img
            src={selectedImage || destination.images?.[0]?.url}
            alt={destination.name}
            className="w-full h-full object-cover transition-all duration-700 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Breadcrumb & Wishlist bar */}
          <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-xs text-white/80 bg-slate-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/destinations" className="hover:text-white">Destinations</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-teal-300 font-semibold">{destination.name}</span>
            </nav>

            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-rose-500/30'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Hero text */}
          <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase">
                  {destination.continent}
                </span>
                <span className="text-teal-200 text-sm font-semibold flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{destination.country}</span>
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
                {destination.name}
              </h1>

              {destination.tagline && (
                <p className="text-base sm:text-xl text-slate-200 font-light max-w-2xl">
                  {destination.tagline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {destination.images?.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {destination.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-24 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === img.url
                      ? 'border-teal-500 scale-105 shadow-md'
                      : 'border-white/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.altText || destination.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MAIN TWO-COLUMN CONTENT LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT 2 COLUMNS: Overview, Attractions, Hotels, Food, Transport */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview & Quick Info */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                About {destination.name}
              </h2>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                {destination.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
                  <Calendar className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase font-bold text-teal-800 tracking-wider block">
                      Best Time to Visit
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {destination.bestTimeToVisit || 'Year-round travel'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <DollarSign className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                      Estimated Budget Range
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      ${destination.avgBudgetMin} – ${destination.avgBudgetMax} {destination.currency} / week
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* TOP ATTRACTIONS */}
            {destination.attractions?.length > 0 && (
              <section className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-teal-600">Must-See Sights</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
                    Top Iconic Attractions
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {destination.attractions.map((att) => (
                    <div
                      key={att.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={att.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
                          alt={att.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        {att.category && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                            {att.category}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">{att.name}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{att.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CURATED HOTELS */}
            {destination.hotels?.length > 0 && (
              <section className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-teal-600">Where to Stay</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
                    Recommended Hotels & Resorts
                  </h2>
                </div>

                <div className="space-y-5">
                  {destination.hotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start"
                    >
                      <img
                        src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                        alt={hotel.name}
                        className="w-full sm:w-52 h-44 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-slate-900">{hotel.name}</h3>
                          <div className="flex items-center space-x-1 text-amber-500">
                            {[...Array(hotel.starRating || 4)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed">{hotel.description}</p>

                        {hotel.amenitiesList && hotel.amenitiesList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {hotel.amenitiesList.map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <span className="text-slate-500 text-xs font-semibold">
                            Est. <strong className="text-slate-900 text-lg">${hotel.pricePerNight}</strong> / night
                          </span>
                          <span className="text-xs font-semibold text-teal-600">
                            Showcase Listing (No Booking)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* RESTAURANTS & GASTRONOMY */}
            {destination.restaurants?.length > 0 && (
              <section className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-teal-600">Culinary Journeys</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
                    Authentic Dining & Flavors
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {destination.restaurants.map((rest) => (
                    <div
                      key={rest.id}
                      className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4"
                    >
                      <img
                        src={rest.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}
                        alt={rest.name}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0"
                      />
                      <div>
                        <span className="text-xs font-bold text-teal-600 block">{rest.priceRange || '$$'}</span>
                        <h3 className="text-base font-bold text-slate-900">{rest.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{rest.cuisine}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* LOCAL TRANSPORTATION */}
            {destination.transportOptions?.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-teal-600">Getting Around</span>
                  <h2 className="text-2xl font-bold text-slate-900 font-display mt-1">
                    Local Transport Guide
                  </h2>
                </div>

                <div className="space-y-4">
                  {destination.transportOptions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-start space-x-3.5">
                        <Car className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{item.type}</h4>
                          <p className="text-xs text-slate-600 mt-0.5 max-w-md leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {item.estCost && (
                        <div className="text-right shrink-0 ml-4">
                          <span className="text-xs text-slate-400 block font-medium">Est. Cost</span>
                          <span className="text-sm font-bold text-slate-900">
                            ~${item.estCost} {item.currency}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* RIGHT COLUMN: Weather Widget, Budget Estimator, Map Embed */}
          <div className="space-y-8">
            
            {/* Live/Dynamic Weather */}
            {weather && <WeatherCard weather={weather} />}

            {/* Budget Estimator Widget */}
            <BudgetEstimator
              baseMin={destination.avgBudgetMin || 1000}
              baseMax={destination.avgBudgetMax || 2500}
              currency={destination.currency || 'USD'}
            />

            {/* Location Map Embed */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Destination Location</h3>
                <span className="text-xs font-semibold text-teal-600 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{destination.country}</span>
                </span>
              </div>

              <div className="h-56 rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  title={`Map of ${destination.name}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${destination.name}, ${destination.country}`
                  )}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                />
              </div>

              <p className="text-xs text-slate-500 text-center">
                Coordinates: {destination.latitude || '0.00'}, {destination.longitude || '0.00'}
              </p>
            </div>

            {/* Contact Specialist CTA */}
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
              <h4 className="text-lg font-bold">Have questions about {destination.name}?</h4>
              <p className="text-xs text-teal-200/80 leading-relaxed">
                Our destination specialists have traveled extensively across {destination.country} and can help clarify season recommendations and transit logistics.
              </p>
              <Link
                to={`/contact?subject=${encodeURIComponent(`Inquiry about ${destination.name}`)}`}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Ask a Destination Specialist</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
