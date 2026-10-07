'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ChartData = {
  tanggal: string;
  kalori: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
};

type Props = {
  data: ChartData[];
  dataKey: 'kalori' | 'protein' | 'lemak' | 'karbohidrat';
  color: string;
  label: string;
};

export default function NutritionChart({ data, dataKey, color, label }: Props) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="tanggal" 
            stroke="var(--text-muted)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--text-muted)"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
            }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
