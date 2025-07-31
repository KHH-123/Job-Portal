'use client';

import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  title?: string;
  showLegend?: boolean;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green  
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
];

export function PieChart({ 
  data, 
  height = 300,
  title,
  showLegend = true
}: PieChartProps) {
  const dataWithColors = data.map((entry, index) => ({
    ...entry,
    color: entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          {showLegend && (
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}