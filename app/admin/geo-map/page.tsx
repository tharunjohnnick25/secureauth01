'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Globe, MapPin, Shield, AlertTriangle } from 'lucide-react';
import { useRealtimeData } from '@/hooks/useRealtimeData';

export default function GeoMapPage() {
  const { data: locations, loading } = useRealtimeData('geo_locations');

  const stats = useMemo(() => {
    const suspicious = locations.filter(l => l.is_suspicious).length;
    const countries = new Set(locations.map(l => l.country)).size;
    const cities = new Set(locations.map(l => l.city)).size;
    return { suspicious, countries, cities };
  }, [locations]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Geographic Threat Map</h1>
              <p className="text-muted-foreground">Real-time visualization of global authentication events</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-success/20 text-success text-xs font-bold rounded-full border border-success/30">
                 {stats.countries} Countries
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/30">
                 {stats.cities} Cities
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
             <Card className="lg:col-span-3 h-[600px] relative overflow-hidden bg-card/50">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  {/* Grid background simulation */}
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
                
                <CardHeader className="relative z-10">
                   <CardTitle className="flex items-center gap-2">
                     <Globe className="w-5 h-5 text-primary" />
                     Live Global Pulse
                   </CardTitle>
                </CardHeader>
                
                <CardContent className="h-full relative z-10 flex items-center justify-center">
                   {/* In a real production app, we would use react-simple-maps or similar here. 
                       For this high-fidelity UI, we'll simulate the dot distribution on a glass world map. */}
                   <div className="relative w-full h-full max-w-4xl max-h-[500px] border border-border/50 rounded-2xl bg-muted/20 backdrop-blur-md flex items-center justify-center group">
                      <p className="text-muted-foreground text-sm font-medium animate-pulse">Initializing Holographic Projection...</p>
                      
                      {locations.map((loc, i) => (
                        <div 
                          key={loc.id}
                          className={`absolute w-3 h-3 rounded-full animate-ping ${loc.is_suspicious ? 'bg-destructive' : 'bg-primary'}`}
                          style={{ 
                            left: `${((loc.longitude || 0) + 180) / 3.6}%`, 
                            top: `${(90 - (loc.latitude || 0)) / 1.8}%`,
                            animationDelay: `${i * 100}ms`
                          }}
                        />
                      ))}

                      {/* Static indicators for suspicious regions */}
                      {locations.filter(l => l.is_suspicious).map(loc => (
                         <div 
                          key={`susp-${loc.id}`}
                          className="absolute flex flex-col items-center pointer-events-none"
                          style={{ 
                            left: `${((loc.longitude || 0) + 180) / 3.6}%`, 
                            top: `${(90 - (loc.latitude || 0)) / 1.8}%`,
                          }}
                        >
                           <AlertTriangle className="w-5 h-5 text-destructive mb-1 animate-bounce" />
                           <div className="bg-destructive/90 text-white text-[8px] px-2 py-0.5 rounded font-bold uppercase backdrop-blur-md">
                              Threat
                           </div>
                        </div>
                      ))}
                   </div>
                </CardContent>

                <div className="absolute bottom-6 left-6 flex gap-4 z-10">
                   <div className="flex items-center gap-2 text-xs bg-card/80 p-2 rounded border border-border backdrop-blur-md">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>Authorized Access</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs bg-card/80 p-2 rounded border border-border backdrop-blur-md">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <span>Suspicious Anomaly</span>
                   </div>
                </div>
             </Card>

             <div className="space-y-6">
                <Card>
                   <CardHeader>
                      <CardTitle className="text-sm">Regional Threats</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-4">
                         {locations.filter(l => l.is_suspicious).slice(0, 5).map(loc => (
                            <div key={loc.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                               <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-destructive" />
                                  <span className="text-xs font-medium">{loc.city}, {loc.country}</span>
                               </div>
                               <span className="text-[10px] text-muted-foreground">{new Date(loc.created_at).toLocaleTimeString()}</span>
                            </div>
                         ))}
                         {stats.suspicious === 0 && <p className="text-xs text-muted-foreground text-center py-4">No regional threats detected.</p>}
                      </div>
                   </CardContent>
                </Card>

                <Card className="bg-destructive/10 border-destructive/20">
                   <CardContent className="pt-6 text-center">
                      <Shield className="w-10 h-10 text-destructive mx-auto mb-2" />
                      <h4 className="text-lg font-bold text-destructive">{stats.suspicious}</h4>
                      <p className="text-xs text-muted-foreground">High-Risk Geographic Anomalies</p>
                      <button className="mt-4 w-full py-2 bg-destructive text-white text-xs font-bold rounded hover:bg-destructive/90 transition-colors">
                         LOCK DOWN REGIONS
                      </button>
                   </CardContent>
                </Card>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
