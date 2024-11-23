import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQueueStore } from '../store/queueStore';

export function AnalyticsDashboard() {
  const { rooms } = useQueueStore();
  const [timeRange, setTimeRange] = useState('24h');

  // Calculate metrics
  const metrics = rooms.map(room => ({
    name: room.name,
    averageWaitTime: room.queue.reduce((acc, q) => acc + q.estimatedWaitTime, 0) / room.queue.length || 0,
    queueLength: room.queue.length,
    throughput: room.queue.length // In a real app, track completed services
  }));

  const timeRanges = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Queue Analytics</h2>
        <div className="flex space-x-2">
          {timeRanges.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTimeRange(id)}
              className={`
                px-3 py-1 rounded-md text-sm
                ${timeRange === id 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Waiting', value: metrics.reduce((acc, m) => acc + m.queueLength, 0) },
          { 
            label: 'Average Wait Time', 
            value: `${Math.round(metrics.reduce((acc, m) => acc + m.averageWaitTime, 0) / metrics.length)}m` 
          },
          { label: 'Daily Throughput', value: metrics.reduce((acc, m) => acc + m.throughput, 0) }
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="queueLength" stroke="#8884d8" name="Queue Length" />
            <Line type="monotone" dataKey="averageWaitTime" stroke="#82ca9d" name="Avg Wait Time" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}