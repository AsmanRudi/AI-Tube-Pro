"use client";

import api from "@/lib/axios";
import { SeoResult, GenerateSeoRequest } from "@/types/seo";

class SeoService {
  async generate(data: GenerateSeoRequest): Promise<SeoResult> {
    const res = await api.post("/seo/generate", data);
    return res.data.data;
  }

  async list(projectId: number): Promise<SeoResult[]> {
    const res = await api.get(`/seo/project/${projectId}`);
    return res.data.data;
  }

  async detail(id: number): Promise<SeoResult> {
    const res = await api.get(`/seo/${id}`);
    return res.data.data;
  }
}

export default new SeoService();
