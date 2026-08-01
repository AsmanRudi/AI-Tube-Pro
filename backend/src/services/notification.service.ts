import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
    private repository = new NotificationRepository();

    async createNotification(userId: number, type: string, title: string, message: string) {
        try {
            await this.repository.create({ userId, type, title, message });
        } catch (error) {
            console.error("Gagal membuat notifikasi:", error);
        }
    }

    async list(userId: number, take?: number, skip?: number) {
        const [notifications, unreadCount] = await Promise.all([
            this.repository.listByUser(userId, take, skip),
            this.repository.unreadCount(userId)
        ]);

        return { notifications, unreadCount };
    }

    async markRead(id: number, userId: number) {
        await this.repository.markRead(id, userId);
        return { success: true };
    }

    async markAllRead(userId: number) {
        await this.repository.markAllRead(userId);
        return { success: true };
    }
}

