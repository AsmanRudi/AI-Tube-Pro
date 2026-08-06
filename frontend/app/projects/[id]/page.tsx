"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Lightbulb,
  FileText,
  Search,
  Image,
  Mic,
  Subtitles,
  Upload,
  Send,
  Video,
  Settings2,
  Sparkles,
  CheckCircle2,
  Loader2,
ChevronDown,
  ChevronUp,
  ListOrdered,
  ALargeSmall,
  Tag,
  Hash,
  KeyRound,
  Palette,
  Wand2,
  Clock,
  Type,
  Mic2,
  BarChart3,
} from "lucide-react";
import projectService from "@/services/project.service";
import videoService from "@/services/video.service";
import channelService from "@/services/channel.service";
import { ProductionVideo } from "@/types/video";
import { Channel } from "@/types/channel";

interface ProjectDetail {
  id: number;
  name: string;
  niche?: string;
  status: string;
  createdAt: string;
  videos: ProductionVideo[];
  channels: Channel[];
  _count: {
    scripts: number;
    seoResults: number;
    videos: number;
  };
}

// Pipeline steps
const STEPS = [
  { key: "DRAFT", label: "Ide", icon: Lightbulb },
  { key: "SCRIPT_GENERATED", label: "Skrip", icon: FileText },
  { key: "SEO_GENERATED", label: "SEO", icon: Search },
  { key: "THUMBNAIL_READY", label: "Thumbnail", icon: Image },
  { key: "VOICEOVER_READY", label: "Voice", icon: Mic },
  { key: "SUBTITLE_READY", label: "Subtitle", icon: Subtitles },
  { key: "READY_TO_UPLOAD", label: "Siap Upload", icon: Upload },
  { key: "PUBLISHED", label: "Terbit", icon: Send },
];

const STEP_ORDER = [
  "DRAFT",
  "SCRIPT_GENERATED",
  "SEO_GENERATED",
  "THUMBNAIL_READY",
  "VOICEOVER_READY",
  "SUBTITLE_READY",
  "READY_TO_UPLOAD",
  "PUBLISHED",
];

function getStepIndex(status: string) {
  const idx = STEP_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<ProductionVideo | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // New video form
  const [newTitle, setNewTitle] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newLanguage, setNewLanguage] = useState("id");
  const [newDuration, setNewDuration] = useState("5-7 menit");
  const [showNewForm, setShowNewForm] = useState(false);

