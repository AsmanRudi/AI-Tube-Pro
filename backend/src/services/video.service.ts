import { AIClient } from "../ai/AIClient";
import { VideoRepository } from "../repositories/video.repository";
import { ApiKeyService } from "./api-key.service";
import prisma from "../config/database";

export class VideoService {

    private ai = new AIClient();
    private repository = new VideoRepository();
    private apiKeyService = new ApiKeyService();

    async create(userId: number, body: any) {
        const projectId = Number(body.projectId);

        if (!projectId || isNaN(projectId)) {
            throw new Error("projectId wajib diisi");
        }

        if (!body.title) {
            throw new Error("Judul video wajib diisi");
        }

        return this.repository.create(projectId, userId, {
            title: body.title,
            keyword: body.keyword,
            language: body.language || "id",
            durationText: body.durationText || "5-7 menit"
        });
    }

    async list(projectId: number, userId: number) {
        return this.repository.list(projectId, userId);
    }

    async detail(id: number, projectId: number, userId: number) {
        return this.repository.findOne(id, projectId, userId);
    }

    async update(id: number, projectId: number, userId: number, body: any) {
        const video = await this.repository.findOne(id, projectId, userId);
        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        return this.repository.update(id, {
            title: body.title,
            keyword: body.keyword,
            language: body.language,
            durationText: body.durationText,
            thumbnail: body.thumbnail
        });
    }

    async delete(id: number, projectId: number, userId: number) {
        return this.repository.delete(id, projectId, userId);
    }

    async generateScript(id: number, projectId: number, userId: number) {
        const video = await this.repository.findOne(id, projectId, userId);
        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const keyword = video.keyword || "topik video";
        const language = video.language || "id";
        const durationText = video.durationText || "5-7 menit";

        const aiResult = await this.ai.generateScript({
            keyword,
            language,
            duration: durationText
        }, apiKey);

        // Simpan script
        const script = await prisma.script.create({
            data: {
                title: aiResult.title,
                content: aiResult.script,
                description: aiResult.description,
                outline: aiResult.outline,
                tags: aiResult.tags,
                keyword,
                language,
                duration: durationText,
                projectId
            }
        });

        // Update video
        return this.repository.update(id, {
            scriptId: script.id,
            status: "SCRIPT_GENERATED",
            title: aiResult.title
        });
    }

    async generateSeo(id: number, projectId: number, userId: number) {
        const video = await this.repository.findOne(id, projectId, userId);
        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        if (!video.scriptId || !video.script) {
            throw new Error("Generate script terlebih dahulu");
        }

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const aiResult = await this.ai.generateSEO({
            keyword: video.script.keyword,
            script: video.script.content,
            language: video.script.language
        }, apiKey);

        const seoResult = await prisma.seoResult.create({
            data: {
                projectId,
                scriptId: video.scriptId,
                title: aiResult.title,
                description: aiResult.description,
                tags: aiResult.tags,
                hashtags: aiResult.hashtags,
                keywords: aiResult.keywords,
                score: aiResult.score
            }
        });

        return this.repository.update(id, {
            seoResultId: seoResult.id,
            status: "SEO_GENERATED"
        });
    }

    async generateThumbnail(id: number, projectId: number, userId: number, body: any) {
        const video = await this.repository.findOne(id, projectId, userId);
        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const style = body.style || "professional";
        const keyword = video.keyword || video.script?.keyword || "youtube";

        const result = await this.ai.generateThumbnail({
            title: video.script?.title || video.title,
            keyword,
            style
        }, apiKey);

        return this.repository.update(id, {
            thumbnailConcept: result as any,
            status: "THUMBNAIL_READY"
        });
    }

    async generateVoiceover(id: number, projectId: number, userId: number) {
        const video = await this.repository.findOne(id, projectId, userId);
        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        if (!video.script) {
            throw new Error("Generate script terlebih dahulu");
        }

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const result = await this.ai.generateVoiceover({
            script: video.script.content,
            language: video.script.language,
            voice_style: "natural"
        }, apiKey);

        return this.repository.update(id, {
            voiceover: result as any,
            status: "VOICEOVER_READY"
        });
    }

    async generateSubtitle(id: number, projectId: number, userId: number) {
        const video = await this.repository.findOne(id, projectId, userId);
        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        if (!video.script) {
            throw new Error("Generate script terlebih dahulu");
        }

        const apiKey = await this.apiKeyService.requireApiKey(userId);

        const result = await this.ai.generateSubtitle({
            script: video.script.content,
            language: video.script.language,
            format: "srt"
        }, apiKey);

        return this.repository.update(id, {
            subtitle: result as any,
            status: "SUBTITLE_READY"
        });
    }

    async markReady(id: number, projectId: number, userId: number) {
        const video = await this.repository.findOne(id, projectId, userId);
        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        return this.repository.update(id, {
            status: "READY_TO_UPLOAD",
            publishStatus: "READY",
            readyAt: new Date()
        });
    }

    async publish(id: number, projectId: number, userId: number, body: any) {
        const video = await this.repository.findOne(id, projectId, userId);
        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        const channelId = Number(body.channelId);
        if (!channelId || isNaN(channelId)) {
            throw new Error("Pilih channel tujuan terlebih dahulu");
        }

        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                projectId,
                userId
            }
        });

        if (!channel) {
            throw new Error("Channel tidak ditemukan");
        }

        // Simulated publish
        return this.repository.update(id, {
            status: "PUBLISHED",
            publishStatus: "PUBLISHED",
            publishedAt: new Date(),
            channelId: channel.id,
            youtubeId: `SIM-${Date.now().toString(36).toUpperCase()}`
        });
    }
}

