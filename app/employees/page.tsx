'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Users, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const mockEmployees = [
  { id: 1, name: 'Alice Smith', email: 'alice.smith@company.com', department: 'Engineering', role: 'Developer', status: 'Active', lastLogin: '10 mins ago' },
  { id: 2, name: 'Bob Johnson', email: 'bob.j@company.com', department: 'Marketing', role: 'Manager', status: 'Active', lastLogin: '2 hours ago' },
  { id: 3, name: 'Charlie Davis', email: 'charlie.d@company.com', department: 'Finance', role: 'Analyst', status: 'Inactive', lastLogin: '3 days ago' },
  { id: 4, name: 'Diana Prince', email: 'diana.p@company.com', department: 'HR', role: 'Director', status: 'Active', lastLogin: '1 hour ago' },
  { id: 5, name: 'Evan Wright', email: 'evan.w@company.com', department: 'Engineering', role: 'Senior Dev', status: 'Suspended', lastLogin: '1 week ago' },
];

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617]">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-20 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2 text-white">Employee Directory</h1>
            <p className="text-muted-foreground">Manage corporate access, roles, and departmental assignments.</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search employees..." 
                  className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEmployees.map((emp) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={emp.id} 
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{emp.name}</div>
                              <div className="text-xs text-gray-500">{emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">{emp.department}</td>
                        <td className="px-4 py-4 text-sm text-gray-300">{emp.role}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${
                            emp.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                            emp.status === 'Inactive' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Manage Access
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
