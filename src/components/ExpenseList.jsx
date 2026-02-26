import { useState } from "react";

function ExpenseList({ transactions, deleteTransaction }) {
  const [sortType, setSortType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions
    .filter((transaction) => {
      if (sortType === "Income") return transaction.amount > 0;
      if (sortType === "Expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) =>
      transaction.text.toUpperCase().includes(searchTerm.toUpperCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="glass-panel p-6 rounded-[2rem] h-[624px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Spending History</h3>
        <select
          className="bg-white dark:bg-[#1A1A1A] border border-slate-300 dark:border-[#222222] text-slate-500 dark:text-slate-400 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary uppercase tracking-wider"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Income">Incomes</option>
          <option value="Expense">Expenses</option>
        </select>
      </div>

      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="input-field pl-11 py-2 text-sm"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-[#222222]">
            <tr>
              <th className="pb-4 pt-0">Category</th>
              <th className="pb-4 pt-0">Amount</th>
              <th className="pb-4 pt-0 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#222222]">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-slate-500 text-sm">No records found</td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="group hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${transaction.amount >= 0 ? "bg-secondary shadow-[0_0_8px_#00D1FF]" : "bg-accent shadow-[0_0_8px_#FF5C00]"}`} />
                      <span className="text-slate-900 dark:text-white font-semibold text-sm">{transaction.text}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-sm font-bold ${transaction.amount >= 0 ? "text-secondary" : "text-accent"}`}>
                      {transaction.amount >= 0 ? "+" : "-"}₹{Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => deleteTransaction(transaction._id)}
                      className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;
