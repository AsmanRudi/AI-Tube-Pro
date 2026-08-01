import api from "@/lib/axios";
import { CreateChannelRequest } from "@/types/channel";

class ChannelService {
  async list(projectId: number) {
    const { data } = await api.get(`/channels/project/${projectId}`);
    return data;
  }

  async create(projectId: number, payload: CreateChannelRequest) {
    const { data } = await api.post("/channels", { ...payload, projectId });
    return data;
  }

  async update(projectId: number, id: number, payload: CreateChannelRequest) {
    const { data } = await api.put(`/channels/${projectId}/${id}`, payload);
    return data;
  }

  async delete(projectId: number, id: number) {
    const { data } = await api.delete(`/channels/${projectId}/${id}`);
    return data;
  }
}

export default new ChannelService();

