"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Gauge } from "lucide-react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

interface GaugeChartProps {
  value: number | null | undefined;
  isPulsing?: boolean;
}

export function GaugeChart({ value, isPulsing }: GaugeChartProps) {
  const numericValue = value ?? 0;
  
  const chartData = [{ name: "L1", value: numericValue }];

  const color =
    numericValue >= 95
      ? "hsl(var(--chart-2))"
      : numericValue >= 90
      ? "hsl(var(--chart-4))"
      : "hsl(var(--chart-1))";

  return (
    <Card className={cn(isPulsing && "animate-pulse-once", "transition-all duration-300 ease-in-out hover:shadow-lg")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Anlık Verim
        </CardTitle>
        <Gauge className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-0">
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="75%"
              outerRadius="90%"
              data={chartData}
              startAngle={180}
              endAngle={0}
              barSize={20}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: "hsl(var(--muted))" }}
                dataKey="value"
                angleAxisId={0}
                fill={color}
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute top-1/2 -translate-y-1 text-center">
            <span className="text-4xl font-bold" style={{ color }}>
                {numericValue.toFixed(1)}
            </span>
            <span className="text-lg font-medium text-muted-foreground" style={{ color }}>%</span>
        </div>
      </CardContent>
    </Card>
  );
}
