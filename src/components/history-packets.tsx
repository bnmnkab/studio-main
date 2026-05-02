"use client";

import { useContext } from 'react';
import { DashboardContext } from '@/contexts/DashboardContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Box, Database, ChevronRight, Hash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function HistoryPackets() {
  const context = useContext(DashboardContext);

  if (!context) {
    return <div className="p-8 text-center text-primary/60 italic font-medium">Veriler yükleniyor...</div>;
  }

  const { emissionsHistory } = context;

  return (
    <Card className="border-none shadow-xl overflow-hidden border-t-4 border-t-primary bg-background">
      <CardHeader className="bg-primary/5 border-b border-primary/10 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2.5 text-primary text-xl font-black tracking-tight">
                <Database className="h-5 w-5" />
                DİJİTAL VERİ ARŞİVİ
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold text-primary/70 uppercase tracking-widest">
                KAYITLI VERİ BLOKLARI
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-black px-2 py-0.5 text-[10px] shadow-sm">
            {emissionsHistory?.length || 0} PAKET
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {emissionsHistory && emissionsHistory.length > 0 ? (
            <ScrollArea className="h-[400px] w-full bg-white">
              <Accordion type="single" collapsible className="w-full">
                  {emissionsHistory.map((packet: any) => (
                    <AccordionItem value={packet.firebaseId} key={packet.firebaseId} className="border-b border-primary/5 px-6 hover:bg-primary/[0.02] transition-colors">
                        <AccordionTrigger className="hover:no-underline transition-all duration-300 py-4">
                           <div className="flex items-center gap-4 w-full">
                              <div className="p-1.5 bg-primary/10 rounded-lg shadow-inner">
                                <Hash className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div className="flex flex-col items-start gap-0.5">
                                <span className="font-mono text-xs font-black text-primary tracking-tight">
                                  {packet.firebaseId}
                                </span>
                                <span className="text-[9px] text-primary/50 font-black uppercase tracking-widest">
                                    VERİ BLOĞU
                                </span>
                              </div>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-1">
                            <div className="bg-white rounded-xl border border-primary/10 shadow-md overflow-hidden mx-1">
                                <Table>
                                    <TableHeader className="bg-primary/5">
                                        <TableRow className="hover:bg-transparent border-b border-primary/10">
                                            <TableHead className="font-black text-primary/80 h-10 uppercase text-[10px] tracking-wider pl-4">PARAMETRE</TableHead>
                                            <TableHead className="font-black text-primary/80 h-10 text-right uppercase text-[10px] tracking-wider pr-4">DEĞER</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(packet)
                                          .filter(([key]) => key !== 'firebaseId' && key !== 'timestamp')
                                          .map(([key, value]) => (
                                            <TableRow key={key} className="hover:bg-primary/[0.04] group transition-colors border-b border-primary/5 last:border-0">
                                                <TableCell className="font-bold text-primary/70 py-2.5 pl-4 text-xs">
                                                  <div className="flex items-center gap-2">
                                                    <ChevronRight className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                                                    {key}
                                                  </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-right font-black text-primary py-2.5 pr-4 text-sm">
                                                    {value === null || value === undefined ? (
                                                      <span className="text-primary/30">N/A</span>
                                                    ) : String(value)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </ScrollArea>
        ) : (
            <div className="text-primary/40 text-center py-20 flex flex-col items-center gap-4 bg-primary/[0.01]">
                <div className="p-4 bg-primary/5 rounded-full shadow-inner">
                  <Box className="h-10 w-10 opacity-30 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-lg text-primary/60">Arşiv Verisi Bulunamadı</p>
                  <p className="text-xs font-medium opacity-60">Veritabanında kayıtlı paket bulunmuyor.</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
