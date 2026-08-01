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
  return new Date(date).toLocaleString("id-ID");
}

export default function AdminPaymentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => adminService.getPayments(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="mt-1 text-gray-500">
          Semua transaksi pembayaran. Struktur siap diintegrasikan dengan Midtrans/Xendit.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Paid At</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-red-500">
                    Gagal memuat data pembayaran
                  </TableCell>
                </TableRow>
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-gray-400">
                    Belum ada transaksi pembayaran
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">#{p.id}</TableCell>
                    <TableCell>
                      <p className="font-medium">{p.user?.name}</p>
                      <p className="text-xs text-gray-500">{p.user?.email}</p>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(p.amount)}
                    </TableCell>
                    <TableCell>
                      {p.status === "SUCCESS" && <Badge variant="success">SUCCESS</Badge>}
                      {p.status === "PENDING" && <Badge variant="warning">PENDING</Badge>}
                      {p.status === "FAILED" && <Badge variant="danger">FAILED</Badge>}
                      {p.status === "EXPIRED" && <Badge variant="default">EXPIRED</Badge>}
                    </TableCell>
                    <TableCell>{p.plan ?? "-"}</TableCell>
                    <TableCell>{p.gateway ?? "-"}</TableCell>
                    <TableCell>{formatDate(p.paidAt)}</TableCell>
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

