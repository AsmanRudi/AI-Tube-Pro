"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import projectService from "@/services/project.service";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const project = await projectService.create({ name, niche });
      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat project");
    } finally {
      setLoading(false);
    }
  }

return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buat Proyek Baru</h1>
        <p className="mt-1 text-gray-500">
          Mulai project AI YouTube automation baru.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
        {error && (
          <div className="rounded bg-red-100 p-3 text-sm text-red-600">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium">Nama Proyek</label>
          <input
            type="text"
            className="mt-1 w-full rounded border p-3"
            placeholder="Misal: Channel Masakanku"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Niche / Kategori</label>
          <input
            type="text"
            className="mt-1 w-full rounded border p-3"
            placeholder="Misal: Memasak, Teknologi, Gaming"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-400">
            Opsional: Tentukan niche konten Anda untuk saran AI yang lebih baik.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Membuat..." : "Buat Proyek"}
        </button>
      </form>
    </div>
  );
}
