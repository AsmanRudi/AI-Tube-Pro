"use client";

import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { Project } from "@/types/project";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <FolderKanban className="text-blue-600" />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
            {project.status}
          </span>
        </div>

        <h3 className="text-lg font-semibold">
          {project.name}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {project.niche || "Tidak ada niche dipilih"}
        </p>

        <div className="mt-5 text-xs text-gray-400">
          {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}