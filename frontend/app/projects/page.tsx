"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";

import projectService from "@/services/project.service";
import { Project } from "@/types/project";
import ProjectList from "@/components/projects/ProjectList";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
        "Gagal memuat proyek. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Memuat...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        <p className="font-medium">Terjadi kesalahan</p>
        <p className="mt-1 text-sm">{error}</p>
        <button
          onClick={() => {
            setError("");
            setLoading(true);
            loadProjects();
          }}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border p-2 hover:bg-gray-100"
            title="Kembali ke Dasbor"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">
              Proyek
            </h1>

            <p className="text-gray-500">
              Kelola semua project AI kamu.
            </p>
          </div>
        </div>

        <Link
          href="/projects/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Proyek Baru
        </Link>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}