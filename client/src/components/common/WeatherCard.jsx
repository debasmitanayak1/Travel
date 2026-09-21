import React from 'react';
import { Sun, CloudSun, CloudRain, Snowflake, Wind, Droplets, Thermometer, Sparkles } from 'lucide-react';

export const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const renderIcon = (condition = '') => {
    const c = condition.toLowerCase();
    if (c.includes('snow') || c.includes('ice')) return <Snowflake className="w-8 h-8 text-sky-400 animate-pulse" />;
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (c.includes('cloud')) return <CloudSun className="w-8 h-8 text-amber-400" />;
    return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-teal-900/50 relative overflow-hidden">
      {/* Background ambient blur */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider font-bold text-teal-400">
              Live Climate & Weather
            </span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{weather.source === 'openweathermap_live' ? 'Live API' : 'Dynamic Model'}</span>
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-1 text-slate-100">
            {weather.city}, {weather.country}
          </h3>
          <p className="text-sm text-teal-200/80 font-medium capitalize mt-0.5">
            {weather.condition}
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
          {renderIcon(weather.condition)}
        </div>
      </div>

      {/* Main Temperature readout */}
      <div className="mt-6 flex items-baseline space-x-3">
        <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white">
          {weather.temperatureC}°
        </span>
        <span className="text-xl text-slate-400 font-semibold">
          / {weather.temperatureF}°F
        </span>
        {weather.feelsLikeC && (
          <span className="text-xs text-slate-400 ml-2">
            Feels like {weather.feelsLikeC}°C
          </span>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center space-x-2.5 bg-white/5 rounded-xl p-2.5">
          <Droplets className="w-4 h-4 text-teal-300" />
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Humidity</p>
            <p className="text-sm font-semibold text-slate-100">{weather.humidity}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 bg-white/5 rounded-xl p-2.5">
          <Wind className="w-4 h-4 text-sky-300" />
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Wind</p>
            <p className="text-sm font-semibold text-slate-100">{weather.windSpeed}</p>
          </div>
        </div>
      </div>

      {/* 3-day forecast preview if available */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          {weather.forecast.map((item, idx) => (
            <div key={idx} className="text-center">
              <span className="block text-[11px] text-slate-400 font-medium">{item.day}</span>
              <span className="font-bold text-teal-200">{item.tempC}°C</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
