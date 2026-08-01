import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { NotificationService } from "../services/notification.service";

const service = new NotificationService();

export class NotificationController {
    async list(req: AuthRequest, res: Response) {
        try {
            const take = req.query.take ? Number(req.query.take) : 50;
            const skip = req.query.skip ? Number(req.query.skip) : 0;

            const result = await service.list(req.user!.id, take, skip);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memuat notifikasi"
            });
        }
    }

    async markRead(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "ID notifikasi tidak valid" });
            }

            const result = await service.markRead(id, req.user!.id);

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal menandai notifikasi"
            });
        }
    }

    async markAllRead(req: AuthRequest, res: Response) {
        try {
            const result = await service.markAllRead(req.user!.id);

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal menandai notifikasi"
            });
        }
    }
}

