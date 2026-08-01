import { AIClient } from "../ai/AIClient";
import { ApiKeyService } from "./api-key.service";
import { CreditService, CREDIT_COSTS } from "./credit.service";

export class ThumbnailService {

    private ai = new AIClient();
    private apiKeyService = new ApiKeyService();
    private creditService = new CreditService();

    async generate(userId: number, body: any) {

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const startTime = Date.now();

        const result = await this.ai.generateThumbnail({
            title: body.title,
            keyword: body.keyword,
            style: body.style || "professional"
        }, apiKey);

        const responseTime = Date.now() - startTime;

        await this.creditService.consume({
            userId,
            feature: "THUMBNAIL_GENERATE",
            cost: CREDIT_COSTS.THUMBNAIL_GENERATE,
            endpoint: "/api/thumbnail/generate",
            prompt: body.title,
            responseTime,
            tokensUsed: Math.ceil((result.prompt?.length ?? 100) / 4) || 1
        });

        return result;
    }
}

