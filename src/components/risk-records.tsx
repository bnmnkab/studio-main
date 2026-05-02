"use client";

import { useMemo, useContext } from 'react';
import { DashboardContext } from '@/contexts/DashboardContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ProcessedAlarm {
  description: string;
  date: Date;
}

// This is the new, hyper-robust, manual date parsing function.
// It makes zero assumptions about the environment's `new Date()` capabilities.
function parseDatabaseTimestamp(dateString: string): Date | null {
  // Input format: "YYYY-MM-DD HH:MM:SS"
  if (typeof dateString !== 'string' || !dateString.includes(' ') || !dateString.includes('-') || !dateString.includes(':')) {
    return null;
  }

  const parts = dateString.split(' ');
  if (parts.length !== 2) return null;

  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':');

  if (dateParts.length !== 3 || timeParts.length !== 3) return null;

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // JS month is 0-indexed
  const day = parseInt(dateParts[2], 10);
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);

  // Validate parsed numbers
  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    return null;
  }
  
  // Create date object from the parsed components.
  const date = new Date(year, month, day, hours, minutes, seconds);

  // Final validation to ensure a valid date was created
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function RiskRecords() {
  const context = useContext(DashboardContext);

  const processedAlarms = useMemo((): ProcessedAlarm[] => {
    if (!context || !context.alarmHistory || !Array.isArray(context.alarmHistory)) {
      return [];
    }

    const alarms: any[] = context.alarmHistory;

    return alarms
      .map((alarm) => {
        // Defensive checks for each property
        if (!alarm || typeof alarm !== 'object') return null;
        
        const timestampStr = alarm.timestamp;
        const typeStr = alarm.type;
        const detailStr = alarm.detail;

        if (typeof timestampStr !== 'string' || typeof typeStr !== 'string' || typeof detailStr !== 'string') {
          return null;
        }

        const date = parseDatabaseTimestamp(timestampStr);

        if (!date) {
          return null;
        }
        
        // Combine type and detail for a full description
        const description = `${typeStr}: ${detailStr}`;
        
        return { description, date };
      })
      .filter((alarm): alarm is ProcessedAlarm => alarm !== null)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [context?.alarmHistory]);

  const renderContent = () => {
    if (!context || context.alarmHistoryLoading) {
      return <Skeleton className="h-[300px]" />;
    }

    if (context.alarmHistoryError) {
      return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>Risk kayıtları yüklenirken bir hata oluştu: {context.alarmHistoryError}</AlertDescription>
        </Alert>
      );
    }
    
    if (processedAlarms.length === 0) {
      return (
        <div className="text-center text-muted-foreground p-6">
            <p>Henüz kaydedilmiş bir risk veya alarm bulunmuyor.</p>
        </div>
      );
    }

    const groupedByMinute = processedAlarms.reduce((acc, curr) => {
      const minuteKey = format(curr.date, 'dd.MM.yyyy || HH:mm');
      if (!acc[minuteKey]) {
        acc[minuteKey] = [];
      }
      acc[minuteKey].push(curr);
      return acc;
    }, {} as Record<string, ProcessedAlarm[]>);
    
    const sortedMinutes = Object.keys(groupedByMinute).sort((a, b) => {
      const dateA = groupedByMinute[a][0].date.getTime();
      const dateB = groupedByMinute[b][0].date.getTime();
      return dateB - dateA;
    });

    return (
      <Accordion type="single" collapsible className="w-full h-[300px] overflow-y-auto pr-4">
          {sortedMinutes.map((minute) => {
              const alarmsInMinute = groupedByMinute[minute];
              return (
                <AccordionItem value={minute} key={minute}>
                    <AccordionTrigger>{minute}</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 text-sm">
                            {alarmsInMinute.map((alarm, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <span className="text-muted-foreground pt-0.5">{format(alarm.date, 'HH:mm:ss')}</span>
                                    <p className="font-medium text-foreground flex-1">{alarm.description}</p>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
              )
          })}
      </Accordion>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Risk Kayıtları
        </CardTitle>
        <CardDescription>
            Sistemde kaydedilmiş geçmiş alarm ve risk bildirimleri.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
