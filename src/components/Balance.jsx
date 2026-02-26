function Balance({ transactions }) {
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0));

  const inCurrentMonth = (dateValue) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const d = new Date(dateValue);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  };

  const currentIncome = transactions
    .filter((t) => t.amount > 0 && inCurrentMonth(t.createdAt))
    .reduce((acc, t) => acc + t.amount, 0);
  const currentExpense = Math.abs(
    transactions
      .filter((t) => t.amount < 0 && inCurrentMonth(t.createdAt))
      .reduce((acc, t) => acc + t.amount, 0)
  );

  const budgetLimit = currentIncome > 0 ? currentIncome : 1;
  const budgetUsed = currentExpense;
  const budgetProgress = Math.min(100, (budgetUsed / budgetLimit) * 100);

  return (
    <>
      {/* 1. Budget Card */}
      <div className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between h-[200px]">
        <div className="flex justify-between items-start">
          <span className="text-slate-900 dark:text-white font-bold text-lg">Budget</span>
          <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
          </button>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">₹{balance.toLocaleString()}</h2>
          <p className="text-slate-500 text-sm mt-1">Used ₹{budgetUsed.toLocaleString()} of ₹{budgetLimit.toLocaleString()} this month</p>
        </div>
        <div
          className="w-full bg-slate-300 dark:bg-[#222222] h-2 rounded-full overflow-hidden mt-4"
          aria-hidden="true"
          title="Monthly budget usage"
        >
          <div className="bg-primary h-full opacity-80" style={{ width: `${budgetProgress}%` }} />
        </div>
      </div>

      {/* 2. Incomes Card */}
      <div className="bg-gradient-to-br from-[#ECFDF5] to-white dark:from-[#0a2e21] dark:to-[#161616] border border-[#BBF7D0] dark:border-[#1a4a35] p-6 rounded-[2rem] flex flex-col justify-between h-[200px]">
        <div className="flex justify-between items-start">
          <span className="text-slate-900 dark:text-white font-bold text-lg">Incomes</span>
          <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center text-black">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">₹{income.toLocaleString()}</h2>
          <p className="text-slate-600 dark:text-slate-500 text-xs mt-1">Total recorded income</p>
        </div>
      </div>

      {/* 3. Expenses Card */}
      <div className="bg-gradient-to-br from-[#FEF2F2] to-white dark:from-[#2e0a0a] dark:to-[#161616] border border-[#FECACA] dark:border-[#4a1a1a] p-6 rounded-[2rem] flex flex-col justify-between h-[200px]">
        <div className="flex justify-between items-start">
          <span className="text-slate-900 dark:text-white font-bold text-lg">Expenses</span>
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">₹{expense.toLocaleString()}</h2>
          <p className="text-slate-600 dark:text-slate-500 text-xs mt-1">Total recorded expense</p>
        </div>
      </div>
    </>
  );
}

export default Balance;
