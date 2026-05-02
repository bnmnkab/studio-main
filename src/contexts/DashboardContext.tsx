'use client';

import { createContext } from 'react';
import type { EmissionData, SensorData, KontrolData, AnalizData, MatrisData } from '@/lib/types';

export interface DashboardContextType {
  emissions: EmissionData | null;
  emissionsHistory: EmissionData[];
  loading: boolean;
  error: string | null;
  isPulsing: boolean;
  lastSync: Date | null;
  sensorData: SensorData | null;
  sensorLoading: boolean;
  sensorError: string | null;
  isSensorPulsing: boolean;
  kontrolData: KontrolData | null;
  kontrolLoading: boolean;
  kontrolError: string | null;
  analizData: AnalizData | null;
  analizLoading: boolean;
  analizError: string | null;
  isAnalizPulsing: boolean;
  archiveLoading: boolean;
  archiveError: string | null;
  matrisData: MatrisData | null;
  matrisLoading: boolean;
  matrisError: string | null;
}

export const DashboardContext = createContext<DashboardContextType | null>(null);
