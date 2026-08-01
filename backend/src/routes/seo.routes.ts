import {
    Router
} from "express";

import {
    SEOController
} from "../controllers/seo.controller";

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
    new SEOController();


router.use(
    authMiddleware
);


router.post(
    "/generate",
    creditMiddleware("SEO_GENERATE", CREDIT_COSTS.SEO_GENERATE),
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

