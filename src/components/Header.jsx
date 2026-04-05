import { useState, useContext, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

function Header({ onAddClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [reminders, setReminders] = useState([]);

  // const fetchReminders = useCallback(async () => {
  //   try {
  //     const apiUrl = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");
  //     const token = localStorage.getItem('token');
  //     const res = await fetch(`${apiUrl}/api/reminders`, {
  //       headers: { 'Authorization': `Bearer ${token}` }
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       setReminders(data.data);
  //     }
  //   } catch (err) {
  //     console.error('Failed to fetch reminders:', err);
  //   }
  // }, []);
  
  const fetchReminders = useCallback(async () => {
    if (!user?.token) return;
  
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");
      const res = await fetch(`${apiUrl}/api/reminders`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
  
      const data = await res.json();
      if (data.success) {
        setReminders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    }
  }, [user?.token]);


  useEffect(() => {
    if (user) {
      fetchReminders();
      
      // Listen for custom event for instant sync
      window.addEventListener('remindersUpdated', fetchReminders);
      
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchReminders, 30000);
      
      return () => {
        window.removeEventListener('remindersUpdated', fetchReminders);
        clearInterval(interval);
      };
    }
  }, [user, fetchReminders]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 dark:border-[#1A1A1A] dark:bg-[#060606]/90 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center rotate-3 shadow-[0_0_20px_rgba(217,255,0,0.3)]">
              <span className="text-black font-black text-2xl italic">W</span>
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Finance</span>
          </Link>
 
          {user && (
            <div className="hidden lg:flex items-center bg-white dark:bg-[#111111] rounded-full p-1.5 border border-slate-200 dark:border-[#222222] shadow-inner">
              <Link
                to="/dashboard"
                className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive("/dashboard") ? "bg-primary text-black shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive("/transactions") ? "bg-primary text-black shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                History
              </Link>
              <Link
                to="/charts"
                className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive("/charts") ? "bg-primary text-black shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Analytics
              </Link>
            </div>
          )}
        </div>
 
        {/* Right: User & Actions */}
        <div className="flex items-center gap-6">
          <ThemeToggle />
          {user ? (
            <>
              {/* Quick Add Trigger */}
              <button 
                onClick={onAddClick}
                className="hidden sm:flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_25px_rgba(217,255,0,0.3)] active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                Post Entry
              </button>
 
              <div className="flex items-center gap-4 relative">
                <button 
                  onClick={() => {
                    const nextState = !isNotificationsOpen;
                    setIsNotificationsOpen(nextState);
                    if (nextState) fetchReminders();
                  }}
                  className={`w-12 h-12 rounded-full bg-white dark:bg-[#111111] border flex items-center justify-center transition-all group relative ${isNotificationsOpen ? 'border-primary shadow-[0_0_15px_rgba(217,255,0,0.2)]' : 'border-slate-300 dark:border-[#222222] text-slate-500 hover:text-primary hover:border-primary/50'}`}
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Notification Dot */}
                  {reminders.length > 0 && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white dark:border-[#060606] animate-pulse shadow-[0_0_10px_rgba(255,92,0,0.5)]"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsNotificationsOpen(false)}></div>
                    <div className="absolute top-16 right-0 w-80 glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[70] animate-in fade-in zoom-in duration-200 origin-top-right">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] italic">Intelligence</h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{reminders.length} Alerts</span>
                      </div>
                      
                      <div className="space-y-4">
                        {reminders.map(item => (
                          <div key={item._id} className="group cursor-pointer">
                            <div className="flex items-start gap-4 p-3 -m-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                              <div className={`w-1.5 h-10 rounded-full shrink-0 ${
                                item.color === 'primary' ? 'bg-primary shadow-[0_0_10px_rgba(217,255,0,0.4)]' : 
                                item.color === 'secondary' ? 'bg-secondary shadow-[0_0_10px_rgba(0,209,255,0.4)]' : 
                                'bg-accent shadow-[0_0_10px_rgba(255,92,0,0.4)]'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                  <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider truncate">{item.title}</h4>
                                  <span className="text-[10px] font-bold text-slate-900 dark:text-white shrink-0 ml-2 italic">{item.amount || ''}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.type || 'Alert'}</p>
                                  <span className="text-[9px] font-black text-slate-400 italic">{item.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full mt-6 py-3 rounded-xl border border-slate-300 dark:border-[#222222] text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all">
                        View All Activity
                      </button>
                    </div>
                  </>
                )}

                <Link to="/profile" className="flex items-center gap-4 pl-1.5 pr-5 py-1.5 bg-white dark:bg-[#111111] rounded-full border border-slate-300 dark:border-[#222222] hover:border-slate-400 dark:hover:border-white/20 transition-all group shadow-xl">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/5 ring-2 ring-primary/10">
                    {user.photo && user.photo !== 'no-photo.jpg' ? (
                      <img src={`${process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "")}/${user.photo}`} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-[#1A1A1A] text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{user.name}</span>
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="w-12 h-12 rounded-full bg-white dark:bg-[#111111] border border-slate-300 dark:border-[#222222] flex items-center justify-center text-slate-500 hover:text-red-500 transition-all hover:border-red-500/50"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary h-12 px-8 flex items-center text-[10px] uppercase font-black tracking-widest">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
