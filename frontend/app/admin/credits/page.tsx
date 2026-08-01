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

export default function AdminCreditsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-credit-users"],
    queryFn: () => adminService.listUsers({ limit: 100 }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Credits Management</h1>
        <p className="mt-1 text-gray-500">
          Pantau saldo kredit seluruh pengguna. Kelola lewat User Management.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-red-500">
                    Gagal memuat data
                  </TableCell>
                </TableRow>
              ) : (
                data?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.plan === "FREE" ? "default" : "purple"}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={user.credits < 10 ? "font-bold text-red-600" : "font-bold"}>
                        {user.credits}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.status === "ACTIVE" ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Suspended</Badge>
                      )}
                    </TableCell>
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

