import {
    Router
} from "express";

import {
    ScriptController
} from "../controllers/script.controller";

import {
    authMiddleware
} from "../middleware/auth.middleware";

import {
    creditMiddleware
} from "../middleware/credit.middleware";

import {
    CREDIT_COSTS
} from "../services/credit.service";


const router =
    Router();


const controller =
    new ScriptController();


router.use(
    authMiddleware
);


router.post(
    "/generate",
    creditMiddleware("SCRIPT_GENERATE", CREDIT_COSTS.SCRIPT_GENERATE),
    controller.generate.bind(controller)
);


router.get(
    "/project/:projectId",
    controller.list.bind(controller)
);


router.get(
    "/:id",
    controller.detail.bind(controller)
);


export default router;

