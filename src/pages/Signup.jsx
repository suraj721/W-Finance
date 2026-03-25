import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, googleSignIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleGoogleSignIn = async () => {
    const res = await googleSignIn();
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#060606] px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="glass-panel p-10 md:p-12 rounded-[2.5rem] w-full max-w-md relative z-10 border border-slate-200 dark:border-[#222222]">
        <div className="mb-10 text-center">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-tight mb-2">Signup</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Join the Network</p>
        </div>

        {error && (
            <div className="bg-accent/10 text-accent border border-accent/20 p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Account Name</label>
            <input
              type="text"
              className="input-field px-6 py-4 font-bold tracking-wide"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="eg. Murad Hossain"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Email Identity</label>
            <input
              type="email"
              className="input-field px-6 py-4 font-bold tracking-wide"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Secure Key</label>
            <input
              type="password"
              className="input-field px-6 py-4 font-bold tracking-wide"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="w-full h-14 rounded-full bg-secondary text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,209,255,0.2)]">
            Create Identity
          </button>
        </form>
        
        <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-slate-200 dark:bg-[#222222] flex-1"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
            <div className="h-px bg-slate-200 dark:bg-[#222222] flex-1"></div>
        </div>

        <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className="w-full h-14 rounded-full border border-slate-200 dark:border-[#222222] bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-50 dark:hover:bg-[#111111] transition-all flex items-center justify-center gap-3"
        >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
        </button>

        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-[#1A1A1A] text-center">
            <p className="text-slate-500 text-xs font-bold font-sans tracking-widest uppercase">
                Already registered?{" "}
                <Link to="/login" className="text-secondary hover:text-slate-900 dark:hover:text-white transition-colors ml-2">
                    Login Now
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
