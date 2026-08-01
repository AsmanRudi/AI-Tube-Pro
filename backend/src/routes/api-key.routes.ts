import { Router } from "express";
import { ApiKeyController } from "../controllers/api-key.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new ApiKeyController();

router.use(authMiddleware);

router.get("/", controller.getStatus.bind(controller));
router.put("/", controller.set.bind(controller));
router.delete("/", controller.clear.bind(controller));
router.post("/test", controller.test.bind(controller));

export default router;

