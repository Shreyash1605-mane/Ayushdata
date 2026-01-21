
import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  Mail,
  User,
  Clock,
  Loader2
} from 'lucide-react';
import { realtimeDb } from '../services/realtimeStore';

export const BankRegistration: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    bankName: '',
    adminName: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    licenseNumber: '',
    facilityType: 'Centralized Blood Bank'
  });

  const updateForm = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleRegister = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const id = `BANK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        realtimeDb.registerUser({
          id,
          name: formData.bankName,
          mobile: formData.phone,
          password: formData.password,
          type: 'bank'
        });

        setIsLoading(false);
        setIsSuccess(true);
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || "Registration failed.");
        setStep(1);
      }
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-in zoom-in-95 duration-500">
        <div className="glass-card bg-white p-12 rounded-[48px] shadow-2xl space-y-8 border-t-8 border-slate-900 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Partner Authenticated</h2>
            <p className="text-slate-500 font-medium">Your Command Hub access for {formData.bankName} is now active.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Access Credentials</p>
            <p className="text-lg font-black text-slate-900">{formData.phone}</p>
            <p className="text-xs text-slate-400 mt-1">Use this mobile number to log in to the Command Hub.</p>
          </div>
          <button 
            onClick={onComplete}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all"
          >
            Go to Login Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Partner Registration</h2>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {step} of 3</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-900 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="glass-card bg-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden border-t-8 border-slate-900">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Facility Information</h3>
              <p className="text-sm text-slate-500 font-medium">Identify your blood bank or medical center.</p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900" />
                <input 
                  type="text" placeholder="Full Bank / Hospital Name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold"
                  value={formData.bankName} onChange={e => updateForm({ bankName: e.target.value })}
                />
              </div>
              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" placeholder="Medical License / Registration Number"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 font-bold"
                  value={formData.licenseNumber} onChange={e => updateForm({ licenseNumber: e.target.value })}
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" placeholder="Complete Address"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 font-bold"
                  value={formData.location} onChange={e => updateForm({ location: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Administrative Contact</h3>
              <p className="text-sm text-slate-500 font-medium">Primary point of contact for the Command Hub.</p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" placeholder="Primary Administrator Name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 font-bold"
                  value={formData.adminName} onChange={e => updateForm({ adminName: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" placeholder="Work Email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 font-bold" value={formData.email} onChange={e => updateForm({ email: e.target.value })} />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" placeholder="Mobile Number" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 font-bold" value={formData.phone} onChange={e => updateForm({ phone: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Security Credentials</h3>
              <p className="text-sm text-slate-500 font-medium">Set your hub access password.</p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" placeholder="Account Password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 font-bold"
                  value={formData.password} onChange={e => updateForm({ password: e.target.value })}
                />
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-slate-900 mt-1" />
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  By registering as a Command Hub partner, you agree to AyushData's medical ethics protocols and real-time inventory synchronization policies.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button 
            onClick={() => step < 3 ? setStep(s => s + 1) : handleRegister()}
            disabled={isLoading}
            className={`ml-auto px-10 py-5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center gap-3 bg-slate-900 text-white hover:bg-red-600 disabled:bg-slate-200`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === 3 ? 'Finalize Registration' : 'Next Step')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
