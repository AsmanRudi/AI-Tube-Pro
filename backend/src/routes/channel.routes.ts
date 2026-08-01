import { Router } from "express";
import { ChannelController } from "../controllers/channel.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new ChannelController();

router.use(authMiddleware);

router.get("/project/:projectId", controller.list.bind(controller));
router.post("/", controller.create.bind(controller));
router.get("/:projectId/:id", controller.detail.bind(controller));
router.put("/:projectId/:id", controller.update.bind(controller));
router.delete("/:projectId/:id", controller.delete.bind(controller));

export default router;

