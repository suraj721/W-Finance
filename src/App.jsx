import Header from "./components/Header";
import Balance from "./components/Balance"
import ExpenseList from "./components/ExpenseList"
import AddTransaction from "./components/AddTransaction"
import ChartIncome from "./components/ChartIncome"; 
import ChartExpense from "./components/ChartExpense";
import Transactions from "./components/Transactions";
import Charts from "./components/Charts";
import Profile from "./components/Profile";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Intro from "./pages/Intro";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthContext from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppContent() {
    const [transactions, setTransactions] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { user } = useContext(AuthContext);
  
    const getTransactions = useCallback(async () => {
      try {
        if (!user?.token) return;
        const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setTransactions(data.data);
      } catch (err) {
        console.log(err);
      }
    }, [user?.token]);

    useEffect(() => {
      if (user) {
        getTransactions();
      }
    }, [user, getTransactions]);

    const addTransaction = async (text, amount) => {
      const newTransaction = {
        text,
        amount
      };

      try {
        if (!user?.token) return;
        const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(newTransaction)
        });

        const data = await res.json();
        setTransactions([...transactions, data.data]);
      } catch (err) {
        console.log(err);
      }
    };

    const deleteTransaction = async (id) => {
      try {
        if (!user?.token) return;
        const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
        await fetch(`${apiUrl}/api/transactions/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        setTransactions(transactions.filter(transaction => transaction._id !== id));
      } catch (err) {
        console.log(err);
      }
    };


  return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#060606] text-slate-800 dark:text-slate-200 font-sans selection:bg-primary/30 selection:text-primary-100 pb-20 transition-colors duration-300">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 dark:bg-secondary/10 blur-[120px]" />
        </div>

        <Header onAddClick={() => setIsAddModalOpen(true)} />

        <AddTransaction 
          transactions={transactions} 
          addTransaction={addTransaction} 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
        />
        
        {/* Floating Action Button (FAB) */}
        {user && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="fixed bottom-24 right-8 z-[40] w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_30px_rgba(217,255,0,0.4)] hover:scale-110 active:scale-95 transition-all lg:hidden"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
        
        <main className="relative pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24 md:pb-8">
          <Routes>
            <Route path="/intro" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Intro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/transactions" element={
              <ProtectedRoute>
                <Transactions transactions={transactions} deleteTransaction={deleteTransaction}/>
              </ProtectedRoute>
            }/>
            <Route path="/charts" element={
              <ProtectedRoute>
                <Charts transactions={transactions} />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="space-y-6">
                  {/* Top Row: Metrics (Budget, Incomes, Expenses) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Balance transactions={transactions}/>
                  </div>
                  
                  {/* Middle Row: Main Budget & Spending Flow Chart */}
                  <div className="grid grid-cols-1 gap-6">
                     <Charts transactions={transactions} type="mainFlow" />
                  </div>
  
                  {/* Bottom Row: Additional Analytics & History */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <ChartIncome transactions={transactions} compact={true}/>
                      <ChartExpense transactions={transactions} compact={true}/>
                    </div>
                    <div className="lg:col-span-3">
                      <ExpenseList transactions={transactions} deleteTransaction={deleteTransaction}/>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        {user && <BottomNav />}
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
