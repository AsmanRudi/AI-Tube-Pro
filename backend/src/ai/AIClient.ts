import axios from "axios";

import { AI_CONFIG } from "../config/ai";

export interface GenerateScriptRequest {

    keyword: string;

    language: string;

    duration: string;

}

export interface GenerateScriptResponse {

    title: string;

    outline: string[];

    script: string;

    description: string;

    tags: string[];

}

export interface GenerateSEORequest {

    keyword: string;

    script: string;

    language: string;

}

export interface GenerateSEOResponse {

    title: string;

    description: string;

    tags: string[];

    hashtags: string[];

    keywords: string[];

    score: number;

}

export interface GenerateThumbnailRequest {

    title: string;

    keyword: string;

    style: string;

}

export interface GenerateThumbnailResponse {

    title: string;

    description: string;

    style: string;

    prompt: string;

    design_tips: string[];

}

export interface GenerateVoiceoverRequest {

    script: string;

    language: string;

    voice_style: string;

}

export interface GenerateVoiceoverResponse {

    estimated_duration_seconds: number;

    word_count: number;

    voice_style: string;

    speaking_tips: string[];

    script_segments: any[];

}

export interface GenerateSubtitleRequest {

    script: string;

    language: string;

    format: string;

}

export interface GenerateSubtitleResponse {

    segments: any[];

    total_segments: number;

    format: string;

    language: string;

}


export class AIClient {

    private getHeaders(apiKey?: string) {
        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        };

        if (apiKey) {
            headers["X-API-Key"] = apiKey;
        }

        return headers;
    }

    async generateScript(
        data: GenerateScriptRequest,
        apiKey?: string
    ): Promise<GenerateScriptResponse> {

        try {

            const response =
                await axios.post<GenerateScriptResponse>(

                    `${AI_CONFIG.BASE_URL}/script/generate`,

                    data,
                    {
                        headers: this.getHeaders(apiKey),
                        timeout: 30000
                    }

                );

            return response.data;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                console.error(
                    "AI Service Error:",
                    error.response?.data ||
                    error.message
                );

                throw new Error(
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Gagal menghubungi AI Service"
                );

            }

            throw error;

        }

    }

    async generateSEO(
        data: GenerateSEORequest,
        apiKey?: string
    ): Promise<GenerateSEOResponse> {

        try {

            const response =
                await axios.post<GenerateSEOResponse>(

                    `${AI_CONFIG.BASE_URL}/seo/generate`,

                    data,
                    {
                        headers: this.getHeaders(apiKey),
                        timeout: 30000
                    }

                );

            return response.data;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                console.error(
                    "SEO AI Service Error:",
                    error.response?.data ||
                    error.message
                );

                throw new Error(
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Gagal generate SEO"
                );

            }

            throw error;

        }

    }

    async generateThumbnail(
        data: GenerateThumbnailRequest,
        apiKey?: string
    ): Promise<GenerateThumbnailResponse> {

        try {

            const response =
                await axios.post<GenerateThumbnailResponse>(

                    `${AI_CONFIG.BASE_URL}/thumbnail/generate`,

                    data,
                    {
                        headers: this.getHeaders(apiKey),
                        timeout: 30000
                    }

                );

            return response.data;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                console.error(
                    "Thumbnail AI Service Error:",
                    error.response?.data ||
                    error.message
                );

                throw new Error(
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Gagal generate Thumbnail"
                );

            }

            throw error;

        }

    }

    async generateVoiceover(
        data: GenerateVoiceoverRequest,
        apiKey?: string
    ): Promise<GenerateVoiceoverResponse> {

        try {

            const response =
                await axios.post<GenerateVoiceoverResponse>(

                    `${AI_CONFIG.BASE_URL}/voice/generate`,

                    data,
                    {
                        headers: this.getHeaders(apiKey),
                        timeout: 30000
                    }

                );

            return response.data;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                console.error(
                    "Voiceover AI Service Error:",
                    error.response?.data ||
                    error.message
                );

                throw new Error(
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Gagal generate Voiceover"
                );

            }

            throw error;

        }

    }

    async generateSubtitle(
        data: GenerateSubtitleRequest,
        apiKey?: string
    ): Promise<GenerateSubtitleResponse> {

        try {

            const response =
                await axios.post<GenerateSubtitleResponse>(

                    `${AI_CONFIG.BASE_URL}/subtitle/generate`,

                    data,
                    {
                        headers: this.getHeaders(apiKey),
                        timeout: 30000
                    }

                );

            return response.data;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                console.error(
                    "Subtitle AI Service Error:",
                    error.response?.data ||
                    error.message
                );

                throw new Error(
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Gagal generate Subtitle"
                );

            }

            throw error;

        }

    }

    async validateKey(apiKey: string): Promise<string> {
        try {
            const response = await axios.post(
                `${AI_CONFIG.BASE_URL}/validate`,
                null,
                {
                    headers: this.getHeaders(apiKey),
                    timeout: 15000
                }
            );

            return response.data.message || "API Key valid";
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const detail = error.response?.data?.detail;
                const message = error.response?.data?.message;

                // Jika AI Service mengembalikan detail error (misal model not found),
                // tampilkan pesan yang lebih informatif
                if (detail && detail.includes("API key tidak valid:")) {
                    throw new Error(detail);
                }

                throw new Error(
                    detail ||
                    message ||
                    "API Key tidak valid"
                );
            }

            throw error;
        }
    }
}
