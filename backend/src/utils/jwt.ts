import jwt from "jsonwebtoken";

export function createToken(id: number, role: string = "USER") {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    );
}

