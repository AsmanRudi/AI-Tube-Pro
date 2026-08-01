"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import projectService from "@/services/project.service";
import scriptService from "@/services/script.service";
import { Script } from "@/types/script";

interface ProjectOption {
  id: number;
  name: string;
}

export default function ScriptsPage() {
  const router = useRouter();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadScripts(Number(selectedProjectId));
    } else {
      setScripts([]);
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

  async function loadScripts(projectId: number) {
    setLoading(true);
    try {
      const data = await scriptService.list(projectId);
      setScripts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold">Skrip</h1>
          <p className="mt-1 text-gray-500">Kelola semua skrip AI yang telah digenerate.</p>
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
      ) : scripts.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-16 text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
<h3 className="text-xl font-semibold">Belum ada skrip</h3>
          <p className="mt-2 text-gray-500">
            Pilih project dan generate skrip dari halaman project.
          </p>
          <Link
            href="/projects"
            className="mt-4 inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <Sparkles size={18} />
            Ke Proyek
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {scripts.map((script) => (
            <div key={script.id} className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{script.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {script.keyword} &middot; {script.language} &middot; {script.duration}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{new Date(script.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{script.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.isArray(script.tags) && script.tags.slice(0, 5).map((tag, i) => (
                  <span key={i} className="rounded-full bg-gray-100 px-2 py-1 text-xs">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
