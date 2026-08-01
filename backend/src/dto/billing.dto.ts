export interface BillingSummary {
    plan: string;
    credits: number;
    expireAt: Date | null;
    creditHistory: any[];
    payments: any[];
    apiUsages: any[];
    subscriptions: any[];
}

