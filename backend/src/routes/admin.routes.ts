import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();
const controller = new AdminController();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/users", controller.listUsers.bind(controller));
router.post("/users", controller.listUsers.bind(controller));
router.get("/users/:id", controller.getUserDetail.bind(controller));
router.patch("/users/:id", controller.updateUser.bind(controller));
router.delete("/users/:id", controller.deleteUser.bind(controller));
router.post("/users/:id/add-credit", controller.addCredit.bind(controller));
router.post("/users/:id/remove-credit", controller.removeCredit.bind(controller));
router.post("/users/:id/reset-credits", controller.resetCredits.bind(controller));
router.post("/users/:id/change-plan", controller.changePlan.bind(controller));
router.post("/users/:id/suspend", controller.suspendUser.bind(controller));
router.post("/users/:id/activate", controller.activateUser.bind(controller));

router.get("/analytics", controller.getAnalytics.bind(controller));
router.get("/payments", controller.getPayments.bind(controller));
router.get("/logs", controller.getLogs.bind(controller));

export default router;

