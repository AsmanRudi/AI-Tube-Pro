"use client";

import api from "@/lib/axios";
import { VoiceoverResult, GenerateVoiceoverRequest } from "@/types/voice";

class VoiceService {
  async generate(data: GenerateVoiceoverRequest): Promise<VoiceoverResult> {
    const res = await api.post("/voice/generate", data);
    return res.data;
  }
}

export default new VoiceService();
