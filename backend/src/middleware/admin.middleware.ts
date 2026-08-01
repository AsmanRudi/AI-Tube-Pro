import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function adminMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Akses ditolak. Hanya admin yang diperbolehkan.",
        });
    }

    next();
}

