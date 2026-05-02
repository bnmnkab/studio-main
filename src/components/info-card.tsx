"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string | null | undefined;
  unit: string;
  className?: string;
  isPulsing?: boolean;
}

export function InfoCard({ icon, title, value, unit, className, isPulsing }: InfoCardProps) {
  let displayValue = "Bekleniyor...";
  let showUnit = false;

  if (value !== null && value !== undefined && value !== "") {
    const valueAsString = String(value).replace(",", ".");
    const numericValue = parseFloat(valueAsString);

    if (!isNaN(numericValue)) {
      if (numericValue % 1 === 0) {
        displayValue = numericValue.toString();
      } else {
        displayValue = numericValue.toFixed(2);
      }
      showUnit = true;
    }
  }

  return (
    <Card className={cn("transition-all duration-300 ease-in-out hover:shadow-lg", isPulsing && "animate-pulse-once", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary">
          {displayValue}
        </div>
        <p className="text-xs text-muted-foreground">{showUnit && unit ? unit : <span>&nbsp;</span>}</p>
      </CardContent>
    </Card>
  );
}
