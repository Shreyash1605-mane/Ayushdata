
import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Hospital, 
  Droplet, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  User,
  Activity,
  Phone,
  Copy,
  Search
} from 'lucide-react';
import { BloodType, DonationType, UrgentRequest } from '../types';
import { realtimeDb } from '../services/realtimeStore';

interface RequestData {
  patientName: string;
  hospitalName: string;
  location: string;
  contactNumber: string;
  bloodType: BloodType | '';
  requestType: DonationType | '';
  unitsNeeded: number;
  urgency: 'IMMEDIATE' | 'HIGH' | 'NORMAL';
}

export const RequestForm: React.FC<{ onComplete: (requestId?: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [formData, setFormData] = useState<RequestData>({
    patientName: '',
    hospitalName: '',
    location: '',
    contactNumber: '',
    bloodType: '',
    requestType: '',
    unitsNeeded: 1,
    urgency: 'NORMAL',
  });

  const updateForm = (fields: Partial<RequestData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleBroadcast = () => {
    const newId = `AD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setRequestId(newId);
    
    // Save to realtime DB
    const newRequest: UrgentRequest = {
      id: newId,
      patientName: formData.patientName,
      bloodType: formData.bloodType as BloodType,
      location: formData.location,
      hospital: formData.hospitalName,
      requiredBy: formData.urgency === 'IMMEDIATE' ? 'Immediate' : 'Scheduled',
      unitsNeeded: formData.unitsNeeded,
      status: 'SEARCHING'
    };
    
    realtimeDb.addRequest(newRequest);
    setIsSuccess(true);
  };

  const copyId = () => {
    navigator.clipboard.writeText(requestId);
    alert('Request ID copied to clipboard!');
  };

  const isStepValid = () => {
    if (step === 1) return formData.patientName && formData.hospitalName && formData.location && formData.contactNumber;
    if (step === 2) return formData.requestType && formData.bloodType;
    return true;
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-in zoom-in-95 duration-500">
        <div className="glass-card bg-white p-12 rounded-[40px] shadow-2xl text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Request Broadcasted</h2>
            <p className="text-slate-500 font-medium">We are alerting all matching donors in {formData.location}.</p>
          </div>

          <div className="p-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Your Request ID</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{requestId}</span>
              <button onClick={copyId} className="p-3 bg-white shadow-sm rounded-xl text-slate-400 hover:text-red-600 transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={() => onComplete(requestId)} className="flex-1 py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-red-600 transition-all"><Search className="w-4 h-4" /> Track Request</button>
            <button onClick={() => onComplete()} className="flex-1 py-5 bg-white border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">Return Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request Support</h2>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {step} of 3</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      <div className="glass-card bg-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl font-black text-slate-900">Hospital Details</h3>
            <div className="space-y-6">
              <input placeholder="Patient Name" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.patientName} onChange={e => updateForm({ patientName: e.target.value })} />
              <input placeholder="Hospital Name" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.hospitalName} onChange={e => updateForm({ hospitalName: e.target.value })} />
              <input placeholder="City" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.location} onChange={e => updateForm({ location: e.target.value })} />
              <input placeholder="Contact Phone" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.contactNumber} onChange={e => updateForm({ contactNumber: e.target.value })} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl font-black text-slate-900">Requirements</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(DonationType).map(type => (
                <button key={type} onClick={() => updateForm({ requestType: type })} className={`py-4 rounded-3xl border-2 font-black uppercase text-[10px] ${formData.requestType === type ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100'}`}>{type}</button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(BloodType).map(type => (
                <button key={type} onClick={() => updateForm({ bloodType: type })} className={`py-3 rounded-xl text-xs font-black ${formData.bloodType === type ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>{type}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 text-center">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto" />
            <h3 className="text-xl font-black">Confirm Broadcast?</h3>
            <p className="text-slate-500">This will notify all available donors in your area immediately.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
          {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl">Back</button>}
          <button onClick={() => step < 3 ? setStep(s => s + 1) : handleBroadcast()} disabled={!isStepValid()} className={`ml-auto px-10 py-5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all ${isStepValid() ? 'bg-slate-900 text-white hover:bg-red-600' : 'bg-slate-100 text-slate-300'}`}>
            {step === 3 ? 'Broadcast Request' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};
