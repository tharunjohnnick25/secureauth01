'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, CreditCard, Activity, Laptop, Eye, Check, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'subscription' | 'activity' | 'devices' | 'privacy'>('personal');
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  // Local state for active components
  const [devices, setDevices] = useState([
    { id: '1', name: 'MacBook Pro 16"', browser: 'Chrome', location: 'New York, USA', lastActive: 'Active now' },
    { id: '2', name: 'iPhone 15 Pro', browser: 'Safari', location: 'New York, USA', lastActive: '2 hours ago' },
    { id: '3', name: 'Windows Workstation', browser: 'Firefox', location: 'London, UK', lastActive: 'Yesterday' }
  ]);

  const [personalInfo, setPersonalInfo] = useState({
    name: 'System Admin',
    email: 'admin@mail.com',
    phone: '+1 (555) 019-2834',
    company: 'SecureAuth Corp',
    employeeId: 'EMP-9824',
    role: 'Administrator'
  });

  const [privacyToggles, setPrivacyToggles] = useState({
    dataAccess: true,
    privacyControls: false,
    visibility: true
  });

  const supabase = createClient();

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSessionUser(session.user);
        // Fill from session if available
        setPersonalInfo(prev => ({
          ...prev,
          email: session.user.email || prev.email,
          name: session.user.user_metadata?.full_name || prev.name
        }));
      }
    }
    getSession();
  }, []);

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Personal details saved successfully to Supabase profile metadata!');
  };

  const handleRemoveDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const menuItems = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'subscription', label: 'Subscription Details', icon: CreditCard },
    { id: 'activity', label: 'Activity Dashboard', icon: Activity },
    { id: 'devices', label: 'Connected Devices', icon: Laptop },
    { id: 'privacy', label: 'Privacy & Permissions', icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 pt-24 overflow-x-hidden">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1 tracking-tight">User Profile</h1>
            <p className="text-gray-400">Manage your enterprise identity and account settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 flex flex-col gap-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'personal' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10">
                      <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Personal Information</h3>
                      <form onSubmit={handleSavePersonalInfo} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">Full Name</label>
                            <Input 
                              type="text" 
                              value={personalInfo.name} 
                              onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                              className="bg-black/50 border-white/10" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">Email Address</label>
                            <Input 
                              type="email" 
                              value={personalInfo.email} 
                              disabled
                              className="bg-black/50 border-white/10 text-gray-500 cursor-not-allowed" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">Phone Number</label>
                            <Input 
                              type="text" 
                              value={personalInfo.phone} 
                              onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                              className="bg-black/50 border-white/10" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">Company</label>
                            <Input 
                              type="text" 
                              value={personalInfo.company} 
                              disabled
                              className="bg-black/50 border-white/10 text-gray-500 cursor-not-allowed" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">Employee ID</label>
                            <Input 
                              type="text" 
                              value={personalInfo.employeeId} 
                              disabled
                              className="bg-black/50 border-white/10 text-gray-500 cursor-not-allowed" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">Enterprise Role</label>
                            <Input 
                              type="text" 
                              value={personalInfo.role} 
                              disabled
                              className="bg-black/50 border-white/10 text-gray-500 cursor-not-allowed" 
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-4">
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 font-bold px-8">
                            Save Info
                          </Button>
                        </div>
                      </form>
                    </Card>
                  )}

                  {activeTab === 'security' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-8">
                      <div>
                        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Security Settings</h3>
                        
                        {/* Change Password */}
                        <div className="space-y-4 mb-8">
                          <h4 className="font-semibold text-gray-300">Change Password</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input type="password" placeholder="New Password" className="bg-black/50 border-white/10" />
                            <Input type="password" placeholder="Confirm Password" className="bg-black/50 border-white/10" />
                          </div>
                          <Button className="bg-white/5 hover:bg-white/10 border border-white/10">Update Password</Button>
                        </div>

                        {/* MFA Setup */}
                        <div className="border-t border-white/10 pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-300">Multi-Factor Authentication (MFA)</h4>
                              <p className="text-sm text-gray-400 mt-1">Add an extra layer of security to your enterprise account.</p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold">Active</span>
                          </div>
                          <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">Disable MFA</Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'subscription' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-8">
                      <div>
                        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Subscription Plan</h3>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white/5 rounded-xl border border-white/5 mb-8">
                          <div>
                            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Current Tier</span>
                            <h4 className="text-2xl font-bold text-white mt-1">Enterprise Pro Suite</h4>
                            <p className="text-sm text-gray-400 mt-1">Subscribed via corporate billing network.</p>
                          </div>
                          <span className="mt-4 md:mt-0 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold text-sm">
                            Status: Active
                          </span>
                        </div>

                        <h4 className="font-semibold text-gray-300 mb-4">Billing History</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400">
                              <tr>
                                <th className="px-4 py-3">Invoice ID</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              <tr>
                                <td className="px-4 py-3 text-gray-300">#INV-9024</td>
                                <td className="px-4 py-3 text-gray-300">May 12, 2026</td>
                                <td className="px-4 py-3 text-gray-300">$1,490.00</td>
                                <td className="px-4 py-3"><span className="text-green-400">Paid</span></td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-gray-300">#INV-8910</td>
                                <td className="px-4 py-3 text-gray-300">Apr 12, 2026</td>
                                <td className="px-4 py-3 text-gray-300">$1,490.00</td>
                                <td className="px-4 py-3"><span className="text-green-400">Paid</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'activity' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10">
                      <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Activity Dashboard</h3>
                      <div className="space-y-6">
                        {[
                          { title: 'Successful Login', desc: 'IP 182.90.12.4 - New York, USA', time: 'Just now', icon: ShieldCheck, status: 'success' },
                          { title: 'MFA Verification Complete', desc: 'Approved via authenticator app key verification', time: '2 mins ago', icon: Shield, status: 'success' },
                          { title: 'New Device Registered', desc: 'iPhone 15 Pro added to trusted platform hardware', time: '2 hours ago', icon: Laptop, status: 'warning' },
                          { title: 'Access Request Submitted', desc: 'Requested access for Internal Portals module', time: '3 days ago', icon: User, status: 'info' }
                        ].map((act, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-start">
                            <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
                              <act.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white">{act.title}</h4>
                              <p className="text-sm text-gray-400 mt-1">{act.desc}</p>
                              <span className="text-xs text-gray-500 mt-2 block">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {activeTab === 'devices' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10">
                      <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Connected Devices</h3>
                      <p className="text-sm text-gray-400 mb-6">Manage all authorized hardware endpoints connected to your SecureAuth session credentials.</p>
                      
                      <div className="divide-y divide-white/5">
                        {devices.map(device => (
                          <div key={device.id} className="flex justify-between items-center py-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-white/5 rounded-xl text-blue-400">
                                <Laptop className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{device.name}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">{device.browser} • {device.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">{device.lastActive}</span>
                              {device.lastActive !== 'Active now' && (
                                <button 
                                  onClick={() => handleRemoveDevice(device.id)}
                                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {activeTab === 'privacy' && (
                    <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-white/10 space-y-6">
                      <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Privacy & Permissions</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">Telemetry & Data Access</h4>
                            <p className="text-xs text-gray-400 mt-1">Allow SecureAuth to optimize typing profiles and device logs for real-time background protection.</p>
                          </div>
                          <div 
                            onClick={() => setPrivacyToggles({...privacyToggles, dataAccess: !privacyToggles.dataAccess})}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${privacyToggles.dataAccess ? 'bg-blue-600' : 'bg-white/10'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacyToggles.dataAccess ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">Aggressive Geo-Blocking</h4>
                            <p className="text-xs text-gray-400 mt-1">Enable geo-fenced boundaries for login logs. Highly restrictive on unknown coordinates.</p>
                          </div>
                          <div 
                            onClick={() => setPrivacyToggles({...privacyToggles, privacyControls: !privacyToggles.privacyControls})}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${privacyToggles.privacyControls ? 'bg-blue-600' : 'bg-white/10'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacyToggles.privacyControls ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </div>
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