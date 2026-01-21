
import React from 'react';
import { Droplets, Heart, UserPlus, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onLearn: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart, onLearn }) => {
  return (
    <div className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-left-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
                LIVE: 142 donors active in your city
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.9]">
                Every drop <br />
                <span className="text-red-600 italic">defines</span> life.
              </h1>
              
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                AyushData is an AI-orchestrated ecosystem bridging the gap between donors, hospitals, and life. Register once, save lives forever.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={onStart}
                className="group relative w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200"
              >
                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" /> Start Your Journey
                </div>
              </button>
              
              <button 
                onClick={onLearn}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-100 hover:border-red-100 hover:text-red-600 transition-all flex items-center justify-center gap-2"
              >
                Learn PBSC Donation <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-8 border-t border-slate-100">
              <div>
                <div className="text-3xl font-black text-slate-900">4.8k</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lives Impacted</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">12s</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Match Time</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">100%</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Banks</div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="animate-float">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
                alt="AyushData Healthcare" 
                className="rounded-[40px] shadow-2xl border-[12px] border-white relative z-10 w-full object-cover aspect-[4/5]"
              />
              
              {/* Overlay Stat Card */}
              <div className="absolute -bottom-10 -right-6 lg:-right-12 glass-card p-6 rounded-3xl z-20 w-64 transform rotate-2 group-hover:rotate-0 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Match Found</p>
                    <p className="text-lg font-black text-slate-800">O- Negative</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]"></div>
                </div>
                <p className="text-[10px] mt-2 text-slate-500">Transfusion successful in Bangalore</p>
              </div>

              {/* Float Element */}
              <div className="absolute top-10 -left-10 glass-card p-4 rounded-2xl z-20 flex items-center gap-3 animate-bounce">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span className="text-sm font-bold text-slate-800">Hero of the Day: Aman K.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
