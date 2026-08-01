import { DashboardRepository } from "../repositories/dashboard.repository";

export class DashboardService {

  repository = new DashboardRepository();

  async getDashboard(userId: number) {

    return this.repository.summary(userId);

  }

}