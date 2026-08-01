import api from "@/lib/axios";
import { NotificationResponse } from "@/types/notification";

class NotificationService {
  async list(take = 50, skip = 0): Promise<NotificationResponse> {
    const { data } = await api.get("/notifications", { params: { take, skip } });
    return data.data;
  }

  async markRead(id: number) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data.data;
  }

  async markAllRead() {
    const { data } = await api.post("/notifications/read-all");
    return data.data;
  }
}

export default new NotificationService();

