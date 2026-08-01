export interface Project {
  id: number;
  name: string;
  niche?: string;
  status: "DRAFT" | "GENERATING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  niche?: string;
}