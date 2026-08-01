import api from "@/lib/axios";
import { CreateVideoRequest } from "@/types/video";

class VideoService {
  async list(projectId: number) {
    const { data } = await api.get(`/videos/project/${projectId}`);
    return data;
  }

  async create(payload: CreateVideoRequest) {
    const { data } = await api.post("/videos", payload);
    return data;
  }

  async detail(projectId: number, id: number) {
    const { data } = await api.get(`/videos/${projectId}/${id}`);
    return data;
  }

  async update(projectId: number, id: number, payload: any) {
    const { data } = await api.put(`/videos/${projectId}/${id}`, payload);
    return data;
  }

  async delete(projectId: number, id: number) {
    const { data } = await api.delete(`/videos/${projectId}/${id}`);
    return data;
  }

  async generateScript(projectId: number, id: number) {
    const { data } = await api.post(`/videos/${projectId}/${id}/generate-script`);
    return data;
  }

  async generateSeo(projectId: number, id: number) {
    const { data } = await api.post(`/videos/${projectId}/${id}/generate-seo`);
    return data;
  }

  async generateThumbnail(projectId: number, id: number, style: string) {
    const { data } = await api.post(`/videos/${projectId}/${id}/generate-thumbnail`, { style });
    return data;
  }

  async generateVoiceover(projectId: number, id: number) {
    const { data } = await api.post(`/videos/${projectId}/${id}/generate-voiceover`);
    return data;
  }

  async generateSubtitle(projectId: number, id: number) {
    const { data } = await api.post(`/videos/${projectId}/${id}/generate-subtitle`);
    return data;
  }

  async markReady(projectId: number, id: number) {
    const { data } = await api.post(`/videos/${projectId}/${id}/ready`);
    return data;
  }

  async publish(projectId: number, id: number, channelId: number) {
    const { data } = await api.post(`/videos/${projectId}/${id}/publish`, { channelId });
    return data;
  }
}

export default new VideoService();

