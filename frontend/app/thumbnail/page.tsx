"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image, Sparkles } from "lucide-react";
import projectService from "@/services/project.service";
import scriptService from "@/services/script.service";
import thumbnailService from "@/services/thumbnail.service";
import { Script } from "@/types/script";
import { ThumbnailResult } from "@/types/thumbnail";

interface ProjectOption {
  id: number;
  name: string;
}

export default function ThumbnailPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState<number | "">("");
  const [style, setStyle] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThumbnailResult | null>(null);

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
          <h1 className="text-3xl font-bold">Thumbnail Generator</h1>
          <p className="mt-1 text-gray-500">Generate konsep thumbnail untuk video YouTube kamu.</p>
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
            <label className="text-sm font-medium">Thumbnail Style</label>
            <select className="mt-1 w-full rounded border p-3" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="professional">Professional</option>
              <option value="dramatic">Dramatic</option>
              <option value="colorful">Colorful</option>
              <option value="minimalist">Minimalist</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedScriptId}
            className="flex w-full items-center justify-center gap-2 rounded bg-purple-600 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            <Sparkles size={18} />
            {loading ? "Generating..." : "Generate Thumbnail Concept"}
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <Image size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{result.title}</h2>
              <p className="text-sm text-gray-500">Style: {result.style}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Visual Concept</h3>
              <p className="mt-1">{result.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">AI Image Prompt</h3>
              <div className="mt-1 rounded-lg bg-gray-50 p-4 text-sm font-mono">{result.prompt}</div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Design Tips</h3>
              <ul className="mt-2 space-y-2">
                {result.design_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
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
