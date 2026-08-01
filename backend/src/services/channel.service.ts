import { ChannelRepository } from "../repositories/channel.repository";

export class ChannelService {

    repository = new ChannelRepository();

    async create(userId: number, body: any) {

        const projectId = Number(body.projectId);

        if (!projectId || isNaN(projectId)) {
            throw new Error("projectId wajib diisi");
        }

        if (!body.name) {
            throw new Error("Nama channel wajib diisi");
        }

        return this.repository.create(userId, projectId, {
            name: body.name,
            youtubeChannelId: body.youtubeChannelId,
            description: body.description
        });
    }

    async list(projectId: number, userId: number) {
        return this.repository.list(projectId, userId);
    }

    async detail(id: number, projectId: number, userId: number) {
        return this.repository.findOne(id, projectId, userId);
    }

    async update(id: number, projectId: number, userId: number, body: any) {
        return this.repository.update(id, projectId, userId, {
            name: body.name,
            youtubeChannelId: body.youtubeChannelId,
            description: body.description
        });
    }

    async delete(id: number, projectId: number, userId: number) {
        return this.repository.delete(id, projectId, userId);
    }
}

