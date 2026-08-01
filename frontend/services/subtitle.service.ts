"use client";

import api from "@/lib/axios";
import { SubtitleResult, GenerateSubtitleRequest } from "@/types/subtitle";

class SubtitleService {
  async generate(data: GenerateSubtitleRequest): Promise<SubtitleResult> {
    const res = await api.post("/subtitle/generate", data);
    return res.data;
  }
}

export default new SubtitleService();
