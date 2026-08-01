import {
    Response,
    NextFunction
} from "express";

import {
    AuthRequest
} from "../middleware/auth.middleware";

import {
    SEOService
} from "../services/seo.service";


const service =
    new SEOService();


export class SEOController {


    async generate(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {

        try {


            const result =
                await service.generate(

                    req.user!.id,

                    {

                        projectId:
                            Number(
                                req.body.projectId
                            ),

                        scriptId:
                            Number(
                                req.body.scriptId
                            )

                    }

                );


            res.status(201).json({

                success: true,

                data: result

            });


        } catch (error) {

            next(error);

        }

    }


    async list(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {

        try {


            const result =
                await service.list(

                    Number(
                        req.params.projectId
                    )

                );


            res.json({

                success: true,

                data: result

            });


        } catch (error) {

            next(error);

        }

    }


    async detail(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {

        try {


            const result =
                await service.detail(

                    Number(
                        req.params.id
                    )

                );


            res.json({

                success: true,

                data: result

            });


        } catch (error) {

            next(error);

        }

    }

}