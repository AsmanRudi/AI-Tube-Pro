import { CreditRepository } from "../repositories/credit.repository";
import { ApiUsageRepository } from "../repositories/api-usage.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import prisma from "../config/database";

export class BillingService {
    private creditRepository = new CreditRepository();
    private apiUsageRepository = new ApiUsageRepository();
    private paymentRepository = new PaymentRepository();

    async getCredits(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                credits: true,
                plan: true,
                expireAt: true
            }
        });

        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        return {
            credits: user.credits,
            plan: user.plan,
            expireAt: user.expireAt
        };
    }

    async getHistory(userId: number, take?: number, skip?: number) {
        const history = await this.creditRepository.listByUser(userId, take, skip);
        return history;
    }

    async getBilling(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                plan: true,
                credits: true,
                expireAt: true
            }
        });

        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        const [creditHistory, payments, apiUsages, subscriptions] = await Promise.all([
            this.creditRepository.listByUser(userId, 50),
            this.paymentRepository.listByUser(userId),
            this.apiUsageRepository.listByUser(userId, 50),
            prisma.subscription.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 10
            })
        ]);

        return {
            plan: user.plan,
            credits: user.credits,
            expireAt: user.expireAt,
            creditHistory,
            payments,
            apiUsages,
            subscriptions
        };
    }
}

