export interface ApiKeyStatus {
  hasApiKey: boolean;
  maskedKey: string | null;
}

export interface ApiKeyTestResult {
  valid: boolean;
  message: string;
}

