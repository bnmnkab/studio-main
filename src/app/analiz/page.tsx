
"use client";

import { useContext } from "react";
import { DashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { format, isValid } from "date-fns";
import { MapPin, Activity, TrendingUp, Cpu, AlertCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ReportSection = ({ title, content, icon, badge }: { title: string; content: string | null; icon: React.ReactNode; badge?: string; }) => (
    <Card className="border-none shadow-sm h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {icon}
                </div>
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
            </div>
            {badge && <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">{badge}</Badge>}
        </CardHeader>
        <CardContent className="flex-grow pt-0">
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50 h-full">
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium">
                    {content || "Analiz yapılıyor..."}
                </p>
            </div>
        </CardContent>
    </Card>
);

export default function AnalysisPage() {
  const context = useContext(DashboardContext);

  if (!context) return null;
  
  const { emissions, loading, error, lastSync } = context;

  if (loading && !emissions) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          <Skeleton className="h-96 md:col-span-2 lg:col-span-4 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Bağlantı Hatası</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }
  
  if (!emissions) {
    return (
      <Card className="rounded-xl border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-20 text-center">
              <Cpu className="h-16 w-16 text-primary animate-pulse opacity-40" />
              <h3 className="mt-6 text-2xl font-black text-foreground">Veri Bekleniyor</h3>
              <p className="mt-2 text-muted-foreground max-w-md">AYBİS Analiz Motoru ilk veriyi bekliyor.</p>
          </CardContent>
      </Card>
    )
  }

  // Handle case where date might still be invalid despite parsing attempts
  const formattedSyncTime = lastSync && isValid(lastSync) 
    ? format(lastSync, 'HH:mm:ss') 
    : (emissions?.last_sync ? String(emissions.last_sync) : 'Güncel');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card rounded-xl shadow-sm border border-border/50">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Yer: Büsan Sanayi / KONYA
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                SON SENKRONİZASYON: {formattedSyncTime}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">Termal Verimlilik</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-1 mb-4">
                        <span className="text-4xl font-black text-primary">%{emissions.efficiency?.toFixed(1) ?? '0.0'}</span>
                    </div>
                    <Progress value={emissions.efficiency ?? 0} className="h-2 rounded-full" />
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">Yapay Zeka Tahmini Arıza Sayısı</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl font-black text-primary">{emissions.ml_ariza_tahmini ?? '0'}</span>
                        <Badge variant="outline" className="text-xs">Aktif Analiz</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Sistem verilerine dayalı önleyici bakım öngörüsü.</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ReportSection 
                title="Durum Raporu" 
                content={emissions.expert_report} 
                icon={<TrendingUp />}
                badge="Sistem Özeti"
            />
            <div className="grid grid-cols-1 gap-8">
                <ReportSection 
                    title="Kritik Bölge" 
                    content={emissions.kritik_bolge} 
                    icon={<AlertCircle />}
                    badge="Optimizasyon"
                />
                <ReportSection 
                    title="Tahmini Arıza Zamanı" 
                    content={emissions.tahmini_ariza_vakti} 
                    icon={<Activity />}
                    badge="Bakım Öngörüsü"
                />
            </div>
        </div>
    </div>
  );
}
