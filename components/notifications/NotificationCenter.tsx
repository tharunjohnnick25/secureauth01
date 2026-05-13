import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock notifications - replace with real data fetching as needed
const mockNotifications = [
  { id: 1, title: 'Suspicious Login Detected', description: 'A new login from an unrecognized device.', time: '2m ago' },
  { id: 2, title: 'Security Policy Updated', description: 'The global security policy was updated by an admin.', time: '1h ago' },
  { id: 3, title: 'New Document Shared', description: 'You have been granted access to a new confidential document.', time: '3h ago' },
];

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState(mockNotifications);

  // In a real app, you would fetch notifications from an API
  useEffect(() => {
    // Example: fetch('/api/notifications').then(...)
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-16 right-4 w-80 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">No new notifications.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-gray-400">{n.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
