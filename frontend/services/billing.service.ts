import api from "@/lib/axios";
import { BillingSummary, CreditHistory, UserCredits } from "@/types/billing";

class BillingService {
  async getCredits(): Promise<UserCredits> {
    const { data } = await api.get("/user/credits");
    return data.data;
  }

  async getHistory(take = 50, skip = 0): Promise<CreditHistory[]> {
    const { data } = await api.get("/user/history", { params: { take, skip } });
    return data.data;
  }

  async getBilling(): Promise<BillingSummary> {
    const { data } = await api.get("/user/billing");
    return data.data;
  }
}

export default new BillingService();

