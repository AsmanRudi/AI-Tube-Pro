import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

export interface AuthUser {
    id: number;
    role: string;
    plan: string;
    credits: number;
    status: string;
    expireAt: Date | null;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}

const repository = new UserRepository();

export async function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({
            success: false,
            message: "Token tidak ditemukan",
        });
    }

    const token = auth.replace("Bearer ", "");

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { id: number };

        const user = await repository.findById(payload.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Pengguna tidak ditemukan",
            });
        }

        req.user = {
            id: user.id,
            role: user.role,
            plan: user.plan,
            credits: user.credits,
            status: user.status,
            expireAt: user.expireAt,
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid",
        });
    }
}

