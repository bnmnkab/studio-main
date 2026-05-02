"use client";

import { useContext } from "react";
import { DashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Loader2, BarChart3, Archive } from "lucide-react";
import { EmissionChart } from "@/components/emission-chart";
import { HistoryPackets } from "@/components/history-packets";

export default function HistoryPage() {
  const context = useContext(DashboardContext);

  if (!context) return null;
  
  const { emissionsHistory, archiveLoading, archiveError } = context;

  const renderContent = () => {
    if (archiveLoading && emissionsHistory.length === 0) {
      return (
        <div className="space-y-8 flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-primary/10">
           <Loader2 className="h-14 w-14 animate-spin text-primary opacity-40" />
           <p className="text-primary/60 font-black tracking-tight text-lg">Bulut Veritabanı Taranıyor...</p>
           <div className="w-full max-w-2xl space-y-4">
              <Skeleton className="h-12 w-full bg-primary/5" />
              <Skeleton className="h-40 w-full bg-primary/5" />
           </div>
        </div>
      );
    }

    if (archiveError) {
      return (
          <Alert variant="destructive" className="border-2 shadow-lg">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-black">Veritabanı Erişim Hatası</AlertTitle>
            <AlertDescription className="font-medium">{archiveError}</AlertDescription>
        </Alert>
      )
    }
    
    if (emissionsHistory.length === 0 && !archiveLoading) {
       return (
            <Card className="border-dashed border-2 bg-primary/[0.01]">
                <CardContent className="flex flex-col items-center justify-center p-24 text-center">
                    <BarChart3 className="h-16 w-16 text-primary/20 mb-4" />
                    <h3 className="text-2xl font-black text-primary/50 tracking-tight">Arşiv Kaydı Mevcut Değil</h3>
                    <p className="mt-2 text-primary/40 font-medium max-w-xs">Veritabanında listelenecek herhangi bir emisyon paketi bulunamadı.</p>
                </CardContent>
            </Card>
        )
    }
    
    return (
        <div className="space-y-12">
            {/* 1. PAKETLER LİSTESİ - KOMPAKT VE ORTALANMIŞ (3/4 ORANI) */}
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <HistoryPackets />
              </div>
            </div>
            
            {/* 2. GRAFİKLER */}
            <div className="pt-8 border-t border-primary/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-3">
                  <BarChart3 className="h-7 w-7" />
                  TARİHSEL TREND ANALİZİ
                </h2>
                <div className="flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                  <Archive className="h-3.5 w-3.5" />
                  Sistem Arşiv Verileri Üzerinden Hesaplanmıştır
                </div>
              </div>
              <EmissionChart data={emissionsHistory} />
            </div>
        </div>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      {renderContent()}
    </div>
  );
}
