'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { DashboardContext } from '@/contexts/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Wind, Fan, RefreshCw, MoveHorizontal, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DijitalIkizPage() {
  const context = useContext(DashboardContext);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [uiValues, setUiValues] = useState({
    step: 0,
    aci: 0,
    fan: 0
  });

  const prevData = useRef({ step: 0, aci: 0, fan: 0 });

  if (!context) return null;

  const { kontrolData } = context;

  // Veritabanından gelen ham veriler
  const fbStep = Number(kontrolData?.stepeksenel ?? 0);
  const fbAci = Number(kontrolData?.servoacı ?? kontrolData?.servoaci ?? 0);
  const fbFanRaw = Number(kontrolData?.fanpwm ?? 0);

  useEffect(() => {
    if (fbStep !== prevData.current.step || fbAci !== prevData.current.aci || fbFanRaw !== prevData.current.fan) {
      setIsUpdating(true);
      
      setUiValues({
        step: fbStep,
        aci: fbAci,
        fan: fbFanRaw
      });

      // İbareyi 10 saniye (mekanik geçiş süresi) boyunca göster
      const timer = setTimeout(() => setIsUpdating(false), 10000);
      
      prevData.current = { step: fbStep, aci: fbAci, fan: fbFanRaw };
      return () => clearTimeout(timer);
    }
  }, [fbStep, fbAci, fbFanRaw]);

  // Görsel hesaplamalar
  const turbulatorTranslate = (uiValues.step * 1.5).toFixed(2);
  const klapeRotate = uiValues.aci.toFixed(2);
  
  // Fan Durumu ve Hız Hesaplama (Mapping & Threshold)
  const isFanActive = uiValues.fan >= 5;
  // 0-180 arası değeri 3.0 (yavaş) ile 0.1 (hızlı) arasına oranla
  // Formül: duration = maxDuration - (currentValue / maxValue) * (maxDuration - minDuration)
  const targetDuration = isFanActive 
    ? (3.0 - (Math.min(uiValues.fan, 180) / 180) * 2.9).toFixed(2)
    : "3.00";

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <Card className="lg:col-span-8 border-none shadow-2xl bg-white overflow-hidden border-t-8 border-t-blue-600 min-h-[550px] flex flex-col relative">
          
          <div className={cn(
            "absolute top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
            isUpdating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          )}>
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-pulse">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Mekanik Geçiş İşleniyor (10s)</span>
            </Badge>
          </div>

          <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-6 px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                  <Box className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-blue-950 uppercase tracking-tighter">Brülör Dijital İkiz</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest">Senkronize Mekanik Simülasyon</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={cn("border-blue-200 font-black bg-blue-50 px-4 py-1 text-[10px]", isFanActive ? "text-emerald-600" : "text-slate-400")}>
                {isFanActive ? "FAN ÇALIŞIYOR" : "FAN STOP"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-grow relative bg-slate-50 flex items-center justify-center overflow-hidden">
            <div className="relative w-full max-w-3xl aspect-video flex items-center justify-center">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

              <div className="w-[90%] h-40 bg-slate-200 border-4 border-slate-300 rounded-xl relative overflow-hidden shadow-inner flex items-center justify-center">
                
                {/* TEKNİK CETVEL */}
                <div className="absolute bottom-0 left-0 w-full h-12 flex items-end justify-between px-[10%] opacity-40 pointer-events-none z-0">
                   {[-100, -75, -50, -25, 0, 25, 50, 75, 100].map((val) => (
                     <div key={val} className="flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-600 mb-1">{val}</span>
                        <div className={cn("w-0.5 bg-slate-400", val % 50 === 0 ? "h-6 w-1 bg-slate-600" : "h-3")} />
                     </div>
                   ))}
                </div>

                {/* FAN MOTORU (#fan-icon) */}
                <div className="absolute left-6 z-20">
                    <div className="p-2 bg-slate-800 rounded-full border-4 border-slate-600 shadow-2xl overflow-hidden">
                        <Fan 
                            id="fan-icon"
                            className={cn(
                              "h-16 w-16 text-blue-400 animate-spin",
                              !isFanActive && "opacity-20"
                            )}
                            style={{ 
                                animationDuration: `${targetDuration}s`,
                                animationPlayState: isFanActive ? 'running' : 'paused',
                                transition: 'all 0.5s ease-in-out',
                                willChange: 'animation-duration'
                            }}
                        />
                    </div>
                </div>

                {/* TÜRBU LATÖR */}
                <div 
                  id="turbulator"
                  className="absolute z-10"
                  style={{ 
                    transform: `translateX(${turbulatorTranslate}px)`,
                    transition: 'transform 10s ease-in-out',
                    willChange: 'transform'
                  }}
                >
                  <div className="w-16 h-32 bg-blue-600 rounded-lg shadow-2xl border-4 border-blue-800 flex flex-col items-center justify-around p-2 relative">
                    <div className="absolute -top-6 text-[10px] font-black text-blue-700 uppercase">EKSENEL</div>
                    {[1,2,3,4,5].map(i => <div key={i} className="w-full h-1 bg-blue-300/30 rounded-full" />)}
                  </div>
                </div>

                {/* KLAPE */}
                <div 
                  id="klape"
                  className="absolute left-[30%] origin-center z-10"
                  style={{ 
                    transform: `rotate(${klapeRotate}deg)`,
                    transition: 'transform 10s ease-in-out',
                    willChange: 'transform'
                  }}
                >
                  <div className="w-3 h-32 bg-orange-600 rounded-full shadow-2xl border-2 border-orange-800 relative flex justify-center">
                     <div className="absolute -top-6 text-[10px] font-black text-orange-700 uppercase">KLAPE</div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full border-4 border-white shadow-xl" />
                  </div>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white border-l-8 border-l-blue-500 transition-all hover:scale-[1.02]">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center gap-3 text-blue-600">
                <MoveHorizontal className="h-5 w-5" />
                <CardTitle className="text-[11px] font-black uppercase tracking-widest">Eksenel Pozisyon</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {uiValues.step > 0 ? `+${uiValues.step}` : uiValues.step}
                </span>
                <span className="text-sm font-bold text-slate-400">mm</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white border-l-8 border-l-orange-500 transition-all hover:scale-[1.02]">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center gap-3 text-orange-600">
                <RotateCw className="h-5 w-5" />
                <CardTitle className="text-[11px] font-black uppercase tracking-widest">Klape Açısı</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {uiValues.aci.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-slate-400">° derece</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Wind className="h-24 w-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Wind className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Fan Modülasyonu</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Güç (PWM)</span>
                  <span className={cn("text-3xl font-black tracking-tighter", isFanActive ? "text-emerald-400" : "text-rose-500")}>
                    {uiValues.fan}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Dönüş Periyodu</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    {isFanActive ? `${targetDuration} saniye` : 'MOTOR STOP'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
