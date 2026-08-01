"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, BarChart3 } from "lucide-react";
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
    if (!score) return "bg-gray-100 text-gray-600";
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

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
        <div className="py-10 text-center text-gray-500">Loading...</div>
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
          {results.map((seo) => (
            <div key={seo.id} className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{seo.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getScoreColor(seo.score)}`}>
                      <BarChart3 size={12} className="inline mr-1" />
                      Score: {seo.score ?? "N/A"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{seo.description}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
<h4 className="text-xs font-semibold text-gray-400 uppercase">Tag</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.isArray(seo.tags) && seo.tags.map((tag, i) => (
                      <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
<h4 className="text-xs font-semibold text-gray-400 uppercase">Tagar</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.isArray(seo.hashtags) && seo.hashtags.map((ht, i) => (
                      <span key={i} className="text-xs text-green-600">{ht}</span>
                    ))}
                  </div>
                </div>
                <div>
<h4 className="text-xs font-semibold text-gray-400 uppercase">Kata Kunci</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.isArray(seo.keywords) && seo.keywords.map((kw, i) => (
                      <span key={i} className="rounded bg-purple-50 px-2 py-0.5 text-xs text-purple-600">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

<div className="mt-3 text-xs text-gray-400">
                Dibuat: {new Date(seo.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
