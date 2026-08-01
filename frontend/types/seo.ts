export interface SeoResult {
  id: number;
  projectId: number;
  scriptId: number | null;
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
  keywords: string[];
  score: number;
  createdAt: string;
}

export interface GenerateSeoRequest {
  projectId: number;
  scriptId: number;
}
