
import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Key,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Phone,
  UserPlus
} from 'lucide-react';
import { realtimeDb, RegisteredUser } from '../services/realtimeStore';

interface AuthProps {
  onLogin: (user: RegisteredUser) => void;
  onCancel: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onCancel }) => {
  const [authType, setAuthType] = useState<'donor' | 'bank' | null>(null);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !password) return;
    
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setIsLoading(false);
      const user = realtimeDb.verifyUser(mobile, password);
      
      if (user) {
        if (user.type !== authType) {
          setError(`This account is registered as a ${user.type}. Please use the correct entry path.`);
          return;
        }
        onLogin(user);
      } else {
        setError('Invalid mobile number or password. Please try again.');
      }
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
      {!authType ? (
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <span className="text-red-600 font-black text-xs uppercase tracking-[0.3em]">Access Portal</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Choose your entry path</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Select the appropriate account type to continue to the AyushData Life Network.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <button 
              onClick={() => setAuthType('donor')}
              className="group p-10 bg-white rounded-[48px] border-2 border-slate-100 hover:border-red-600 shadow-sm hover:shadow-2xl transition-all text-left space-y-8"
            >
              <div className="w-20 h-20 bg-slate-50 text-slate-900 rounded-3xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                <User className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Donor / Recipient</h3>
                <p className="text-slate-500 font-medium">Manage your genetic profile, track requests, and schedule donations.</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-red-600 transition-colors">
                  Personal Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            <button 
              onClick={() => setAuthType('bank')}
              className="group p-10 bg-slate-900 rounded-[48px] border-2 border-transparent hover:border-slate-700 shadow-2xl text-left space-y-8"
            >
              <div className="w-20 h-20 bg-white/10 text-white rounded-3xl flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all">
                <Building2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Partner Bank</h3>
                <p className="text-slate-400 font-medium">Access command hub, manage inventory, and verify donor matches.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                Partner Staff Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
          
          <div className="text-center">
            <button 
              onClick={onCancel}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
            >
              Return to Network
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => setAuthType(null)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-12"
          >
            <ChevronLeft className="w-4 h-4" /> Switch Account Type
          </button>

          <div className="glass-card bg-white p-12 rounded-[48px] shadow-2xl border-t-8 border-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              {authType === 'donor' ? <User className="w-24 h-24" /> : <Building2 className="w-24 h-24" />}
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {authType === 'donor' ? 'Verified Login' : 'Staff Access'}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {authType === 'donor' ? 'Enter your registered mobile number.' : 'Authorized organizational credentials only.'}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                    <input 
                      type="tel" 
                      placeholder="Mobile Number"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 transition-all font-bold"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                    <input 
                      type="password" 
                      placeholder="Security Password"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 transition-all font-bold"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-red-600 focus:ring-red-500/10" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remember Me</span>
                  </label>
                  <button type="button" className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In To Network'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
