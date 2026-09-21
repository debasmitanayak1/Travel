import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Bookmark, Share2 } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/guide/${slug}`);
        if (res.data?.success) {
          setArticle(res.data.data.article);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner label="Loading article..." />;
  }

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Article not found</h2>
        <Link to="/guide" className="text-teal-600 font-semibold inline-flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Travel Guide</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <Link
        to="/guide"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Travel Guide</span>
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider">
          {article.category || 'Travel Guide'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2 border-b border-slate-100 pb-4">
          <span className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Published {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>5 min read</span>
          </span>
        </div>
      </div>

      {/* Hero Image */}
      {article.coverImage && (
        <div className="h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Article Content Render */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 prose prose-slate max-w-none space-y-5 text-slate-700 leading-relaxed text-base sm:text-lg">
        {article.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-2xl font-bold font-display text-slate-900 pt-4 pb-1">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-xl font-bold text-slate-800 pt-2">
                {paragraph.replace('#### ', '')}
              </h4>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-teal-500 pl-4 py-2 bg-teal-50/50 rounded-r-2xl italic text-slate-700">
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Author / Back Footer */}
      <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
        <Link
          to="/guide"
          className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-sm transition-colors"
        >
          Explore More Articles
        </Link>
        <Link
          to="/destinations"
          className="px-5 py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 font-semibold text-sm transition-colors"
        >
          Plan a Trip
        </Link>
      </div>

    </div>
  );
};
