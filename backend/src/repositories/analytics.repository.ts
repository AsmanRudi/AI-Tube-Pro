import prisma from "../config/database";

export class AnalyticsRepository {
    async overview() {
        const [totalUsers, activeUsers, premiumUsers, totalCreditsUsed, scriptGenerated, revenue, totalProjects] =
            await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { status: "ACTIVE" } }),
                prisma.user.count({
                    where: { plan: { not: "FREE" } }
                }),
                prisma.creditHistory.aggregate({
                    where: { amount: { lt: 0 } },
                    _sum: { amount: true }
                }),
                prisma.script.count(),
                prisma.payment.aggregate({
                    where: { status: "SUCCESS" },
                    _sum: { amount: true }
                }),
                prisma.project.count()
            ]);

        return {
            totalUsers,
            activeUsers,
            premiumUsers,
            totalCreditsUsed: Math.abs(totalCreditsUsed._sum.amount ?? 0),
            scriptGenerated,
            revenue: revenue._sum.amount ?? 0,
            totalProjects
        };
    }

    async topUser() {
        const aggregate = await prisma.creditHistory.groupBy({
            by: ["userId"],
            where: { amount: { lt: 0 } },
            _sum: { amount: true },
            orderBy: { _sum: { amount: "asc" } },
            take: 1
        });

        if (aggregate.length === 0) return null;

        const user = await prisma.user.findUnique({
            where: { id: aggregate[0].userId },
            select: { id: true, name: true, email: true }
        });

        return {
            user,
            creditsUsed: Math.abs(aggregate[0]._sum.amount ?? 0)
        };
    }

    async mostUsedFeature() {
        const result = await prisma.apiUsage.groupBy({
            by: ["feature"],
            _count: { _all: true },
            orderBy: { _count: { feature: "desc" } },
            take: 1
        });

        if (result.length === 0) return null;

        return {
            feature: result[0].feature,
            count: result[0]._count._all
        };
    }

    async dailyAiUsage(days: number = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        since.setHours(0, 0, 0, 0);

        const usages = await prisma.apiUsage.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true }
        });

        const map = new Map<string, number>();

        for (const usage of usages) {
            const key = usage.createdAt.toISOString().slice(0, 10);
            map.set(key, (map.get(key) ?? 0) + 1);
        }

        const result: { date: string; count: number }[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(since);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            result.push({ date: key, count: map.get(key) ?? 0 });
        }

        return result;
    }

    async monthlyAiUsage(months: number = 6) {
        const since = new Date();
        since.setMonth(since.getMonth() - (months - 1));
        since.setDate(1);
        since.setHours(0, 0, 0, 0);

        const usages = await prisma.apiUsage.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true }
        });

        const map = new Map<string, number>();

        for (const usage of usages) {
            const key = usage.createdAt.toISOString().slice(0, 7);
            map.set(key, (map.get(key) ?? 0) + 1);
        }

        const result: { month: string; count: number }[] = [];

        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(since);
            d.setMonth(d.getMonth() + i);
            const key = d.toISOString().slice(0, 7);
            result.push({ month: key, count: map.get(key) ?? 0 });
        }

        return result;
    }

    async planDistribution() {
        const result = await prisma.user.groupBy({
            by: ["plan"],
            _count: { _all: true }
        });

        return result.map((item) => ({
            plan: item.plan,
            count: item._count._all
        }));
    }

    async recentLogs(limit: number = 20) {
        return prisma.apiUsage.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }
}

