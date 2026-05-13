'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Smartphone, 
  Keyboard, 
  MapPin, 
  AlertTriangle,
  TrendingUp,
  Cpu,
  Fingerprint,
  Zap,
  Lock,
  Search,
  Eye,
  RefreshCw,
  Bell
} from 'lucide-react';
import { 
  AreaChart, Area, 
  BarChart, Bar,
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

// Mock data for the heatmap and advanced analytics
const threatData = [
  { subject: 'SQL Injection', A: 120, fullMark: 150 },
  { subject: 'XSS', A: 98, fullMark: 150 },
  { subject: 'Brute Force', A: 86, fullMark: 150 },
  { subject: 'Impossible Travel', A: 99, fullMark: 150 },
  { subject: 'Bot Pattern', A: 85, fullMark: 150 },
  { subject: 'Account Takeover', A: 65, fullMark: 150 },
];

const loginTrendData = [
  { time: '00:00', risk: 20, success: 80 },
  { time: '04:00', risk: 15, success: 45 },
  { time: '08:00', risk: 45, success: 120 },
  { time: '12:00', risk: 30, success: 150 },
  { time: '16:00', risk: 65, success: 110 },
  { time: '20:00', risk: 40, success: 90 },
  { time: '23:59', risk: 20, success: 75 },
];

const deviceData = [
  { name: 'Trusted', value: 75, color: '#00f0ff' },
  { name: 'Untrusted', value: 15, color: '#ff003c' },
  { name: 'Unknown', value: 10, color: '#8a2be2' },
];

export function RiskDashboard() {
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        
        <main className="pt-24 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <ShieldAlert className="text-blue-400 w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">AI Risk Monitoring</h1>
              </div>
              <p className="text-gray-400">Deep neural behavioral analysis & real-time threat intelligence</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 glass-panel border-blue-500/20">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                  {isLive ? 'Live Surveillance' : 'Paused'}
                </span>
              </div>
              <button 
                onClick={() => setIsLive(!isLive)}
                className="w-10 h-10 glass-panel flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-gray-400 ${isLive ? 'animate-spin-slow' : ''}`} />
              </button>
            </div>
          </div>

          {/* Top Tier Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-panel border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Zap className="text-blue-400 w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">HEALTHY</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">Avg System Risk</p>
                  <h3 className="text-3xl font-bold text-white mt-1">12.4<span className="text-sm font-medium text-gray-500">/100</span></h3>
                  <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '12.4%' }} className="h-full bg-blue-500"></motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-panel border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Fingerprint className="text-purple-400 w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded">+12% INC</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">Biometric Matches</p>
                  <h3 className="text-3xl font-bold text-white mt-1">98.2<span className="text-sm font-medium text-gray-500">%</span></h3>
                  <div className="mt-4 flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 7 ? 'bg-purple-500' : 'bg-white/5'}`}></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass-panel border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="text-red-400 w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">2 CRITICAL</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">Anomalies Detected</p>
                  <h3 className="text-3xl font-bold text-white mt-1">24</h3>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-red-400" />
                    Last 24 hours
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="glass-panel border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <ShieldCheck className="text-green-400 w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">100% PROTECTED</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">Threats Neutralized</p>
                  <h3 className="text-3xl font-bold text-white mt-1">1,402</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-slate-900 bg-slate-800"></div>)}
                    </div>
                    <span className="text-[10px] text-gray-500">Auto-blocked</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Risk Distribution Heatmap Style */}
            <Card className="lg:col-span-2 glass-panel p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Authentication & Risk Trends</h3>
                  <p className="text-sm text-gray-400">Correlated real-time analysis</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-400">Success</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-400">Risk Score</span>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={loginTrendData}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff003c" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="success" stroke="#00f0ff" strokeWidth={3} fill="url(#colorSuccess)" />
                    <Area type="monotone" dataKey="risk" stroke="#ff003c" strokeWidth={2} fill="url(#colorRisk)" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Threat Radar */}
            <Card className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-2">Threat Intelligence Radar</h3>
              <p className="text-sm text-gray-400 mb-8">Attack vector distribution</p>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={threatData}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                    <PolarRadiusAxis stroke="#ffffff10" fontSize={8} />
                    <Radar
                      name="Threat Level"
                      dataKey="A"
                      stroke="#8a2be2"
                      fill="#8a2be2"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                   <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Top Vector</div>
                   <div className="text-sm font-bold text-white mt-1">SQL Injection</div>
                </div>
                <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                   <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Detection Rate</div>
                   <div className="text-sm font-bold text-white mt-1">99.9%</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Lower Section: Biometrics & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Device Trust & Biometrics */}
            <div className="lg:col-span-1 space-y-6">
               <Card className="glass-panel p-6">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-400" /> Device Integrity
                  </h4>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 mt-4">
                    {deviceData.map(d => (
                      <div key={d.name} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                           <span className="text-xs text-gray-400">{d.name}</span>
                         </div>
                         <span className="text-xs font-bold text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
               </Card>

               <Card className="glass-panel p-6 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-4">
                    <Keyboard className="w-12 h-12 text-purple-500/10 group-hover:text-purple-500/20 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Typing Biometrics</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                       <Fingerprint className="text-purple-400 w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">98.2%</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Confidence Score</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 h-12 items-end">
                    {[40, 70, 45, 90, 65, 30, 80, 55, 95, 40].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05 }}
                        className="flex-1 bg-purple-500/40 rounded-t-sm"
                      ></motion.div>
                    ))}
                  </div>
               </Card>
            </div>

            {/* Live Activity Feed */}
            <Card className="lg:col-span-3 glass-panel p-6 h-fit">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" /> Neural Security Stream
                 </h3>
                 <div className="text-xs text-gray-500 font-mono">ENCRYPTED_FEED_V4.2</div>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { user: 'usr_8231', event: 'AUTH_SUCCESS', risk: 12, loc: 'New York, US', icon: ShieldCheck, color: 'text-green-400' },
                  { user: 'usr_1922', event: 'TYPING_ANOMALY', risk: 65, loc: 'Unknown', icon: AlertTriangle, color: 'text-yellow-400' },
                  { user: 'ip_102.32', event: 'BRUTE_FORCE_BLOCK', risk: 99, loc: 'Kyiv, UA', icon: ShieldAlert, color: 'text-red-400' },
                  { user: 'usr_4401', event: 'DEVICE_UNTRUSTED', risk: 42, loc: 'London, UK', icon: Smartphone, color: 'text-purple-400' },
                  { user: 'usr_8231', event: 'AUTH_SUCCESS', risk: 10, loc: 'New York, US', icon: ShieldCheck, color: 'text-green-400' },
                  { user: 'usr_1922', event: 'TYPING_ANOMALY', risk: 65, loc: 'Unknown', icon: AlertTriangle, color: 'text-yellow-400' },
                  { user: 'ip_102.32', event: 'BRUTE_FORCE_BLOCK', risk: 99, loc: 'Kyiv, UA', icon: ShieldAlert, color: 'text-red-400' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-white">{item.event}</span>
                           <span className="text-[10px] text-gray-500 font-mono">{item.user}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                           <MapPin className="w-3 h-3" /> {item.loc}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className={`text-sm font-bold ${item.risk > 70 ? 'text-red-400' : item.risk > 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                         {item.risk}% RISK
                       </div>
                       <div className="text-[10px] text-gray-500 font-mono mt-0.5">JUST NOW</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-400 transition-all uppercase tracking-widest">
                 Load Historical Archives
              </button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
