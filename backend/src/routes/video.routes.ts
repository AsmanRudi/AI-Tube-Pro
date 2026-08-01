import { Router } from "express";
import { VideoController } from "../controllers/video.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new VideoController();

router.use(authMiddleware);

router.get("/project/:projectId", controller.list.bind(controller));
router.post("/", controller.create.bind(controller));

router.post("/:projectId/:id/generate-script", controller.generateScript.bind(controller));
router.post("/:projectId/:id/generate-seo", controller.generateSeo.bind(controller));
router.post("/:projectId/:id/generate-thumbnail", controller.generateThumbnail.bind(controller));
router.post("/:projectId/:id/generate-voiceover", controller.generateVoiceover.bind(controller));
router.post("/:projectId/:id/generate-subtitle", controller.generateSubtitle.bind(controller));
router.post("/:projectId/:id/ready", controller.markReady.bind(controller));
router.post("/:projectId/:id/publish", controller.publish.bind(controller));

router.get("/:projectId/:id", controller.detail.bind(controller));
router.put("/:projectId/:id", controller.update.bind(controller));
router.delete("/:projectId/:id", controller.delete.bind(controller));

export default router;

