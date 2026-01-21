
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Activity, 
  Hospital, 
  Droplet,
  ShieldCheck
} from 'lucide-react';
import { realtimeDb } from '../services/realtimeStore';
import { UrgentRequest } from '../types';

interface RequestStatus extends UrgentRequest {
  donorsMatched: number;
  timestamp: string;
}

export const RequestTracking: React.FC<{ initialId?: string }> = ({ initialId = '' }) => {
  const [requestId, setRequestId] = useState(initialId);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<RequestStatus | null>(null);

  const performSearch = useCallback((id: string) => {
    const requests = realtimeDb.getRequests();
    const found = requests.find(r => r.id === id);
    
    if (found) {
      setResult({
        ...found,
        // In a real system, this would be computed by matching donor locations
        // Here we simulate a realistic match count based on blood rarity
        donorsMatched: found.bloodType.includes('-') ? 2 : 12, 
        timestamp: new Date().toLocaleTimeString(),
      });
    } else {
      setResult(null);
    }
  }, []);

  useEffect(() => {
    if (initialId) {
      handleSearch();
    }
  }, [initialId]);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribe = realtimeDb.subscribe(() => {
      if (requestId) {
        const requests = realtimeDb.getRequests();
        const found = requests.find(r => r.id === requestId);
        if (found) {
          setResult(prev => prev ? {
            ...found,
            donorsMatched: prev.donorsMatched,
            timestamp: prev.timestamp
          } : null);
        }
      }
    });
    return unsubscribe;
  }, [requestId]);

  const handleSearch = () => {
    if (!requestId) return;
    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
      performSearch(requestId);
    }, 800);
  };

  const getStatusStep = (status: string) => {
    const steps = ['SEARCHING', 'MATCHED', 'DISPATCHED', 'DELIVERED'];
    return steps.indexOf(status);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12 text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Track Your Request</h2>
        <p className="text-slate-500 font-medium">Real-time matching status for AyushData life-line.</p>
      </div>

      <div className="flex gap-4 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Enter Request ID (e.g., AD-XJ2A9)"
            className="w-full pl-16 pr-6 py-5 bg-white shadow-xl shadow-slate-100 border-none rounded-[32px] focus:ring-2 focus:ring-red-500/10 transition-all font-bold text-slate-800 uppercase"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="px-10 py-5 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl disabled:bg-slate-200"
        >
          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </div>

      {result ? (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="glass-card bg-white p-8 md:p-12 rounded-[40px] shadow-2xl space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-50">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Progress</p>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-slate-900">{result.id}</h3>
                  <div className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {result.status}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
                <p className="text-sm font-bold text-slate-800">{result.timestamp}</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative flex justify-between items-center px-4">
              <div className="absolute left-4 right-4 h-1 bg-slate-100 top-1/2 -translate-y-1/2 -z-10">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${(getStatusStep(result.status) / 3) * 100}%` }}
                ></div>
              </div>
              
              {[
                { label: 'Searching', icon: Search },
                { label: 'Matched', icon: UsersIcon },
                { label: 'Dispatched', icon: Clock },
                { label: 'Delivered', icon: ShieldCheck }
              ].map((step, i) => {
                const isActive = getStatusStep(result.status) >= i;
                return (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Requirement Data</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <Droplet className="w-4 h-4 text-red-500" />
                    <span>Blood Type: {result.bloodType}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <Hospital className="w-4 h-4 text-slate-400" />
                    <span>{result.hospital}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{result.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-emerald-50 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Network Activity</h4>
                <div className="space-y-2">
                  <div className="text-3xl font-black text-emerald-700">{result.donorsMatched}</div>
                  <p className="text-xs font-bold text-emerald-600 leading-relaxed">
                    Matched donors notified in your immediate vicinity. Any update from the Command Hub will reflect here instantly.
                  </p>
                </div>
              </div>
            </div>

            <button onClick={handleSearch} className="w-full py-5 border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest rounded-3xl hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center gap-3">
              Refresh Live Status <Activity className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        !isSearching && requestId && (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No active request found for this ID.</p>
          </div>
        )
      )}
    </div>
  );
};

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
