"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Coins,
  BarChart3,
  ScrollText,
  Settings,
  ArrowLeft,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Subscription",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Credits",
    href: "/admin/credits",
    icon: Coins,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Logs",
    href: "/admin/logs",
    icon: ScrollText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-60 lg:border-b-0 lg:border-r">
      <div className="border-b p-5 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Admin Panel
        </p>
        <h1 className="mt-1 text-lg font-bold text-blue-600">AI Tube Pro</h1>
      </div>

      <nav className="flex flex-1 gap-1 overflow-x-auto p-3 lg:flex-col">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = menu.exact
            ? pathname === menu.href
            : pathname?.startsWith(menu.href);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={18} />
              <span className="whitespace-nowrap">{menu.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 dark:border-gray-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Kembali ke Aplikasi
        </Link>
      </div>
    </aside>
  );
}

