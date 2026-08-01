import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { ChannelService } from "../services/channel.service";

const service = new ChannelService();

export class ChannelController {

    async create(req: AuthRequest, res: Response) {
        try {
            const result = await service.create(req.user!.id, req.body);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal membuat channel" });
        }
    }

    async list(req: AuthRequest, res: Response) {
        try {
            const projectId = Number(req.params.projectId);
            if (isNaN(projectId)) {
                return res.status(400).json({ message: "projectId tidak valid" });
            }

            const result = await service.list(projectId, req.user!.id);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal mengambil channel" });
        }
    }

    async detail(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            if (isNaN(id) || isNaN(projectId)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }

            const result = await service.detail(id, projectId, req.user!.id);
            if (!result) {
                return res.status(404).json({ message: "Channel tidak ditemukan" });
            }

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal mengambil detail channel" });
        }
    }

    async update(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            if (isNaN(id) || isNaN(projectId)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }

            const result = await service.update(id, projectId, req.user!.id, req.body);
            if (result.count === 0) {
                return res.status(404).json({ message: "Channel tidak ditemukan" });
            }

            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal update channel" });
        }
    }

    async delete(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            if (isNaN(id) || isNaN(projectId)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }

            const result = await service.delete(id, projectId, req.user!.id);
            if (result.count === 0) {
                return res.status(404).json({ message: "Channel tidak ditemukan" });
            }

            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal hapus channel" });
        }
    }
}

