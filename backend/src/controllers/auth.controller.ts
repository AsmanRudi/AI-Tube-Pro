import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";

const service = new AuthService();

export class AuthController {

    async register(req: Request, res: Response) {

        try {

            const result =
                await service.register(req.body);

            res.json(result);

        }

        catch (e: any) {

            res.status(400).json({

                message: e.message

            });

        }

    }

   async login(req: Request, res: Response) {
    console.log("REQ.BODY:", req.body);

    try {
        const result = await service.login(req.body);
        res.json(result);
    } catch (e: any) {
        res.status(400).json({
            message: e.message
        });
    }
}

}

