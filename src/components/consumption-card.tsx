"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface ConsumptionCardProps {
  value: number | string | null | undefined;
  isPulsing?: boolean;
}

export function ConsumptionCard({ value, isPulsing }: ConsumptionCardProps) {
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
    <Card className={cn(
        "bg-[hsl(var(--metric-warning)/0.1)] border-[hsl(var(--metric-warning)/0.4)] text-[hsl(var(--metric-warning))] transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[hsl(var(--metric-warning)/0.1)]", 
        isPulsing && "animate-pulse-once"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[hsl(var(--metric-warning)/0.8)]">
            Anlık Karbon Emisyonu
        </CardTitle>
        <Flame className="h-4 w-4 text-[hsl(var(--metric-warning)/0.9)]" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {displayValue}
        </div>
        <p className="text-xs text-[hsl(var(--metric-warning)/0.8)]">{showUnit ? "kg" : <span>&nbsp;</span>}</p>
      </CardContent>
    </Card>
  );
}
