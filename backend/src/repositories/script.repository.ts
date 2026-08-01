import prisma from "../config/database";

import { Prisma } from "@prisma/client";


export class ScriptRepository {


    create(
        data: Prisma.ScriptUncheckedCreateInput
    ) {

        return prisma.script.create({

            data

        });

    }


    list(
        projectId: number
    ) {

        return prisma.script.findMany({

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

        return prisma.script.findUnique({

            where: {

                id

            }

        });

    }

}