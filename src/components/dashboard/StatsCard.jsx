export default function StatsCard({ title, value, icon: Icon, trend, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-full bg-${color}-100`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
        )}
      </div>
      <div className="flex items-baseline">
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
        {!!trend && (
          <span className={`ml-2 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}
