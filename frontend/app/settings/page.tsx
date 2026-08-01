"use client";

import { useEffect, useState } from "react";
import { User, Key, Bell, Shield } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  plan: string;
  credits: number;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      const u = JSON.parse(data);
      setUser(u);
      setName(u.name);
    }
  }, []);

  function handleSave() {
    if (user) {
      const updated = { ...user, name };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
<h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="mt-1 text-gray-500">Kelola pengaturan akun dan preferensi.</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <User size={24} />
          </div>
<h2 className="text-lg font-semibold">Profil</h2>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Nama</label>
            <input
              className="mt-1 w-full rounded border p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded border bg-gray-50 p-3 text-gray-500"
              value={user?.email ?? ""}
              disabled
            />
          </div>
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            {saved ? "Tersimpan!" : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* Plan & Credits */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-3 text-green-600">
            <Key size={24} />
          </div>
          <h2 className="text-lg font-semibold">Paket & Kredit</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Paket Saat Ini</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">{user?.plan ?? "FREE"}</p>
          </div>
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Sisa Kredit</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{user?.credits ?? 0}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          <p className="font-medium">💡 Paket Gratis Termasuk:</p>
          <ul className="mt-2 space-y-1">
            <li>• 100 kredit per bulan</li>
            <li>• Generasi skrip</li>
            <li>• Optimasi SEO</li>
            <li>• Konsep thumbnail</li>
          </ul>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
            <Bell size={24} />
          </div>
          <h2 className="text-lg font-semibold">Notifikasi</h2>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Notifikasi email saat pembuatan skrip selesai</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Laporan penggunaan mingguan</span>
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-red-100 p-3 text-red-600">
            <Shield size={24} />
          </div>
          <h2 className="text-lg font-semibold">Keamanan</h2>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Ubah Kata Sandi</label>
            <input
              type="password"
              className="mt-1 w-full rounded border p-3"
              placeholder="Kata sandi baru"
            />
          </div>
          <div>
            <input
              type="password"
              className="mt-1 w-full rounded border p-3"
              placeholder="Konfirmasi kata sandi baru"
            />
          </div>
          <button className="rounded bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700">
            Perbarui Kata Sandi
          </button>
        </div>
      </div>
    </div>
  );
}
