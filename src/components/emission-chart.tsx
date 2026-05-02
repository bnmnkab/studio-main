
'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";
import type { EmissionData } from '@/lib/types';
import { SingleEmissionChart } from './single-emission-chart';

interface EmissionChartProps {
  data: any[];
}

export function EmissionChart({ data }: EmissionChartProps) {
  if (!data || data.length < 2) {
    return (
       <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            Emisyon Geçmişi Grafikleri
          </CardTitle>
        </CardHeader>
        <CardContent>
             <Alert variant="secondary" className="bg-primary/5 border-primary/20">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">Yetersiz Veri</AlertTitle>
                <AlertDescription className="text-primary/70">Grafikleri çizebilmek için en az 2 veri noktası gereklidir. Lütfen veri akışını bekleyin.</AlertDescription>
            </Alert>
        </CardContent>
       </Card>
    );
  }

  // Ensure data is sorted by timestamp for correct linear representation
  // and maintain full decimal precision
  const chartData = [...data]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(d => ({
      ...d,
      timestamp: d.timestamp,
      co: typeof d.co === 'number' ? d.co : parseFloat(String(d.co).replace(',', '.')) || 0,
      co2: typeof d.co2 === 'number' ? d.co2 : parseFloat(String(d.co2).replace(',', '.')) || 0,
      o2: typeof d.o2 === 'number' ? d.o2 : parseFloat(String(d.o2).replace(',', '.')) || 0,
      lambda: typeof d.lambda === 'number' ? d.lambda : parseFloat(String(d.lambda).replace(',', '.')) || 0,
    }));
  
  const chartConfigs = [
    { dataKey: 'co', name: 'CO', unit: 'mg/m³', strokeColor: 'hsl(var(--chart-1))' },
    { dataKey: 'co2', name: 'CO₂', unit: 'mg/m³', strokeColor: 'hsl(var(--chart-3))' },
    { dataKey: 'o2', name: 'O₂', unit: '%', strokeColor: 'hsl(var(--chart-2))' },
    { dataKey: 'lambda', name: 'Lambda', unit: '', strokeColor: 'hsl(var(--chart-4))' },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {chartConfigs.map(config => (
         <SingleEmissionChart 
            key={config.dataKey}
            data={chartData}
            dataKey={config.dataKey as any}
            name={config.name}
            unit={config.unit}
            strokeColor={config.strokeColor}
         />
      ))}
    </div>
  );
}
