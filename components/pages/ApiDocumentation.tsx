'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { FileText, Code, Download } from 'lucide-react';

const endpoints = [
  { method: 'GET', path: '/api/v1/users', description: 'List all users', auth: 'Bearer Token' },
  { method: 'POST', path: '/api/v1/users', description: 'Create a new user', auth: 'Bearer Token' },
  { method: 'GET', path: '/api/v1/devices', description: 'List all devices', auth: 'Bearer Token' },
  { method: 'POST', path: '/api/v1/security/scan', description: 'Initiate security scan', auth: 'API Key' },
];

export function ApiDocumentation() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">API Documentation</h1>
              <p className="text-muted-foreground">RESTful API reference and examples</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download OpenAPI Spec
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {endpoints.map((endpoint, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded font-mono ${
                        endpoint.method === 'GET' ? 'bg-success/20 text-success' :
                        endpoint.method === 'POST' ? 'bg-primary/20 text-primary' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                    <span className="text-xs text-muted-foreground">Auth: {endpoint.auth}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
