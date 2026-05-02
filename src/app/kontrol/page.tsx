'use client';

import { useContext } from 'react';
import { DashboardContext } from '@/contexts/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Settings2, Cpu, Zap, Power, AlertTriangle, Cog, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const PIDCard = ({ label, value }: { label: string; value: number | null | undefined }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 transition-all hover:shadow-lg hover:bg-white group">
    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">{label} Katsayısı</span>
    <span className="text-5xl font-black text-primary tracking-tighter">
      {value !== null && value !== undefined ? value.toFixed(5) : '---'}
    </span>
  </div>
);

export default function KontrolPage() {
  const context = useContext(DashboardContext);
  if (!context) return null;
  const { kontrolData, kontrolLoading, kontrolError } = context;

  if (kontrolLoading && !kontrolData) return <div className="space-y-6"><Skeleton className="h-64 w-full" /><Skeleton className="h-96 w-full" /></div>;
  if (kontrolError) return <Alert variant="destructive"><AlertTitle>Bağlantı Hatası</AlertTitle><AlertDescription>{kontrolError}</AlertDescription></Alert>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto py-4">
      <Card className="border-none shadow-2xl bg-white overflow-hidden border-t-8 border-t-primary">
        <CardHeader className="bg-primary/5 py-6 px-10 border-b border-primary/10">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-primary/10 rounded-2xl shadow-inner"><Cpu className="h-8 w-8 text-primary" /></div>
            <div>
              <CardTitle className="text-2xl font-black text-primary uppercase tracking-widest">PID Algoritma Katsayıları</CardTitle>
              <CardDescription className="text-[11px] font-bold text-primary/40 uppercase tracking-widest mt-2">Sistem Dinamik Kontrol Parametreleri</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PIDCard label="Kp" value={kontrolData?.Kp} />
            <PIDCard label="Ki" value={kontrolData?.Ki} />
            <PIDCard label="Kd" value={kontrolData?.Kd} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-2xl bg-white overflow-hidden border-l-8 border-l-amber-500 h-full flex flex-col">
          <CardHeader className="bg-amber-50 py-6 px-10 border-b border-amber-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-2xl">
                  <Cog className={cn("h-7 w-7 text-amber-600", kontrolData?.bypass && "animate-spin-slow")} />
                </div>
                <CardTitle className="text-xl font-black text-amber-900 uppercase tracking-widest">Bypass Durumu</CardTitle>
              </div>
              <Badge className={cn("font-black px-6 py-2 text-[11px] uppercase tracking-widest", kontrolData?.bypass ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-500")}>
                {kontrolData?.bypass ? "AKTİF" : "DEAKTİF"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-12 flex-grow flex flex-col items-center justify-center text-center">
            <div className={cn("p-10 rounded-full mb-8 transition-all duration-500", kontrolData?.bypass ? "bg-amber-500/10 scale-110" : "bg-slate-100")}>
              <Power className={cn("h-20 w-20 transition-colors duration-500", kontrolData?.bypass ? "text-amber-500" : "text-slate-300")} />
            </div>
            <h3 className={cn("text-4xl font-black uppercase tracking-tighter mb-4", kontrolData?.bypass ? "text-amber-600" : "text-slate-400")}>
              {kontrolData?.bypass ? "Sistem Bypass Edildi" : "Normal Çalışma Modu"}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl bg-white overflow-hidden border-l-8 border-l-rose-500 h-full flex flex-col">
          <CardHeader className="bg-rose-50 py-6 px-10 border-b border-rose-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 rounded-2xl"><Activity className="h-7 w-7 text-rose-600" /></div>
              <CardTitle className="text-xl font-black text-rose-900 uppercase tracking-widest">Anlık Hata Oranı</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-12 flex-grow flex flex-col justify-center">
            <div className="flex items-baseline gap-6 mb-10">
              <span className={cn("text-9xl font-black tracking-tighter leading-none", (kontrolData?.hata ?? 0) > 20 || (kontrolData?.hata ?? 0) < -20 ? "text-rose-600" : "text-primary")}>
                {kontrolData?.hata !== null && kontrolData?.hata !== undefined ? (kontrolData.hata > 0 ? `+${kontrolData.hata.toFixed(3)}` : kontrolData.hata.toFixed(3)) : '---'}
              </span>
              <div className="flex flex-col"><span className="text-[14px] font-black text-muted-foreground uppercase tracking-widest">Hata</span><span className="text-[14px] font-black text-muted-foreground uppercase tracking-widest">Sapması</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
