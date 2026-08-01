import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new NotificationController();

router.use(authMiddleware);

router.get("/", controller.list.bind(controller));
router.patch("/:id/read", controller.markRead.bind(controller));
router.post("/read-all", controller.markAllRead.bind(controller));

export default router;

