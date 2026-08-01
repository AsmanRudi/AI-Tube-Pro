"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import notificationService from "@/services/notification.service";
import { Notification } from "@/types/notification";

interface User {
  name: string;
  plan: string;
  credits: number;
}

export default function AppNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("user");

    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const result = await notificationService.list(20);
      setNotifications(result.notifications);
    } catch {
      // abaikan error notifikasi
    }
  }

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-900 md:px-6">
      <div>
        <h2 className="text-xl font-semibold">
          AI Tube Pro
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Notifikasi */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDropdown((v) => !v);
              loadNotifications();
            }}
            className="relative rounded-md p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-2 flex items-center justify-between px-2 py-1">
                  <span className="text-sm font-semibold">Notifikasi</span>
                  {unread > 0 && (
                    <button
                      onClick={async () => {
                        await notificationService.markAllRead();
                        loadNotifications();
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-72 space-y-1 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-2 py-4 text-center text-sm text-gray-400">
                      Belum ada notifikasi
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`rounded-md px-3 py-2 text-sm ${n.isRead ? "" : "bg-blue-50 dark:bg-blue-950/40"}`}
                      >
                        <p className="font-medium">{n.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => router.push("/billing")}
          className="hidden text-right md:block"
        >
          <p className="text-sm font-semibold">
            {user?.plan ?? "FREE"} PLAN
          </p>

          <p className="text-xs text-gray-500">
            Kredit : {user?.credits ?? 50}
          </p>
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}

