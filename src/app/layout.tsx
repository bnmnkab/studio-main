'use client';

import { Toaster } from "@/components/ui/toaster";
import './globals.css';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { database } from "@/lib/firebase";
import { ref, onValue, off } from "firebase/database";
import type { EmissionData, SensorData, KontrolData, AnalizData, MatrisData } from "@/lib/types";
import { DashboardContext } from "@/contexts/DashboardContext";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator } from "@/components/ui/sidebar";
import { History, Zap, LayoutDashboard, Leaf, Flame, Settings2, Box } from "lucide-react";
import { LoginScreen } from "@/components/login-screen";

const parseLastSync = (dateVal: any): Date | null => {
  if (!dateVal) return null;
  if (typeof dateVal === 'string') {
    if (dateVal.includes(':') && !dateVal.includes('-')) {
      const timeParts = dateVal.split(':');
      if (timeParts.length >= 2) {
        const now = new Date();
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        now.setHours(hours, minutes, 0);
        return now;
      }
    }
  }
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? null : d;
};

const getTimestampFromPushId = (id: string): number => {
  const PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
  if (!id || id.length < 9) return Date.now();
  let time = 0;
  for (let i = 1; i < 9; i++) {
    const char = id.charAt(i);
    const index = PUSH_CHARS.indexOf(char);
    if (index === -1) return Date.now();
    time = (time * 64) + index;
  }
  return time;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const [emissions, setEmissions] = useState<EmissionData | null>(null);
  const [emissionsHistory, setEmissionsHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [sensorLoading, setSensorLoading] = useState(true);

  const [archiveLoading, setArchiveLoading] = useState(true);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const [analizData, setAnalizData] = useState<AnalizData | null>(null);
  const [analizLoading, setAnalizLoading] = useState(true);

  const [matrisData, setMatrisData] = useState<MatrisData | null>(null);
  const [matrisLoading, setMatrisLoading] = useState(true);
  const [matrisError, setMatrisError] = useState<string | null>(null);

  const [kontrolData, setKontrolData] = useState<KontrolData | null>(null);
  const [kontrolLoading, setKontrolLoading] = useState(true);
  const [kontrolError, setKontrolError] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    setIsHydrated(true);
    const authStatus = localStorage.getItem('aybis_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('aybis_auth', 'true');
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const dbRef = ref(database, "advanced_analysis");
    const onDataLoaded = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        setEmissions({ ...data, last_sync: parseLastSync(data.last_sync) });
        setLastSync(parseLastSync(data.last_sync));
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 700);
      }
      setLoading(false);
    };
    onValue(dbRef, onDataLoaded);
    return () => off(dbRef);
  }, [isAuthenticated]); 

  useEffect(() => {
    if (!isAuthenticated) return;
    const archiveRef = ref(database, "arsiv/paketler");
    onValue(archiveRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const packets = Object.entries(data).map(([id, val]) => ({
          firebaseId: id,
          timestamp: (val as any).timestamp || getTimestampFromPushId(id),
          ...val as any
        }));
        setEmissionsHistory([...packets].reverse());
      }
      setArchiveLoading(false);
    }, (err) => {
      setArchiveError(err.message);
      setArchiveLoading(false);
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const sensorRef = ref(database, "sensor");
    onValue(sensorRef, (snapshot) => {
        setSensorData(snapshot.val());
        setSensorLoading(false);
    });
    const analizRef = ref(database, "analiz");
    onValue(analizRef, (snapshot) => {
        setAnalizData(snapshot.val());
        setAnalizLoading(false);
    });
    const matrisRef = ref(database, "matris");
    onValue(matrisRef, (snapshot) => {
      setMatrisData(snapshot.val());
      setMatrisLoading(false);
    }, (err) => setMatrisError(err.message));
    const kontrolRef = ref(database, "kontrol");
    onValue(kontrolRef, (snapshot) => {
        setKontrolData(snapshot.val());
        setKontrolLoading(false);
    }, (err) => setKontrolError(err.message));
  }, [isAuthenticated]);

  const contextValue = {
    emissions, emissionsHistory, loading, error, isPulsing, lastSync,
    sensorData, sensorLoading, analizData, analizLoading, archiveLoading, archiveError,
    matrisData, matrisLoading, matrisError, kontrolData, kontrolLoading, kontrolError,
  };
  
  if (!isHydrated) return <html lang="tr"><body className="bg-slate-950" /></html>;

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased">
        {!isAuthenticated ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <DashboardContext.Provider value={contextValue as any}>
            <SidebarProvider>
                <Sidebar>
                  <SidebarHeader className="p-4">
                    <h1 className="text-3xl font-black tracking-tighter text-primary">AYBİS</h1>
                    <p className="text-[10px] uppercase font-bold text-sidebar-foreground/50 tracking-widest mt-0.5">Akıllı Yanma ve Brülör İzleme</p>
                    <SidebarSeparator className="mt-4" />
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/'} size="lg">
                          <Link href="/"><LayoutDashboard />Gösterge Paneli</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/analiz'} size="lg">
                          <Link href="/analiz"><Zap />Durum Analizi</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/history'} size="lg">
                          <Link href="/history"><History />Veri Arşivi</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/economy'} size="lg">
                          <Link href="/economy"><Leaf />Ekonomi ve Tasarruf</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/alev-matrisi'} size="lg">
                          <Link href="/alev-matrisi"><Flame />Alev Matrisi</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/kontrol'} size="lg">
                          <Link href="/kontrol"><Settings2 />Kontrol Paneli</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/dijital-ikiz'} size="lg">
                          <Link href="/dijital-ikiz"><Box />Brülör Dijital İkiz</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                </Sidebar>
                <main className="flex-1 p-6 lg:p-10 bg-slate-50/50">
                  <header className="mb-10">
                      <h1 className="text-4xl font-black tracking-tight text-foreground">
                        {pathname === '/analiz' ? 'Durum Analizi' : pathname === '/history' ? 'Veri Arşivi' : pathname === '/economy' ? 'Ekonomi Analizi' : pathname === '/alev-matrisi' ? 'Alev Matrisi' : pathname === '/kontrol' ? 'Kontrol Paneli' : pathname === '/dijital-ikiz' ? 'Brülör Dijital İkiz' : 'Ana İzleme Paneli'}
                      </h1>
                  </header>
                  {children}
                </main>
            </SidebarProvider>
          </DashboardContext.Provider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
