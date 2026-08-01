import api from "@/lib/axios";
import { AdminAnalytics, AdminUser, ListUsersResponse, Payment, ApiLog } from "@/types/admin";

export interface ListUsersParams {
  search?: string;
  plan?: string;
  status?: string;
  page?: number;
  limit?: number;
}

class AdminService {
  async listUsers(params: ListUsersParams = {}): Promise<ListUsersResponse> {
    const { data } = await api.get("/admin/users", { params });
    return data.data;
  }

  async getUserDetail(id: number): Promise<AdminUser & { totalScripts: number }> {
    const { data } = await api.get(`/admin/users/${id}`);
    return data.data;
  }

  async updateUser(id: number, payload: Record<string, unknown>): Promise<AdminUser> {
    const { data } = await api.patch(`/admin/users/${id}`, payload);
    return data.data;
  }

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  }

  async addCredit(id: number, amount: number, feature?: string) {
    const { data } = await api.post(`/admin/users/${id}/add-credit`, { amount, feature });
    return data.data;
  }

  async removeCredit(id: number, amount: number, feature?: string) {
    const { data } = await api.post(`/admin/users/${id}/remove-credit`, { amount, feature });
    return data.data;
  }

  async resetCredits(id: number) {
    const { data } = await api.post(`/admin/users/${id}/reset-credits`);
    return data.data;
  }

  async changePlan(id: number, plan: string, expireAt?: string | null) {
    const { data } = await api.post(`/admin/users/${id}/change-plan`, { plan, expireAt });
    return data.data;
  }

  async suspendUser(id: number) {
    const { data } = await api.post(`/admin/users/${id}/suspend`);
    return data.data;
  }

  async activateUser(id: number) {
    const { data } = await api.post(`/admin/users/${id}/activate`);
    return data.data;
  }

  async getAnalytics(): Promise<AdminAnalytics> {
    const { data } = await api.get("/admin/analytics");
    return data.data;
  }

  async getPayments(): Promise<Payment[]> {
    const { data } = await api.get("/admin/payments");
    return data.data;
  }

  async getLogs(limit = 50): Promise<ApiLog[]> {
    const { data } = await api.get("/admin/logs", { params: { limit } });
    return data.data;
  }
}

export default new AdminService();

