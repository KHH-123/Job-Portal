'use client';

import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface AreaChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  title?: string;
  fillOpacity?: number;
}

export function AreaChart({ 
  data, 
  xKey, 
  yKey, 
  color = '#3b82f6', 
  height = 300,
  title,
  fillOpacity = 0.3
}: AreaChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id={`colorGradient-${yKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={fillOpacity * 2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey={xKey} 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            strokeWidth={2}
            fill={`url(#colorGradient-${yKey})`}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}