// Thumbnail style
  const [thumbnailStyle, setThumbnailStyle] = useState("professional");

  // Script accordion toggle
  const [scriptOpen, setScriptOpen] = useState(true);

  // Channel management
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelYtId, setChannelYtId] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const [publishChannelId, setPublishChannelId] = useState("");

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function loadProject() {
    try {
      const data = await projectService.getById(projectId);
      setProject(data);
      if (data.videos && data.videos.length > 0) {
        setSelectedVideo(data.videos[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    await loadProject();
  }

  async function handleCreateVideo(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await videoService.create({
        projectId,
        title: newTitle,
        keyword: newKeyword,
        language: newLanguage,
        durationText: newDuration,
      });
      setNewTitle("");
      setNewKeyword("");
      setShowNewForm(false);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat video");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateScript() {
    if (!selectedVideo) return;
    setBusy(true);
    setError("");
    try {
      await videoService.generateScript(projectId, selectedVideo.id);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal generate script");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateSeo() {
    if (!selectedVideo) return;
    setBusy(true);
    setError("");
    try {
      await videoService.generateSeo(projectId, selectedVideo.id);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal generate SEO");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateThumbnail() {
    if (!selectedVideo) return;
    setBusy(true);
    setError("");
    try {
      await videoService.generateThumbnail(projectId, selectedVideo.id, thumbnailStyle);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal generate thumbnail");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateVoiceover() {
    if (!selectedVideo) return;
    setBusy(true);
    setError("");
    try {
      await videoService.generateVoiceover(projectId, selectedVideo.id);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal generate voiceover");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateSubtitle() {
    if (!selectedVideo) return;
    setBusy(true);
    setError("");
    try {
      await videoService.generateSubtitle(projectId, selectedVideo.id);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal generate subtitle");
    } finally {
      setBusy(false);
    }
  }

  async function handleMarkReady() {
    if (!selectedVideo) return;
    setBusy(true);
    setError("");
    try {
      await videoService.markReady(projectId, selectedVideo.id);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal tandai siap upload");
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    if (!selectedVideo) return;
    if (!publishChannelId) {
      setError("Pilih channel tujuan terlebih dahulu");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await videoService.publish(projectId, selectedVideo.id, Number(publishChannelId));
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal publikasikan video");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteVideo() {
    if (!selectedVideo) return;
    if (!confirm("Yakin ingin menghapus video ini?")) return;
    setBusy(true);
    try {
      await videoService.delete(projectId, selectedVideo.id);
      setSelectedVideo(null);
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteProject() {
    if (!confirm("Yakin ingin menghapus project ini?")) return;
    try {
      await projectService.delete(projectId);
      router.push("/projects");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddChannel(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await channelService.create(projectId, {
        name: channelName,
        youtubeChannelId: channelYtId || undefined,
        description: channelDesc || undefined,
      });
      setChannelName("");
      setChannelYtId("");
      setChannelDesc("");
      setShowChannelForm(false);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menambah channel");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteChannel(id: number) {
    if (!confirm("Yakin ingin menghapus channel ini?")) return;
    try {
      await channelService.delete(projectId, id);
      await refresh();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  if (!project) {
    return <div className="py-20 text-center text-gray-500">Project tidak ditemukan</div>;
  }

  const videos = project.videos || [];
  const channels = project.channels || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/projects")}
            className="rounded-lg border p-2 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-500">
              {project.niche || "No niche"} &middot; {project.status} &middot;{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleDeleteProject}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
          Hapus Project
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button onClick={() => setError("")} className="float-right font-bold">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{videos.length}</p>
          <p className="text-sm text-gray-500">Video Produksi</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{project._count.scripts}</p>
          <p className="text-sm text-gray-500">Skrip</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-purple-600">
            {videos.filter((v) => v.status === "PUBLISHED").length}
          </p>
          <p className="text-sm text-gray-500">Terbit</p>
        </div>
      </div>

      {/* Channel Manager */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Video size={20} className="text-red-600" />
            Channel Tujuan Upload
          </h2>
          <button
            onClick={() => setShowChannelForm(!showChannelForm)}
            className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <Plus size={16} />
            Tambah Channel
          </button>
        </div>

        {showChannelForm && (
          <form onSubmit={handleAddChannel} className="mt-4 grid gap-3 rounded-lg bg-gray-50 p-4 md:grid-cols-4">
            <input
              className="rounded border p-2"
              placeholder="Nama Channel"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
            />
            <input
              className="rounded border p-2"
              placeholder="YouTube Channel ID (opsional)"
              value={channelYtId}
              onChange={(e) => setChannelYtId(e.target.value)}
            />
            <input
              className="rounded border p-2"
              placeholder="Deskripsi (opsional)"
              value={channelDesc}
              onChange={(e) => setChannelDesc(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-red-600 p-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {busy ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {channels.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada channel. Tambahkan channel tujuan untuk publikasi.
            </p>
          ) : (
            channels.map((ch) => (
              <div key={ch.id} className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-2">
                <Video size={16} className="text-red-600" />
                <div>
                  <p className="text-sm font-medium">{ch.name}</p>
                  {ch.youtubeChannelId && (
                    <p className="text-xs text-gray-400">ID: {ch.youtubeChannelId}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteChannel(ch.id)}
                  className="ml-2 text-gray-400 hover:text-red-600"
                  title="Hapus channel"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Workspace: Videos list + detail */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: Videos list */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <Settings2 size={18} className="text-blue-600" />
                Video Produksi
              </h2>
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                <Plus size={14} />
                Baru
              </button>
            </div>

            {showNewForm && (
              <form onSubmit={handleCreateVideo} className="mb-3 space-y-2 rounded-lg bg-blue-50 p-3">
                <input
                  className="w-full rounded border p-2 text-sm"
                  placeholder="Judul video (ide)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <input
                  className="w-full rounded border p-2 text-sm"
                  placeholder="Keyword / topik"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                />
                <select
                  className="w-full rounded border p-2 text-sm"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                >
                  <option value="id">Indonesian</option>
                  <option value="en">English</option>
                </select>
                <select
                  className="w-full rounded border p-2 text-sm"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                >
                  <option>3-5 menit</option>
                  <option>5-7 menit</option>
                  <option>8-10 menit</option>
                  <option>10-15 menit</option>
                </select>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded bg-blue-600 p-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {busy ? "Membuat..." : "Buat Video"}
                </button>
              </form>
            )}

            <div className="max-h-[600px] space-y-2 overflow-y-auto">
              {videos.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  Belum ada video. Buat video produksi pertama!
                </p>
              ) : (
                videos.map((video) => {
                  const stepIdx = getStepIndex(video.status);
                  const active = selectedVideo?.id === video.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`cursor-pointer rounded-lg border p-3 transition hover:shadow-md ${
                        active ? "border-blue-500 bg-blue-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="line-clamp-1 text-sm font-medium">{video.title}</p>
                        {video.status === "PUBLISHED" && (
                          <CheckCircle2 size={16} className="shrink-0 text-green-600" />
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {STEPS.slice(0, stepIdx + 1).map((s, i) => {
                          const Icon = s.icon;
                          const isDone = i < stepIdx || video.status === "PUBLISHED";
                          return (
                            <span
                              key={i}
                              className={`flex items-center gap-1 text-[10px] ${
                                isDone || video.status === s.key
                                  ? "text-blue-600"
                                  : "text-gray-300"
                              }`}
                            >
                              <Icon size={11} />
                              {i < STEPS.length - 1 && <span className="w-1 border-t border-gray-200" />}
                            </span>
                          );
                        })}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-400">
                        {STEPS[stepIdx]?.label} &middot; {video.language || "-"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Selected video detail */}
        <div className="lg:col-span-2">
          {!selectedVideo ? (
            <div className="rounded-xl border border-dashed bg-white p-12 text-center text-gray-400">
              <Lightbulb size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">Pilih atau buat video produksi</p>
              <p className="mt-1 text-sm">
                Alur: Ide → Skrip → SEO → Thumbnail → Voice → Subtitle → Siap Upload → Terbit
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pipeline stepper */}
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
                  <button
                    onClick={handleDeleteVideo}
                    className="text-gray-400 hover:text-red-600"
                    title="Hapus video"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Stepper */}
                <div className="mt-6 flex items-center">
                  {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const currentIdx = getStepIndex(selectedVideo.status);
                    const isCompleted = i < currentIdx || selectedVideo.status === "PUBLISHED";
                    const isCurrent = i === currentIdx;
                    return (
                      <div key={step.key} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                              isCompleted
                                ? "border-green-500 bg-green-500 text-white"
                                : isCurrent
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-200 bg-white text-gray-300"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                          </div>
                          <span
                            className={`mt-1 hidden text-[10px] sm:block ${
                              isCurrent ? "font-medium text-blue-600" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`mx-1 h-0.5 flex-1 ${
                              i < currentIdx ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    Status: <b>{selectedVideo.status.replace(/_/g, " ")}</b>
                  </span>
                  {selectedVideo.keyword && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                      {selectedVideo.keyword}
                    </span>
                  )}
                  {selectedVideo.language && (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-green-600">
                      {selectedVideo.language}
                    </span>
                  )}
                  {selectedVideo.channel && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-red-600">
                      Channel: {selectedVideo.channel.name}
                    </span>
                  )}
                  {selectedVideo.publishedAt && (
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-600">
                      Terbit: {new Date(selectedVideo.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                  {selectedVideo.youtubeId && (
                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-yellow-700">
                      YT ID: {selectedVideo.youtubeId}
                    </span>
                  )}
                </div>
              </div>

              {/* Action: Generate Script */}
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <FileText size={18} className="text-blue-600" />
                  1. Skrip (Script)
                </h3>
{selectedVideo.script ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="font-medium">{selectedVideo.script.title}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {selectedVideo.script.keyword} &middot; {selectedVideo.script.language}
                      </p>
                    </div>

                    {/* Outline */}
                    {Array.isArray(selectedVideo.script.outline) && selectedVideo.script.outline.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                          <ListOrdered size={14} />
                          Garis Besar (Outline)
                        </h4>
                        <ol className="mt-2 space-y-1.5">
                          {selectedVideo.script.outline.map((item, i) => (
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
                    <details open={scriptOpen}>
                      <summary
                        onClick={(e) => {
                          e.preventDefault();
                          setScriptOpen(!scriptOpen);
                        }}
                        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600"
                      >
                        {scriptOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {scriptOpen ? "Sembunyikan script lengkap" : "Lihat script lengkap"}
                      </summary>
                      <div className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
                        {selectedVideo.script.content}
                      </div>
                    </details>

                    {/* Deskripsi */}
                    {selectedVideo.script.description && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                          <ALargeSmall size={14} />
                          Deskripsi
                        </h4>
                        <p className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-3 text-sm text-gray-700">
                          {selectedVideo.script.description}
                        </p>
                      </div>
                    )}

                    {/* Tag */}
                    {Array.isArray(selectedVideo.script.tags) && selectedVideo.script.tags.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                          <Tag size={14} />
                          Tag
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedVideo.script.tags.map((tag, i) => (
                            <span key={i} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateScript}
                    disabled={busy}
                    className="flex items-center gap-2 rounded bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Generate Skrip dengan AI
                  </button>
                )}
              </div>

              {/* Action: Generate SEO */}
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Search size={18} className="text-green-600" />
                  2. SEO
                </h3>
{selectedVideo.seoResult ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-green-50 p-4">
                      <p className="flex-1 font-medium">{selectedVideo.seoResult.title}</p>
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        <BarChart3 size={12} />
                        Skor SEO: {selectedVideo.seoResult.score ?? "N/A"}
                      </span>
                    </div>

                    {/* Score progress bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium text-gray-700">Skor Optimasi SEO</span>
                        <span className="font-semibold text-green-700">
                          {selectedVideo.seoResult.score != null && selectedVideo.seoResult.score >= 80
                            ? "Sangat Baik"
                            : selectedVideo.seoResult.score != null && selectedVideo.seoResult.score >= 60
                            ? "Cukup Baik"
                            : "Perlu Diperbaiki"}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            selectedVideo.seoResult.score != null && selectedVideo.seoResult.score >= 80
                              ? "bg-green-500"
                              : selectedVideo.seoResult.score != null && selectedVideo.seoResult.score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${selectedVideo.seoResult.score ?? 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-600">
                        <ALargeSmall size={14} />
                        Deskripsi
                      </h4>
                      <p className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                        {selectedVideo.seoResult.description}
                      </p>
                    </div>

                    {/* Tag, Tagar, Kata Kunci */}
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-lg border bg-gray-50 p-3">
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase text-blue-600">
                          <Tag size={13} />
                          Tag
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedVideo.seoResult.tags?.map((t, i) => (
                            <span key={i} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border bg-gray-50 p-3">
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase text-green-600">
                          <Hash size={13} />
                          Tagar
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedVideo.seoResult.hashtags?.map((ht, i) => (
                            <span key={i} className="text-xs text-green-700">{ht}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border bg-gray-50 p-3">
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase text-purple-600">
                          <KeyRound size={13} />
                          Kata Kunci
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedVideo.seoResult.keywords?.map((kw, i) => (
                            <span key={i} className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateSeo}
                    disabled={busy || !selectedVideo.script}
                    className="flex items-center gap-2 rounded bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {selectedVideo.script ? "Generate SEO" : "Generate Skrip dulu"}
                  </button>
                )}
              </div>

              {/* Action: Generate Thumbnail */}
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Image size={18} className="text-purple-600" />
                  3. Thumbnail
                </h3>
{selectedVideo.thumbnailConcept ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="font-medium">{selectedVideo.thumbnailConcept.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Gaya: {selectedVideo.thumbnailConcept.style}
                      </p>
                    </div>

                    {/* Konsep Visual */}
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                        <Palette size={14} />
                        Konsep Visual
                      </h4>
                      <p className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                        {selectedVideo.thumbnailConcept.description}
                      </p>
                    </div>

                    {/* Prompt Gambar AI */}
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                        <Wand2 size={14} />
                        Prompt Gambar AI
                      </h4>
                      <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-900 p-3 font-mono text-xs leading-relaxed text-gray-100">
                        {selectedVideo.thumbnailConcept.prompt}
                      </pre>
                    </div>

                    {/* Tips Desain */}
                    {Array.isArray(selectedVideo.thumbnailConcept.design_tips) &&
                      selectedVideo.thumbnailConcept.design_tips.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                            <Lightbulb size={14} />
                            Tips Desain
                          </h4>
                          <ul className="mt-2 space-y-2">
                            {selectedVideo.thumbnailConcept.design_tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      className="rounded border p-2 text-sm"
                      value={thumbnailStyle}
                      onChange={(e) => setThumbnailStyle(e.target.value)}
                    >
                      <option value="professional">Professional</option>
                      <option value="dramatic">Dramatic</option>
                      <option value="colorful">Colorful</option>
                      <option value="minimalist">Minimalist</option>
                    </select>
                    <button
                      onClick={handleGenerateThumbnail}
                      disabled={busy}
                      className="flex items-center gap-2 rounded bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                    >
                      {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      Generate Thumbnail
                    </button>
                  </div>
                )}
              </div>

              {/* Action: Generate Voiceover */}
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Mic size={18} className="text-orange-600" />
                  4. Sulih Suara (Voiceover)
                </h3>
{selectedVideo.voiceover ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-orange-50 p-3 text-center">
                        <p className="flex items-center justify-center gap-1 text-xl font-bold text-orange-600">
                          <Clock size={16} />
                          {Math.floor(selectedVideo.voiceover.estimated_duration_seconds / 60)}:
                          {(selectedVideo.voiceover.estimated_duration_seconds % 60)
                            .toString()
                            .padStart(2, "0")}
                        </p>
                        <p className="text-xs text-gray-500">Durasi</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-3 text-center">
                        <p className="flex items-center justify-center gap-1 text-xl font-bold text-blue-600">
                          <Type size={16} />
                          {selectedVideo.voiceover.word_count}
                        </p>
                        <p className="text-xs text-gray-500">Kata</p>
                      </div>
                    </div>

                    {/* Gaya Suara */}
                    {selectedVideo.voiceover.voice_style && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                          <Mic2 size={14} />
                          Gaya Suara
                        </h4>
                        <p className="mt-1 rounded bg-gray-50 p-3 text-sm text-gray-700">
                          {selectedVideo.voiceover.voice_style}
                        </p>
                      </div>
                    )}

                    {/* Segmen Script */}
                    {Array.isArray(selectedVideo.voiceover.script_segments) &&
                      selectedVideo.voiceover.script_segments.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                            <ListOrdered size={14} />
                            Segmen Naskah ({selectedVideo.voiceover.script_segments.length})
                          </h4>
                          <div className="mt-2 max-h-64 space-y-2 overflow-y-auto rounded-lg border bg-gray-50 p-3">
                            {selectedVideo.voiceover.script_segments.map((seg, i) => (
                              <div key={i} className="rounded-md bg-white p-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-semibold text-gray-400">#{i + 1}</span>
                                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                                    {seg.tone}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">{seg.text}</p>
                                <p className="mt-1 text-[10px] text-gray-400">
                                  Durasi: {seg.duration_seconds} detik
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Tips Berbicara */}
                    {Array.isArray(selectedVideo.voiceover.speaking_tips) &&
                      selectedVideo.voiceover.speaking_tips.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                            <Lightbulb size={14} />
                            Tips Berbicara
                          </h4>
                          <ul className="mt-2 space-y-2">
                            {selectedVideo.voiceover.speaking_tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateVoiceover}
                    disabled={busy || !selectedVideo.script}
                    className="flex items-center gap-2 rounded bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {selectedVideo.script ? "Generate Voiceover" : "Generate Skrip dulu"}
                  </button>
                )}
              </div>

              {/* Action: Generate Subtitle */}
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Subtitles size={18} className="text-teal-600" />
                  5. Subtitle
                </h3>
{selectedVideo.subtitle ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
                        {selectedVideo.subtitle.total_segments} segmen
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        Format: {selectedVideo.subtitle.format}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        Bahasa: {selectedVideo.subtitle.language}
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-teal-50 text-xs uppercase tracking-wide text-teal-700">
                          <tr>
                            <th className="px-3 py-2 font-semibold">No</th>
                            <th className="px-3 py-2 font-semibold">Waktu</th>
                            <th className="px-3 py-2 font-semibold">Teks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedVideo.subtitle.segments.slice(0, 20).map((seg) => (
                            <tr key={seg.index} className="bg-white">
                              <td className="px-3 py-2 text-xs font-medium text-gray-400">{seg.index}</td>
                              <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-teal-600">
                                {seg.start_time} → {seg.end_time}
                              </td>
                              <td className="px-3 py-2 text-gray-700">{seg.text}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedVideo.subtitle.segments.length > 20 && (
                      <p className="text-xs text-gray-400">
                        ... dan {selectedVideo.subtitle.segments.length - 20} segmen lainnya
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateSubtitle}
                    disabled={busy || !selectedVideo.script}
                    className="flex items-center gap-2 rounded bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {selectedVideo.script ? "Generate Subtitle" : "Generate Skrip dulu"}
                  </button>
                )}
              </div>

              {/* Final: Ready & Publish */}
              <div className="rounded-xl border-2 border-blue-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Send size={20} className="text-blue-600" />
                  Tahap Akhir: Upload & Publikasi
                </h3>

                {selectedVideo.status === "PUBLISHED" ? (
                  <div className="rounded-lg bg-green-50 p-4 text-green-700">
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 size={20} />
                      Video telah dipublikasikan (simulasi)
                    </div>
                    <p className="mt-1 text-sm">
                      Channel: {selectedVideo.channel?.name ?? "-"} &middot; YouTube ID:{" "}
                      {selectedVideo.youtubeId ?? "-"} &middot; Tanggal:{" "}
                      {selectedVideo.publishedAt
                        ? new Date(selectedVideo.publishedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleMarkReady}
                      disabled={busy}
                      className="flex items-center gap-2 rounded bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {selectedVideo.status === "READY_TO_UPLOAD"
                        ? "✓ Sudah Siap Upload"
                        : "Tandai Siap Upload"}
                    </button>

                    {selectedVideo.publishStatus === "READY" && (
                      <div className="rounded-lg bg-gray-50 p-4">
                        <label className="block text-sm font-medium">
                          Pilih Channel Tujuan
                        </label>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <select
                            className="rounded border p-2 text-sm"
                            value={publishChannelId}
                            onChange={(e) => setPublishChannelId(e.target.value)}
                          >
                            <option value="">-- Pilih channel --</option>
                            {channels.map((ch) => (
                              <option key={ch.id} value={ch.id}>
                                {ch.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handlePublish}
                            disabled={busy}
                            className="flex items-center gap-2 rounded bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            Publikasikan (Simulasi)
                          </button>
                        </div>
                        {channels.length === 0 && (
                          <p className="mt-2 text-xs text-amber-600">
                            Tambahkan channel tujuan di bagian atas halaman terlebih dahulu.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

