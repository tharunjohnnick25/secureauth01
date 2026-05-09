import { Bell, Search, Menu } from 'lucide-react';
import { Input } from './Input';
import { useState } from 'react';

export function Navbar() {
  const [notifications] = useState(3);

  return (
    <header className="fixed top-0 right-0 left-64 h-16 glass-card border-b border-border z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <button className="lg:hidden p-2 hover:bg-accent rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search devices, users, alerts..."
              icon={<Search className="w-4 h-4" />}
              className="bg-input-background/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
