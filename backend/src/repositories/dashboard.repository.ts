import  prisma  from "../config/database";

export class DashboardRepository {

  async summary(userId: number) {

    const totalProjects = await prisma.project.count({
      where: {
        userId
      }
    });

    const totalScripts = await prisma.script.count({
      where: {
        project: {
          userId
        }
      }
    });

    const totalSeo = await prisma.seoResult.count({
      where: {
        project: {
          userId
        }
      }
    });

    const videos = await prisma.video.count({
      where: {
        project: {
          userId
        }
      }
    });

    const published = await prisma.video.count({
      where: {
        status: "PUBLISHED",
        project: {
          userId
        }
      }
    });

    const draft = await prisma.video.count({
      where: {
        status: "DRAFT",
        project: {
          userId
        }
      }
    });

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    const recentProjects = await prisma.project.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    });

    const recentScripts = await prisma.script.findMany({
      where: {
        project: {
          userId
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    });

    return {
      totalProjects,
      totalScripts,
      totalSeo,
      videos,
      published,
      draft,
      credits: user?.credits ?? 0,
      plan: user?.plan ?? "FREE",
      recentProjects,
      recentScripts
    };

  }

}
