import { UserRepository } from "../repositories/user.repository";
import { AIClient } from "../ai/AIClient";

export class ApiKeyService {

    private repository = new UserRepository();
    private ai = new AIClient();

    async getStatus(userId: number) {
        const apiKey = await this.repository.getApiKey(userId);

        if (!apiKey) {
            return {
                hasApiKey: false,
                maskedKey: null
            };
        }

        return {
            hasApiKey: true,
            maskedKey: this.maskKey(apiKey)
        };
    }

    async set(userId: number, apiKey: string) {
        const trimmed = (apiKey || "").trim();

        if (!trimmed) {
            throw new Error("API Key wajib diisi");
        }

        await this.repository.setApiKey(userId, trimmed);

        return this.getStatus(userId);
    }

    async clear(userId: number) {
        await this.repository.clearApiKey(userId);

        return {
            hasApiKey: false,
            maskedKey: null
        };
    }

    async test(userId: number) {
        const apiKey = await this.repository.getApiKey(userId);

        if (!apiKey) {
            throw new Error("Anda belum mendaftarkan API Key. Silakan daftarkan API Key Gemini terlebih dahulu.");
        }

        try {
            const result = await this.ai.validateKey(apiKey);

            return {
                valid: true,
                message: result
            };
        } catch (error: any) {
            return {
                valid: false,
                message: error.message || "API Key tidak valid"
            };
        }
    }

    async requireApiKey(userId: number): Promise<string> {
        const apiKey = await this.repository.getApiKey(userId);

        if (!apiKey) {
            throw new Error("API Key belum didaftarkan. Silakan daftarkan API Key Gemini Anda di menu API Key terlebih dahulu.");
        }

        return apiKey;
    }

    private maskKey(key: string): string {
        if (key.length <= 8) {
            return "****";
        }

        return `${key.slice(0, 4)}****${key.slice(-4)}`;
    }
}

