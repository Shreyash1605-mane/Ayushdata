
import { BloodType, DonationType, UrgentRequest, Bank, CallRecord } from '../types';

// Simulated Realtime Database Store
const STORE_KEY = 'ayushdata_realtime_store';
const CHANNEL_NAME = 'ayushdata_sync';

export interface PastDonation {
  date: string;
  time?: string;
  type: DonationType;
  location?: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  mobile: string;
  password: string;
  type: 'donor' | 'bank';
  bloodType?: string;
  history?: PastDonation[];
  calls?: CallRecord[];
  location?: string;
}

export interface AppState {
  requests: UrgentRequest[];
  stock: Record<string, number>;
  appointments: any[];
  banks: any[];
  users: RegisteredUser[];
  lastSync: number;
}

const DEFAULT_STATE: AppState = {
  requests: [],
  stock: {
    'A+': 12, 'A-': 4, 'B+': 18, 'B-': 2,
    'O+': 25, 'O-': 8, 'AB+': 5, 'AB-': 1
  },
  appointments: [],
  banks: [
    {
      id: 'B1',
      name: 'Apollo Central Blood Bank',
      location: 'Richmond Road, Bangalore',
      contact: '080-2223-4567',
      distance: '1.2 km',
      openUntil: '24 Hours',
      verified: true
    },
    {
      id: 'B2',
      name: 'Red Cross Life Center',
      location: 'Indiranagar, Bangalore',
      contact: '080-4123-8899',
      distance: '4.5 km',
      openUntil: '8:00 PM',
      verified: true
    }
  ],
  users: [
    {
      id: 'STAFF-01',
      name: 'Apollo Staff',
      mobile: '9999999999',
      password: 'admin',
      type: 'bank'
    }
  ],
  lastSync: Date.now()
};

class RealtimeDatabase {
  private channel: BroadcastChannel;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    
    this.channel.onmessage = () => {
      this.notify();
    };

    window.addEventListener('storage', (event) => {
      if (event.key === STORE_KEY) {
        this.notify();
      }
    });
    
    const existing = localStorage.getItem(STORE_KEY);
    if (!existing) {
      this.saveState(DEFAULT_STATE);
    }
  }

  public getState(): AppState {
    const data = localStorage.getItem(STORE_KEY);
    return data ? JSON.parse(data) : DEFAULT_STATE;
  }

  private saveState(state: AppState) {
    state.lastSync = Date.now();
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    this.channel.postMessage('update');
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // --- User Methods ---
  
  registerUser(user: RegisteredUser) {
    const state = this.getState();
    if (state.users.find(u => u.mobile === user.mobile)) {
      throw new Error("Mobile number already registered.");
    }
    state.users.push(user);
    this.saveState(state);
  }

  verifyUser(mobile: string, password: string): RegisteredUser | null {
    const state = this.getState();
    const user = state.users.find(u => u.mobile === mobile && u.password === password);
    return user || null;
  }

  updateUserHistory(mobile: string, donation: PastDonation) {
    const state = this.getState();
    const userIndex = state.users.findIndex(u => u.mobile === mobile);
    if (userIndex > -1) {
      const user = state.users[userIndex];
      user.history = [donation, ...(user.history || [])].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      state.users[userIndex] = user;
      this.saveState(state);
    }
  }

  addCallRecord(mobile: string, call: CallRecord) {
    const state = this.getState();
    const userIndex = state.users.findIndex(u => u.mobile === mobile);
    if (userIndex > -1) {
      const user = state.users[userIndex];
      user.calls = [call, ...(user.calls || [])];
      state.users[userIndex] = user;
      this.saveState(state);
    }
  }

  // --- API Methods ---
  
  getRequests() { return this.getState().requests; }
  
  addRequest(req: UrgentRequest) {
    const state = this.getState();
    state.requests = [req, ...state.requests];
    this.saveState(state);
  }

  updateRequestStatus(id: string, status: UrgentRequest['status']) {
    const state = this.getState();
    state.requests = state.requests.map(r => r.id === id ? { ...r, status } : r);
    this.saveState(state);
  }

  getStock() { return this.getState().stock; }

  updateStock(type: string, delta: number) {
    const state = this.getState();
    state.stock[type] = Math.max(0, (state.stock[type] || 0) + delta);
    this.saveState(state);
  }

  getAppointments() { return this.getState().appointments; }

  addAppointment(apt: any) {
    const state = this.getState();
    state.appointments = [...state.appointments, apt];
    this.saveState(state);
  }

  updateAppointmentStatus(id: string, status: string) {
    const state = this.getState();
    state.appointments = state.appointments.map(a => a.id === id ? { ...a, status } : a);
    this.saveState(state);
  }

  getBanks() { return this.getState().banks; }

  getLastSync() { return this.getState().lastSync; }
}

export const realtimeDb = new RealtimeDatabase();
