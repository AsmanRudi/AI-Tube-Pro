import { Router } from "express";

import auth from "./auth.routes";

import projectRoutes from "./project.routes";

import dashboardRoutes from "./dashboard.routes";

import scriptRoutes from "./script.routes";

import seoRoutes from "./seo.routes";

import thumbnailRoutes from "./thumbnail.routes";

import voiceRoutes from "./voice.routes";

import subtitleRoutes from "./subtitle.routes";

import channelRoutes from "./channel.routes";

import videoRoutes from "./video.routes";

import apiKeyRoutes from "./api-key.routes";

import adminRoutes from "./admin.routes";

import billingRoutes from "./billing.routes";

import notificationRoutes from "./notification.routes";


const router = Router();


router.use(
    "/auth",
    auth
);


router.use(
    "/dashboard",
    dashboardRoutes
);


router.use(
    "/projects",
    projectRoutes
);


router.use(
    "/script",
    scriptRoutes
);


router.use(
    "/seo",
    seoRoutes
);


router.use(
    "/thumbnail",
    thumbnailRoutes
);


router.use(
    "/voice",
    voiceRoutes
);


router.use(
    "/subtitle",
    subtitleRoutes
);


router.use(
    "/channels",
    channelRoutes
);


router.use(
    "/videos",
    videoRoutes
);


router.use(
    "/user/api-key",
    apiKeyRoutes
);


router.use(
    "/admin",
    adminRoutes
);


router.use(
    "/user",
    billingRoutes
);


router.use(
    "/notifications",
    notificationRoutes
);


export default router;

