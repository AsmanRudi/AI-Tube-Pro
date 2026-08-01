export interface CreditHistory {
  id: number;
  userId: number;
  feature: string;
  amount: number;
  type: string;
  createdAt: string;
}

export interface BillingSummary {
  plan: string;
  credits: number;
  expireAt: string | null;
  creditHistory: CreditHistory[];
  payments: any[];
  apiUsages: any[];
  subscriptions: any[];
}

export interface UserCredits {
  credits: number;
  plan: string;
  expireAt: string | null;
}

