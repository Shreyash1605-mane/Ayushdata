
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Droplet, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  History, 
  Zap, 
  Heart,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Share2,
  Printer,
  Navigation,
  Activity,
  Award,
  ChevronDown,
  ChevronUp,
  Building,
  Info
} from 'lucide-react';
import { RegisteredUser, realtimeDb, PastDonation } from '../services/realtimeStore';
import { DonationType } from '../types';

interface DonorDashboardProps {
  user: RegisteredUser;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ user }) => {
  const [dbUser, setDbUser] = useState<RegisteredUser>(user);
  const [eligibility, setEligibility] = useState({ ready: true, daysLeft: 0, percentage: 100 });
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = realtimeDb.subscribe(() => {
      // Find updated user data from local storage/db
      const state = realtimeDb.getState();
      const updated = state.users.find((u: RegisteredUser) => u.mobile === user.mobile);
      if (updated) setDbUser(updated);
    });
    return unsubscribe;
  }, [user.mobile]);

  useEffect(() => {
    if (dbUser.history && dbUser.history.length > 0) {
      const lastDonation = new Date(dbUser.history[0].date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Assume 56 days for Whole Blood cooldown
      const cooldown = 56;
      if (diffDays < cooldown) {
        setEligibility({
          ready: false,
          daysLeft: cooldown - diffDays,
          percentage: Math.min(100, (diffDays / cooldown) * 100)
        });
      }
    }
  }, [dbUser.history]);

  const handlePrint = () => {
    window.print();
  };

  const getImpactMessage = () => {
    const count = dbUser.history?.length || 0;
    if (count === 0) return "Ready to make your first impact?";
    if (count < 5) return "You're a rising life-saver!";
    return "An elite veteran of the life network.";
  };

  const visibleHistory = isHistoryExpanded 
    ? dbUser.history 
    : dbUser.history?.slice(0, 3);

  const hasMoreHistory = (dbUser.history?.length || 0) > 3;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 no-print">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100">
            <ShieldCheck className="w-3 h-3" /> Verified Network Hero
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Greetings, <span className="text-red-600">{dbUser.name.split(' ')[0]}</span>.
          </h2>
          <p className="text-slate-500 font-medium max-w-md">{getImpactMessage()}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={handlePrint} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all text-slate-400 hover:text-red-600 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
            <Printer className="w-4 h-4" /> Export ID Card
          </button>
          <div className="px-6 py-4 bg-slate-900 text-white rounded-[32px] shadow-2xl flex items-center gap-4">
             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-red-500" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Hero Rank</p>
                <p className="text-sm font-black mt-1">Level {(dbUser.history?.length || 0) + 1}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 no-print">
        {/* Eligibility Card */}
        <div className="glass-card bg-white p-8 rounded-[40px] shadow-sm space-y-8 border border-slate-50">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Activity className="w-4 h-4 text-red-600" /> Readiness Status
           </h3>
           
           <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  className={eligibility.ready ? "text-emerald-500" : "text-red-600"}
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * eligibility.percentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-3xl font-black text-slate-900">{Math.round(eligibility.percentage)}%</span>
                 <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Recovery</span>
              </div>
           </div>

           <div className="p-6 bg-slate-50 rounded-3xl space-y-2 text-center">
              {eligibility.ready ? (
                <>
                  <p className="text-emerald-600 font-black text-xs uppercase tracking-widest">System Ready</p>
                  <p className="text-[10px] text-slate-400 font-bold italic">You are eligible to donate today!</p>
                </>
              ) : (
                <>
                  <p className="text-red-600 font-black text-xs uppercase tracking-widest">{eligibility.daysLeft} Days to Ready</p>
                  <p className="text-[10px] text-slate-400 font-bold italic">Allowing your system to fully regenerate.</p>
                </>
              )}
           </div>
        </div>

        {/* History Timeline Card */}
        <div className="lg:col-span-2 glass-card bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 overflow-hidden relative">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-red-600" /> Donation Timeline
              </h3>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-slate-50 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">Total: {dbUser.history?.length || 0} Impact(s)</div>
              </div>
           </div>

           {!dbUser.history || dbUser.history.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-slate-100 rounded-3xl">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <Droplet className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-400">Your impact journey is about to begin.</p>
             </div>
           ) : (
             <div className="space-y-6 relative pb-4">
                {/* Visual Line */}
                <div className="absolute left-6 top-2 bottom-20 w-1 bg-slate-50 rounded-full -z-0"></div>
                
                {visibleHistory?.map((item, i) => (
                  <div key={i} className="flex gap-10 relative animate-in slide-in-from-top-4 duration-300">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-transform hover:scale-110 shadow-lg ${
                      item.type === DonationType.BLOOD ? 'bg-red-600 text-white' : 
                      item.type === DonationType.STEM_CELL ? 'bg-slate-900 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div className="flex-1 bg-slate-50/50 p-6 rounded-[28px] border border-slate-100 hover:border-red-100 transition-all group relative">
                       <div className="flex justify-between items-start mb-2">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Impact Type</p>
                            <h4 className="font-black text-slate-900 group-hover:text-red-600 transition-colors flex items-center gap-2">
                                {item.type.replace('_', ' ')}
                                <div title={`${item.date} at ${item.time || '10:00 AM'}`} className="cursor-help">
                                    <Info className="w-3 h-3 text-slate-300 hover:text-slate-900" />
                                </div>
                            </h4>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Impact Date</p>
                             <p className="text-xs font-bold text-slate-700">{item.date}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-500">
                          <Building className="w-3 h-3 text-red-500" />
                          <span className="uppercase tracking-widest">{item.location || 'Verified Network Partner'}</span>
                       </div>
                    </div>
                  </div>
                ))}

                {hasMoreHistory && (
                  <div className="pl-20 pt-4">
                    <button 
                      onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors group/btn"
                    >
                      {isHistoryExpanded ? (
                        <>Show Less <ChevronUp className="w-3 h-3 group-hover/btn:-translate-y-0.5 transition-transform" /></>
                      ) : (
                        <>View All History <ChevronDown className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" /></>
                      )}
                    </button>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      {/* Mini Card Preview */}
      <div className="no-print">
         <div className="bg-slate-900 rounded-[56px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <ShieldCheck className="w-80 h-80" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black italic tracking-tight">Your Hero Card</h3>
                    <p className="text-slate-400 font-medium max-w-sm">This is your digital health identity. Keep it handy for verified check-ins at any network hub.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <MapPin className="w-5 h-5 text-red-500 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase">Registered City</p>
                        <p className="text-sm font-black">{dbUser.location || 'Not Set'}</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <Droplet className="w-5 h-5 text-red-500 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase">Genotype</p>
                        <p className="text-sm font-black">{dbUser.bloodType}</p>
                     </div>
                  </div>
               </div>

               <div id="print-area" className="bg-white rounded-[40px] p-10 text-slate-900 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 scale-90 md:scale-100">
                  <div className="flex justify-between items-start mb-10">
                     <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-xl">
                          <Droplet className="w-6 h-6 text-red-500 fill-red-500" />
                        </div>
                        <div>
                          <span className="text-sm font-black text-slate-900 tracking-tighter block leading-none uppercase">AyushData</span>
                          <span className="text-[8px] font-black text-red-600 uppercase tracking-widest mt-1 block">Life Network ID</span>
                        </div>
                     </div>
                     <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-red-200">
                        {dbUser.bloodType}
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Hero</p>
                        <p className="text-2xl font-black">{dbUser.name}</p>
                     </div>
                     <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Donor Serial</p>
                          <p className="text-lg font-black tracking-tighter tabular-nums">{dbUser.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-1 rounded">Status: Active</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
