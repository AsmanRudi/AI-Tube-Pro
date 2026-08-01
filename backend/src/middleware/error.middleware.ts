import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("Error:", err.message);

    res.status(500).json({
        success: false,
        message: err.message || "Terjadi kesalahan server internal"
    });
}
