import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new ProjectController();

router.use(authMiddleware);

router.get("/", controller.list.bind(controller));
router.get("/:id", controller.detail.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
