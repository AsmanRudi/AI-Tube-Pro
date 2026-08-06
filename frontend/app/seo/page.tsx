"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  BarChart3,
  Copy,
  Check,
  Tag,
  Hash,
  KeyRound,
  ALargeSmall,
  AlignLeft,
} from "lucide-react";
import projectService from "@/services/project.service";
import seoService from "@/services/seo.service";
import { SeoResult } from "@/types/seo";

interface ProjectOption {
  id: number;
  name: string;
}

export default function SeoPage() {
  const router = useRouter();
  const [results, setResults] = useState<SeoResult[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadSeoResults(Number(selectedProjectId));
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [selectedProjectId]);

  async function loadProjects() {
    try {
      const data = await projectService.getAll();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSeoResults(projectId: number) {
    setLoading(true);
    try {
      const data = await seoService.list(projectId);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return { text: "text-gray-600", bg: "bg-gray-100", bar: "bg-gray-400", label: "Tidak tersedia" };
    if (score >= 80) return { text: "text-green-700", bg: "bg-green-100", bar: "bg-green-500", label: "Sangat Baik" };
    if (score >= 60) return { text: "text-yellow-700", bg: "bg-yellow-100", bar: "bg-yellow-500", label: "Cukup Baik" };
    return { text: "text-red-700", bg: "bg-red-100", bar: "bg-red-500", label: "Perlu Diperbaiki" };
  };

  async function copyText(text: string, fieldKey: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (err) {
      console.error("Gagal menyalin teks:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border p-2 hover:bg-gray-100"
          title="Kembali ke Dasbor"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Hasil SEO</h1>
          <p className="mt-1 text-gray-500">Lihat dan kelola hasil optimasi SEO untuk video YouTube.</p>
        </div>
      </div>

      {/* Project Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Pilih Project:</label>
        <select
          className="rounded border p-2"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">-- Pilih Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Memuat...</div>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-16 text-center">
          <Search size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold">Belum ada hasil SEO</h3>
          <p className="mt-2 text-gray-500">
            Generate SEO untuk script dari halaman project.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((seo) => {
            const color = getScoreColor(seo.score);
            const scoreVal = seo.score ?? 0;
            return (
              <div key={seo.id} className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                {/* Header + Score */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{seo.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${color.bg} ${color.text}`}>
                      <BarChart3 size={12} />
                      Skor SEO: {seo.score ?? "N/A"}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Skor Optimasi SEO</span>
                    <span className={`font-semibold ${color.text}`}>{color.label}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${color.bar} transition-all`}
                      style={{ width: `${scoreVal}%` }}
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-600">
                      <AlignLeft size={14} />
                      Deskripsi
                    </h4>
                    <button
                      onClick={() => copyText(seo.description, `desc-${seo.id}`)}
                      className="flex items-center gap-1 rounded border px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                    >
                      {copiedField === `desc-${seo.id}` ? (
                        <><Check size={12} className="text-green-600" /> Tersalin</>
                      ) : (
                        <><Copy size={12} /> Salin</>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                    {seo.description}
                  </p>
                </div>

                {/* Tag, Tagar, Kata Kunci */}
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-gray-50 p-3">
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                      <Tag size={13} />
                      Tag
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Array.isArray(seo.tags) && seo.tags.map((tag, i) => (
                        <span key={i} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-gray-50 p-3">
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-600">
                      <Hash size={13} />
                      Tagar
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Array.isArray(seo.hashtags) && seo.hashtags.map((ht, i) => (
                        <span key={i} className="text-xs text-green-700">{ht}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-gray-50 p-3">
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                      <KeyRound size={13} />
                      Kata Kunci
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Array.isArray(seo.keywords) && seo.keywords.map((kw, i) => (
                        <span key={i} className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  Dibuat: {new Date(seo.createdAt).toLocaleString("id-ID")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
