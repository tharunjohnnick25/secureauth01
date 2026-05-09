import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Shield,
  Target,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const riskDistribution = [
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'High', value: 34, color: '#f59e0b' },
  { name: 'Medium', value: 67, color: '#6366f1' },
  { name: 'Low', value: 128, color: '#10b981' },
];

const riskTrend = [
  { month: 'Jan', critical: 18, high: 42, medium: 65, low: 110 },
  { month: 'Feb', critical: 15, high: 38, medium: 68, low: 115 },
  { month: 'Mar', critical: 14, high: 36, medium: 64, low: 120 },
  { month: 'Apr', critical: 12, high: 34, medium: 67, low: 128 },
];

const riskCategories = [
  { category: 'Vulnerabilities', critical: 5, high: 12, medium: 23, low: 45, total: 85 },
  { category: 'Access Control', critical: 3, high: 8, medium: 15, low: 28, total: 54 },
  { category: 'Data Protection', critical: 2, high: 7, medium: 18, low: 32, total: 59 },
  { category: 'Network Security', critical: 2, high: 7, medium: 11, low: 23, total: 43 },
];

const topRisks = [
  { id: 'RISK-2024-001', title: 'Unpatched Critical Vulnerabilities', severity: 'critical', score: 9.8, impact: 'High', likelihood: 'High', status: 'Open' },
  { id: 'RISK-2024-002', title: 'Weak Password Policies', severity: 'high', score: 8.2, impact: 'Medium', likelihood: 'High', status: 'In Progress' },
  { id: 'RISK-2024-003', title: 'Insufficient Access Controls', severity: 'high', score: 7.9, impact: 'High', likelihood: 'Medium', status: 'Open' },
  { id: 'RISK-2024-004', title: 'Outdated Encryption Standards', severity: 'medium', score: 6.5, impact: 'Medium', likelihood: 'Medium', status: 'Open' },
];

export function RiskAssessment() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Risk Assessment</h1>
              <p className="text-muted-foreground">
                Comprehensive risk analysis and mitigation tracking
              </p>
            </div>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critical Risks</p>
                  <h3 className="text-2xl font-semibold">12</h3>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3" />
                    -33% from last month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <h3 className="text-2xl font-semibold">6.4</h3>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3" />
                    -0.8 this month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Risks</p>
                  <h3 className="text-2xl font-semibold">241</h3>
                  <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mitigated</p>
                  <h3 className="text-2xl font-semibold">89</h3>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +15 this month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Risk Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="critical" stackId="a" fill="#ef4444" />
                    <Bar dataKey="high" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="medium" stackId="a" fill="#6366f1" />
                    <Bar dataKey="low" stackId="a" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {riskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Risk by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskCategories.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg bg-input-background/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{category.category}</h4>
                      <span className="text-sm font-medium">Total: {category.total}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div className="text-center">
                        <div className="text-destructive text-xl font-semibold">{category.critical}</div>
                        <div className="text-xs text-muted-foreground">Critical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-warning text-xl font-semibold">{category.high}</div>
                        <div className="text-xs text-muted-foreground">High</div>
                      </div>
                      <div className="text-center">
                        <div className="text-primary text-xl font-semibold">{category.medium}</div>
                        <div className="text-xs text-muted-foreground">Medium</div>
                      </div>
                      <div className="text-center">
                        <div className="text-success text-xl font-semibold">{category.low}</div>
                        <div className="text-xs text-muted-foreground">Low</div>
                      </div>
                    </div>
                    <div className="w-full bg-input-background rounded-full h-2 overflow-hidden flex">
                      <div className="bg-destructive h-2" style={{ width: `${(category.critical / category.total) * 100}%` }} />
                      <div className="bg-warning h-2" style={{ width: `${(category.high / category.total) * 100}%` }} />
                      <div className="bg-primary h-2" style={{ width: `${(category.medium / category.total) * 100}%` }} />
                      <div className="bg-success h-2" style={{ width: `${(category.low / category.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topRisks.map((risk) => (
                  <div
                    key={risk.id}
                    className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{risk.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            risk.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                            risk.severity === 'high' ? 'bg-warning/20 text-warning' :
                            'bg-primary/20 text-primary'
                          }`}>
                            {risk.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="block text-xs">Risk Score</span>
                            <span className="font-semibold text-foreground">{risk.score}</span>
                          </div>
                          <div>
                            <span className="block text-xs">Impact</span>
                            <span className="font-medium text-foreground">{risk.impact}</span>
                          </div>
                          <div>
                            <span className="block text-xs">Likelihood</span>
                            <span className="font-medium text-foreground">{risk.likelihood}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          risk.status === 'In Progress' ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                        }`}>
                          {risk.status}
                        </span>
                      </div>
                    </div>
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
