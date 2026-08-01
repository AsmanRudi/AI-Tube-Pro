import prisma from "../config/database";

import { Prisma } from "@prisma/client";

export class ChannelRepository {

    async create(
        userId: number,
        projectId: number,
        data: {
            name: string;
            youtubeChannelId?: string;
            description?: string;
        }
    ) {
        return prisma.channel.create({
            data: {
                ...data,
                userId,
                projectId
            }
        });
    }

    async list(projectId: number, userId: number) {
        return prisma.channel.findMany({
            where: {
                projectId,
                userId
            },
            orderBy: {
                id: "desc"
            }
        });
    }

    async findOne(id: number, projectId: number, userId: number) {
        return prisma.channel.findFirst({
            where: {
                id,
                projectId,
                userId
            }
        });
    }

    async update(
        id: number,
        projectId: number,
        userId: number,
        data: {
            name?: string;
            youtubeChannelId?: string;
            description?: string;
        }
    ) {
        return prisma.channel.updateMany({
            where: {
                id,
                projectId,
                userId
            },
            data
        });
    }

    async delete(id: number, projectId: number, userId: number) {
        return prisma.channel.deleteMany({
            where: {
                id,
                projectId,
                userId
            }
        });
    }
}

