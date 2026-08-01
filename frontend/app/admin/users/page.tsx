"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Minus, RotateCcw, Crown, Ban, CheckCircle, Trash2, RefreshCw } from "lucide-react";
import adminService from "@/services/admin.service";
import { AdminUser } from "@/types/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID");
}

function planBadge(plan: string) {
  switch (plan) {
    case "FREE":
      return <Badge variant="default">FREE</Badge>;
    case "BASIC":
      return <Badge variant="info">BASIC</Badge>;
    case "PRO":
      return <Badge variant="purple">PRO</Badge>;
    case "ENTERPRISE":
      return <Badge variant="success">ENTERPRISE</Badge>;
    default:
      return <Badge>{plan}</Badge>;
  }
}

function statusBadge(status: string) {
  return status === "ACTIVE" ? (
    <Badge variant="success">Active</Badge>
  ) : (
    <Badge variant="danger">Suspended</Badge>
  );
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialog, setDialog] = useState<{
    type: "add" | "remove" | "plan" | "delete";
    user: AdminUser;
  } | null>(null);
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState("BASIC");
  const [expireAt, setExpireAt] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, debouncedSearch, planFilter, statusFilter],
    queryFn: () =>
      adminService.listUsers({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        plan: planFilter || undefined,
        status: statusFilter || undefined,
      }),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const creditMutation = useMutation({
    mutationFn: ({ id, amount, type }: { id: number; amount: number; type: "add" | "remove" }) =>
      type === "add"
        ? adminService.addCredit(id, amount)
        : adminService.removeCredit(id, amount),
    onSuccess: () => {
      toast("Kredit berhasil diperbarui", "success");
      setDialog(null);
      setAmount("");
      refresh();
    },
    onError: (e: Error) => {
      toast(e.message || "Gagal memperbarui kredit", "error");
    },
  });

  const planMutation = useMutation({
    mutationFn: ({ id, plan, expireAt }: { id: number; plan: string; expireAt?: string }) =>
      adminService.changePlan(id, plan, expireAt || null),
    onSuccess: () => {
      toast("Plan berhasil diubah", "success");
      setDialog(null);
      setPlan("BASIC");
      setExpireAt("");
      refresh();
    },
    onError: (e: Error) => {
      toast(e.message || "Gagal mengubah plan", "error");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, suspend }: { id: number; suspend: boolean }) =>
      suspend ? adminService.suspendUser(id) : adminService.activateUser(id),
    onSuccess: () => {
      toast("Status user berhasil diubah", "success");
      refresh();
    },
    onError: (e: Error) => {
      toast(e.message || "Gagal mengubah status", "error");
    },
  });

  const resetMutation = useMutation({
    mutationFn: (id: number) => adminService.resetCredits(id),
    onSuccess: () => {
      toast("Kredit berhasil direset", "success");
      refresh();
    },
    onError: (e: Error) => {
      toast(e.message || "Gagal reset kredit", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteUser(id),
    onSuccess: () => {
      toast("User berhasil dihapus", "success");
      setDialog(null);
      refresh();
    },
    onError: (e: Error) => {
      toast(e.message || "Gagal menghapus user", "error");
    },
  });

  const submitCredit = () => {
    if (!dialog) return;
    if (dialog.type !== "add" && dialog.type !== "remove") return;
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast("Masukkan jumlah kredit valid", "error");
      return;
    }
    creditMutation.mutate({ id: dialog.user.id, amount: amt, type: dialog.type });
  };

  const submitPlan = () => {
    if (!dialog) return;
    planMutation.mutate({ id: dialog.user.id, plan, expireAt: expireAt || undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="mt-1 text-gray-500">Kelola seluruh pengguna platform.</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari nama atau email..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setTimeout(() => setDebouncedSearch(e.target.value), 400);
              }}
            />
          </div>
          <Select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}>
            <option value="">Semua Plan</option>
            <option value="FREE">FREE</option>
            <option value="BASIC">BASIC</option>
            <option value="PRO">PRO</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Semua Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
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
                <TableHead>Expire</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
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
              ) : data?.users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-gray-400">
                    Tidak ada user ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                data?.users.map((user: AdminUser) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{planBadge(user.plan)}</TableCell>
                    <TableCell>{user.credits}</TableCell>
                    <TableCell>{statusBadge(user.status)}</TableCell>
                    <TableCell>{formatDate(user.expireAt)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        {(close) => (
                          <>
                            <DropdownMenuItem
                              onClick={() => { setDialog({ type: "add", user }); setAmount(""); }}
                            >
                              <Plus size={14} className="mr-2 text-green-600" />
                              Tambah Credits
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setDialog({ type: "remove", user }); setAmount(""); }}
                            >
                              <Minus size={14} className="mr-2 text-red-600" />
                              Kurangi Credits
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { resetMutation.mutate(user.id); close(); }}
                            >
                              <RotateCcw size={14} className="mr-2 text-amber-600" />
                              Reset Credits
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setDialog({ type: "plan", user }); setPlan(user.plan); setExpireAt(user.expireAt?.slice(0, 10) ?? ""); }}
                            >
                              <Crown size={14} className="mr-2 text-purple-600" />
                              {user.plan === "FREE" ? "Upgrade Plan" : "Change Plan"}
                            </DropdownMenuItem>
                            {user.status === "ACTIVE" ? (
                              <DropdownMenuItem
                                onClick={() => { statusMutation.mutate({ id: user.id, suspend: true }); close(); }}
                              >
                                <Ban size={14} className="mr-2 text-red-600" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => { statusMutation.mutate({ id: user.id, suspend: false }); close(); }}
                              >
                                <CheckCircle size={14} className="mr-2 text-green-600" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => { setDialog({ type: "delete", user }); close(); }}
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data && (
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Credit Dialog */}
      <Dialog
        open={dialog?.type === "add" || dialog?.type === "remove"}
        onClose={() => setDialog(null)}
        title={dialog?.type === "add" ? "Tambah Credits" : "Kurangi Credits"}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {dialog?.user.name} ({dialog?.user.email})
          </p>
          <div>
            <Label>Jumlah Credits</Label>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan jumlah"
            />
          </div>
          <Button onClick={submitCredit} className="w-full">
            {dialog?.type === "add" ? "Tambah" : "Kurangi"}
          </Button>
        </div>
      </Dialog>

      {/* Plan Dialog */}
      <Dialog
        open={dialog?.type === "plan"}
        onClose={() => setDialog(null)}
        title="Change Plan"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {dialog?.user.name} ({dialog?.user.email})
          </p>
          <div>
            <Label>Plan</Label>
            <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="FREE">FREE</option>
              <option value="BASIC">BASIC</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </Select>
          </div>
          <div>
            <Label>Expire Date (opsional)</Label>
            <Input type="date" value={expireAt} onChange={(e) => setExpireAt(e.target.value)} />
          </div>
          <Button onClick={submitPlan} className="w-full">Simpan</Button>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={dialog?.type === "delete"}
        onClose={() => setDialog(null)}
        title="Hapus User"
      >
        <div className="space-y-4">
          <p>
            Yakin ingin menghapus user{" "}
            <span className="font-semibold">{dialog?.user.name}</span>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDialog(null)}>
              Batal
            </Button>
            <Button
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              onClick={() => dialog && deleteMutation.mutate(dialog.user.id)}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

