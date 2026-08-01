"use client";

import api from "@/lib/axios";
import { Script, GenerateScriptRequest } from "@/types/script";

class ScriptService {
  async generate(data: GenerateScriptRequest): Promise<Script> {
    const res = await api.post("/script/generate", data);
    return res.data;
  }

  async list(projectId: number): Promise<Script[]> {
    const res = await api.get(`/script/project/${projectId}`);
    return res.data;
  }

  async detail(id: number): Promise<Script> {
    const res = await api.get(`/script/${id}`);
    return res.data;
  }
}

export default new ScriptService();
