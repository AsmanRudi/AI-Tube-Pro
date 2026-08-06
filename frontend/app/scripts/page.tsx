"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ListOrdered,
  AlignLeft,
  Tag,
  ALargeSmall,
} from "lucide-react";
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

  // Untuk accordion & tombol salin
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
    setExpandedId(null);
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
        <div className="py-10 text-center text-gray-500">Memuat...</div>
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
          {scripts.map((script) => {
            const isOpen = expandedId === script.id;
            return (
              <div key={script.id} className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : script.id)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{script.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {script.keyword} &middot; {script.language} &middot; {script.duration}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {new Date(script.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="rounded-full bg-blue-50 p-1.5 text-blue-600">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>
                </button>

                {/* Ringkasan */}
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{script.description}</p>

                {/* Konten lengkap */}
                {isOpen && (
                  <div className="mt-4 space-y-5 border-t pt-4">
                    {/* Outline */}
                    {Array.isArray(script.outline) && script.outline.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                          <ListOrdered size={14} />
                          Garis Besar (Outline)
                        </h4>
                        <ol className="mt-2 space-y-1.5">
                          {script.outline.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                                {i + 1}
                              </span>
                              {item}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Isi Script */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                          <AlignLeft size={14} />
                          Script Lengkap
                        </h4>
                        <button
                          onClick={() => copyText(script.content, `script-${script.id}`)}
                          className="flex items-center gap-1 rounded border px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                        >
                          {copiedField === `script-${script.id}` ? (
                            <><Check size={12} className="text-green-600" /> Tersalin</>
                          ) : (
                            <><Copy size={12} /> Salin</>
                          )}
                        </button>
                      </div>
                      <div className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
                        {script.content}
                      </div>
                    </div>

                    {/* Deskripsi */}
                    {script.description && (
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                            <ALargeSmall size={14} />
                            Deskripsi
                          </h4>
                          <button
                            onClick={() => copyText(script.description, `desc-${script.id}`)}
                            className="flex items-center gap-1 rounded border px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                          >
                            {copiedField === `desc-${script.id}` ? (
                              <><Check size={12} className="text-green-600" /> Tersalin</>
                            ) : (
                              <><Copy size={12} /> Salin</>
                            )}
                          </button>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                          {script.description}
                        </p>
                      </div>
                    )}

                    {/* Tag */}
                    {Array.isArray(script.tags) && script.tags.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                          <Tag size={14} />
                          Tag
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {script.tags.map((tag, i) => (
                            <span key={i} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
