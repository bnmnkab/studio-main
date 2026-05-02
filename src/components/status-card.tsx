"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

interface StatusCardProps {
  prediction: string | null | undefined;
  isPulsing?: boolean;
}

export function StatusCard({ prediction, isPulsing }: StatusCardProps) {
  const status = prediction?.toLowerCase() || "";
  
  let icon = <AlertTriangle className="h-4 w-4" />;
  let cardClass = "bg-muted border-muted-foreground/20";
  let textClass = "text-muted-foreground";
  let title = "Durum Bilinmiyor";
  let isCritical = false;

  if (status.includes("stabil")) {
    title = "Sistem Stabil";
    icon = <ShieldCheck className="h-4 w-4 text-green-500" />;
    cardClass = "bg-green-500/10 border-green-500/40";
    textClass = "text-green-500";
  } else if (status.includes("kritik") || status.includes("arıza")) {
    title = "Kritik Durum";
    icon = <AlertTriangle className="h-4 w-4 text-red-500" />;
    cardClass = "bg-red-500/10 border-red-500/40";
    textClass = "text-red-500";
    isCritical = true;
  }

  return (
    <Card className={cn("transition-all duration-300 ease-in-out hover:shadow-lg", cardClass, isCritical && "animate-blink", isPulsing && "animate-pulse-once")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", textClass)}>
          Sistem Durumu
        </CardTitle>
        <div className={cn(textClass)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", textClass)}>
          {title}
        </div>
        <p className={cn("text-xs", textClass, "opacity-80")}>
            {prediction || "Veri bekleniyor..."}
        </p>
      </CardContent>
    </Card>
  );
}
