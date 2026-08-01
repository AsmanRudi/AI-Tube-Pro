"use client";

import api from "@/lib/axios";
import { ApiKeyStatus, ApiKeyTestResult } from "@/types/apiKey";

class ApiKeyService {
  async getStatus(): Promise<ApiKeyStatus> {
    const res = await api.get("/user/api-key");
    return res.data;
  }

  async save(apiKey: string): Promise<ApiKeyStatus> {
    const res = await api.put("/user/api-key", { apiKey });
    return res.data;
  }

  async remove(): Promise<ApiKeyStatus> {
    const res = await api.delete("/user/api-key");
    return res.data;
  }

  async test(): Promise<ApiKeyTestResult> {
    const res = await api.post("/user/api-key/test");
    return res.data;
  }
}

export default new ApiKeyService();

