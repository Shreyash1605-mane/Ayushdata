
import React from 'react';
import { 
  ArrowLeft, 
  Dna, 
  ShieldCheck, 
  Zap, 
  Heart, 
  Info, 
  CheckCircle2, 
  HelpCircle,
  Stethoscope,
  Microscope,
  LifeBuoy,
  // Added missing Activity icon import
  Activity
} from 'lucide-react';

interface LearnPBSCProps {
  onBack: () => void;
  onRegister: () => void;
}

export const LearnPBSC: React.FC<LearnPBSCProps> = ({ onBack, onRegister }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="space-y-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Network
        </button>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100">
            <Microscope className="w-3 h-3" /> Educational Resource
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight">
            PBSC Donation: <br />
            <span className="text-red-600 italic">The Science of Second Chances</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            Peripheral Blood Stem Cell (PBSC) donation is a non-surgical method used to collect blood-forming stem cells for patients in need of a transplant.
          </p>
        </div>
      </div>

      {/* The Core Concept */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">What exactly is PBSC?</h2>
          <div className="space-y-4 text-slate-500 font-medium leading-relaxed text-lg">
            <p>
              In the past, bone marrow donation was the primary method for collecting stem cells. Today, about 75-80% of all stem cell donations are done via PBSC.
            </p>
            <p>
              Your blood-forming cells live in your bone marrow. PBSC donation uses a process called apheresis to collect these cells directly from your bloodstream, making it similar to a regular blood or plasma donation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <Zap className="w-8 h-8 text-red-600 mb-4" />
              <h4 className="font-black text-slate-900 text-sm mb-1">Non-Surgical</h4>
              <p className="text-xs text-slate-400">No anesthesia or incisions required.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <ShieldCheck className="w-8 h-8 text-red-600 mb-4" />
              <h4 className="font-black text-slate-900 text-sm mb-1">FDA Approved</h4>
              <p className="text-xs text-slate-400">Safe, regulated, and standardized process.</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1579154238328-39150520d7d2?auto=format&fit=crop&q=80&w=1000" 
            alt="Scientific visualization" 
            className="rounded-[40px] shadow-2xl border-[8px] border-white w-full aspect-square object-cover"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[240px]">
            <Dna className="w-6 h-6 text-red-500 mb-2" />
            <p className="text-xs font-black text-slate-900">Your cells regenerate fully within 2-4 weeks after donation.</p>
          </div>
        </div>
      </div>

      {/* The 5-Day Journey */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">The 5-Day Journey</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">From initial prep to the moment you save a life.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Preparation",
              desc: "For 5 days, you receive injections of a naturally occurring protein (filgrastim) that moves stem cells out of the marrow and into the bloodstream.",
              icon: Stethoscope
            },
            {
              step: "02",
              title: "Apheresis Day",
              desc: "On day 5, you're connected to a machine. Blood is drawn from one arm, stem cells are separated, and the rest of the blood returns through the other arm.",
              icon: Activity
            },
            {
              step: "03",
              title: "Recovery",
              desc: "Most donors return to normal activities within 1-2 days. Your body completely replenishes the donated cells in a few short weeks.",
              icon: LifeBuoy
            }
          ].map((item, i) => (
            <div key={i} className="group p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="text-5xl font-black text-slate-100 group-hover:text-red-50 transition-colors">{item.step}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ & CTA */}
      <div className="bg-slate-900 rounded-[56px] p-8 md:p-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <HelpCircle className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tight">Common Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Does it hurt?", a: "The injections may cause bone pain or flu-like symptoms, which subside quickly. The donation itself is painless beyond the needle prick." },
                { q: "Who can donate?", a: "Generally, healthy individuals between 18 and 44 years old provide the best outcomes for patients." },
                { q: "What about costs?", a: "Donors never pay to donate. All medical and travel expenses are covered by the patient's insurance or the registry." }
              ].map((faq, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="flex items-center gap-2 text-red-400 font-black text-sm uppercase tracking-wider">
                    <Info className="w-4 h-4" /> {faq.q}
                  </h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic">Ready to make a difference?</h3>
              <p className="text-slate-400 font-medium">Your genetic profile could be the one that saves a life today.</p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={onRegister}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20"
              >
                Join the Registry
              </button>
              <button 
                onClick={onBack}
                className="w-full py-5 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                Maybe Later
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> Secure • Private • Impactful
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
