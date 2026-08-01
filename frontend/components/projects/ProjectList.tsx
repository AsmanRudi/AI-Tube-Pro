"use client";

import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
}

export default function ProjectList({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-white p-12 text-center">
        <h3 className="text-xl font-semibold">
          Belum ada project
        </h3>

        <p className="mt-2 text-gray-500">
          Buat project pertama untuk mulai menghasilkan AI Script.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}