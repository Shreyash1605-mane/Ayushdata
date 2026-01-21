
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight, CheckCircle2, Heart } from 'lucide-react';
import { DonationType } from '../types';
import { realtimeDb } from '../services/realtimeStore';

export const Scheduler: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [appointment, setAppointment] = useState({
    center: 'Apollo Central Blood Bank',
    date: '',
    time: '09:00 AM',
    type: DonationType.BLOOD,
    name: 'Verified Donor'
  });

  const handleComplete = () => {
    const id = `APT-${Math.floor(Math.random() * 900) + 100}`;
    realtimeDb.addAppointment({ 
      id, 
      time: appointment.time, 
      name: appointment.name, 
      type: appointment.type, 
      status: 'PENDING' 
    });
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-in zoom-in-95">
        <CheckCircle2 className="w-24 h-24 text-emerald-600 mx-auto mb-8 animate-bounce" />
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Appointment Synced!</h2>
        <p className="text-slate-500 font-medium mb-12">Reserved at {appointment.center}. Command Hub has been notified.</p>
        <button onClick={onComplete} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all">Back to Network</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="glass-card bg-white p-12 rounded-[48px] shadow-2xl space-y-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Book Slot</h2>
        <div className="space-y-8">
          <input placeholder="Your Name" className="w-full p-5 bg-slate-50 rounded-2xl font-bold" onChange={e => setAppointment({...appointment, name: e.target.value})} />
          <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold" onChange={e => setAppointment({...appointment, center: e.target.value})}>
            <option>Apollo Central Blood Bank</option>
            <option>Red Cross Life Center</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className="p-5 bg-slate-50 rounded-2xl font-bold" onChange={e => setAppointment({...appointment, date: e.target.value})} />
            <select className="p-5 bg-slate-50 rounded-2xl font-bold" onChange={e => setAppointment({...appointment, time: e.target.value})}>
              <option>09:00 AM</option><option>11:30 AM</option><option>02:00 PM</option>
            </select>
          </div>
          <button onClick={handleComplete} disabled={!appointment.date} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs disabled:opacity-20">Confirm Appointment</button>
        </div>
      </div>
    </div>
  );
};
