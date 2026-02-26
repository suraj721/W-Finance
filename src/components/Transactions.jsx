import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

function Transactions({ transactions, deleteTransaction }) {
  const [sortType, setSortType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [importing, setImporting] = useState(false);
  const { user } = useContext(AuthContext);

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

  const handleFileImport = async (file) => {
        setImporting(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                if (!user?.token) throw new Error("Authentication required");
                console.log("File read complete");
                let formattedData = [];
                const content = e.target.result;

                if (file.name.endsWith('.json')) {
                    const json = JSON.parse(content);
                    if (!Array.isArray(json)) throw new Error("Invalid JSON format: Expected an array");
                    formattedData = json.map(item => ({
                        text: item.text,
                        amount: Number(item.amount)
                    }));
                } else if (file.name.endsWith('.csv')) {
                    const lines = content.split('\n');
                    const startIndex = lines[0].toLowerCase().includes('text') ? 1 : 0;
                    
                    for (let i = startIndex; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;
                        
                        const parts = line.split(','); 
                        
                        let text, amount;
                        
                        if (line.startsWith('"')) {
                            const closingQuoteIndex = line.indexOf('",');
                            if (closingQuoteIndex !== -1) {
                                text = line.substring(1, closingQuoteIndex).replace(/""/g, '"');
                                const rest = line.substring(closingQuoteIndex + 2);
                                amount = rest.split(',')[0];
                            } else {
                                const parts = line.split(',');
                                if(parts.length >= 2) {
                                     amount = parts[parts.length - 2];
                                     const regex = /^"(.*)",(-?\d+(\.\d+)?),"(.*)"$/;
                                     const match = line.match(regex);
                                     if (match) {
                                         text = match[1].replace(/""/g, '"');
                                         amount = match[2];
                                     } else {
                                         text = parts[0];
                                         amount = parts[1];
                                     }
                                }
                            }
                        } else {
                            text = parts[0];
                            amount = parts[1];
                        }

                        if (text && amount && !isNaN(amount)) {
                            formattedData.push({
                                text: text.trim(),
                                amount: Number(amount)
                            });
                        }
                    }
                } else {
                    throw new Error("Unsupported file type");
                }

                if (formattedData.length === 0) {
                    throw new Error("No valid transactions found to import");
                }

                const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
                const res = await fetch(`${apiUrl}/api/transactions/import`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify(formattedData)
                });
                
                const data = await res.json();

                if (res.ok) {
                    alert(`Successfully imported ${data.count} transactions`);
                    window.location.reload(); 
                } else {
                    alert(`Import failed: ${data.error || 'Unknown error'}`);
                }
            } catch (err) {
                console.error(err);
                alert(`Import failed: ${err.message}`);
            } finally {
                setImporting(false);
            }
        };
        reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Transactions</h2>
        
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," 
                            + "Text,Amount,Date\n"
                            + transactions.map(t => `"${t.text.replace(/"/g, '""')}",${t.amount},"${new Date(t.createdAt).toLocaleDateString()}"`).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "transactions.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                    className="h-12 px-6 rounded-full bg-white dark:bg-[#161616] border border-slate-300 dark:border-[#222222] text-[#1db954] text-xs font-black uppercase tracking-widest hover:bg-[#1db954] hover:text-black transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                </button>
                
                <div className="relative group">
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setImporting(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setImporting(false);
                        }}
                        onDrop={async (e) => {
                            e.preventDefault();
                            setImporting(false);
                            const file = e.dataTransfer.files[0];
                            if (file) handleFileImport(file);
                        }}
                        className={`h-12 px-6 rounded-full bg-[rgba(217,255,0,0.4)] dark:bg-[#161616] border border-[rgba(217,255,0,0.4)] dark:border-[#222222] text-black dark:text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center gap-2 cursor-pointer ${importing ? 'opacity-70 grayscale' : ''}`}
                    >
                        {importing ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        )}
                        <span>{importing ? 'Drop' : 'Import'}</span>
                        
                        <input
                            type="file"
                            accept=".json,.csv"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={importing}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) handleFileImport(file);
                            }}
                        />
                    </div>
                </div>
            </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="input-field pl-12 pr-6 py-3 w-full sm:w-72 font-semibold transition-all shadow-inner"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative group">
            <select
                className="input-field px-6 py-3 w-full sm:w-56 font-bold text-slate-500 dark:text-slate-400 focus:text-slate-900 dark:focus:text-white cursor-pointer appearance-none"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
            >
                <option value="All">All Transactions</option>
                <option value="Income">Income Only</option>
                <option value="Expense">Expense Only</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#222222]">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Type</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1A1A1A]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <p className="text-slate-500 font-bold italic tracking-wider">No matching records found.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr 
                    key={transaction._id} 
                    className="hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          transaction.amount >= 0 
                            ? "border-[#1DB954]/30 bg-[#1DB954]/15 text-green-700 dark:border-primary/20 dark:bg-primary/10 dark:text-primary" 
                            : "border-accent/20 bg-accent/10 text-accent"
                        }`}>
                          {transaction.amount >= 0 ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          )}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg uppercase italic">{transaction.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        transaction.amount >= 0 
                          ? "text-[#1DB954] dark:text-primary" 
                          : "text-orange-700 dark:text-accent"
                      }`}>
                        {transaction.amount >= 0 ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-semibold text-sm">
                      {new Date(transaction.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className={`px-6 py-5 text-right font-black text-xl italic ${
                      transaction.amount >= 0 ? "text-[#1DB954] dark:text-primary" : "text-red-600 dark:text-red-500"
                    }`}>
                      {transaction.amount >= 0 ? "+" : "-"}₹{Math.abs(transaction.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => deleteTransaction(transaction._id)}
                        className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1A1A] border border-slate-300 dark:border-[#222222] flex items-center justify-center text-slate-600 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove Record"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
}

export default Transactions;
