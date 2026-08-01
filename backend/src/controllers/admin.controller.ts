import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { AdminService } from "../services/admin.service";
import { Plan } from "@prisma/client";

const service = new AdminService();

export class AdminController {
    async listUsers(req: AuthRequest, res: Response) {
        try {
            const result = await service.listUsers({
                search: req.query.search as string | undefined,
                plan: req.query.plan as string | undefined,
                status: req.query.status as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined
            });

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memuat daftar user"
            });
        }
    }

    async getUserDetail(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            const result = await service.getUserDetail(id);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : "User tidak ditemukan"
            });
        }
    }

    async updateUser(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            const result = await service.updateUser(id, req.body);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memperbarui user"
            });
        }
    }

    async deleteUser(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            await service.deleteUser(id);

            res.json({
                success: true,
                message: "User berhasil dihapus"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal menghapus user"
            });
        }
    }

    async addCredit(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const amount = Number(req.body.amount);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            const result = await service.addCredit(id, amount, req.body.feature);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal menambah credit"
            });
        }
    }

    async removeCredit(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const amount = Number(req.body.amount);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            const result = await service.removeCredit(id, amount, req.body.feature);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal mengurangi credit"
            });
        }
    }

    async resetCredits(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            const result = await service.resetCredits(id);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal reset credit"
            });
        }
    }

    async changePlan(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const plan = req.body.plan as Plan;

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            if (!plan || !["FREE", "BASIC", "PRO", "ENTERPRISE"].includes(plan)) {
                return res.status(400).json({ success: false, message: "Plan tidak valid" });
            }

            const result = await service.changePlan(
                id,
                plan,
                req.body.expireAt ? new Date(req.body.expireAt) : null
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal mengubah plan"
            });
        }
    }

    async suspendUser(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            const result = await service.suspendUser(id);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal suspend user"
            });
        }
    }

    async activateUser(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID user tidak valid" });
            }

            const result = await service.activateUser(id);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal mengaktifkan user"
            });
        }
    }

    async getAnalytics(req: AuthRequest, res: Response) {
        try {
            const result = await service.getAnalytics();

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memuat analytics"
            });
        }
    }

    async getPayments(req: AuthRequest, res: Response) {
        try {
            const result = await service.getPayments();

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memuat payments"
            });
        }
    }

    async getLogs(req: AuthRequest, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 50;
            const result = await service.getLogs(limit);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memuat logs"
            });
        }
    }
}

