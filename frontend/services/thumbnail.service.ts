"use client";

import api from "@/lib/axios";
import { ThumbnailResult, GenerateThumbnailRequest } from "@/types/thumbnail";

class ThumbnailService {
  async generate(data: GenerateThumbnailRequest): Promise<ThumbnailResult> {
    const res = await api.post("/thumbnail/generate", data);
    return res.data;
  }
}

export default new ThumbnailService();
