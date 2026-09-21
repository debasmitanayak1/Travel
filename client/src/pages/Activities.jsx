import React, { useState, useEffect } from 'react';
import { Compass, Clock, Award, Filter, Sparkles } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const categories = ['All', 'adventure', 'culture', 'food', 'nature', 'relaxation'];
  const difficulties = ['All', 'easy', 'moderate', 'challenging'];

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        if (difficulty !== 'All') params.set('difficulty', difficulty);

        const res = await api.get(`/activities?${params.toString()}`);
        if (res.data?.success) {
          setActivities(res.data.data.activities);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [category, difficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
          Immersive Experiences
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Things to Do & Experiences
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          From pre-dawn volcanic sunrise treks and private tea ceremonies to glacier hikes and catamaran sails.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase mr-2">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                category === c
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Difficulty Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase mr-2">Pace:</span>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3.5 py-1 rounded-xl text-xs font-medium capitalize transition-all ${
                difficulty === d
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

      </div>

      {/* Activities Grid */}
      {loading ? (
        <LoadingSpinner label="Loading activities catalog..." />
      ) : activities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Compass className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No activities match the selected category or difficulty level.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all flex flex-col"
            >
              <div className="h-52 relative overflow-hidden">
                <img
                  src={act.imageUrl || 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2'}
                  alt={act.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                  {act.category || 'Experience'}
                </div>
                {act.difficulty && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-teal-500/90 backdrop-blur-md text-slate-950 text-[10px] font-extrabold uppercase">
                    {act.difficulty}
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{act.name}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1 font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>~{act.durationHrs} Hours</span>
                  </span>
                  <span className="font-semibold text-teal-600">
                    Curated Experience
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
