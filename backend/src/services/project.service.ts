import { ProjectRepository } from "../repositories/project.repository";

export class ProjectService {

  repository = new ProjectRepository();

  async create(userId: number, body: any) {

    return this.repository.create({

       name: body.name,
        niche: body.niche,

      userId

    });

  }

  async list(userId: number) {

    return this.repository.findByUser(userId);

  }

  async detail(id: number, userId: number) {

    return this.repository.findOne(id, userId);

  }

  async update(id: number, body: any) {

    return this.repository.update(id, body);

  }

  async delete(id: number, userId: number) {

    const project = await this.repository.findOne(id, userId);

    if (!project) {
      throw new Error("Project tidak ditemukan");
    }

    return this.repository.delete(id);

  }

}
