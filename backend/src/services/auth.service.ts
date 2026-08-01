import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import { createToken } from "../utils/jwt";

export class AuthService {
    private repository = new UserRepository();

    async register(body: any) {
        const exists = await this.repository.findByEmail(body.email);

        if (exists) {
            throw new Error("Email sudah digunakan");
        }

        const password = await hashPassword(body.password);

        const user = await this.repository.create({
            name: body.name,
            email: body.email,
            password
        });

        const { password: _pw, geminiApiKey, ...safeUser } = user;

        return {
            token: createToken(user.id, user.role),
            user: safeUser
        };
    }

    async login(body: any) {
        const user = await this.repository.findByEmail(body.email);

        if (!user) {
            throw new Error("Email tidak ditemukan");
        }

        if (user.status === "SUSPENDED") {
            throw new Error("Akun Anda telah disuspended. Hubungi admin.");
        }

        const valid = await comparePassword(body.password, user.password);

        if (!valid) {
            throw new Error("Password salah");
        }

        const token = createToken(user.id, user.role);

        const { password, geminiApiKey, ...safeUser } = user;

        return {
            token,
            user: safeUser
        };
    }
}

