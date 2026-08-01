import prisma from "../config/database";

export class UserRepository {

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    async create(data: {
        name: string;
        email: string;
        password: string;
    }) {
        return prisma.user.create({
            data
        });
    }

    async findById(id: number) {
        return prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async getApiKey(id: number): Promise<string | null> {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                geminiApiKey: true
            }
        });

        return user?.geminiApiKey ?? null;
    }

    async setApiKey(id: number, apiKey: string) {
        return prisma.user.update({
            where: {
                id
            },
            data: {
                geminiApiKey: apiKey
            }
        });
    }

    async clearApiKey(id: number) {
        return prisma.user.update({
            where: {
                id
            },
            data: {
                geminiApiKey: null
            }
        });
    }
}
