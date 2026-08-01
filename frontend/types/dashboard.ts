export interface DashboardSummary {
  totalProjects: number;
  totalScripts: number;
  totalSeo: number;
  videos: number;
  published: number;
  draft: number;
  credits: number;
  plan: string;

  recentProjects: {
    id: number;
    name: string;
    createdAt: string;
  }[];

  recentScripts: {
    id: number;
    title: string;
    createdAt: string;
  }[];
}
