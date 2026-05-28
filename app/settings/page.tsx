'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Bell, Lock, Key, CreditCard, Command, Check, Trash2, Plus } from 'lucide-react';

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<'general' | 'security' | 'notifications' | 'access' | 'api' | 'billing' | 'admin'>('general');
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production SIEM Integration', value: 'sa_live_k8a...29b8c', created: '2026-05-10' },
    { id: '2', name: 'Okta Synchronization Hook', value: 'sa_live_o9x...82a3d', created: '2026-04-18' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  // Toggles and forms
  const [generalSettings, setGeneralSettings] = useState({
    theme: 'dark',
    language: 'English',
    timezone: 'UTC-5 (EST)',
    highContrast: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    mfaRequired: true,
    minPasswordLength: 12,
    sessionTimeout: 30,
    loginProtection: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    securityNotif: true,
    smsAlerts: false,
    pushNotif: true
  });

  const [accessSettings, setAccessSettings] = useState({
    autoApprove: false,
    requireReason: true,
    defaultRole: 'Employee'
  });

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const randomHex = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const newKey = {
      id: String(apiKeys.length + 1),
      name: newKeyName,
      value: `sa_live_${randomHex.substring(0, 3)}...${randomHex.substring(12)}`,
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const categories = [
    { id: 'general', label: 'General Preferences', icon: Settings },
    { id: 'security', label: 'Security & Policies', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'access', label: 'Access Management', icon: Lock },
    { id: 'api', label: 'API & Integrations', icon: Key },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'admin', label: 'Admin Safeguards', icon: Command }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 pt-24 overflow-x-hidden">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1 tracking-tight">Platform Settings</h1>
            <p className="text-gray-400">Configure global enterprise cybersecurity parameters</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigator */}
            <div className="lg:col-span-1 flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <cat.icon className="w-5 h-5" />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Content Categories Panels */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeCategory === 'general' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/10 pb-4">General Preferences</h3>
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <label className="text-sm font-semibold text-gray-300">Default Theme</label>
                          <select 
                            value={generalSettings.theme}
                            onChange={(e) => setGeneralSettings({...generalSettings, theme: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                          >
                            <option value="dark">Secure Dark Mode</option>
                            <option value="light">System Light Mode</option>
                          </select>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <label className="text-sm font-semibold text-gray-300">System Language</label>
                          <select 
                            value={generalSettings.language}
                            onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                          >
                            <option value="English">English (US)</option>
                            <option value="Spanish">Spanish (ES)</option>
                            <option value="German">German (DE)</option>
                          </select>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <label className="text-sm font-semibold text-gray-300">Time Zone</label>
                          <select 
                            value={generalSettings.timezone}
                            onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                          >
                            <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                            <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                            <option value="UTC+5:30 (IST)">UTC+5:30 (IST)</option>
                          </select>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeCategory === 'security' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/10 pb-4">Security & Policies</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">Global MFA Enforcement</h4>
                            <p className="text-xs text-gray-400 mt-1">Force all non-administrative users to authenticate via MFA on every new login session.</p>
                          </div>
                          <div 
                            onClick={() => setSecuritySettings({...securitySettings, mfaRequired: !securitySettings.mfaRequired})}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${securitySettings.mfaRequired ? 'bg-blue-600' : 'bg-white/10'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${securitySettings.mfaRequired ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">Proactive Login Threat Safeguards</h4>
                            <p className="text-xs text-gray-400 mt-1">Instantly trigger system quarantines when rapid suspicious login behaviors are verified.</p>
                          </div>
                          <div 
                            onClick={() => setSecuritySettings({...securitySettings, loginProtection: !securitySettings.loginProtection})}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${securitySettings.loginProtection ? 'bg-blue-600' : 'bg-white/10'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${securitySettings.loginProtection ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <label className="text-sm font-semibold text-gray-300">Session Timeout (Minutes)</label>
                          <Input 
                            type="number" 
                            value={securitySettings.sessionTimeout} 
                            onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: Number(e.target.value)})}
                            className="bg-black/50 border-white/10 w-full sm:w-32" 
                          />
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeCategory === 'notifications' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/10 pb-4">Notifications</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">Critical Threat Email Alerts</h4>
                            <p className="text-xs text-gray-400 mt-1">Instantly receive emails regarding system policy violations or failed authentication attempts.</p>
                          </div>
                          <div 
                            onClick={() => setNotificationSettings({...notificationSettings, emailAlerts: !notificationSettings.emailAlerts})}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notificationSettings.emailAlerts ? 'bg-blue-600' : 'bg-white/10'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notificationSettings.emailAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">Push System notifications</h4>
                            <p className="text-xs text-gray-400 mt-1">Enable real-time push alerts within active administrative web browser sessions.</p>
                          </div>
                          <div 
                            onClick={() => setNotificationSettings({...notificationSettings, pushNotif: !notificationSettings.pushNotif})}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notificationSettings.pushNotif ? 'bg-blue-600' : 'bg-white/10'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notificationSettings.pushNotif ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeCategory === 'access' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/10 pb-4">Access Management</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">Require Justification For Access</h4>
                            <p className="text-xs text-gray-400 mt-1">Enforce employees to provide brief justification writeups during resource access requests.</p>
                          </div>
                          <div 
                            onClick={() => setAccessSettings({...accessSettings, requireReason: !accessSettings.requireReason})}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${accessSettings.requireReason ? 'bg-blue-600' : 'bg-white/10'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${accessSettings.requireReason ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeCategory === 'api' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/10 pb-4">API & Integrations</h3>
                      
                      {/* Active API Keys */}
                      <div className="space-y-4 mb-6">
                        <h4 className="font-semibold text-gray-300">Active API Keys</h4>
                        <div className="divide-y divide-white/5">
                          {apiKeys.map(key => (
                            <div key={key.id} className="flex justify-between items-center py-3">
                              <div>
                                <p className="font-medium text-white">{key.name}</p>
                                <p className="text-xs text-gray-500 font-mono mt-1">{key.value} • Created {key.created}</p>
                              </div>
                              <button 
                                onClick={() => handleRevokeKey(key.id)}
                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Generate New Key */}
                      <form onSubmit={handleGenerateKey} className="flex gap-4 items-end border-t border-white/10 pt-6">
                        <div className="flex-1">
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">Generate New Platform Key</label>
                          <Input 
                            type="text" 
                            placeholder="Integration Client Name (e.g. Splunk Syslog)" 
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="bg-black/50 border-white/10" 
                          />
                        </div>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-500 h-[42px] px-6 font-bold flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Create
                        </Button>
                      </form>
                    </Card>
                  )}

                  {activeCategory === 'billing' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/10 pb-4">Billing Settings</h3>
                      <div className="space-y-6">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-semibold text-white">Default Payment Method</p>
                            <p className="text-xs text-gray-400 mt-1">Visa ending in •••• 8294</p>
                          </div>
                          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs h-9">Update Card</Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeCategory === 'admin' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/10 pb-4">Admin Safeguards (Strict Mode)</h3>
                      <div className="space-y-6">
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
                          <h4 className="font-semibold text-red-200">Sensitive System Configurations</h4>
                          <p className="text-xs mt-1 leading-relaxed">Modifying options below can trigger platform-wide audits or reset session hashes. Exercise extreme care.</p>
                        </div>
                        <Button className="bg-red-600 hover:bg-red-500 font-bold px-6">Enforce Force-Logout</Button>
                      </div>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}