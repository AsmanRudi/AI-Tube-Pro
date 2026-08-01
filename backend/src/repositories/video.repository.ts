import prisma from "../config/database";

import { Prisma } from "@prisma/client";

export class VideoRepository {

    async create(
        projectId: number,
        userId: number,
        data: {
            title: string;
            keyword?: string;
            language?: string;
            durationText?: string;
        }
    ) {
        // Pastikan project milik user
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId
            }
        });

        if (!project) {
            throw new Error("Project tidak ditemukan");
        }

        return prisma.video.create({
            data: {
                ...data,
                projectId,
                status: "DRAFT"
            }
        });
    }

    async list(projectId: number, userId: number) {
        return prisma.video.findMany({
            where: {
                projectId,
                project: {
                    userId
                }
            },
            include: {
                script: true,
                seoResult: true,
                channel: true
            },
            orderBy: {
                id: "desc"
            }
        });
    }

    async findOne(id: number, projectId: number, userId: number) {
        return prisma.video.findFirst({
            where: {
                id,
                projectId,
                project: {
                    userId
                }
            },
            include: {
                script: true,
                seoResult: true,
                channel: true,
                project: {
                    include: {
                        channels: true
                    }
                }
            }
        });
    }

    async update(id: number, data: any) {
        return prisma.video.update({
            where: { id },
            data
        });
    }

    async delete(id: number, projectId: number, userId: number) {
        const video = await prisma.video.findFirst({
            where: {
                id,
                projectId,
                project: { userId }
            }
        });

        if (!video) {
            throw new Error("Video tidak ditemukan");
        }

        return prisma.video.delete({
            where: { id }
        });
    }
}

