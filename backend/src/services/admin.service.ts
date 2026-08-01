import { AdminRepository } from "../repositories/admin.repository";
import { UserRepository } from "../repositories/user.repository";
import { CreditService } from "./credit.service";
import { AnalyticsService } from "./analytics.service";
import { NotificationService } from "./notification.service";
import { Role, Plan, UserStatus } from "@prisma/client";
import prisma from "../config/database";

export class AdminService {
    private adminRepository = new AdminRepository();
    private userRepository = new UserRepository();
    private creditService = new CreditService();
    private analyticsService = new AnalyticsService();
    private notificationService = new NotificationService();

    async listUsers(params: {
        search?: string;
        plan?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        return this.adminRepository.listUsers(params);
    }

    async getUserDetail(id: number) {
        const user = await this.adminRepository.getUserDetail(id);

        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        return user;
    }

    async updateUser(id: number, data: any) {
        const existing = await this.userRepository.findById(id);

        if (!existing) {
            throw new Error("Pengguna tidak ditemukan");
        }

        const updateData: {
            name?: string;
            email?: string;
            role?: Role;
            plan?: Plan;
            status?: UserStatus;
            credits?: number;
            expireAt?: Date | null;
        } = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.role !== undefined) updateData.role = data.role as Role;
        if (data.plan !== undefined) updateData.plan = data.plan as Plan;
        if (data.status !== undefined) updateData.status = data.status as UserStatus;
        if (data.credits !== undefined) updateData.credits = Number(data.credits);
        if (data.expireAt !== undefined) updateData.expireAt = data.expireAt ? new Date(data.expireAt) : null;

        return this.adminRepository.updateUser(id, updateData);
    }

    async deleteUser(id: number) {
        const existing = await this.userRepository.findById(id);

        if (!existing) {
            throw new Error("Pengguna tidak ditemukan");
        }

        if (existing.role === "ADMIN") {
            throw new Error("Tidak dapat menghapus admin");
        }

        return this.adminRepository.deleteUser(id);
    }

    async addCredit(userId: number, amount: number, feature?: string) {
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error("Jumlah credit harus bilangan bulat positif");
        }

        return this.creditService.addCredits(
            userId,
            amount,
            feature ?? "Admin Bonus",
            "ADMIN_BONUS"
        );
    }

    async removeCredit(userId: number, amount: number, feature?: string) {
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error("Jumlah credit harus bilangan bulat positif");
        }

        return this.creditService.removeCredits(
            userId,
            amount,
            feature ?? "Admin Deduction",
            "ADMIN_DEDUCT"
        );
    }

    async resetCredits(userId: number) {
        return this.creditService.resetCredits(userId);
    }

    async changePlan(userId: number, plan: Plan, expireAt?: Date | null) {
        const existing = await this.userRepository.findById(userId);

        if (!existing) {
            throw new Error("Pengguna tidak ditemukan");
        }

        const updated = await this.adminRepository.updateUser(userId, {
            plan,
            expireAt: expireAt ?? null
        });

        await this.notificationService.createNotification(
            userId,
            "PLAN_CHANGED",
            "Paket Berubah",
            `Paket Anda telah diubah menjadi ${plan}.`
        );

        return updated;
    }

    async suspendUser(userId: number) {
        const existing = await this.userRepository.findById(userId);

        if (!existing) {
            throw new Error("Pengguna tidak ditemukan");
        }

        if (existing.role === "ADMIN") {
            throw new Error("Tidak dapat men-suspend admin");
        }

        const updated = await this.adminRepository.updateUser(userId, {
            status: "SUSPENDED"
        });

        await this.notificationService.createNotification(
            userId,
            "ACCOUNT_SUSPENDED",
            "Akun Disuspend",
            "Akun Anda telah disuspended. Hubungi admin untuk informasi lebih lanjut."
        );

        return updated;
    }

    async activateUser(userId: number) {
        const existing = await this.userRepository.findById(userId);

        if (!existing) {
            throw new Error("Pengguna tidak ditemukan");
        }

        return this.adminRepository.updateUser(userId, {
            status: "ACTIVE"
        });
    }

    async getAnalytics() {
        return this.analyticsService.getDashboardAnalytics();
    }

    async getPayments() {
        return prisma.payment.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    async getLogs(limit?: number) {
        return this.analyticsService.getRecentLogs(limit ?? 50);
    }
}

