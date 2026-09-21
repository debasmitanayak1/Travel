import React, { useState } from 'react';
import { DollarSign, Users, Calendar, Sparkles, PieChart } from 'lucide-react';

export const BudgetEstimator = ({ baseMin = 1000, baseMax = 2500, currency = 'USD' }) => {
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [tier, setTier] = useState('standard'); // 'budget' | 'standard' | 'luxury'

  const tierMultipliers = {
    budget: 0.7,
    standard: 1.0,
    luxury: 2.1,
  };

  const dailyBase = (baseMin + baseMax) / 2 / 7;
  const multiplier = tierMultipliers[tier];
  
  const totalPerPerson = Math.round(dailyBase * days * multiplier);
  const grandTotal = Math.round(totalPerPerson * travelers);

  // Categorical breakdown
  const stayCost = Math.round(grandTotal * 0.45);
  const foodCost = Math.round(grandTotal * 0.25);
  const transportCost = Math.round(grandTotal * 0.15);
  const activitiesCost = Math.round(grandTotal * 0.15);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Trip Cost Planner
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Interactive Budget Estimator
          </h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Days */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <label className="flex items-center text-xs font-semibold text-slate-500 mb-1.5">
            <Calendar className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Duration: <span className="ml-1 text-slate-900 font-bold">{days} Days</span>
          </label>
          <input
            type="range"
            min="2"
            max="21"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        {/* Travelers */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <label className="flex items-center text-xs font-semibold text-slate-500 mb-1.5">
            <Users className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Travelers: <span className="ml-1 text-slate-900 font-bold">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        {/* Travel Style */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <label className="flex items-center text-xs font-semibold text-slate-500 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Travel Style
          </label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
          >
            <option value="budget">Backpacker / Budget</option>
            <option value="standard">Comfort / Standard</option>
            <option value="luxury">Luxury / 5-Star</option>
          </select>
        </div>
      </div>

      {/* Calculated Total Display */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-teal-200 uppercase tracking-wider font-semibold">
            Estimated Total ({travelers} travelers, {days} days)
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-0.5">
            ${grandTotal.toLocaleString()} <span className="text-sm font-normal text-teal-300">{currency}</span>
          </p>
        </div>
        <div className="text-xs sm:text-right text-slate-300">
          <p className="font-semibold text-white">~${Math.round(grandTotal / days / travelers)} / person / day</p>
          <p className="text-[11px] text-teal-300/80 mt-0.5">Excludes international roundtrip airfare</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Accommodations</span>
          <span className="text-base font-bold text-slate-900">${stayCost.toLocaleString()}</span>
          <span className="text-[10px] text-teal-600 block font-medium">45% of total</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Food & Dining</span>
          <span className="text-base font-bold text-slate-900">${foodCost.toLocaleString()}</span>
          <span className="text-[10px] text-teal-600 block font-medium">25% of total</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Local Transit</span>
          <span className="text-base font-bold text-slate-900">${transportCost.toLocaleString()}</span>
          <span className="text-[10px] text-teal-600 block font-medium">15% of total</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Activities & Passes</span>
          <span className="text-base font-bold text-slate-900">${activitiesCost.toLocaleString()}</span>
          <span className="text-[10px] text-teal-600 block font-medium">15% of total</span>
        </div>
      </div>
    </div>
  );
};
