
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Droplet, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Dna,
  ShieldCheck,
  ClipboardList,
  Plus,
  Trash2,
  History as HistoryIcon,
  Clock,
  CalendarDays,
  Copy,
  Printer,
  Share2,
  MailCheck,
  Lock,
  Building
} from 'lucide-react';
import { BloodType, DonationType } from '../types';
import { realtimeDb, PastDonation } from '../services/realtimeStore';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  location: string;
  bloodType: BloodType | '';
  donationType: DonationType | '';
  history: PastDonation[];
  availability: string[];
  preferredTime: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['Morning (8AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)', 'Anytime'];

export const DonorRegistration: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [donorId, setDonorId] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    bloodType: '',
    donationType: '',
    history: [],
    availability: [],
    preferredTime: '',
  });

  const [newHistoryDate, setNewHistoryDate] = useState('');
  const [newHistoryTime, setNewHistoryTime] = useState('10:00');
  const [newHistoryLocation, setNewHistoryLocation] = useState('');
  const [newHistoryType, setNewHistoryType] = useState<DonationType>(DonationType.BLOOD);

  const updateForm = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  const addHistoryEntry = () => {
    if (!newHistoryDate) return;
    const newEntry: PastDonation = { 
      date: newHistoryDate, 
      type: newHistoryType,
      time: newHistoryTime,
      location: newHistoryLocation || 'Local Blood Bank'
    };
    setFormData(prev => ({
      ...prev,
      history: [...prev.history, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
    setNewHistoryDate('');
    setNewHistoryLocation('');
  };

  const nextStep = () => {
    setError(null);
    setStep(s => Math.min(s + 1, 6));
  };
  const prevStep = () => {
    setError(null);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleFinalConfirm = () => {
    try {
      const id = `DN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Save to real-time DB
      realtimeDb.registerUser({
        id,
        name: formData.name,
        mobile: formData.phone,
        password: formData.password,
        type: 'donor',
        bloodType: formData.bloodType,
        history: formData.history,
        location: formData.location
      });

      setDonorId(id);
      setIsSuccess(true);
      
      setTimeout(() => {
        setEmailSent(true);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      setStep(1); // Go back to step 1 to fix the mobile number
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareText = `I just joined the AyushData Life Network as a donor! My Donor ID is ${donorId}. Together we can bridge the gap in healthcare. Join the network today!`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AyushData Hero Card',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('Share text and link copied to clipboard!');
      } catch (err) {
        console.error('Clipboard failed:', err);
      }
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.email && formData.phone && formData.password;
    if (step === 2) return formData.bloodType;
    if (step === 3) return formData.donationType;
    if (step === 5) return formData.availability.length > 0 && formData.preferredTime;
    return true;
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-in zoom-in-95 duration-500">
        <div className="glass-card bg-white p-10 md:p-16 rounded-[48px] shadow-2xl space-y-10 border-t-8 border-red-600">
          <div className="text-center space-y-4 no-print">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome to the Network, Hero!</h2>
            
            <div className={`transition-all duration-700 ${emailSent ? 'opacity-100 transform translate-y-0' : 'opacity-50 transform -translate-y-2'}`}>
              {emailSent ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                  <MailCheck className="w-4 h-4" /> Official digital ID sent to {formData.email}
                </div>
              ) : (
                <p className="text-slate-500 font-medium flex items-center justify-center gap-2 italic">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></span>
                  Securing your profile and dispatching confirmation...
                </p>
              )}
            </div>
          </div>

          <div id="print-area" className="bg-slate-50 rounded-3xl p-8 space-y-6 relative overflow-hidden border border-slate-200">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <ShieldCheck className="w-24 h-24" />
             </div>
             
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-900 p-2 rounded-xl">
                  <Droplet className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 tracking-widest block leading-none">AYUSHDATA</span>
                  <span className="text-[8px] font-black text-red-600 uppercase tracking-widest block mt-1">Life Network Card</span>
                </div>
             </div>

             <div className="flex justify-between items-start border-b border-slate-200 pb-6">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                 <p className="text-xl font-black text-slate-900">{formData.name}</p>
                 
                 <div className="mt-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Donor ID</p>
                   <p className="text-2xl font-black text-red-600 tracking-tighter tabular-nums">{donorId}</p>
                 </div>
               </div>
               
               <div className="text-right">
                 <div className="w-16 h-16 bg-white border-2 border-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-2 shadow-sm">
                    <span className="text-2xl font-black">{formData.bloodType}</span>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Type</p>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-y-6 text-sm font-bold pt-2">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Impact Modality</p>
                 <p className="text-slate-800 uppercase text-xs">{formData.donationType.replace('_', ' ')}</p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Availability</p>
                 <p className="text-slate-800 text-xs">{formData.availability.join(', ')}</p>
               </div>
               <div className="col-span-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Assigned Support Location</p>
                 <p className="text-slate-800 text-xs flex items-center gap-1">
                   <MapPin className="w-3 h-3 text-slate-400" /> {formData.location}
                 </p>
               </div>
             </div>
          </div>

          <div className="space-y-4 pt-4 no-print">
            <button 
              onClick={onComplete}
              className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-slate-100"
            >
              Finish & Return Home
            </button>
            <div className="flex gap-4">
              <button 
                onClick={handlePrint}
                className="flex-1 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-red-100 hover:text-red-600 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Donor ID
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-red-100 hover:text-red-600 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share My Impact
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Donor Registration</h2>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {step} of 6</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold animate-in fade-in">
          {error}
        </div>
      )}

      <div className="glass-card bg-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Personal Identity</h3>
              <p className="text-sm text-slate-500 font-medium">Create your secure hero account.</p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500" />
                <input 
                  type="text" placeholder="Full Legal Name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 transition-all font-bold"
                  value={formData.name} onChange={e => updateForm({ name: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" placeholder="Email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 font-bold" value={formData.email} onChange={e => updateForm({ email: e.target.value })} /></div>
                <div className="relative group"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="tel" placeholder="Mobile Number (for Login)" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 font-bold" value={formData.phone} onChange={e => updateForm({ phone: e.target.value })} /></div>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" placeholder="Account Password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 font-bold"
                  value={formData.password} onChange={e => updateForm({ password: e.target.value })}
                />
              </div>
              <div className="relative group"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="City, State" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 font-bold" value={formData.location} onChange={e => updateForm({ location: e.target.value })} /></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2"><h3 className="text-xl font-black text-slate-900">Medical Profile</h3><p className="text-sm text-slate-500 font-medium">Select your blood type.</p></div>
            <div className="grid grid-cols-4 gap-3">
              {Object.values(BloodType).map(type => (
                <button key={type} onClick={() => updateForm({ bloodType: type })} className={`py-4 rounded-2xl text-sm font-black transition-all ${formData.bloodType === type ? 'bg-red-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{type}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2"><h3 className="text-xl font-black text-slate-900">Donation Interest</h3><p className="text-sm text-slate-500 font-medium">How would you like to contribute?</p></div>
            <div className="space-y-4">
              {[
                { id: DonationType.BLOOD, label: 'Whole Blood', icon: Droplet, desc: 'Immediate impact for surgeries.' },
                { id: DonationType.STEM_CELL, label: 'Stem Cell (PBSC)', icon: Dna, desc: 'Help treat leukemia cases.' },
                { id: DonationType.PLASMA, label: 'Plasma / Platelets', icon: Droplet, desc: 'Critical recovery support.' },
              ].map(item => (
                <button key={item.id} onClick={() => updateForm({ donationType: item.id })} className={`w-full p-6 rounded-3xl border-2 flex items-center gap-6 transition-all text-left ${formData.donationType === item.id ? 'border-red-600 bg-red-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${formData.donationType === item.id ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'}`}><item.icon className="w-7 h-7" /></div>
                  <div className="flex-1"><h4 className={`font-black ${formData.donationType === item.id ? 'text-red-900' : 'text-slate-800'}`}>{item.label}</h4><p className="text-xs font-medium text-slate-500 mt-1">{item.desc}</p></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2"><h3 className="text-xl font-black text-slate-900">Donation History</h3><p className="text-sm text-slate-500 font-medium">Record past contributions.</p></div>
            <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl font-bold" value={newHistoryDate} onChange={e => setNewHistoryDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Donation Type</label>
                  <select className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl font-bold" value={newHistoryType} onChange={e => setNewHistoryType(e.target.value as DonationType)}>
                    {Object.values(DonationType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Location / Center</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="e.g. Apollo Central" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold" value={newHistoryLocation} onChange={e => setNewHistoryLocation(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Time</label>
                  <input type="time" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl font-bold" value={newHistoryTime} onChange={e => setNewHistoryTime(e.target.value)} />
                </div>
              </div>
              <button onClick={addHistoryEntry} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">Add Record</button>
              
              {formData.history.length > 0 && (
                <div className="space-y-2 mt-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Added Entries</p>
                   {formData.history.map((h, i) => (
                     <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{h.date} @ {h.time}</span>
                          <span className="text-[9px] text-slate-400 uppercase font-black">{h.location}</span>
                        </div>
                        <span className="text-[9px] font-black uppercase text-red-600 bg-red-50 px-2 py-1 rounded-md">{h.type}</span>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Availability & Times</h3>
              <p className="text-sm text-slate-500 font-medium">When can you coordinate with centers?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 flex items-center gap-2">
                  <CalendarDays className="w-3 h-3" /> Available Days
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`py-3 rounded-xl text-xs font-black transition-all ${
                        formData.availability.includes(day)
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Preferred Time Slot
                </label>
                <div className="space-y-2">
                  {TIMES.map(time => (
                    <button
                      key={time}
                      onClick={() => updateForm({ preferredTime: time })}
                      className={`w-full p-4 rounded-2xl text-sm font-bold text-left transition-all border-2 ${
                        formData.preferredTime === time
                          ? 'border-red-600 bg-red-50 text-red-900'
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce"><CheckCircle2 className="w-12 h-12" /></div>
            <h3 className="text-2xl font-black text-slate-900">Review & Confirm</h3>
            <div className="bg-slate-50 p-6 rounded-3xl space-y-4 text-left text-sm font-bold">
              <div className="flex justify-between border-b pb-2"><span>Name</span><span>{formData.name}</span></div>
              <div className="flex justify-between border-b pb-2"><span>Mobile</span><span>{formData.phone}</span></div>
              <div className="flex justify-between border-b pb-2"><span>Blood Type</span><span className="text-red-600">{formData.bloodType}</span></div>
              <div className="flex justify-between border-b pb-2"><span>Past Donations</span><span>{formData.history.length}</span></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
          {step > 1 && <button onClick={prevStep} className="px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>}
          <button 
            onClick={() => step < 6 ? nextStep() : handleFinalConfirm()}
            disabled={!isStepValid()}
            className={`ml-auto px-10 py-5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center gap-3 ${isStepValid() ? 'bg-slate-900 text-white hover:bg-red-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
          >
            {step === 6 ? 'Confirm Registration' : 'Next Step'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
