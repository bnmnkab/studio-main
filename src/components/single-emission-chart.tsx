
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { EmissionData } from '@/lib/types';
import { format, isValid } from 'date-fns';

interface SingleEmissionChartProps {
  data: any[];
  dataKey: keyof EmissionData;
  name: string;
  unit: string;
  strokeColor: string;
}

const CustomTooltip = ({ active, payload, label, name, unit }: any) => {
  if (active && payload && payload.length) {
    const dateObj = new Date(label);
    const formattedLabel = isValid(dateObj) ? format(dateObj, 'HH:mm:ss') : 'Belirsiz';
    
    const rawValue = payload[0].value;
    const formattedValue = typeof rawValue === 'number' ? rawValue.toFixed(4) : rawValue;

    return (
      <div className="bg-background/95 backdrop-blur-md border border-primary/20 p-3 rounded-xl shadow-xl">
        <p className="text-[10px] uppercase font-black text-primary/70 tracking-widest mb-1">{`Zaman: ${formattedLabel}`}</p>
        <p className="text-sm font-black" style={{ color: payload[0].color }}>
            {`${name}: ${formattedValue} ${unit}`}
        </p>
      </div>
    );
  }
  return null;
};

export function SingleEmissionChart({ data, dataKey, name, unit, strokeColor }: SingleEmissionChartProps) {
  return (
    <Card className="border-none shadow-lg bg-white overflow-hidden">
      <CardHeader className="bg-primary/[0.02] border-b border-primary/5 pb-3">
        <CardTitle className="text-sm font-black text-primary/60 uppercase tracking-wider">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => {
                          const d = new Date(timestamp);
                          return isValid(d) ? format(d, 'HH:mm') : '';
                        }}
                        stroke="hsl(var(--primary) / 0.8)"
                        fontSize={11}
                        fontWeight="700"
                        tick={{ fill: 'hsl(var(--primary) / 0.8)' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--primary) / 0.8)" 
                      fontSize={11} 
                      fontWeight="700"
                      domain={['auto', 'auto']} 
                      tick={{ fill: 'hsl(var(--primary) / 0.8)' }}
                    />
                    <Tooltip content={<CustomTooltip name={name} unit={unit} />} />
                    <Line 
                      type="monotone" 
                      dataKey={dataKey as string} 
                      name={name} 
                      stroke={strokeColor} 
                      dot={{ r: 3, fill: strokeColor, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      strokeWidth={3}
                      animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
