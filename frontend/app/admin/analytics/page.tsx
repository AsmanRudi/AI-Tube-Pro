"use client";

import { useQuery } from "@tanstack/react-query";
import adminService from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { DoughnutChart } from "@/components/charts/DoughnutChart";

export default function AdminAnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminService.getAnalytics(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Gagal memuat analytics.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-gray-500">
          Statistik penggunaan AI dan pertumbuhan platform.
        </p>
      </div>

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

