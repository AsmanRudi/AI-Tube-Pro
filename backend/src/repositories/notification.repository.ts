import prisma from "../config/database";

export interface NotificationCreateData {
    userId: number;
    type: string;
    title: string;
    message: string;
}

export class NotificationRepository {
    async create(data: NotificationCreateData) {
        return prisma.notification.create({
            data
        });
    }

    async listByUser(userId: number, take?: number, skip?: number) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: take ?? 50,
            skip: skip ?? 0
        });
    }

    async unreadCount(userId: number) {
        return prisma.notification.count({
            where: { userId, isRead: false }
        });
    }

    async markRead(id: number, userId: number) {
        return prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true }
        });
    }

    async markAllRead(userId: number) {
        return prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }
}

