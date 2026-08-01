import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import prisma from "../config/database";

/**
 * Middleware untuk memeriksa ketersediaan credits sebelum request AI diproses.
 * Pengurangan credits dan pencatatan history dilakukan di service setelah
 * generasi AI berhasil (lihat CreditService.consume).
 */
export function creditMiddleware(feature: string, requiredCredits: number) {
    return async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user!.id },
                select: { credits: true, status: true },
            });

            if (!user || user.status === "SUSPENDED") {
                return res.status(403).json({
                    success: false,
                    message: "Akun Anda telah disuspended. Hubungi admin.",
                });
            }

            if (user.credits < requiredCredits) {
                return res.status(400).json({
                    success: false,
                    message: "Credits tidak mencukupi.",
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

