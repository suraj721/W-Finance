import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function ChartIncome({ transactions, compact }) {
  const incomeData = transactions
    .filter((t) => t.amount > 0)
    .map((t) => ({
      name: new Date(t.createdAt).toLocaleDateString('default', { day: '2-digit', month: 'short' }),
      value: t.amount,
    }));

  return (
    <div className="bg-gradient-to-br from-white to-slate-100 dark:from-[#161616] dark:to-[#0D0D0D] border border-slate-200 dark:border-[#222222] p-6 rounded-[2rem] h-[300px] flex flex-col">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Income Flow</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={incomeData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D9FF00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D9FF00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
            <XAxis hide dataKey="name" />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #222222', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#D9FF00" 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartIncome;
