import { AnalyticsRepository } from "../repositories/analytics.repository";

export class AnalyticsService {
    private repository = new AnalyticsRepository();

    async getDashboardAnalytics() {
        const [overview, topUser, mostUsedFeature, dailyAiUsage, monthlyAiUsage, planDistribution] =
            await Promise.all([
                this.repository.overview(),
                this.repository.topUser(),
                this.repository.mostUsedFeature(),
                this.repository.dailyAiUsage(30),
                this.repository.monthlyAiUsage(6),
                this.repository.planDistribution()
            ]);

        return {
            overview,
            topUser,
            mostUsedFeature,
            dailyAiUsage,
            monthlyAiUsage,
            planDistribution
        };
    }

    async getRecentLogs(limit: number) {
        return this.repository.recentLogs(limit);
    }
}

