import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { VoiceService } from "../services/voice.service";

const service = new VoiceService();

export class VoiceController {

    async generate(req: AuthRequest, res: Response) {
        try {
            const result = await service.generate(req.user!.id, req.body);
            res.json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({
                message: error.message || "Gagal generate voiceover"
            });
        }
    }
}

