import { ApiUsageRepository } from "../repositories/api-usage.repository";

export class ApiUsageService {
    private repository = new ApiUsageRepository();

    async record(data: {
        userId: number;
        endpoint: string;
        feature: string;
        prompt: string;
        responseTime: number;
        tokensUsed: number;
        creditsUsed: number;
        status?: string;
    }) {
        try {
            await this.repository.create(data);
        } catch (error) {
            console.error("Gagal mencatat API usage:", error);
        }
    }

    async listByUser(userId: number, take?: number, skip?: number) {
        return this.repository.listByUser(userId, take, skip);
    }
}

