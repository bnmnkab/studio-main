export interface EmissionData {
  co2?: number | null;
  co?: number | null;
  nox?: number | null;
  o2?: number | null;
  sicaklik?: number | null;
  kukurt?: number | null;
  lambda?: number | null;
  nem?: number | null;
  
  efficiency: number | null;
  carbon_kg: number | null;
  saved_co2_kg: number | null;
  prediction: string | null;
  expert_report: string | null;
  last_sync: Date | null;

  cevre_etkisi?: {
    engellenen_co2_kg: number | null;
    gunluk_agac_katkisi: number | null;
    anlik_salinim_kg: number | null;
  };

  ekonomi?: {
    tasarruf_m3: number | null;
    yakit_miktari: number | null;
  };

  ai_special_advice: string | null;
  peak_info: string | null;
  raw_status: string | null;
  ml_ariza_tahmini: number | null;
  kritik_bolge: string | null;
  tahmini_ariza_vakti: string | null;

  timestamp?: number;
  firebaseId?: string;
}

export interface SensorData {
  co: number | null;
  co2: number | null;
  kukurt: number | null;
  lambda: number | null;
  nox: number | null;
  o2: number | null;
  sicaklik: number | null;
  nem: number | null;
  timestamp?: number;
}

export interface KontrolData {
  Kp: number | null;
  Ki: number | null;
  Kd: number | null;
  bypass: boolean | null;
  hata: number | null;
  stepeksenel: number | null;
  servoacı?: number | null; // Exact match for screenshot
  servoaci?: number | null; // Fallback
  fanpwm?: number | null; // New fan PWM data
  timestamp?: number;
}

export interface AnalizData {
  ahata: number | null;
  dX: number | null;
  dY: number | null;
  mlMudahaleSayisi: number | null;
  timestamp?: number;
}

export interface MatrisData {
  aalt: number | null;
  asag: number | null;
  asol: number | null;
  aust: number | null;
  merkez: number | null;
  sagalt: number | null;
  sagust: number | null;
  solalt: number | null;
  solust: number | null;
  timestamp?: number;
}
