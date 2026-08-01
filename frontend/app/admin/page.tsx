"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  Crown,
  Coins,
  FileText,
  DollarSign,
  FolderKanban,
  TrendingUp,
} from "lucide-react";
import adminService from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { DoughnutChart } from "@/components/charts/DoughnutChart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminService.getAnalytics(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-lg text-red-500">
        Gagal memuat data analytics.
      </div>
    );
  }

  const overview = data?.overview;

  const stats = [
    { title: "Total Users", value: overview?.totalUsers ?? 0, icon: <Users size={20} />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40" },
    { title: "Active Users", value: overview?.activeUsers ?? 0, icon: <UserCheck size={20} />, color: "bg-green-100 text-green-600 dark:bg-green-900/40" },
    { title: "Premium Users", value: overview?.premiumUsers ?? 0, icon: <Crown size={20} />, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40" },
    { title: "Total Credits Used", value: overview?.totalCreditsUsed ?? 0, icon: <Coins size={20} />, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40" },
    { title: "Script Generated", value: overview?.scriptGenerated ?? 0, icon: <FileText size={20} />, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40" },
    { title: "Revenue", value: formatCurrency(overview?.revenue ?? 0), icon: <DollarSign size={20} />, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" },
    { title: "Total Projects", value: overview?.totalProjects ?? 0, icon: <FolderKanban size={20} />, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">Ringkasan performa platform AI Tube Pro.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>{stat.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top User & Most Used Feature */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              Top User
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.topUser ? (
              <div>
                <p className="text-lg font-semibold">{data.topUser.user.name}</p>
                <p className="text-sm text-gray-500">{data.topUser.user.email}</p>
                <p className="mt-2 text-sm">
                  Credits digunakan:{" "}
                  <span className="font-bold text-amber-600">
                    {data.topUser.creditsUsed}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Belum ada data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fitur Paling Sering Digunakan</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.mostUsedFeature ? (
              <div>
                <p className="text-lg font-semibold">{data.mostUsedFeature.feature}</p>
                <p className="mt-2 text-sm">
                  Total pemakaian:{" "}
                  <span className="font-bold">{data.mostUsedFeature.count}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Belum ada data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily AI Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={(data?.dailyAiUsage ?? []).map((d) => ({
                label: d.date.slice(5),
                value: d.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly AI Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={(data?.monthlyAiUsage ?? []).map((d) => ({
                label: d.month,
                value: d.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribusi Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <DoughnutChart
            data={(data?.planDistribution ?? []).map((d) => ({
              label: d.plan,
              value: d.count,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}

