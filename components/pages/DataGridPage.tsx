'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Search, Filter, Download, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/DashboardHeader';

interface Column {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface DataGridPageProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  primaryAction?: { label: string; onClick: () => void };
}

export function DataGridPage({ title, description, columns, data, primaryAction }: DataGridPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleExport = () => {
    if (!data || data.length === 0) return;
    
    const headers = columns.map(col => col.label).join(',');
    const csvData = data.map(row => 
      columns.map(col => {
        const val = row[col.key];
        return typeof val === 'object' ? JSON.stringify(val).replace(/,/g, ';') : String(val).replace(/,/g, ';');
      }).join(',')
    ).join('\n');
    
    const blob = new Blob([`${headers}\n${csvData}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SecureAuth-${title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 pt-24 overflow-x-hidden">
          <DashboardHeader title={title} description={description}>
            <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            {primaryAction && (
              <Button className="bg-blue-600 hover:bg-blue-500" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
          </DashboardHeader>

          <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <Button variant="outline" className="w-full sm:w-auto border-white/10">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    {columns.map(col => (
                      <th key={col.key} className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredData.length > 0 ? filteredData.map((row, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i} 
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {columns.map(col => (
                        <td key={col.key} className="px-6 py-4 text-gray-300">
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                        No records found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
              <span>Showing {filteredData.length} entries</span>
              <div className="flex gap-2">
                <Button variant="outline" className="border-white/10 h-8 px-3" disabled>Previous</Button>
                <Button variant="outline" className="border-white/10 h-8 px-3">Next</Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
