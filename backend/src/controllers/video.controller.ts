import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { VideoService } from "../services/video.service";

const service = new VideoService();

export class VideoController {

    async create(req: AuthRequest, res: Response) {
        try {
            const result = await service.create(req.user!.id, req.body);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal membuat video" });
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
            res.status(500).json({ message: "Gagal mengambil video" });
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
                return res.status(404).json({ message: "Video tidak ditemukan" });
            }

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal mengambil detail video" });
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
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal update video" });
        }
    }

    async delete(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            if (isNaN(id) || isNaN(projectId)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }

            await service.delete(id, projectId, req.user!.id);
            res.json({ success: true });
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal hapus video" });
        }
    }

    async generateScript(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            const result = await service.generateScript(id, projectId, req.user!.id);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal generate script" });
        }
    }

    async generateSeo(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            const result = await service.generateSeo(id, projectId, req.user!.id);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal generate SEO" });
        }
    }

    async generateThumbnail(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            const result = await service.generateThumbnail(id, projectId, req.user!.id, req.body);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal generate thumbnail" });
        }
    }

    async generateVoiceover(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            const result = await service.generateVoiceover(id, projectId, req.user!.id);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal generate voiceover" });
        }
    }

    async generateSubtitle(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            const result = await service.generateSubtitle(id, projectId, req.user!.id);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal generate subtitle" });
        }
    }

    async markReady(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            const result = await service.markReady(id, projectId, req.user!.id);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal tandai siap upload" });
        }
    }

    async publish(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const projectId = Number(req.params.projectId);

            const result = await service.publish(id, projectId, req.user!.id, req.body);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message || "Gagal publikasikan video" });
        }
    }
}

