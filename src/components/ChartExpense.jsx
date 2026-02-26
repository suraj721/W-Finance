import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function ChartExpense({ transactions, compact }) {
  const expense = transactions.filter((t) => t.amount < 0);
  
  // Aggregate by category/text
  const data = expense.reduce((acc, t) => {
    const existing = acc.find(d => d.name === t.text);
    if (existing) existing.value += Math.abs(t.amount);
    else acc.push({ name: t.text, value: Math.abs(t.amount) });
    return acc;
  }, []);

  const COLORS = ["#FF5C00", "#00D1FF", "#D9FF00", "#FF005C", "#7000FF"];

  return (
    <div className="glass-panel p-6 rounded-[2rem] h-[300px] flex flex-col relative overflow-hidden">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Spending Categories</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              startAngle={180}
              endAngle={0}
              paddingAngle={8}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #222222', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{data.reduce((acc, d) => acc + d.value, 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default ChartExpense;
