import prisma from "../config/database";

import {
    AIClient
} from "../ai/AIClient";

import {
    SEORepository
} from "../repositories/seo.repository";

import {
    GenerateSeoDto
} from "../dto/GenerateSeoDto";

import {
    ApiKeyService
} from "./api-key.service";

import {
    CreditService,
    CREDIT_COSTS
} from "./credit.service";


export class SEOService {


    private ai =
        new AIClient();


    private repository =
        new SEORepository();

    private apiKeyService =
        new ApiKeyService();

    private creditService =
        new CreditService();


    async generate(
        userId: number,
        body: GenerateSeoDto
    ) {


        if (!body.projectId) {

            throw new Error(
                "projectId wajib diisi"
            );

        }


        if (!body.scriptId) {

            throw new Error(
                "scriptId wajib diisi"
            );

        }


        const script =
            await prisma.script.findFirst({

                where: {

                    id: body.scriptId,

                    projectId:
                        body.projectId,

                    project: {

                        userId

                    }

                }

            });


        if (!script) {

            throw new Error(
                "Script tidak ditemukan"
            );

        }


        const apiKey =
            await this.apiKeyService.requireApiKey(userId);

        const startTime = Date.now();

        const result =
            await this.ai.generateSEO({

                keyword:
                    script.keyword,

                script:
                    script.content,

                language:
                    script.language

            }, apiKey);

        const responseTime = Date.now() - startTime;

        const saved =
            await this.repository.create({

                title:
                    result.title,

                description:
                    result.description,

                tags:
                    result.tags,

                hashtags:
                    result.hashtags,

                keywords:
                    result.keywords,

                score:
                    result.score,

                projectId:
                    body.projectId,

                scriptId:
                    body.scriptId

            });

        await this.creditService.consume({
            userId,
            feature: "SEO_GENERATE",
            cost: CREDIT_COSTS.SEO_GENERATE,
            endpoint: "/api/seo/generate",
            prompt: script.keyword,
            responseTime,
            tokensUsed: Math.ceil(result.description.length / 4) || 1
        });

        return saved;

    }


    async list(
        projectId: number
    ) {

        return this.repository.list(
            projectId
        );

    }


    async detail(
        id: number
    ) {

        return this.repository.detail(
            id
        );

    }

}

