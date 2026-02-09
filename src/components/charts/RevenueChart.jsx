import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RevenueChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-96">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Andamento Cassa (Entrate vs Uscite)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="income" name="Entrate" stroke="#16a34a" fill="#22c55e" fillOpacity={0.1} />
          <Area type="monotone" dataKey="expense" name="Uscite" stroke="#dc2626" fill="#ef4444" fillOpacity={0.1} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
