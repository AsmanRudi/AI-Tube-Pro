"use client";

import { useQuery } from "@tanstack/react-query";
import { Coins, CreditCard, Crown, CalendarDays, Activity } from "lucide-react";
import billingService from "@/services/billing.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID");
}

export default function BillingPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["billing"],
    queryFn: () => billingService.getBilling(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (error) {
    return <div className="text-lg text-red-500">Gagal memuat data billing.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="mt-1 text-gray-500">
          Kelola langganan, kredit, dan riwayat penggunaan Anda.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Crown size={16} /> Plan
              </p>
              <p className="mt-1 text-2xl font-bold">{data?.plan ?? "FREE"}</p>
            </div>
            <Badge variant="purple">{data?.plan ?? "FREE"}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Coins size={16} /> Kredit
              </p>
              <p className="mt-1 text-2xl font-bold">{data?.credits ?? 0}</p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
              <Coins size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays size={16} /> Berlaku Hingga
              </p>
              <p className="mt-1 text-2xl font-bold">
                {formatDate(data?.expireAt)}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <CalendarDays size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins size={18} className="text-amber-600" />
            Riwayat Kredit
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto">
          {data?.creditHistory?.length === 0 ? (
            <p className="py-8 text-center text-gray-400">Belum ada riwayat kredit</p>
          ) : (
            <div className="space-y-2">
              {data?.creditHistory?.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{h.feature}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(h.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      h.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {h.amount > 0 ? `+${h.amount}` : h.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            Riwayat Pembelian
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.payments?.length === 0 ? (
            <p className="py-8 text-center text-gray-400">Belum ada pembelian</p>
          ) : (
            <div className="space-y-2">
              {data?.payments?.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{p.plan ?? "Top Up"} Package</p>
                    <p className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(p.amount)}
                    </span>
                    <Badge variant={p.status === "SUCCESS" ? "success" : "warning"}>
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Usage History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity size={18} className="text-purple-600" />
            Riwayat Penggunaan AI
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto">
          {data?.apiUsages?.length === 0 ? (
            <p className="py-8 text-center text-gray-400">Belum ada penggunaan AI</p>
          ) : (
            <div className="space-y-2">
              {data?.apiUsages?.map((u: any) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{u.feature}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {u.responseTime}ms
                    </span>
                    <span className="font-bold text-red-600">
                      -{u.creditsUsed} credits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

