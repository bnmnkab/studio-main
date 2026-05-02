'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, User, Cpu, Loader2 } from 'lucide-react';

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[150px]" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/95 backdrop-blur-md relative z-10 animate-in fade-in zoom-in duration-700 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pb-4 pt-12">
          <div className="flex justify-center mb-8">
             <div className="p-5 bg-primary/10 rounded-[2rem] shadow-inner text-primary animate-pulse">
                <Cpu className="h-16 w-16" />
             </div>
          </div>
          <CardTitle className="text-6xl font-black text-primary tracking-tighter uppercase">AYBİS</CardTitle>
          <CardDescription className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-4">Akıllı Yanma ve Brülör İzleme Sistemi</CardDescription>
        </CardHeader>
        <CardContent className="px-10 pt-10 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-[11px] font-black uppercase text-slate-400 ml-2">Kullanıcı Kimliği</Label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="username" placeholder="admin" className="pl-14 h-16 bg-slate-100/50 border-slate-200 rounded-2xl font-bold text-lg" />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-[11px] font-black uppercase text-slate-400 ml-2">Güvenlik Parolası</Label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-14 h-16 bg-slate-100/50 border-slate-200 rounded-2xl font-bold text-lg" />
              </div>
            </div>
            <Button type="submit" className="w-full h-16 text-base font-black uppercase tracking-widest mt-8 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-[0.97]" disabled={loading}>
              {loading ? <div className="flex items-center gap-3"><Loader2 className="h-6 w-6 animate-spin" /> SİSTEM BAĞLANTISI...</div> : "SİSTEME GİRİŞ YAP"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-12">
            <div className="w-16 h-1.5 bg-slate-200 rounded-full" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center leading-relaxed">Konya Sanayi / Tesis A<br/>GÜVENLİ ERİŞİM PROTOKOLÜ V2.5</p>
        </CardFooter>
      </Card>
      <div className="fixed bottom-8 text-[11px] text-white/30 font-black tracking-[0.6em] uppercase pointer-events-none">POWERED BY ARTIFICIAL INTELLIGENCE</div>
    </div>
  );
}
