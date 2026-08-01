import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { ApiKeyService } from "../services/api-key.service";

const service = new ApiKeyService();

export class ApiKeyController {

    async getStatus(req: AuthRequest, res: Response) {
        try {
            const result = await service.getStatus(req.user!.id);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: error.message || "Gagal mengambil status API Key"
            });
        }
    }

    async set(req: AuthRequest, res: Response) {
        try {
            const apiKey = req.body.apiKey;
            const result = await service.set(req.user!.id, apiKey);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({
                message: error.message || "Gagal menyimpan API Key"
            });
        }
    }

    async clear(req: AuthRequest, res: Response) {
        try {
            const result = await service.clear(req.user!.id);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: error.message || "Gagal menghapus API Key"
            });
        }
    }

    async test(req: AuthRequest, res: Response) {
        try {
            const result = await service.test(req.user!.id);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({
                message: error.message || "Gagal menguji API Key"
            });
        }
    }
}

