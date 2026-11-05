import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { CommercialStall, PaymentStatus } from '../../../types/ops';
import { 
  Store, 
  Zap, 
  Flame, 
  Phone, 
  Search 
} from 'lucide-react';

export const StallMarketApp: React.FC = () => {
  const [stalls, setStalls] = useState<CommercialStall[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadStalls = async () => {
    const list = await opsDb.getStalls();
    setStalls(list);
  };

  useEffect(() => {
    loadStalls();
  }, []);

  const handleTogglePayment = async (stall: CommercialStall) => {
    const nextStatus: PaymentStatus = 
      stall.paymentStatus === 'paid' ? 'pending' : 
      stall.paymentStatus === 'pending' ? 'partial' : 'paid';

    await opsDb.updateStall(stall.id, { paymentStatus: nextStatus });
    loadStalls();
  };

  const handleTogglePower = async (stall: CommercialStall) => {
    await opsDb.updateStall(stall.id, { powerInspected: !stall.powerInspected });
    loadStalls();
  };

  const handleToggleFireSafety = async (stall: CommercialStall) => {
    await opsDb.updateStall(stall.id, { fireSafetyCleared: !stall.fireSafetyCleared });
    loadStalls();
  };

  const filteredStalls = stalls.filter((s) => {
    const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesSearch =
      s.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.stallNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalRentCollected = stalls.reduce((acc, s) => {
    if (s.paymentStatus === 'paid') return acc + s.rentAmount;
    if (s.paymentStatus === 'partial') return acc + s.rentAmount * 0.5;
    return acc;
  }, 0);

  const totalRentExpected = stalls.reduce((acc, s) => acc + s.rentAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-600" /> Commercial Marketplace Command
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
              Gate 4 Logistics Access
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Stalls, Eateries & Vendor Operations
          </h1>
          <p className="text-xs text-slate-500">
            Rented stalls for clothing, food, eateries, jewellery, power load allocations, and rent collection.
          </p>
        </div>

        {/* Financials & Stall Count */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Rent Collected
            </div>
            <div className="text-2xl font-black text-amber-800">
              ₹{totalRentCollected.toLocaleString()} <span className="text-xs font-semibold text-slate-400">/ ₹{totalRentExpected.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'clothing', 'food-eateries', 'jewellery', 'books-merch'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-amber-50/60 text-slate-600 hover:text-slate-900 border border-amber-200/60'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stalls..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Stalls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStalls.map((stall) => (
          <div
            key={stall.id}
            className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] hover:border-amber-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-black font-mono text-amber-900 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-300">
                  {stall.stallNumber}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border cursor-pointer ${
                    stall.paymentStatus === 'paid'
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : stall.paymentStatus === 'partial'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                  onClick={() => handleTogglePayment(stall)}
                  title="Click to cycle payment status"
                >
                  Rent: {stall.paymentStatus} (₹{stall.rentAmount.toLocaleString()})
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900">{stall.businessName}</h3>
              <p className="text-xs text-slate-500 capitalize font-medium">{stall.category.replace('-', ' ')}</p>

              {/* Vendor Contact */}
              <div className="mt-3 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900">{stall.contactPerson}</div>
                <a
                  href={`tel:${stall.phone}`}
                  className="text-amber-800 hover:text-amber-950 font-bold font-mono flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  {stall.phone}
                </a>
                <div className="text-[11px] text-slate-500">
                  Vendor Passes: <strong>{stall.vendorPassesIssued} Issued</strong>
                </div>
              </div>

              {stall.notes && (
                <p className="text-[11px] text-slate-500 italic mt-2">
                  {stall.notes}
                </p>
              )}
            </div>

            {/* Compliance Toggles */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleTogglePower(stall)}
                className={`flex-1 py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                  stall.powerInspected
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{stall.powerRequiredKw}kW {stall.powerInspected ? 'Passed' : 'Inspect'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleFireSafety(stall)}
                className={`flex-1 py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                  stall.fireSafetyCleared
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{stall.fireSafetyCleared ? 'Fire Safe' : 'Safety Check'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
