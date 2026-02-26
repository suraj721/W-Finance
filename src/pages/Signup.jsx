import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, user } = useContext(AuthContext);
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
