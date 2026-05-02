"use client";

import { useContext, useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, set, onValue } from "firebase/database";
import { DashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoCard } from "@/components/info-card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Thermometer, 
  Cloud, 
  Wind, 
  CloudCog, 
  CloudLightning, 
  GitCommit,
  BrainCircuit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sensorConfig = [
    { key: 'sicaklik', title: 'Sıcaklık', unit: '°C', icon: <Thermometer /> },
    { key: 'co', title: 'CO', unit: 'mg/m³', icon: <CloudCog /> },
    { key: 'co2', title: 'CO₂', unit: 'mg/m³', icon: <Cloud /> },
    { key: 'o2', title: 'O₂', unit: '%', icon: <Wind /> },
    { key: 'nox', title: 'NOx', unit: 'mg/m³', icon: <CloudLightning /> },
    { key: 'lambda', title: 'Lambda', unit: '', icon: <GitCommit /> },
] as const;

const fuelOptions = [
  { name: 'Dizel', value: 'dizel', index: 1, oran: 15 },
  { name: 'LPG', value: 'lpg', index: 2, oran: 16 },
  { name: 'CNG', value: 'cng', index: 3, oran: 17 },
  { name: 'Fuel-oil', value: 'fuel-oil', index: 4, oran: 14 },
];


export default function DashboardPage() {
  const context = useContext(DashboardContext);
  const [selectedFacility, setSelectedFacility] = useState<string>('facility-a');
  const [selectedFuelValue, setSelectedFuelValue] = useState<string>('');
  const [isFuelLoading, setIsFuelLoading] = useState(true);
  const [yakitMiktari, setYakitMiktari] = useState('');
  const [lastYakitMiktari, setLastYakitMiktari] = useState<string | number | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const selectedFuelRef = ref(database, 'settings/selectedFuel');
    
    const unsubscribe = onValue(selectedFuelRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.name) {
        const currentFuel = fuelOptions.find(f => f.name === data.name);
        if (currentFuel) {
          setSelectedFuelValue(currentFuel.value);
        }
      }
      setIsFuelLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const yakitMiktariRef = ref(database, 'settings/yakitMiktari');
    const unsubscribe = onValue(yakitMiktariRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            setLastYakitMiktari(data);
        }
    });

    return () => unsubscribe();
  }, []);

  const handleFuelChange = (value: string) => {
    const selectedFuel = fuelOptions.find(f => f.value === value);
    if (selectedFuel) {
      const selectedFuelRef = ref(database, 'settings/selectedFuel');
      set(selectedFuelRef, {
        name: selectedFuel.name,
        oran: selectedFuel.oran,
        index: selectedFuel.index,
      }).then(() => {
        toast({
          title: "Yakıt Tipi Güncellendi",
          description: `Yakıt tipi ${selectedFuel.name} olarak ayarlandı.`,
        });
        setSelectedFuelValue(value);
      }).catch((error) => {
        console.error("Failed to update fuel type:", error);
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Yakıt tipi güncellenirken bir hata oluştu.",
        });
      });
    }
  };

  const handleYakitMiktariSubmit = () => {
      if (yakitMiktari.trim() === '') {
        toast({
            variant: "destructive",
            title: "Geçersiz Değer",
            description: "Lütfen bir değer girin.",
        });
        return;
      }
      const value = parseFloat(yakitMiktari);
      if (!isNaN(value)) {
        setIsSubmitting(true);
        const yakitMiktariRef = ref(database, 'settings/yakitMiktari');
        set(yakitMiktariRef, value).then(() => {
          toast({
            title: "Yakıt Miktarı Güncellendi",
            description: `Saatlik yakıt miktarı ${value} m³ olarak ayarlandı.`,
          });
          setYakitMiktari(''); 
        }).catch((error) => {
          console.error("Failed to update yakit miktari:", error);
          toast({
            variant: "destructive",
            title: "Hata",
            description: "Yakıt miktarı güncellenirken bir hata oluştu.",
          });
        }).finally(() => {
            setIsSubmitting(false);
        });
      } else {
         toast({
            variant: "destructive",
            title: "Geçersiz Değer",
            description: "Lütfen geçerli bir sayı girin.",
          });
      }
    };

  if (!context) {
    return <div>Yükleniyor...</div>;
  }
  
  const { sensorData, sensorLoading, sensorError, isSensorPulsing, analizData, analizLoading, isAnalizPulsing, analizError } = context;

  const renderContent = () => {
    if (sensorLoading || analizLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
      );
    }

    if (sensorError || analizError) {
      return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{sensorError || analizError}</AlertDescription>
        </Alert>
      )
    }

    if (!sensorData || !analizData) {
       return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold text-muted-foreground">Veri Bekleniyor</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Firebase veritabanınızdan anlık veri akışı bekleniyor.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sensorConfig.map(item => (
            <InfoCard
                key={item.key}
                title={item.title}
                value={sensorData[item.key as keyof typeof sensorData]}
                unit={item.unit}
                icon={item.icon}
                isPulsing={isSensorPulsing}
            />
          ))}
          <InfoCard
              title="Yapay Zeka Müdahale Sayısı"
              value={analizData.mlMudahaleSayisi}
              unit="adet"
              icon={<BrainCircuit />}
              isPulsing={isAnalizPulsing}
              className="bg-primary/5 border-primary/20"
          />
        </div>
      );
  };

  return (
    <div className="space-y-8">
        <Card className="p-4 lg:p-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                <div className="grid gap-2 w-full">
                    <Label htmlFor="facility">Tesis Seçimi</Label>
                    <Select value={selectedFacility} onValueChange={setSelectedFacility} defaultValue="facility-a">
                        <SelectTrigger id="facility" className="w-full">
                            <SelectValue placeholder="Bir tesis seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="facility-a">Tesis A / Büsan Sanayi Konya</SelectItem>
                            <SelectItem value="facility-b">Tesis B / 2. Organize Konya</SelectItem>
                            <SelectItem value="facility-c">Tesis C / 3. Organize Konya</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2 w-full">
                    <Label htmlFor="fuel">Yakıt Seçimi</Label>
                    <Select onValueChange={handleFuelChange} value={selectedFuelValue} disabled={isFuelLoading}>
                        <SelectTrigger id="fuel" className="w-full">
                            <SelectValue placeholder="Bir yakıt tipi seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                            {fuelOptions.map(fuel => (
                                <SelectItem key={fuel.value} value={fuel.value}>{fuel.name.replace('-',' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2 w-full">
                    <Label htmlFor="yakit-miktari">Saatlik Yakıt Miktarı Girişi (m³)</Label>
                    <div>
                      <div className="flex w-full items-center space-x-2">
                          <Input
                              id="yakit-miktari"
                              type="number"
                              placeholder="Örn: 12.5"
                              value={yakitMiktari}
                              onChange={(e) => setYakitMiktari(e.target.value)}
                              disabled={isSubmitting}
                          />
                          <Button onClick={handleYakitMiktariSubmit} disabled={isSubmitting}>Onayla</Button>
                      </div>
                          {lastYakitMiktari !== null && (
                          <p className="text-sm text-muted-foreground mt-2">
                              Son girilen değer: <span className="font-semibold text-foreground">{lastYakitMiktari} m³</span>
                          </p>
                      )}
                    </div>
                </div>
            </div>
        </Card>

        {renderContent()}
    </div>
  );
}