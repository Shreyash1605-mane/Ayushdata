
import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { LiveAssistant } from './components/LiveAssistant';
import { DonorRegistration } from './components/DonorRegistration';
import { BankRegistration } from './components/BankRegistration';
import { RequestForm } from './components/RequestForm';
import { RequestTracking } from './components/RequestTracking';
import { BankList } from './components/BankList';
import { Scheduler } from './components/Scheduler';
import { LearnPBSC } from './components/LearnPBSC';
import { Dashboard } from './components/Dashboard';
import { DonorDashboard } from './components/DonorDashboard';
import { Auth } from './components/Auth';
import { 
  Droplets, 
  Home, 
  Menu, 
  X, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  ShieldAlert,
  Dna,
  Stethoscope,
  Activity,
  UserPlus,
  LifeBuoy,
  Search,
  Send,
  Mail,
  User,
  Calendar,
  Navigation as NavIcon,
  BookOpen,
  Headphones,
  LogOut,
  LayoutDashboard,
  LogIn,
  Settings,
  Bell,
  Building2,
  LayoutGrid
} from 'lucide-react';
import { RegisteredUser } from './services/realtimeStore';

type Page = 'home' | 'request' | 'register' | 'bank-register' | 'tracking' | 'banks' | 'scheduler' | 'learn' | 'login' | 'dashboard' | 'donor-dashboard';
type UserType = 'donor' | 'bank' | null;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [trackingId, setTrackingId] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigateTo = (page: Page, id?: string) => {
    // Role-based navigation guard
    if (userType === 'bank' && page !== 'dashboard' && page !== 'login' && page !== 'home') {
       return;
    }
    if (userType === 'donor' && page === 'dashboard') {
       return;
    }

    if (id) setTrackingId(id);
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user: RegisteredUser) => {
    setUserType(user.type);
    setCurrentUser(user);
    if (user.type === 'bank') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('donor-dashboard');
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Message sent! Thank you, ${contactForm.name}. We'll contact you at ${contactForm.email}.`);
      setContactForm({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  if (userType === 'bank' && currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col">
        <header className="h-20 bg-[#020617] border-b border-slate-800 flex items-center justify-between px-8 z-50">
          <div className="flex items-center gap-3">
             <div className="bg-red-600 p-1.5 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
             </div>
             <div>
                <span className="text-white font-black text-sm uppercase tracking-widest block leading-none">AyushData</span>
                <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mt-1">Command Hub Profile</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-white transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{currentUser?.name || 'Apollo Staff'}</p>
                <p className="text-[8px] font-bold text-emerald-500 uppercase mt-1">Admin Session</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:text-red-500 transition-all border border-slate-700"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col selection:bg-red-100 selection:text-red-900">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('home')}>
              <div className="bg-slate-900 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform">
                <Droplets className="w-7 h-7 text-red-500 fill-red-500" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter block leading-none">
                  Ayush<span className="text-red-600 italic">Data</span>
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Life Network</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {[
                { id: 'home', label: 'Network', icon: Home },
                { id: 'request', label: 'Request Support', icon: LifeBuoy },
                { id: 'banks', label: 'Find Centers', icon: NavIcon },
                { id: 'scheduler', label: 'Book Appointment', icon: Calendar },
                { id: 'learn', label: 'Learn PBSC', icon: BookOpen },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id as Page)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentPage === item.id ? 'text-red-600' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-6 w-px bg-slate-100"></div>
              
              {userType ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end cursor-pointer" onClick={() => navigateTo(userType === 'donor' ? 'donor-dashboard' : 'dashboard')}>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none flex items-center gap-1">
                      <LayoutGrid className="w-3 h-3 text-red-600" /> Dashboard
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{currentUser?.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigateTo('login')}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Login
                  </button>
                  <div className="relative group/signup">
                    <button 
                      className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-xl shadow-slate-100 flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" /> Sign Up
                    </button>
                    <div className="absolute right-0 top-full pt-2 opacity-0 group-hover/signup:opacity-100 transition-opacity pointer-events-none group-hover/signup:pointer-events-auto">
                      <div className="bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden w-48">
                        <button onClick={() => navigateTo('register')} className="w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center gap-3">
                          <Heart className="w-4 h-4" /> As Donor
                        </button>
                        <button onClick={() => navigateTo('bank-register')} className="w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white flex items-center gap-3 border-t border-slate-50">
                          <Building2 className="w-4 h-4" /> As Partner
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-3 bg-slate-50 rounded-xl text-slate-600">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white p-6 space-y-4 border-t border-slate-50">
            {['home', 'request', 'banks', 'scheduler', 'learn', 'register', 'bank-register', 'login'].map(page => (
              <button 
                key={page}
                onClick={() => navigateTo(page as Page)} 
                className="block w-full text-left font-black text-slate-900 text-sm uppercase tracking-widest p-4 bg-slate-50 rounded-2xl"
              >
                {page.replace('home', 'Network').replace('bank-register', 'Partner Signup').replace('register', 'Donor Signup')}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <Hero 
              onStart={() => navigateTo('register')} 
              onLearn={() => navigateTo('learn')}
            />
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                  <span className="text-red-600 font-black text-xs uppercase tracking-[0.3em]">The Workflow</span>
                  <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">Your path to being a <br /> life-saving hero.</h2>
                </div>
                <div className="grid md:grid-cols-4 gap-8">
                  {[
                    { title: 'Genetic Profiling', desc: 'Securely register your biological identity.', icon: Dna },
                    { title: 'Real-time Match', desc: 'Our AI scans 24/7 for urgent hospital requests.', icon: ShieldCheck },
                    { title: 'Seamless Screen', desc: 'Quick health screening at your nearest hub.', icon: Stethoscope },
                    { title: 'Final Impact', desc: 'Donate with confidence and save a life.', icon: Heart },
                  ].map((feat, i) => (
                    <div key={i} className="group p-10 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-red-100">
                      <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <feat.icon className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-4">{feat.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
        {currentPage === 'login' && <Auth onLogin={handleLogin} onCancel={() => navigateTo('home')} />}
        {currentPage === 'request' && <RequestForm onComplete={(id) => navigateTo(id ? 'tracking' : 'home', id)} />}
        {currentPage === 'register' && <DonorRegistration onComplete={() => navigateTo('login')} />}
        {currentPage === 'bank-register' && <BankRegistration onComplete={() => navigateTo('login')} />}
        {currentPage === 'tracking' && <RequestTracking initialId={trackingId} />}
        {currentPage === 'banks' && <BankList />}
        {currentPage === 'scheduler' && <Scheduler onComplete={() => navigateTo('home')} />}
        {currentPage === 'learn' && <LearnPBSC onBack={() => navigateTo('home')} onRegister={() => navigateTo('register')} />}
        {currentPage === 'donor-dashboard' && currentUser && <DonorDashboard user={currentUser} />}
      </main>

      <LiveAssistant />

      <footer className="bg-white py-24 border-t border-slate-100 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-4 gap-16">
          <div className="col-span-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-xl"><Droplets className="w-6 h-6 text-red-500 fill-red-500" /></div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">AyushData</span>
            </div>
            <p className="text-slate-400 font-medium leading-loose">India's first AI-driven blood and stem cell matching network.</p>
            <div className="p-6 bg-slate-50 rounded-[32px] space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Hotline</h4>
              <p className="text-xl font-black text-slate-900">1800-AYUSH-LIFE</p>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><button onClick={() => navigateTo('banks')} className="hover:text-red-600 transition-colors">Verified Banks</button></li>
              <li><button onClick={() => navigateTo('register')} className="hover:text-red-600 transition-colors">Become a Donor</button></li>
              <li><button onClick={() => navigateTo('request')} className="hover:text-red-600 transition-colors">Request Support</button></li>
              <li><button onClick={() => navigateTo('tracking')} className="hover:text-red-600 transition-colors">Track Request</button></li>
              <li><button onClick={() => navigateTo('learn')} className="hover:text-red-600 transition-colors">About PBSC</button></li>
              <li><button onClick={() => navigateTo('bank-register')} className="hover:text-red-600 transition-colors">Partner Access</button></li>
            </ul>
          </div>

          <div className="col-span-2">
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-8">Send us a Message</h4>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Name" required
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-red-500/10"
                  value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                />
                <input 
                  type="email" placeholder="Email" required
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-red-500/10"
                  value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                />
              </div>
              <textarea 
                placeholder="How can we help?" required rows={3}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-red-500/10 resize-none"
                value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              ></textarea>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-5 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
