"use client";

import { useEffect, useState } from "react";

import {
  FolderKanban,
  FileText,
  Video,
  Coins,
} from "lucide-react";

import StatsCard from "../cards/StatCard";

interface DashboardData {
  projects: number;
  scripts: number;
  videos: number;
  credits: number;
}

interface User {
  name: string;
}

export default function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);

  const [dashboard, setDashboard] =
    useState<DashboardData>({
      projects: 0,
      scripts: 0,
      videos: 0,
      credits: 0,
    });

  useEffect(() => {
    const data = localStorage.getItem("user");

    if (data) {
      const u = JSON.parse(data);

      setUser(u);

      setDashboard({
        projects: 0,
        scripts: 0,
        videos: 0,
        credits: u.credits ?? 100,
      });
    }
  }, []);

  return (
    <div className="space-y-8">

      {/* Welcome */}

      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

        <h1 className="text-3xl font-bold">
          Selamat Datang 👋
        </h1>

        <p className="mt-2 text-blue-100">
          {user?.name ?? "User"}
        </p>

        <p className="mt-3">
          Mari buat konten AI yang luar biasa hari ini.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Projects"
          value={dashboard.projects}
          icon={<FolderKanban size={24} />}
        />

        <StatsCard
          title="Scripts"
          value={dashboard.scripts}
          icon={<FileText size={24} />}
        />

        <StatsCard
          title="Videos"
          value={dashboard.videos}
          icon={<Video size={24} />}
        />

        <StatsCard
          title="Credits"
          value={dashboard.credits}
          icon={<Coins size={24} />}
        />

      </div>

      {/* Recent Projects */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-xl font-semibold">
          Recent Projects
        </h2>

        <p className="text-gray-500">
          Belum ada project.
        </p>

      </div>

      {/* Recent Scripts */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-xl font-semibold">
          Recent Scripts
        </h2>

        <p className="text-gray-500">
          Belum ada script.
        </p>

      </div>

    </div>
  );
}