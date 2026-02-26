// import { useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const Intro = () => {
//     const videoRef = useRef(null);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (videoRef.current) {
//                     if (entry.isIntersecting) {
//                         videoRef.current.play().catch(err => console.log("Video play blocked:", err));
//                     } else {
//                         videoRef.current.pause();
//                     }
//                 }
//             },
//             { threshold: 0.3 }
//         );

//         if (videoRef.current) {
//             observer.observe(videoRef.current);
//         }

//         return () => {
//             if (videoRef.current) {
//                 observer.unobserve(videoRef.current);
//             }
//         };
//     }, []);

//     return (
//         <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#060606]">
//             {/* Hero Section */}
//             <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative overflow-hidden">
//                 {/* Background Glow */}
//                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] pointer-events-none rounded-full" />
                
//                 <div className="max-w-4xl mx-auto space-y-10 relative z-10">
//                     <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase leading-tight">
//                         Master Your <br />
//                         <span className="text-primary italic">Finance</span>
//                     </h1>
//                     <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
//                         Track expenses, visualize your spending habits, and achieve your financial goals with our <span className="text-white">premium personal finance tool</span>.
//                     </p>
                    
//                     <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
//                         <Link 
//                             to="/dashboard" 
//                             className="btn-primary px-10 h-16 flex items-center justify-center text-xl"
//                         >
//                             Get Started
//                             <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                             </svg>
//                         </Link>
//                         <Link 
//                             to="/login" 
//                             className="px-8 py-4 text-slate-400 hover:text-white font-bold transition-all"
//                         >
//                             Existing User? Login
//                         </Link>
//                     </div>

//                     <div className="relative w-full max-w-5xl mx-auto rounded-[3rem] overflow-hidden border border-[#222222] shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-[#0D0D0D] aspect-video group">
//                         <video 
//                             ref={videoRef}
//                             src="/210707.mov" 
//                             className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
//                             muted
//                             loop
//                             playsInline
//                             poster="/expense_tracker_hero.png"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/20 to-transparent opacity-60"></div>
//                         <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
//                     </div>
//                 </div>
//             </div>

//             {/* Features Section */}
//             <div className="py-24 md:py-32 bg-[#0D0D0D]/30 border-t border-[#222222]">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="grid md:grid-cols-3 gap-8">
//                         {/* Feature 1 */}
//                         <div className="glass-panel p-10 rounded-[2.5rem] hover:border-primary/50 transition-all group">
//                             <div className="w-16 h-16 bg-[#1A1A1A] border border-[#222222] rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
//                                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">Track Expenses</h3>
//                             <p className="text-slate-400 font-medium leading-relaxed">
//                                 Easily log your daily expenses and income. Categorize transactions to see exactly where your money goes.
//                             </p>
//                         </div>

//                         {/* Feature 2 */}
//                         <div className="glass-panel p-10 rounded-[2.5rem] hover:border-secondary/50 transition-all group">
//                             <div className="w-16 h-16 bg-[#1A1A1A] border border-[#222222] rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
//                                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">Visual Analytics</h3>
//                             <p className="text-slate-400 font-medium leading-relaxed">
//                                 Visualize your financial health with beautiful interactive charts and graphs. Spot trends instantly.
//                             </p>
//                         </div>

//                         {/* Feature 3 */}
//                         <div className="glass-panel p-10 rounded-[2.5rem] hover:border-accent/50 transition-all group">
//                             <div className="w-16 h-16 bg-[#1A1A1A] border border-[#222222] rounded-2xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
//                                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">Secure & Private</h3>
//                             <p className="text-slate-400 font-medium leading-relaxed">
//                                 Your data is encrypted and secure. We prioritize your privacy so you can manage your money with peace of mind.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Intro;
import { Link } from "react-router-dom";

const Intro = () => {
  const BRAND = "#D9FF00"; // Exact lemon color

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">

      {/* LEMON RADIAL GLOW BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(217,255,0,0.18) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(217,255,0,0.08) 0%, transparent 50%)",
        }}
      />

      <section className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 pt-28 pb-24">

        {/* HEADLINE */}
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-tight">
          <span className="text-slate-900 dark:text-white">MASTER YOUR</span>
          <br />
          <span
            style={{
              color: BRAND,
              textShadow: "0 0 40px rgba(217,255,0,0.8)",
            }}
          >
            FINANCE
          </span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mt-8 leading-relaxed">
          Track expenses, visualize your spending habits, and achieve your
          financial goals with our premium personal finance tool.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-6 mt-10 items-center">
          <Link
            to="/dashboard"
            className="px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            style={{
              backgroundColor: BRAND,
              color: "black",
              boxShadow: "0 0 60px rgba(217,255,0,0.7)",
            }}
          >
            Get Started →
          </Link>

          <Link
            to="/login"
            className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          >
            Existing User? Login
          </Link>
        </div>

        {/* TRUST LINE */}
        <p className="text-sm text-slate-600 dark:text-slate-500 mt-6">
          Trusted by 2,000+ users • 99.99% uptime • Secure & encrypted
        </p>

        {/* DASHBOARD MOCK PREVIEW */}
        <div className="relative mt-24 w-full max-w-6xl">

          {/* OUTER LEMON GLOW */}
          <div
            className="absolute inset-0 rounded-[40px]"
            style={{
              boxShadow: "0 0 150px rgba(217,255,0,0.4)",
            }}
          />

          <div
            className="relative bg-white dark:bg-[#0E0E0E] rounded-[40px] p-10"
            style={{
              border: "1px solid rgba(148,163,184,0.25)",
            }}
          >
            <div className="grid md:grid-cols-3 gap-8">

              {/* Chart Area */}
              <div className="md:col-span-2 bg-slate-100 dark:bg-[#141414] rounded-2xl p-6">
                <h3 className="text-slate-600 dark:text-slate-400 mb-4">Monthly Growth</h3>

                <div className="flex items-end gap-4 h-40">
                  {[40, 55, 70, 50, 80, 95, 110].map((h, i) => (
                    <div
                      key={i}
                      className="w-6 rounded-t-lg"
                      style={{
                        height: `${h}px`,
                        backgroundColor: BRAND,
                        boxShadow: "0 0 25px rgba(217,255,0,0.8)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-slate-100 dark:bg-[#141414] rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-600 dark:text-slate-400">Total Income</h3>
                  <p
                    className="text-3xl font-bold mt-2"
                    style={{ color: BRAND }}
                  >
                    ₹1,12,321
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-slate-600 dark:text-slate-400">Savings Rate</h3>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-2">
                    72%
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Expense Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                { name: "Coffee Shop", value: "- ₹40" },
                { name: "Gym Membership", value: "- ₹179" },
                { name: "Flight Booking", value: "- ₹197" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-100 dark:bg-[#141414] p-6 rounded-xl transition"
                  style={{
                    border: "1px solid rgba(148,163,184,0.2)",
                  }}
                >
                  <p className="text-slate-600 dark:text-slate-400">{item.name}</p>
                  <p
                    className="font-semibold mt-2"
                    style={{ color: BRAND }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </section>
    </div>
  );
};

export default Intro;
