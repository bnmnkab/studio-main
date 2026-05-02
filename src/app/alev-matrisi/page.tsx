'use client';

import { useContext } from 'react';
import { DashboardContext } from '@/contexts/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Flame, AlertTriangle, MoveHorizontal, MoveVertical, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const getHeatColor = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'rgba(255, 255, 255, 0.05)';
  const normalized = Math.max(0, Math.min(1, value));
  const hue = 45 * (1 - normalized); // 45 is yellow-orange hue
  const lightness = 60 - (normalized * 30); // 60 to 30 for depth
  const saturation = 100;
  // Transition: Yellow (low) -> Deep Red (high)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const HeatCell = ({ label, value }: { label: string; value: number | null | undefined }) => {
  const backgroundColor = getHeatColor(value);
  const isHigh = value && value > 0.8;

  return (
    <div 
      className={cn(
        "aspect-square rounded-2xl flex flex-col items-center justify-center p-3 transition-all duration-500 shadow-md border border-white/20 relative overflow-hidden group",
        isHigh && "animate-pulse ring-2 ring-red-500"
      )}
      style={{ backgroundColor }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-20 pointer-events-none" />
      <span className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 z-10 text-center leading-none">
        {label}
      </span>
      <span className="text-3xl font-black text-black tracking-tighter z-10">
        {value !== null && value !== undefined ? value.toFixed(2) : '--'}
      </span>
      {isHigh && (
        <Flame className="absolute -bottom-2 -right-2 h-10 w-10 text-black/10 text-center rotate-12" />
      )}
    </div>
  );
};

const AnalysisParamCard = ({ title, value, icon, description, idealNote, unit = "" }: any) => (
  <Card className="border-none shadow-xl bg-white overflow-hidden transition-all hover:shadow-2xl h-full flex flex-col">
    <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
      <div className="p-2.5 bg-primary/10 rounded-xl text-primary">{icon}</div>
    </CardHeader>
    <CardContent className="p-6 pt-2 flex-grow flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-5xl font-black tracking-tighter text-foreground">
            {value !== null && value !== undefined ? (value > 0 ? `+${value}` : value) : '---'}
          </span>
          <span className="text-sm font-bold text-muted-foreground uppercase">{unit}</span>
        </div>
        <p className="text-[13px] font-bold text-slate-700 leading-tight uppercase">
          {description}
        </p>
      </div>
      {idealNote && (
        <div className="flex items-center gap-2 text-[11px] font-black text-emerald-600 uppercase tracking-tight bg-emerald-50 w-full px-4 py-2.5 rounded-xl border border-emerald-100">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {idealNote}
        </div>
      )}
    </CardContent>
  </Card>
);

export default function AlevMatrisiPage() {
  const context = useContext(DashboardContext);
  if (!context) return null;
  const { matrisData, matrisLoading, matrisError, analizData } = context;

  if (matrisLoading && !matrisData) return <Skeleton className="h-[600px] w-full rounded-3xl" />;
  if (matrisError) return <Alert variant="destructive"><AlertTitle>Veri Hatası</AlertTitle><AlertDescription>{matrisError}</AlertDescription></Alert>;

  const rows = [
    [{ id: 'solust', label: 'Sol Üst', val: matrisData?.solust }, { id: 'aust', label: 'Üst', val: matrisData?.aust }, { id: 'sagust', label: 'Sağ Üst', val: matrisData?.sagust }],
    [{ id: 'asol', label: 'Sol', val: matrisData?.asol }, { id: 'merkez', label: 'Merkez', val: matrisData?.merkez }, { id: 'asag', label: 'Sağ', val: matrisData?.asag }],
    [{ id: 'solalt', label: 'Sol Alt', val: matrisData?.solalt }, { id: 'aalt', label: 'Alt', val: matrisData?.aalt }, { id: 'sagalt', label: 'Sağ Alt', val: matrisData?.sagalt }],
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 h-full">
          <Card className="border-none shadow-2xl bg-white overflow-hidden border-t-8 border-t-orange-600 h-full flex flex-col">
            <CardHeader className="bg-orange-50 border-b border-orange-100 py-6 px-8 text-center">
              <CardTitle className="text-3xl font-black text-orange-950 tracking-tighter uppercase">Brülör Isı Haritası</CardTitle>
              <Badge variant="outline" className="mt-2 border-orange-200 text-orange-800 text-[10px] font-black uppercase tracking-widest px-4 py-1.5">ANLIK YOĞUNLUK MATRİSİ</Badge>
            </CardHeader>
            <CardContent className="p-8 flex-grow flex flex-col justify-center">
              <div className="grid grid-cols-3 gap-4 w-full bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-inner">
                {rows.flat().map((cell) => <HeatCell key={cell.id} label={cell.label} value={cell.val} />)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6 h-full flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnalysisParamCard title="Yatay Eksen Sapması (dX)" value={analizData?.dX} icon={<MoveHorizontal className="h-7 w-7" />} description="Pozitif (+): Sağ taraf yığılma. Negatif (-): Sol tarafa kaçış." idealNote="İdeal Durum: 0'a yakın olması." />
            <AnalysisParamCard title="Dikey Eksen Sapması (dY)" value={analizData?.dY} icon={<MoveVertical className="h-7 w-7" />} description="Pozitif (+): Yukarı kalkış. Negatif (-): Aşağı çöküş." idealNote="İdeal Durum: 0'a yakın olması." />
          </div>
          
          <Card className="border-none shadow-2xl bg-white overflow-hidden border-l-8 border-l-primary flex-grow">
            <CardHeader className="bg-primary/5 py-5 px-8 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-primary/10 rounded-2xl shadow-inner"><Activity className="h-7 w-7 text-primary" /></div>
                  <div>
                    <CardTitle className="text-xl font-black text-primary uppercase tracking-widest leading-none">Geometrik Hata Analizi</CardTitle>
                    <CardDescription className="text-[11px] font-bold text-primary/40 uppercase tracking-[0.2em] mt-2">Yapay Zeka Stabilite Kontrolü</CardDescription>
                  </div>
                </div>
                {analizData?.ahata !== null && (
                   <Badge className={cn("font-black uppercase tracking-tighter px-6 py-2 rounded-full text-[12px] shadow-lg", (analizData?.ahata ?? 0) < 0.2 ? "bg-emerald-500" : "bg-orange-500 animate-blink")}>
                     {(analizData?.ahata ?? 0) < 0.2 ? 'STABİL' : 'SAPMA VAR'}
                   </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-10">
               <div className="flex items-baseline gap-5 mb-10">
                  <span className="text-8xl font-black text-primary tracking-tighter leading-none">{analizData?.ahata?.toFixed(3) ?? '---'}</span>
                  <div className="flex flex-col"><span className="text-[14px] font-black text-muted-foreground uppercase tracking-widest">Toplam Hata</span><span className="text-[14px] font-black text-muted-foreground uppercase tracking-widest">Katsayısı</span></div>
               </div>
               <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-100">
                  <div className="space-y-4">
                    <p className="text-[12px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Düşük Değer (0-0.2)</p>
                    <p className="text-sm font-bold text-slate-600 leading-tight uppercase">Sistem kararlı ve dengeli. Enerji verimliliği en üst seviyede.</p>
                  </div>
                  <div className="space-y-4 border-l-2 border-slate-100 pl-12">
                    <p className="text-[12px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Yüksek Değer (&gt; 0.2)</p>
                    <p className="text-sm font-bold text-slate-600 leading-tight uppercase">Kararsız yanma ve geometri bozulması. Mekanik müdahale gerekebilir.</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
