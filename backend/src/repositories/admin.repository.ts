import prisma from "../config/database";
import { Prisma, Role, Plan, UserStatus } from "@prisma/client";

export class AdminRepository {
    async listUsers(params: {
        search?: string;
        plan?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {
            ...(params.search
                ? {
                      OR: [
                          { name: { contains: params.search, mode: "insensitive" } },
                          { email: { contains: params.search, mode: "insensitive" } }
                      ]
                  }
                : {}),
            ...(params.plan ? { plan: params.plan as Plan } : {}),
            ...(params.status ? { status: params.status as UserStatus } : {})
        };

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    plan: true,
                    credits: true,
                    status: true,
                    expireAt: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            projects: true,
                            channels: true,
                            apiUsages: true,
                            payments: true,
                            subscriptions: true
                        }
                    }
                }
            }),
            prisma.user.count({ where })
        ]);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getUserDetail(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                plan: true,
                credits: true,
                status: true,
                expireAt: true,
                createdAt: true,
                updatedAt: true,
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        createdAt: true,
                        _count: { select: { scripts: true } }
                    }
                },
                creditHistory: {
                    orderBy: { createdAt: "desc" },
                    take: 20
                },
                apiUsages: {
                    orderBy: { createdAt: "desc" },
                    take: 20
                },
                payments: {
                    orderBy: { createdAt: "desc" },
                    take: 20
                },
                subscriptions: {
                    orderBy: { createdAt: "desc" },
                    take: 10
                }
            }
        });

        if (!user) return null;

        const totalScripts = await prisma.script.count({
            where: { project: { userId: id } }
        });

        return {
            ...user,
            totalScripts
        };
    }

    async updateUser(
        id: number,
        data: {
            name?: string;
            email?: string;
            role?: Role;
            plan?: Plan;
            status?: UserStatus;
            credits?: number;
            expireAt?: Date | null;
        }
    ) {
        return prisma.user.update({
            where: { id },
            data
        });
    }

    async deleteUser(id: number) {
        return prisma.user.delete({
            where: { id }
        });
    }
}

