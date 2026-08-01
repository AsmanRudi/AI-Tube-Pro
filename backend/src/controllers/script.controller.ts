import { Request, Response } from "express";
import { ScriptService } from "../services/script.service";
import { AuthRequest } from "../middleware/auth.middleware";

const service = new ScriptService();

export class ScriptController {

    async generate(req: AuthRequest, res: Response) {
        try {
            const result = await service.generate(req.user!.id, req.body);

            res.json(result);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: error instanceof Error ? error.message : "Generate Script Gagal"
            });
        }
    }


    async list(req: Request, res: Response) {
        try {
            const projectId = Number(req.params.projectId);

            if (isNaN(projectId)) {
                return res.status(400).json({
                    message: "projectId tidak valid"
                });
            }

            const result = await service.list(projectId);

            res.json(result);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Gagal mengambil script"
            });
        }
    }


    async detail(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "ID script tidak valid"
                });
            }

            const result = await service.detail(id);

            if (!result) {
                return res.status(404).json({
                    message: "Script tidak ditemukan"
                });
            }

            res.json(result);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Gagal mengambil detail script"
            });
        }
    }
}