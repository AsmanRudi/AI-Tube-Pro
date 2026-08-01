export interface ListUsersQuery {
    search?: string;
    plan?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    role?: "ADMIN" | "USER";
    plan?: "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
    status?: "ACTIVE" | "SUSPENDED";
    credits?: number;
    expireAt?: string | null;
}

export interface AddCreditDto {
    amount: number;
    feature?: string;
}

export interface RemoveCreditDto {
    amount: number;
    feature?: string;
}

export interface ChangePlanDto {
    plan: "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
    expireAt?: string | null;
}

