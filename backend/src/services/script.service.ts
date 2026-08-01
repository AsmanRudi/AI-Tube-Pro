import { AIClient } from "../ai/AIClient";
import { ScriptRepository } from "../repositories/script.repository";
import { ApiKeyService } from "./api-key.service";
import { CreditService, CREDIT_COSTS } from "./credit.service";

export class ScriptService {

    private ai = new AIClient();
    private repository = new ScriptRepository();
    private apiKeyService = new ApiKeyService();
    private creditService = new CreditService();

    async generate(userId: number, body: any) {

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const startTime = Date.now();

        const aiResult = await this.ai.generateScript({
            keyword: body.keyword,
            language: body.language,
            duration: body.duration
        }, apiKey);

        const responseTime = Date.now() - startTime;

        const result = await this.repository.create({
            title: aiResult.title,
            content: aiResult.script,
            description: aiResult.description,
            outline: aiResult.outline,
            tags: aiResult.tags,
            keyword: body.keyword,
            language: body.language,
            duration: body.duration,
            projectId: Number(body.projectId)
        });

        // Kurangi credits + catat ApiUsage
        await this.creditService.consume({
            userId,
            feature: "SCRIPT_GENERATE",
            cost: CREDIT_COSTS.SCRIPT_GENERATE,
            endpoint: "/api/script/generate",
            prompt: body.keyword,
            responseTime,
            tokensUsed: Math.ceil(aiResult.script.length / 4) || 1
        });

        return result;
    }


    async list(projectId: number) {
        return this.repository.list(projectId);
    }


    async detail(id: number) {
        return this.repository.detail(id);
    }
}

