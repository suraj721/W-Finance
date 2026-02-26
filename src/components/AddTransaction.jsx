import { useState } from "react";

function AddTransaction({ addTransaction, isOpen, onClose }){
    const[text, setText] = useState("")
    const[amount, setAmount] = useState("")

    if (!isOpen) return null;

    const handleSubmit = (e)=>{
        e.preventDefault();
        addTransaction(text, parseFloat(amount))
        setText("");
        setAmount("");
        onClose();
    }

    return(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative glass-panel p-8 rounded-[2rem] w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tighter italic uppercase">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Quick Add
                    </h3>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1A1A] border border-slate-300 dark:border-[#222222] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Description</label>
                        <input 
                            list="transactionName"
                            type="text" 
                            maxLength={25}
                            value={text} 
                            className="input-field text-lg font-semibold" 
                            placeholder="e.g. Salary, Groceries..."
                            onChange={(e) => setText(e.target.value)} 
                            required 
                        />
                        <datalist id="transactionName">
                            <option value="Salary"/>
                            <option value="Groceries"/>
                            <option value="Electricity Bill"/>
                            <option value="Internet Bill"/>
                            <option value="Fuel"/>
                            <option value="Dining Out"/>
                            <option value="Miscellaneous" />
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-bold">₹</span>
                            <input 
                                type="number"
                                value={amount} 
                                className="input-field pl-10 text-xl font-black text-primary" 
                                placeholder="0.00"
                                onChange={(e) => setAmount(e.target.value)} 
                                required
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 font-bold italic tracking-wider">Negative for expense, positive for income</p>
                    </div>
                    <button type="submit" className="w-full btn-primary h-14 text-lg">
                        Confirm Transaction
                    </button>
                </form>
            </div>
        </div>
    )
}
export default AddTransaction;
