import prisma from "../config/database";

import {
    Prisma
} from "@prisma/client";


export class SEORepository {


    create(
        data: Prisma.SeoResultUncheckedCreateInput
    ) {

        return prisma.seoResult.create({

            data

        });

    }


    list(
        projectId: number
    ) {

        return prisma.seoResult.findMany({

            where: {

                projectId

            },

            orderBy: {

                createdAt: "desc"

            }

        });

    }


    detail(
        id: number
    ) {

        return prisma.seoResult.findUnique({

            where: {

                id

            }

        });

    }

}