import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { Home } from './pages/Home';
import { Destinations } from './pages/Destinations';
import { DestinationDetail } from './pages/DestinationDetail';
import { Packages } from './pages/Packages';
import { Hotels } from './pages/Hotels';
import { Activities } from './pages/Activities';
import { TravelGuide } from './pages/TravelGuide';
import { ArticleDetail } from './pages/ArticleDetail';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Wishlist } from './pages/Wishlist';
import { Profile } from './pages/Profile';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProfile } from './pages/admin/AdminProfile';
import { ManageDestinations } from './pages/admin/ManageDestinations';
import { ManageHotels } from './pages/admin/ManageHotels';
import { ManageRestaurants } from './pages/admin/ManageRestaurants';
import { ManagePackages } from './pages/admin/ManagePackages';
import { ManageActivities } from './pages/admin/ManageActivities';
import { ManageArticles } from './pages/admin/ManageArticles';
import { ManageInquiries } from './pages/admin/ManageInquiries';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <ScrollToTop />
      
      {/* Hide public Navbar on Admin panel */}
      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/guide" element={<TravelGuide />} />
          <Route path="/guide/:slug" element={<ArticleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="destinations" element={<ManageDestinations />} />
            <Route path="hotels" element={<ManageHotels />} />
            <Route path="restaurants" element={<ManageRestaurants />} />
            <Route path="packages" element={<ManagePackages />} />
            <Route path="activities" element={<ManageActivities />} />
            <Route path="guide" element={<ManageArticles />} />
            <Route path="inquiries" element={<ManageInquiries />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Catch-all route */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
                <h2 className="text-4xl font-extrabold text-slate-900 font-display">404 - Page Not Found</h2>
                <p className="text-slate-500 text-sm">The route you navigated to does not exist.</p>
                <a href="/" className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-xl text-sm">
                  Back to Home
                </a>
              </div>
            }
          />
        </Routes>
      </div>

      {/* Hide public Footer on Admin panel */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
