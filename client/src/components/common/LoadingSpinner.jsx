import React from 'react';
import { Compass } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading amazing destinations...' }) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin"></div>
        <Compass className="w-7 h-7 text-teal-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">{label}</p>
    </div>
  );
};
