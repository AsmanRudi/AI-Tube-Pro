import api from "@/lib/axios";
import { DashboardSummary } from "@/types/dashboard";

export async function getDashboard(): Promise<DashboardSummary> {
  const response = await api.get("/dashboard");

  return response.data;
}
