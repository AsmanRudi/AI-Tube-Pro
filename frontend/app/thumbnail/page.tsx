"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Image,
  Sparkles,
  Copy,
  Check,
  Palette,
  Lightbulb,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import projectService from "@/services/project.service";
import scriptService from "@/services/script.service";
import thumbnailService from "@/services/thumbnail.service";
import { Script } from "@/types/script";
import { ThumbnailResult } from "@/types/thumbnail";

interface ProjectOption {
  id: number;
  name: string;
}

const STYLE_OPTIONS: { value: string; label: string }[] = [
  { value: "professional", label: "Profesional" },
  { value: "dramatic", label: "Dramatis" },
  { value: "colorful", label: "Berwarna" },
  { value: "minimalist", label: "Minimalis" },
];

export default function ThumbnailPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState<number | "">("");
  const [style, setStyle] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThumbnailResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadScripts(Number(selectedProjectId));
    } else {
      setScripts([]);
    }
    setSelectedScriptId("");
    setResult(null);
  }, [selectedProjectId]);

  async function loadProjects() {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadScripts(projectId: number) {
    try {
      const data = await scriptService.list(projectId);
      setScripts(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGenerate() {
    if (!selectedScriptId) return;
    setLoading(true);
    setResult(null);
    setCopied(false);
    try {
      const script = scripts.find((s) => s.id === Number(selectedScriptId));
      if (!script) return;
      const data = await thumbnailService.generate({
        title: script.title,
        keyword: script.keyword,
        style,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Gagal menyalin prompt:", err);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border p-2 hover:bg-gray-100"
          title="Kembali ke Dasbor"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Generator Thumbnail</h1>
          <p className="mt-1 text-gray-500">Hasilkan konsep thumbnail untuk video YouTube kamu.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Pilih Project</label>
            <select className="mt-1 w-full rounded border p-3" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- Pilih Project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Pilih Script</label>
            <select className="mt-1 w-full rounded border p-3" value={selectedScriptId} onChange={(e) => setSelectedScriptId(e.target.value ? Number(e.target.value) : "")} disabled={!selectedProjectId || scripts.length === 0}>
              <option value="">-- Pilih Script --</option>
              {scripts.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Gaya Thumbnail</label>
            <select className="mt-1 w-full rounded border p-3" value={style} onChange={(e) => setStyle(e.target.value)}>
              {STYLE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedScriptId}
            className="flex w-full items-center justify-center gap-2 rounded bg-purple-600 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            <Sparkles size={18} />
            {loading ? "Menghasilkan..." : "Hasilkan Konsep Thumbnail"}
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <Image size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{result.title}</h2>
              <p className="text-sm text-gray-500">
                Gaya:{" "}
                {STYLE_OPTIONS.find((s) => s.value === result.style)?.label ?? result.style}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Konsep Visual */}
            <div className="rounded-lg border bg-gray-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                <Palette size={16} />
                Konsep Visual
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{result.description}</p>
            </div>

            {/* Prompt Gambar AI */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                  <Wand2 size={16} />
                  Prompt Gambar AI
                </h3>
                <button
                  onClick={copyPrompt}
                  className="flex items-center gap-1 rounded border px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                >
                  {copied ? (
                    <><Check size={12} className="text-green-600" /> Tersalin</>
                  ) : (
                    <><Copy size={12} /> Salin</>
                  )}
                </button>
              </div>
              <div className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-900 p-4 text-sm font-mono text-gray-100">
                {result.prompt}
              </div>
            </div>

            {/* Tips Desain */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                <Lightbulb size={16} />
                Tips Desain
              </h3>
              <ul className="mt-2 space-y-2">
                {result.design_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
