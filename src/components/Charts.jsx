import React from 'react';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTheme } from '../context/ThemeContext';

function Charts({ transactions, type }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartGrid = isDark ? "#222222" : "#CBD5E1";
  const chartTick = isDark ? "#555555" : "#64748B";
  const tooltipBg = isDark ? "#0D0D0D" : "#FFFFFF";
  const tooltipBorder = isDark ? "#222222" : "#CBD5E1";
  const tooltipText = isDark ? "#FFFFFF" : "#0F172A";
  const chartCursor = isDark ? "#FFFFFF05" : "#F1F5F9";

  // 1. Monthly Data (Bar & Flow)
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    
    const existing = acc.find(d => d.name === month);
    if (existing) {
      if (t.amount > 0) existing.income += t.amount;
      else existing.expense += Math.abs(t.amount);
    } else {
      acc.push({
        name: month,
        income: t.amount > 0 ? t.amount : 0,
        expense: t.amount < 0 ? Math.abs(t.amount) : 0
      });
    }
    return acc;
  }, []);

  const expenseByCategory = transactions.reduce((acc, t) => {
    if (t.amount < 0) {
      const key = (t.text || "Uncategorized").trim();
      acc[key] = (acc[key] || 0) + Math.abs(t.amount);
    }
    return acc;
  }, {});

  const topCategoryEntry = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
  const topCategoryName = topCategoryEntry ? topCategoryEntry[0] : "No Expense Data";
  const topCategoryAmount = topCategoryEntry ? topCategoryEntry[1] : 0;

  if (type === 'mainFlow') {
    return (
      <div className="glass-panel p-8 rounded-[2rem] h-[400px]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Budget & Spending Flow</h3>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-slate-600 dark:text-slate-400 uppercase">Incomes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-slate-600 dark:text-slate-400 uppercase">Expenses</span>
            </div>
          </div>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: chartTick, fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: chartTick, fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: chartCursor }}
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px' }}
                itemStyle={{ color: tooltipText }}
              />
              <Bar 
                dataKey="income" 
                fill="#00D1FF" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
              <Bar 
                dataKey="expense" 
                fill="#FF5C00" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Default Full Analytics View (for /charts route)
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">Analytics</h2>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Financial Intelligence</p>
        </div>
        <div className="flex bg-white dark:bg-[#161616] p-1.5 rounded-full border border-slate-200 dark:border-[#222222] shadow-xl">
           <button className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-primary text-black transition-all hover:scale-105 active:scale-95">Monthly</button>
           <button className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">Yearly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Flow Overview */}
        <div className="lg:col-span-8">
           <div className="glass-panel p-10 rounded-[2.5rem] min-h-[450px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] pointer-events-none group-hover:bg-secondary/10 transition-all duration-700" />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase mb-10 tracking-tight">Income vs Spending Flow</h3>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
	                   <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
	                     <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
	                     <XAxis 
	                       dataKey="name" 
	                       axisLine={false} 
	                       tickLine={false} 
	                       tick={{ fill: chartTick, fontSize: 10, fontWeight: 'bold' }} 
	                       dy={10}
	                     />
	                     <YAxis 
	                       axisLine={false} 
	                       tickLine={false} 
	                       tick={{ fill: chartTick, fontSize: 10, fontWeight: 'bold' }} 
	                     />
	                     <Tooltip 
	                       cursor={{ fill: chartCursor }}
	                       contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '16px', padding: '12px' }}
	                       itemStyle={{ color: tooltipText, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
	                     />
                     <Bar 
                       dataKey="income" 
                       fill="#D9FF00" 
                       radius={[6, 6, 0, 0]} 
                       barSize={24}
                     />
                     <Bar 
                       dataKey="expense" 
                       fill="#FF5C00" 
                       radius={[6, 6, 0, 0]} 
                       barSize={24}
                     />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Side Stats */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel p-10 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-100 dark:from-[#161616] dark:to-[#0D0D0D]">
	              <h4 className="text-slate-500 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Efficiency Score</h4>
              <div className="flex items-end gap-2 mb-2">
	                <span className="text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter">84</span>
                <span className="text-primary font-bold mb-2">/100</span>
              </div>
	              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">Your spending is <span className="text-slate-900 dark:text-white">12% lower</span> than last month. Keep it up!</p>
           </div>

           <div className="glass-panel p-10 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-100 dark:from-[#1A1A1A] dark:to-[#161616] border border-primary/10">
              <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Top Category</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div>
	                   <p className="text-slate-900 dark:text-white font-black italic tracking-tight text-xl uppercase">{topCategoryName}</p>
	                   <p className="text-slate-500 text-xs font-bold font-sans tracking-widest">₹{topCategoryAmount.toLocaleString()} SPENT</p>
	                </div>
	              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
