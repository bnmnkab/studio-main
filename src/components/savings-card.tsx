"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

interface SavingsCardProps {
  value: number | string | null | undefined;
  isPulsing?: boolean;
}

export function SavingsCard({ value, isPulsing }: SavingsCardProps) {
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
        "bg-[hsl(var(--savings-green)/0.1)] border-[hsl(var(--savings-green)/0.4)] text-[hsl(var(--savings-green))] transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[hsl(var(--savings-green)/0.1)]", 
        isPulsing && "animate-pulse-once"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[hsl(var(--savings-green)/0.8)]">
            CO₂ Tasarrufu
        </CardTitle>
        <Leaf className="h-4 w-4 text-[hsl(var(--savings-green)/0.9)]" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {displayValue}
        </div>
        <p className="text-xs text-[hsl(var(--savings-green)/0.8)]">{showUnit ? "kg" : <span>&nbsp;</span>}</p>
      </CardContent>
    </Card>
  );
}
