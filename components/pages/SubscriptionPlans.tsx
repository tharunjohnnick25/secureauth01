'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { CheckCircle, Crown } from 'lucide-react';

const plans = [
  { name: 'Starter', price: '$99', features: ['Up to 100 devices', 'Basic security scans', 'Email support'], current: false },
  { name: 'Professional', price: '$299', features: ['Up to 500 devices', 'Advanced threat detection', '24/7 support', 'API access'], current: true },
  { name: 'Enterprise', price: '$999', features: ['Unlimited devices', 'Custom integrations', 'Dedicated support', 'SLA guarantee'], current: false },
];

export function SubscriptionPlans() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Subscription Plans</h1>
            <p className="text-muted-foreground">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <Card key={idx} className={plan.current ? 'border-primary' : ''}>
                <CardContent className="p-6">
                  {plan.current && (
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium text-warning">Current Plan</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.current ? 'outline' : 'default'}>
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
