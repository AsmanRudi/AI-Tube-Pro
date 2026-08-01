import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { DashboardService } from "../services/dashboard.service";

const service = new DashboardService();

export class DashboardController {

  async summary(req: AuthRequest, res: Response) {

    const result = await service.getDashboard(
      req.user!.id
    );

    res.json(result);

  }

}