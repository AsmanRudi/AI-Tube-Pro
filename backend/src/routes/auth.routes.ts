import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

const router = Router();

const controller = new AuthController();

router.post("/register", (req, res) => {
  controller.register(req, res);
});



router.get("/test", (req, res) => {
  res.json({ message: "auth route aktif" });
});

router.post("/login", (req, res) => {
  console.log("LOGIN ROUTE DIPANGGIL");
  controller.login(req, res);
});

export default router;