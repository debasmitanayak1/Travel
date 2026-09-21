import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, MapPin, Phone, Heart, Globe, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Travel<span className="text-teal-400">Explore</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your premier gateway to exploring earth’s most enchanting destinations. 
              Comprehensive travel intelligence, curated accommodations, local gastronomy, and immersive discovery guides.
            </p>
            <div className="pt-2 flex items-center space-x-4 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Global Discovery</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Traveler-First Content</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations" className="hover:text-teal-400 transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-teal-400 transition-colors">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-teal-400 transition-colors">
                  Curated Hotels
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-teal-400 transition-colors">
                  Things to Do
                </Link>
              </li>
              <li>
                <Link to="/guide" className="hover:text-teal-400 transition-colors">
                  Travel Guides & Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Regions */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Destinations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations/bali" className="hover:text-teal-400 transition-colors">
                  Bali, Indonesia
                </Link>
              </li>
              <li>
                <Link to="/destinations/paris" className="hover:text-teal-400 transition-colors">
                  Paris, France
                </Link>
              </li>
              <li>
                <Link to="/destinations/kyoto" className="hover:text-teal-400 transition-colors">
                  Kyoto, Japan
                </Link>
              </li>
              <li>
                <Link to="/destinations/swiss-alps" className="hover:text-teal-400 transition-colors">
                  Swiss Alps, Switzerland
                </Link>
              </li>
              <li>
                <Link to="/destinations/santorini" className="hover:text-teal-400 transition-colors">
                  Santorini, Greece
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info & Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="space-y-2 text-sm text-slate-400 mb-4">
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@travelexplore.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+1 (800) 555-VOYAGE</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>San Francisco, CA & Zurich</span>
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 text-sm font-semibold group"
            >
              <span>Send us an inquiry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TravelExplore Inc. All rights reserved. Crafted for world adventurers.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
