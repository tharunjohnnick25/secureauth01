import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Globe,
  Target,
  Activity,
  Eye,
  Search,
  Download,
  Filter,
} from 'lucide-react';

const threatData = [
  { id: 'THR-2024-001', type: 'Malware', severity: 'critical', source: 'Dark Web', target: 'Financial Sector', status: 'Active', date: '2026-04-30' },
  { id: 'THR-2024-002', type: 'Phishing', severity: 'high', source: 'Email Campaign', target: 'Healthcare', status: 'Monitoring', date: '2026-04-29' },
  { id: 'THR-2024-003', type: 'DDoS', severity: 'medium', source: 'Botnet', target: 'E-commerce', status: 'Mitigated', date: '2026-04-28' },
  { id: 'THR-2024-004', type: 'Ransomware', severity: 'critical', source: 'APT Group', target: 'Government', status: 'Active', date: '2026-04-27' },
  { id: 'THR-2024-005', type: 'Data Breach', severity: 'high', source: 'Insider Threat', target: 'Technology', status: 'Investigating', date: '2026-04-26' },
];

const threatStats = [
  { label: 'Active Threats', value: '247', change: '+12%', trend: 'up', color: 'destructive' },
  { label: 'Mitigated Today', value: '89', change: '+8%', trend: 'up', color: 'success' },
  { label: 'Under Investigation', value: '34', change: '-5%', trend: 'down', color: 'warning' },
  { label: 'Global Coverage', value: '156', change: '+3%', trend: 'up', color: 'primary' },
];

const threatSources = [
  { name: 'Dark Web Forums', threats: 89, percentage: 36 },
  { name: 'APT Groups', threats: 54, percentage: 22 },
  { name: 'Botnets', threats: 42, percentage: 17 },
  { name: 'Insider Threats', threats: 35, percentage: 14 },
  { name: 'Other', threats: 27, percentage: 11 },
];

export function ThreatIntelligence() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Threat Intelligence</h1>
              <p className="text-muted-foreground">
                Real-time threat monitoring and analysis
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {threatStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
                    <Shield className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                    <p className={`text-xs flex items-center gap-1 mt-1 ${stat.trend === 'up' ? 'text-destructive' : 'text-success'}`}>
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Active Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {threatData.map((threat) => (
                    <div
                      key={threat.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          threat.severity === 'critical' ? 'bg-destructive/20' :
                          threat.severity === 'high' ? 'bg-warning/20' : 'bg-primary/20'
                        }`}>
                          <Target className={`w-5 h-5 ${
                            threat.severity === 'critical' ? 'text-destructive' :
                            threat.severity === 'high' ? 'text-warning' : 'text-primary'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{threat.id}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              threat.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                              threat.severity === 'high' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                            }`}>
                              {threat.severity}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{threat.type} - {threat.source}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{threat.target}</p>
                        <p className="text-xs text-muted-foreground">{threat.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Threat Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threatSources.map((source, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{source.name}</span>
                        <span className="text-sm font-medium">{source.threats}</span>
                      </div>
                      <div className="w-full bg-input-background rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Threat Intelligence Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search threat intelligence..."
                    className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">New Malware Variant Detected</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          A new variant of the TrickBot malware has been identified targeting financial institutions in North America.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Source: CISA</span>
                          <span>•</span>
                          <span>2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Phishing Campaign Alert</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Large-scale phishing campaign impersonating major cloud providers detected across multiple regions.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Source: Internal</span>
                          <span>•</span>
                          <span>5 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
