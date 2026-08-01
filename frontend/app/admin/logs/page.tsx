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

function formatDate(date: string) {
  return new Date(date).toLocaleString("id-ID");
}

export default function AdminLogsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-logs"],
    queryFn: () => adminService.getLogs(100),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Logs</h1>
        <p className="mt-1 text-gray-500">
          Riwayat seluruh request AI yang dilakukan pengguna.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waktu</TableHead>
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
                    Gagal memuat log
                  </TableCell>
                </TableRow>
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-gray-400">
                    Belum ada log AI
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <p className="font-medium">{log.user?.name}</p>
                      <p className="text-xs text-gray-500">{log.user?.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">{log.feature}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                    <TableCell>-{log.creditsUsed}</TableCell>
                    <TableCell>{log.responseTime}ms</TableCell>
                    <TableCell>{log.tokensUsed}</TableCell>
                    <TableCell>
                      {log.status === "SUCCESS" ? (
                        <Badge variant="success">SUCCESS</Badge>
                      ) : (
                        <Badge variant="danger">FAILED</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
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

