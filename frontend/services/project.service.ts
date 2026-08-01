import api from "@/lib/axios";
import { CreateProjectRequest } from "@/types/project";

class ProjectService {
  async getAll() {
    const { data } = await api.get("/projects");
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  }

  async create(payload: CreateProjectRequest) {
    const { data } = await api.post("/projects", payload);
    return data;
  }

  async update(id: number, payload: CreateProjectRequest) {
    const { data } = await api.put(`/projects/${id}`, payload);
    return data;
  }

  async delete(id: number) {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  }
}

export default new ProjectService();