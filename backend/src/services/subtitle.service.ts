import { AIClient } from "../ai/AIClient";
import { ApiKeyService } from "./api-key.service";
import { CreditService, CREDIT_COSTS } from "./credit.service";

export class SubtitleService {

    private ai = new AIClient();
    private apiKeyService = new ApiKeyService();
    private creditService = new CreditService();

    async generate(userId: number, body: any) {

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const startTime = Date.now();

        const result = await this.ai.generateSubtitle({
            script: body.script,
            language: body.language || "id",
            format: body.format || "srt"
        }, apiKey);

        const responseTime = Date.now() - startTime;

        await this.creditService.consume({
            userId,
            feature: "SUBTITLE_GENERATE",
            cost: CREDIT_COSTS.SUBTITLE_GENERATE,
            endpoint: "/api/subtitle/generate",
            prompt: (body.script ?? "").slice(0, 500),
            responseTime,
            tokensUsed: result.total_segments || 1
        });

        return result;
    }
}

