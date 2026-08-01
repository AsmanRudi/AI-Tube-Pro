import { Router } from "express";
import { ThumbnailController } from "../controllers/thumbnail.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { creditMiddleware } from "../middleware/credit.middleware";
import { CREDIT_COSTS } from "../services/credit.service";

const router = Router();
const controller = new ThumbnailController();

router.use(authMiddleware);

router.post(
    "/generate",
    creditMiddleware("THUMBNAIL_GENERATE", CREDIT_COSTS.THUMBNAIL_GENERATE),
    controller.generate.bind(controller)
);

export default router;

