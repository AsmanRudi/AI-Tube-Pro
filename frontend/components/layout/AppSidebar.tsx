"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Search,
  Image,
  Key,
  Settings,
  LogOut,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

interface User {
  role?: string;
}

const baseMenus = [
  {
    title: "Dasbor",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Proyek",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Skrip",
    href: "/scripts",
    icon: FileText,
  },
  {
    title: "SEO",
    href: "/seo",
    icon: Search,
  },
  {
    title: "Thumbnail",
    href: "/thumbnail",
    icon: Image,
  },
  {
    title: "API Key",
    href: "/api-key",
    icon: Key,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Pengaturan",
    href: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem("user");
      if (data) setUser(JSON.parse(data));
    } catch {
      setUser(null);
    }
  }, []);

  const menus = user?.role === "ADMIN"
    ? [
        ...baseMenus,
        {
          title: "Admin Panel",
          href: "/admin",
          icon: ShieldCheck,
        },
      ]
    : baseMenus;

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

    window.location.href = "/login";
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white dark:border-gray-800 dark:bg-gray-900 lg:flex lg:flex-col">
      {/* Logo */}
      <div className="border-b p-6 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-blue-600">
          AI Tube Pro
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Otomatisasi Konten AI
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 p-4">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active =
            pathname === menu.href ||
            (menu.href !== "/dashboard" && pathname?.startsWith(menu.href));

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              <span>{menu.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}

