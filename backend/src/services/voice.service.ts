import { AIClient } from "../ai/AIClient";
import { ApiKeyService } from "./api-key.service";
import { CreditService, CREDIT_COSTS } from "./credit.service";

export class VoiceService {

    private ai = new AIClient();
    private apiKeyService = new ApiKeyService();
    private creditService = new CreditService();

    async generate(userId: number, body: any) {

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const startTime = Date.now();

        const result = await this.ai.generateVoiceover({
            script: body.script,
            language: body.language || "id",
            voice_style: body.voice_style || "natural"
        }, apiKey);

        const responseTime = Date.now() - startTime;

        await this.creditService.consume({
            userId,
            feature: "VOICE_GENERATE",
            cost: CREDIT_COSTS.VOICE_GENERATE,
            endpoint: "/api/voice/generate",
            prompt: (body.script ?? "").slice(0, 500),
            responseTime,
            tokensUsed: result.word_count || 1
        });

        return result;
    }
}

