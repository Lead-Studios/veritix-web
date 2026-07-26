'use client';

import { useState, useEffect } from 'react';
import { HiBell } from 'react-icons/hi';

interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', message: 'New ticket purchase for Veritix Launch', timestamp: '5m ago', read: false },
    { id: '2', message: 'Daily check-in target reached', timestamp: '1h ago', read: false },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
        aria-label="Notifications"
      >
        <HiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#101428] border border-white/10 shadow-xl z-50 p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h4 className="text-sm font-semibold text-white">Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-400 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-lg text-xs transition-colors ${
                  item.read ? 'bg-white/5 text-gray-400' : 'bg-blue-500/10 text-white font-medium'
                }`}
              >
                <p>{item.message}</p>
                <span className="text-[10px] text-gray-400 block pt-1">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
