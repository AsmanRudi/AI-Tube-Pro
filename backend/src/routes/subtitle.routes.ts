import { Router } from "express";
import { SubtitleController } from "../controllers/subtitle.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { creditMiddleware } from "../middleware/credit.middleware";
import { CREDIT_COSTS } from "../services/credit.service";

const router = Router();
const controller = new SubtitleController();

router.use(authMiddleware);

router.post(
    "/generate",
    creditMiddleware("SUBTITLE_GENERATE", CREDIT_COSTS.SUBTITLE_GENERATE),
    controller.generate.bind(controller)
);

export default router;

