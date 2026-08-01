export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  plan: "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
  credits: number;
  status: "ACTIVE" | "SUSPENDED";
  expireAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    projects: number;
    channels: number;
    apiUsages: number;
    payments: number;
    subscriptions: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListUsersResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export interface AdminAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    premiumUsers: number;
    totalCreditsUsed: number;
    scriptGenerated: number;
    revenue: number;
    totalProjects: number;
  };
  topUser: {
    user: { id: number; name: string; email: string };
    creditsUsed: number;
  } | null;
  mostUsedFeature: {
    feature: string;
    count: number;
  } | null;
  dailyAiUsage: { date: string; count: number }[];
  monthlyAiUsage: { month: string; count: number }[];
  planDistribution: { plan: string; count: number }[];
}

export interface Payment {
  id: number;
  userId: number;
  externalId: string | null;
  gateway: string | null;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";
  plan: string | null;
  credits: number;
  paymentUrl: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: number; name: string; email: string };
}

export interface ApiLog {
  id: number;
  userId: number;
  endpoint: string;
  feature: string;
  prompt: string;
  responseTime: number;
  tokensUsed: number;
  creditsUsed: number;
  status: string;
  createdAt: string;
  user?: { id: number; name: string; email: string };
}

