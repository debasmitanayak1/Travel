import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Bookmark } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TravelGuide = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  const categories = ['All', 'packing', 'visa', 'safety'];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        const res = await api.get(`/guide?${params.toString()}`);
        if (res.data?.success) {
          setArticles(res.data.data.articles);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
          Editorial Travel Intelligence
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-display">
          The Travel Guide Journal
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Practical advice, packing frameworks, international visa policies, and safety protocols from seasoned global travelers.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all ${
              category === c
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <LoadingSpinner label="Loading articles..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col"
            >
              <div className="h-56 relative overflow-hidden">
                <img
                  src={art.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'}
                  alt={art.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                  {art.category || 'Guide'}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug hover:text-teal-600 transition-colors">
                    <Link to={`/guide/${art.slug}`}>{art.title}</Link>
                  </h3>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed line-clamp-3">
                    {art.content.replace(/[#*`_>]/g, '').slice(0, 150)}...
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>4 min read</span>
                  </span>
                  <Link
                    to={`/guide/${art.slug}`}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1 group"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
