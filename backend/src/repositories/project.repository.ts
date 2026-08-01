import  prisma  from "../config/database";

export class ProjectRepository {

  async create(data: any) {
    return prisma.project.create({
      data,
    });
  }

  async findByUser(userId: number) {
    return prisma.project.findMany({
      where: {
        userId,
      },
      include: {
        videos: true,
        channels: true,
        _count: {
          select: {
            scripts: true,
            seoResults: true
          }
        }
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async findOne(id: number, userId?: number) {
    return prisma.project.findFirst({
      where: {
        id,
        ...(userId ? { userId } : {}),
      },
      include: {
        scripts: {
          orderBy: {
            createdAt: "desc"
          }
        },
        seoResults: {
          orderBy: {
            createdAt: "desc"
          }
        },
        channels: {
          orderBy: {
            id: "desc"
          }
        },
        videos: {
          orderBy: {
            id: "desc"
          },
          include: {
            script: true,
            seoResult: true,
            channel: true
          }
        },
        _count: {
          select: {
            scripts: true,
            seoResults: true,
            videos: true
          }
        }
      },
    });
  }

  async update(id: number, data: any) {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
