import { Router } from "express";
import { BillingController } from "../controllers/billing.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new BillingController();

router.use(authMiddleware);

router.get("/credits", controller.getCredits.bind(controller));
router.get("/history", controller.getHistory.bind(controller));
router.get("/billing", controller.getBilling.bind(controller));

export default router;

