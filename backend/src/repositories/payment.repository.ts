import prisma from "../config/database";

export class PaymentRepository {
    async listByUser(userId: number) {
        return prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
    }

    async listAll() {
        return prisma.payment.findMany({
            orderBy: { createdAt: "desc" },
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

    async totalRevenue() {
        const aggregate = await prisma.payment.aggregate({
            where: { status: "SUCCESS" },
            _sum: { amount: true }
        });

        return aggregate._sum.amount ?? 0;
    }

    async countByStatus() {
        const result = await prisma.payment.groupBy({
            by: ["status"],
            _count: { _all: true }
        });

        return result.map((item) => ({
            status: item.status,
            count: item._count._all
        }));
    }
}

