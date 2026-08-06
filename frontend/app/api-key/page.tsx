"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Key, Loader2, Trash2, CheckCircle2, XCircle, ExternalLink, ShieldCheck } from "lucide-react";
import apiKeyService from "@/services/api-key.service";

export default function ApiKeyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<{ hasApiKey: boolean; maskedKey: string | null } | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const data = await apiKeyService.getStatus();
      setStatus(data);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal memuat status API Key",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setValidating(true);
    setMessage(null);
    try {
      const data = await apiKeyService.save(apiKey);
      setStatus(data);
      setApiKey("");
      setMessage({ type: "success", text: "API Key berhasil disimpan dan divalidasi." });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "API Key tidak valid. Periksa kembali API Key Anda di Google AI Studio.",
      });
    } finally {
      setBusy(false);
      setValidating(false);
    }
  }

  async function handleTest() {
    setBusy(true);
    setMessage(null);
    try {
      const result = await apiKeyService.test();
      setMessage({
        type: result.valid ? "success" : "error",
        text: result.message,
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal menguji API Key",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus API Key ini?")) return;
    setBusy(true);
    setMessage(null);
    try {
      const data = await apiKeyService.remove();
      setStatus(data);
      setMessage({ type: "success", text: "API Key telah dihapus." });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal menghapus API Key",
      });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border p-2 hover:bg-gray-100"
          title="Kembali ke Dasbor"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">API Key</h1>
          <p className="mt-1 text-gray-500">
            Daftarkan API Key Gemini pribadi Anda agar fitur AI dapat digunakan.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <Key size={24} />
          </div>
          <h2 className="text-lg font-semibold">Status API Key</h2>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          {status?.hasApiKey ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600" />
                <span className="font-medium text-green-700">API Key terdaftar</span>
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-sm">
                  {status.maskedKey}
                </span>
              </div>
              <button
                onClick={handleTest}
                disabled={busy}
                className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                Uji Key
              </button>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-gray-500">
              <XCircle size={18} className="text-red-500" />
              Belum ada API Key. Daftarkan di bawah ini agar fitur AI berfungsi.
            </p>
          )}
        </div>

        {status?.hasApiKey && (
          <div className="mt-4">
            <button
              onClick={handleDelete}
              disabled={busy}
              className="flex items-center gap-2 rounded border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Hapus API Key
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          {status?.hasApiKey ? "Perbarui API Key" : "Daftarkan API Key"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Dapatkan API Key gratis di Google AI Studio:
        </p>
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          aistudio.google.com/apikey <ExternalLink size={14} />
        </a>

        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <input
            type="password"
            className="w-full rounded border p-3 font-mono"
            placeholder="Paste API Key Gemini Anda di sini"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required={!status?.hasApiKey}
          />
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 rounded bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : <Key size={18} />}
            {validating ? "Memvalidasi API Key..." : "Simpan API Key"}
          </button>
        </form>
      </div>

      {/* Pesan */}
      {message && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Info */}
      <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
        <p className="font-medium">💡 Cara kerja:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>API Key disimpan khusus untuk akun Anda dan dienkripsi di database.</li>
          <li>Key tidak pernah ditampilkan utuh — hanya bagian awal dan akhir.</li>
          <li>Semua fitur AI (Skrip, SEO, Thumbnail, Voiceover, Subtitle) akan menggunakan API Key Anda.</li>
          <li>Tanpa API Key, fitur AI tidak dapat digunakan.</li>
        </ul>
      </div>
    </div>
  );
}

