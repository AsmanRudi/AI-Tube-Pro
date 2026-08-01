import prisma from "../config/database";
import { CreditRepository } from "../repositories/credit.repository";
import { ApiUsageRepository } from "../repositories/api-usage.repository";
import { NotificationService } from "./notification.service";

export const CREDIT_COSTS = {
    SCRIPT_GENERATE: 5,
    SEO_GENERATE: 3,
    THUMBNAIL_GENERATE: 8,
    VOICE_GENERATE: 15,
    SUBTITLE_GENERATE: 5,
} as const;

export const DEFAULT_CREDITS = 50;

export class CreditService {
    private creditRepository = new CreditRepository();
    private apiUsageRepository = new ApiUsageRepository();
    private notificationService = new NotificationService();

    /**
     * Periksa saldo credits user mencukupi untuk biaya tertentu.
     */
    async hasEnoughCredits(userId: number, required: number): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });

        return (user?.credits ?? 0) >= required;
    }

    /**
     * Kurangi credits setelah AI berhasil di-generate,
     * simpan CreditHistory + ApiUsage, lalu kirim notifikasi jika diperlukan.
     */
    async consume(params: {
        userId: number;
        feature: string;
        cost: number;
        endpoint: string;
        prompt: string;
        responseTime: number;
        tokensUsed: number;
    }) {
        const { userId, feature, cost, endpoint, prompt, responseTime, tokensUsed } = params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });

        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        if (user.credits < cost) {
            throw new Error("Credits tidak mencukupi.");
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { decrement: cost }
            },
            select: { credits: true }
        });

        await this.creditRepository.create({
            userId,
            feature,
            amount: -cost,
            type: "USAGE"
        });

        await this.apiUsageRepository.create({
            userId,
            endpoint,
            feature,
            prompt: prompt.slice(0, 2000),
            responseTime,
            tokensUsed,
            creditsUsed: cost,
            status: "SUCCESS"
        });

        // Notifikasi: credits hampir habis / habis
        if (updated.credits <= 0) {
            await this.notificationService.createNotification(
                userId,
                "CREDITS_EMPTY",
                "Credits Habis",
                "Kredit Anda telah habis. Silakan top up untuk melanjutkan."
            );
        } else if (updated.credits <= 10) {
            await this.notificationService.createNotification(
                userId,
                "CREDITS_LOW",
                "Credits Hampir Habis",
                `Kredit Anda tersisa ${updated.credits}. Segera lakukan top up.`
            );
        }

        return {
            success: true,
            creditsUsed: cost,
            creditsRemaining: updated.credits
        };
    }

    /**
     * Tambahkan credits (Top Up, Admin Bonus, dll).
     */
    async addCredits(userId: number, amount: number, feature: string, type = "TOP_UP") {
        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { increment: amount }
            },
            select: { credits: true }
        });

        await this.creditRepository.create({
            userId,
            feature,
            amount,
            type
        });

        return {
            success: true,
            creditsAdded: amount,
            creditsRemaining: updated.credits
        };
    }

    /**
     * Kurangi credits (penalti, admin correction).
     */
    async removeCredits(userId: number, amount: number, feature: string, type = "ADMIN") {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });

        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        const newCredits = Math.max(0, user.credits - amount);

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { credits: newCredits }
        });

        await this.creditRepository.create({
            userId,
            feature,
            amount: -amount,
            type
        });

        return {
            success: true,
            creditsRemoved: amount,
            creditsRemaining: updated.credits
        };
    }

    /**
     * Reset credits ke nilai default.
     */
    async resetCredits(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });

        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        const diff = DEFAULT_CREDITS - user.credits;

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { credits: DEFAULT_CREDITS }
        });

        if (diff !== 0) {
            await this.creditRepository.create({
                userId,
                feature: "Reset Credits",
                amount: diff,
                type: "ADMIN_RESET"
            });
        }

        return {
            success: true,
            creditsRemaining: updated.credits
        };
    }
}

