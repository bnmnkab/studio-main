'use client';

import { useContext } from 'react';
import { DashboardContext } from '@/contexts/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wallet, Leaf, Trees, ShieldCheck, Gauge, TrendingUp, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const EcoMetricCard = ({ title, value, unit, icon, colorClass, description, isPulsing }: any) => (
  <Card className={cn(
    "border-none shadow-lg bg-white overflow-hidden transition-all duration-500 h-full",
    isPulsing && "ring-2 ring-primary/20 scale-[1.01]"
  )}>
    <CardHeader className={cn("pb-2 border-b border-gray-50", colorClass)}>
      <div className="flex items-center justify-between">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-70">{title}</CardTitle>
        {icon}
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tighter text-foreground">
          {value !== null && value !== undefined ? value : '---'}
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase">{unit}</span>
      </div>
      <p className="mt-1 text-[9px] font-bold text-muted-foreground leading-tight uppercase">
        {description}
      </p>
    </CardContent>
  </Card>
);

export default function EconomyPage() {
  const context = useContext(DashboardContext);

  if (!context) return null;

  const { emissions, loading, error, isPulsing } = context;

  if (loading && !emissions) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Veri Bağlantı Hatası</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const cevreEtkisi = emissions?.cevre_etkisi;
  const ekonomi = emissions?.ekonomi;

  return (
    <div className="space-y-4 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* 1. SİSTEM DURUM ÇUBUĞU (EN ÜSTTE) */}
      <div className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between text-white overflow-hidden relative shadow-xl border-l-4 border-l-primary">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/20 to-transparent" />
        <div className="relative z-10 flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Sistem Verimlilik Oranı</span>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-black text-primary">%{emissions?.efficiency ?? '0'}</span>
               <span className="text-[10px] text-white/60 font-bold uppercase">Optimal</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Tasarruf Durumu</span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-bold text-emerald-400 uppercase tracking-tight">AKTİF OPTİMİZASYON</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-right hidden sm:block">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
            <Cpu className="h-3 w-3" /> AYBİS EKONOMİ MODÜLÜ
          </p>
        </div>
      </div>

      {/* 2. ÇEVRESEL METRİKLER (3'LÜ KART) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EcoMetricCard 
          title="Engellenen CO₂" 
          value={cevreEtkisi?.engellenen_co2_kg} 
          unit="kg" 
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
          colorClass="bg-emerald-50 text-emerald-900"
          description="Atmosfere salınımı engellenen karbon miktarı"
          isPulsing={isPulsing}
        />
        <EcoMetricCard 
          title="Günlük Ağaç Katkısı" 
          value={cevreEtkisi?.gunluk_agac_katkisi} 
          unit="adet" 
          icon={<Trees className="h-5 w-5 text-green-600" />}
          colorClass="bg-green-50 text-green-900"
          description="Sistemin sağladığı günlük oksijen eşdeğeri"
          isPulsing={isPulsing}
        />
        <EcoMetricCard 
          title="Anlık Karbon" 
          value={cevreEtkisi?.anlik_salinim_kg} 
          unit="kg" 
          icon={<Leaf className="h-5 w-5 text-teal-600" />}
          colorClass="bg-teal-50 text-teal-900"
          description="Üretim esnasındaki anlık karbon ayak izi"
          isPulsing={isPulsing}
        />
      </div>

      {/* 3. FİNANSAL VERİMLİLİK ANALİZİ (GENİŞ PANEL) */}
      <Card className="border-none shadow-2xl bg-white overflow-hidden border-t-4 border-t-primary">
        <CardHeader className="bg-primary/5 border-b border-primary/10 py-4 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl shadow-inner">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-primary tracking-tighter uppercase">Finansal Verimlilik Analizi</CardTitle>
                <CardDescription className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Canlı Yakıt ve Tasarruf Verileri</CardDescription>
              </div>
            </div>
            <Badge className="bg-primary text-white font-black px-4 py-1 rounded-full shadow-lg text-[10px] animate-pulse">
              CANLI AKIŞ
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* YAKIT TÜKETİMİ BÖLMESİ (CANLI RENK) */}
            <div className="p-6 bg-primary/10 rounded-[1.5rem] border-2 border-primary/20 flex flex-col justify-between transition-all hover:bg-primary/[0.15] group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Gauge className="h-5 w-5 text-primary" />
                </div>
                <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest">Anlık Yakıt Tüketimi</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-primary tracking-tighter">
                  {ekonomi?.yakit_miktari ?? '0'}
                </span>
                <span className="text-lg font-bold text-primary/50 uppercase">m³/saat</span>
              </div>
              <div className="mt-6 pt-4 border-t border-primary/10">
                 <p className="text-[9px] font-black text-primary/50 uppercase leading-tight">
                    Sistemin anlık yük altındaki net tüketimi.
                 </p>
              </div>
            </div>

            {/* TASARRUF BÖLMESİ (CANLI RENK) */}
            <div className="p-6 bg-emerald-500/10 rounded-[1.5rem] border-2 border-emerald-500/20 flex flex-col justify-between transition-all hover:bg-emerald-500/[0.15] group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest">Yapılan Tasarruf</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-emerald-600 tracking-tighter">
                  {ekonomi?.tasarruf_m3 ?? '0'}
                </span>
                <span className="text-lg font-bold text-emerald-600/50 uppercase">m³/saat</span>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-500/10">
                 <p className="text-[9px] font-black text-emerald-600/50 uppercase leading-tight">
                    Optimize edilen yanma ile kazanılan yakıt.
                 </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
