import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { BillingService } from "../services/billing.service";

const service = new BillingService();

export class BillingController {
    async getCredits(req: AuthRequest, res: Response) {
        try {
            const result = await service.getCredits(req.user!.id);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memuat credits"
            });
        }
    }

    async getHistory(req: AuthRequest, res: Response) {
        try {
            const take = req.query.take ? Number(req.query.take) : 50;
            const skip = req.query.skip ? Number(req.query.skip) : 0;

            const result = await service.getHistory(req.user!.id, take, skip);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memuat history"
            });
        }
    }

    async getBilling(req: AuthRequest, res: Response) {
        try {
            const result = await service.getBilling(req.user!.id);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Gagal memuat billing"
            });
        }
    }
}

