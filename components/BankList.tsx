
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Search, 
  Navigation, 
  Droplets, 
  Activity, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Building
} from 'lucide-react';
import { BloodType } from '../types';
import { realtimeDb } from '../services/realtimeStore';

export const BankList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [dbState, setDbState] = useState({
    stock: realtimeDb.getStock(),
    banks: realtimeDb.getBanks()
  });

  useEffect(() => {
    const unsubscribe = realtimeDb.subscribe(() => {
      setDbState({
        stock: realtimeDb.getStock(),
        banks: realtimeDb.getBanks()
      });
    });
    return unsubscribe;
  }, []);

  const filteredBanks = dbState.banks.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Donation Hubs</h2>
        <p className="text-slate-500 font-medium">Real-time stock from verified AyushData partners.</p>
      </div>

      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search centers by city or name..."
          className="w-full pl-16 pr-6 py-5 bg-white shadow-xl shadow-slate-100 border-none rounded-[32px] focus:ring-2 focus:ring-red-500/10 font-bold transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredBanks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100">
           <Building className="w-12 h-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-bold">No centers found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBanks.map(bank => {
            // In this real-time simulation, stock is global to the system
            const relevantTypes = ['O-', 'A+', 'B+']; // Highlight key types
            
            return (
              <div key={bank.id} className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex gap-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-red-600"><Navigation /></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900">{bank.name}</h3>
                      {bank.verified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {bank.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {bank.openUntil}</span>
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {bank.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {relevantTypes.map(type => {
                    const count = dbState.stock[type] || 0;
                    return (
                      <div key={type} className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${
                        count === 0 ? 'bg-slate-50 border-slate-200 text-slate-300' :
                        count < 10 ? 'bg-red-50 border-red-600 text-red-600 animate-pulse' : 
                        count < 25 ? 'bg-orange-50 border-orange-400 text-orange-600' :
                        'bg-emerald-50 border-emerald-500 text-emerald-700'
                      }`}>
                        {type}: {count === 0 ? 'Out of Stock' : count < 10 ? 'Critical' : count < 25 ? 'Low' : 'Optimal'} ({count})
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
