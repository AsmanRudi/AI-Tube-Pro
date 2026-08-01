import prisma from "../config/database";

export interface ApiUsageCreateData {
    userId: number;
    endpoint: string;
    feature: string;
    prompt: string;
    responseTime: number;
    tokensUsed: number;
    creditsUsed: number;
    status?: string;
}

export class ApiUsageRepository {
    async create(data: ApiUsageCreateData) {
        return prisma.apiUsage.create({
            data
        });
    }

    async listByUser(userId: number, take?: number, skip?: number) {
        return prisma.apiUsage.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: take ?? 50,
            skip: skip ?? 0
        });
    }

    async listAll(take?: number, skip?: number) {
        return prisma.apiUsage.findMany({
            orderBy: { createdAt: "desc" },
            take: take ?? 100,
            skip: skip ?? 0,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }

    async countByFeature() {
        const result = await prisma.apiUsage.groupBy({
            by: ["feature"],
            _count: { _all: true },
            orderBy: { _count: { feature: "desc" } }
        });

        return result.map((item) => ({
            feature: item.feature,
            count: item._count._all
        }));
    }

    async countDaily(days: number) {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const result = await prisma.apiUsage.groupBy({
            by: ["createdAt"],
            where: {
                createdAt: { gte: since }
            },
            _count: { _all: true }
        });

        return result;
    }
}

