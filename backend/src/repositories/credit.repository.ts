import prisma from "../config/database";

export interface CreditHistoryCreateData {
    userId: number;
    feature: string;
    amount: number;
    type: string;
}

export class CreditRepository {
    async create(data: CreditHistoryCreateData) {
        return prisma.creditHistory.create({
            data
        });
    }

    async listByUser(userId: number, take?: number, skip?: number) {
        return prisma.creditHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: take ?? 50,
            skip: skip ?? 0
        });
    }

    async totalCreditsUsed(userId?: number) {
        const where = userId ? { userId } : undefined;

        const aggregate = await prisma.creditHistory.aggregate({
            where: {
                ...where,
                amount: { lt: 0 }
            },
            _sum: { amount: true }
        });

        return Math.abs(aggregate._sum.amount ?? 0);
    }

    async totalCreditsAdded(userId?: number) {
        const where = userId ? { userId } : undefined;

        const aggregate = await prisma.creditHistory.aggregate({
            where: {
                ...where,
                amount: { gt: 0 }
            },
            _sum: { amount: true }
        });

        return aggregate._sum.amount ?? 0;
    }
}

