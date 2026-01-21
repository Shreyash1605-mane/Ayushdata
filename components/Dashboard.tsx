
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Droplets, 
  Hospital, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Search,
  Bell,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Plus,
  Loader2,
  Package,
  Truck,
  Settings,
  LayoutGrid,
  ClipboardList,
  Edit3,
  History,
  ShieldCheck,
  Building,
  Minus,
  Save,
  X,
  Inbox,
  RefreshCw,
  Wifi
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell 
} from 'recharts';
import { BloodType, DonationType, UrgentRequest } from '../types';
import { realtimeDb, AppState } from '../services/realtimeStore';

type CommandView = 'overview' | 'inventory' | 'dispatch' | 'schedule' | 'bank-data';

export const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<CommandView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chartVisible, setChartVisible] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Sync with Realtime Store
  const [dbState, setDbState] = useState<AppState>({
    requests: realtimeDb.getRequests(),
    stock: realtimeDb.getStock(),
    appointments: realtimeDb.getAppointments(),
    banks: realtimeDb.getBanks(),
    users: [],
    lastSync: realtimeDb.getLastSync()
  });

  useEffect(() => {
    const unsubscribe = realtimeDb.subscribe(() => {
      setDbState({
        requests: realtimeDb.getRequests(),
        stock: realtimeDb.getStock(),
        appointments: realtimeDb.getAppointments(),
        banks: realtimeDb.getBanks(),
        users: [],
        lastSync: realtimeDb.getLastSync()
      });
      setLastSyncTime(new Date());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setChartVisible(true), 200);
    return () => clearTimeout(timer);
  }, [activeView]);

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ name: '', time: '09:00 AM', type: 'Whole Blood' });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateStock = (type: string, delta: number) => {
    realtimeDb.updateStock(type, delta);
    showNotification(`Stock adjusted: ${type}`);
  };

  const handleDispatch = (id: string) => {
    realtimeDb.updateRequestStatus(id, 'DISPATCHED');
    showNotification(`Emergency dispatch active: ${id}`);
  };

  const handleCheckIn = (id: string) => {
    realtimeDb.updateAppointmentStatus(id, 'COMPLETED');
    showNotification(`Check-in verified`);
  };

  const handleManualSlotEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `APT-${Math.floor(Math.random() * 900) + 100}`;
    realtimeDb.addAppointment({ id, ...newSlot, status: 'PENDING' });
    setShowAddSlot(false);
    setNewSlot({ name: '', time: '09:00 AM', type: 'Whole Blood' });
    showNotification(`Manual slot added`);
  };

  const chartData = useMemo(() => {
    return Object.entries(dbState.stock).map(([type, count]) => ({
      type,
      count: count as number,
      status: (count as number) < 10 ? 'Critical' : (count as number) < 25 ? 'Low' : 'Optimal'
    }));
  }, [dbState.stock]);

  const stats = useMemo(() => {
    const totalUnits = Object.values(dbState.stock).reduce((a, b) => (a as number) + (b as number), 0);
    const critical = Object.values(dbState.stock).filter(c => (c as number) < 10 && (c as number) > 0).length;
    return { 
      totalUnits, 
      critical, 
      pendingReqs: dbState.requests.filter(r => r.status !== 'DELIVERED').length 
    };
  }, [dbState.stock, dbState.requests]);

  const SidebarItem = ({ id, icon: Icon, label }: { id: CommandView, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveView(id)} 
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 ${activeView === id ? 'bg-red-600 text-white shadow-lg shadow-red-900/20 translate-x-1' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
      <Icon className="w-5 h-5" />
      {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>}
    </button>
  );

  return (
    <div className="flex flex-1 min-h-0 bg-[#0f172a] text-white relative">
      {notification && (
        <div className="fixed top-24 right-8 z-[100] px-6 py-4 rounded-2xl bg-[#020617] border border-emerald-500/50 text-emerald-400 shadow-2xl animate-in slide-in-from-right-10 duration-300">
          <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
        </div>
      )}

      <aside className={`bg-[#020617] border-r border-slate-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex-1 py-6">
          <SidebarItem id="overview" icon={LayoutGrid} label="Control Panel" />
          <SidebarItem id="inventory" icon={Package} label="Inventory Mgmt" />
          <SidebarItem id="dispatch" icon={Truck} label="Dispatch Ops" />
          <SidebarItem id="schedule" icon={Calendar} label="Appointments" />
          <SidebarItem id="bank-data" icon={Building} label="Bank Profile" />
        </div>
        <div className="p-6 border-t border-slate-800">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              {isSidebarOpen && <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Synced</span>}
           </div>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto scrollbar-hide bg-[#0f172a]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight">{activeView.charAt(0).toUpperCase() + activeView.slice(1).replace('-', ' ')}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" /> Last sync: {lastSyncTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-3">
              <Wifi className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Live Hub Active</span>
            </div>
          </div>
        </div>

        {activeView === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-[32px] hover:border-blue-500/50 transition-all group">
                <Droplets className="w-8 h-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-4xl font-black tabular-nums transition-all duration-500">{stats.totalUnits}</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase mt-2">Total Units Live</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-[32px] hover:border-red-500/50 transition-all group">
                <Activity className="w-8 h-8 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-4xl font-black tabular-nums transition-all duration-500">{stats.critical}</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase mt-2">Critical Alerts</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-[32px] hover:border-emerald-500/50 transition-all group">
                <Truck className="w-8 h-8 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-4xl font-black tabular-nums transition-all duration-500">{stats.pendingReqs}</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase mt-2">Dispatches Active</p>
              </div>
            </div>

            <div className="bg-slate-800/20 border border-slate-800 p-10 rounded-[40px] h-[450px] relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-black flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-blue-500" /> Network Stock Distribution
                </h3>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div> Critical
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div> Healthy
                   </div>
                </div>
              </div>
              {chartVisible && (
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="type" tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px'}} 
                    />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]} animationDuration={1000}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.count > 0 ? (e.status === 'Critical' ? '#ef4444' : '#3b82f6') : '#1e293b'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {activeView === 'inventory' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Object.entries(dbState.stock).map(([type, count]) => (
                <div key={type} className={`p-8 rounded-[32px] bg-slate-900 border-2 transition-all duration-300 ${(count as number) < 10 && (count as number) > 0 ? 'border-red-600 animate-pulse bg-red-950/10' : 'border-slate-800 hover:border-slate-600'}`}>
                  <h4 className="text-3xl font-black mb-4">{type}</h4>
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Available Units</p>
                      <p className="text-2xl font-black tabular-nums">{count as number}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      (count as number) < 10 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {(count as number) < 10 ? 'Critical' : 'Stable'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStock(type, 1)} className="flex-1 p-3 bg-white/5 rounded-xl hover:bg-white/10 flex justify-center"><Plus className="w-4 h-4" /></button>
                    <button onClick={() => handleUpdateStock(type, -1)} className="flex-1 p-3 bg-white/5 rounded-xl hover:bg-white/10 flex justify-center"><Minus className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'dispatch' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            {dbState.requests.length === 0 ? (
              <div className="bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-800 p-32 text-center flex flex-col items-center gap-6">
                 <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-700">
                   <Inbox className="w-10 h-10" />
                 </div>
                 <p className="text-slate-500 font-bold max-w-xs">No active life-saving dispatches required at this time.</p>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-[40px] border border-slate-800 divide-y divide-slate-800 overflow-hidden shadow-2xl">
                {dbState.requests.map(req => (
                  <div key={req.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex gap-8">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                        req.status === 'SEARCHING' ? 'bg-red-950/30 text-red-500 animate-pulse' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Droplets className="group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-xl">{req.patientName}</h4>
                          <span className="px-2 py-0.5 bg-red-600 rounded text-[9px] font-black uppercase">{req.bloodType}</span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
                          <Hospital className="w-3 h-3" /> {req.hospital} • {req.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Status</p>
                        <p className={`text-xs font-bold ${req.status === 'SEARCHING' ? 'text-red-500' : 'text-emerald-500'}`}>{req.status}</p>
                      </div>
                      {req.status === 'SEARCHING' && (
                        <button 
                          onClick={() => handleDispatch(req.id)} 
                          className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all shadow-lg"
                        >
                          Execute Dispatch
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
