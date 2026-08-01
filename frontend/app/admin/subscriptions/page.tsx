"use client";

import { useQuery } from "@tanstack/react-query";
import adminService from "@/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID");
}

export default function AdminSubscriptionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: () => adminService.getPayments(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="mt-1 text-gray-500">Data langganan dan pembayaran pengguna.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Dibuat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-red-500">
                    Gagal memuat data subscription
                  </TableCell>
                </TableRow>
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-gray-400">
                    Belum ada data subscription
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="font-medium">{p.user?.name}</p>
                      <p className="text-xs text-gray-500">{p.user?.email}</p>
                    </TableCell>
                    <TableCell>{p.plan ?? "-"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(p.amount)}
                    </TableCell>
                    <TableCell>
                      {p.status === "SUCCESS" && <Badge variant="success">{p.status}</Badge>}
                      {p.status === "PENDING" && <Badge variant="warning">{p.status}</Badge>}
                      {p.status === "FAILED" && <Badge variant="danger">{p.status}</Badge>}
                      {p.status === "EXPIRED" && <Badge variant="default">{p.status}</Badge>}
                    </TableCell>
                    <TableCell>{p.gateway ?? "-"}</TableCell>
                    <TableCell>{formatDate(p.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

