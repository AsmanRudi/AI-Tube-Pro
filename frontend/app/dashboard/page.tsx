"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FolderKanban, FileText, Search, Video, Coins, Plus, Sparkles, ArrowRight } from "lucide-react";
import { getDashboard } from "@/services/dashboard.service";
import StatsCard from "@/components/cards/StatCard";

export default function DashboardPage() {

  const token =
    typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: !!token,
  });

  const user = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg text-gray-500">Memuat dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg text-red-500">Gagal memuat dashboard.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Selamat Datang 👋</h1>
        <p className="mt-2 text-blue-100">{user?.name || "Pengguna"}</p>
        <p className="mt-3 max-w-xl">
          Mari buat konten YouTube bertenaga AI yang luar biasa hari ini. Hasilkan skrip, optimalkan SEO, dan banyak lagi!
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/projects/new"
            className="flex items-center gap-2 rounded bg-white px-5 py-3 font-medium text-blue-600 hover:bg-blue-50"
          >
            <Plus size={18} />
            Proyek Baru
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded bg-white/20 px-5 py-3 font-medium text-white hover:bg-white/30"
          >
            Lihat Proyek
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Proyek"
          value={data?.totalProjects ?? 0}
          icon={<FolderKanban size={24} />}
        />
        <StatsCard
          title="Total Skrip"
          value={data?.totalScripts ?? 0}
          icon={<FileText size={24} />}
        />
        <StatsCard
          title="Hasil SEO"
          value={data?.totalSeo ?? 0}
          icon={<Search size={24} />}
        />
        <StatsCard
          title="Kredit"
          value={data?.credits ?? 0}
          icon={<Coins size={24} />}
        />
      </div>

      {/* Video Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Video</p>
          <p className="mt-2 text-3xl font-bold">{data?.videos ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Dipublikasikan</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{data?.published ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Draf</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{data?.draft ?? 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Sparkles size={20} className="text-blue-600" />
          Aksi Cepat
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/projects/new"
            className="flex items-center gap-3 rounded-lg border p-4 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <Plus size={20} className="text-blue-600" />
            <div>
              <p className="font-medium">Proyek Baru</p>
              <p className="text-sm text-gray-500">Mulai project baru</p>
            </div>
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-3 rounded-lg border p-4 transition hover:border-green-300 hover:bg-green-50"
          >
            <FileText size={20} className="text-green-600" />
            <div>
              <p className="font-medium">Generate Skrip</p>
              <p className="text-sm text-gray-500">Buat script AI baru</p>
            </div>
          </Link>
          <Link
            href="/seo"
            className="flex items-center gap-3 rounded-lg border p-4 transition hover:border-purple-300 hover:bg-purple-50"
          >
            <Search size={20} className="text-purple-600" />
            <div>
              <p className="font-medium">Optimasi SEO</p>
              <p className="text-sm text-gray-500">Optimasi SEO video</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Proyek Terbaru</h2>
          <Link href="/projects" className="text-sm text-blue-600 hover:underline">
            Lihat Semua
          </Link>
        </div>
        {data?.recentProjects && data.recentProjects.length > 0 ? (
          <div className="mt-4 space-y-3">
            {data.recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FolderKanban size={18} className="text-blue-600" />
                  <span className="font-medium">{project.name}</span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">Belum ada project. Buat project baru untuk memulai!</p>
        )}
      </div>

      {/* Recent Scripts */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Skrip Terbaru</h2>
          <Link href="/scripts" className="text-sm text-blue-600 hover:underline">
            Lihat Semua
          </Link>
        </div>
        {data?.recentScripts && data.recentScripts.length > 0 ? (
          <div className="mt-4 space-y-3">
            {data.recentScripts.map((script) => (
              <div
                key={script.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-green-600" />
                  <span className="font-medium">{script.title}</span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(script.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">Belum ada skrip. Generate skrip dari project!</p>
        )}
      </div>
    </div>
  );
}
