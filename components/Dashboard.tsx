'use client';

import {
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Lock,
  Key,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const authData = [
  { name: "Mon", success: 2400, failed: 24 },
  { name: "Tue", success: 1398, failed: 32 },
  { name: "Wed", success: 9800, failed: 18 },
  { name: "Thu", success: 3908, failed: 45 },
  { name: "Fri", success: 4800, failed: 28 },
  { name: "Sat", success: 3800, failed: 12 },
  { name: "Sun", success: 4300, failed: 15 },
];

const accessData = [
  { name: "Admin", value: 15, color: "#3B82F6" },
  { name: "Manager", value: 45, color: "#10B981" },
  { name: "Developer", value: 120, color: "#8B5CF6" },
  { name: "User", value: 320, color: "#F59E0B" },
];

const recentActivities = [
  {
    id: 1,
    user: "john.doe@enterprise.com",
    action: "Login successful",
    timestamp: "2 minutes ago",
    status: "success",
    ip: "192.168.1.45",
  },
  {
    id: 2,
    user: "jane.smith@enterprise.com",
    action: "Failed MFA verification",
    timestamp: "5 minutes ago",
    status: "warning",
    ip: "10.0.0.123",
  },
  {
    id: 3,
    user: "admin@enterprise.com",
    action: "Role updated for user",
    timestamp: "12 minutes ago",
    status: "info",
    ip: "172.16.0.50",
  },
  {
    id: 4,
    user: "bob.wilson@enterprise.com",
    action: "Password reset requested",
    timestamp: "18 minutes ago",
    status: "info",
    ip: "192.168.1.78",
  },
  {
    id: 5,
    user: "attacker@external.com",
    action: "Multiple failed login attempts",
    timestamp: "23 minutes ago",
    status: "danger",
    ip: "203.0.113.45",
  },
];

const securityAlerts = [
  {
    id: 1,
    type: "High Risk",
    message: "Unusual login pattern detected from IP 203.0.113.45",
    severity: "high",
    time: "15 minutes ago",
  },
  {
    id: 2,
    type: "Medium Risk",
    message: "3 users with expired passwords",
    severity: "medium",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "Low Risk",
    message: "Session timeout configuration changed",
    severity: "low",
    time: "2 hours ago",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Security Dashboard
        </h2>
        <p className="text-gray-600 mt-1">
          Real-time overview of your enterprise security posture
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">500</p>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+12% this month</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">287</p>
              <p className="text-sm text-gray-500 mt-2">
                Across all platforms
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed Attempts</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">24</p>
              <p className="text-sm text-amber-600 mt-2">Last 24 hours</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">MFA Enabled</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">94%</p>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>470 users</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Trends */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            Authentication Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={authData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="success"
                stroke="#10B981"
                strokeWidth={2}
                name="Successful"
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#EF4444"
                strokeWidth={2}
                name="Failed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Roles Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">User Roles Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={accessData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Security Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Alerts */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Security Alerts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === "high"
                        ? "bg-red-500"
                        : alert.severity === "medium"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          alert.severity === "high"
                            ? "text-red-700"
                            : alert.severity === "medium"
                            ? "text-amber-700"
                            : "text-blue-700"
                        }`}
                      >
                        {alert.type}
                      </span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      IP: {activity.ip} • {activity.timestamp}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === "success"
                        ? "bg-green-100 text-green-700"
                        : activity.status === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : activity.status === "danger"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
