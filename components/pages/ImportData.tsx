'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { Upload, FileText, AlertTriangle } from 'lucide-react';

const importTypes = [
  { name: 'User Accounts', description: 'Bulk import user accounts from CSV', supported: 'CSV' },
  { name: 'Device Inventory', description: 'Import device information', supported: 'CSV, JSON' },
  { name: 'Security Policies', description: 'Import security policy configurations', supported: 'JSON' },
  { name: 'Threat Intelligence', description: 'Import threat indicators and IOCs', supported: 'CSV, JSON' },
];

export function ImportData() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-24 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Import Data</h1>
            <p className="text-muted-foreground">Bulk import data from external sources</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Import Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importTypes.map((type, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-input-background/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{type.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                        <p className="text-xs text-muted-foreground">Supported formats: {type.supported}</p>
                      </div>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 bg-warning/10 border border-warning/20">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Important Notice</h4>
                  <p className="text-sm text-muted-foreground">
                    Always backup your data before importing. Large imports may take several minutes to process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
