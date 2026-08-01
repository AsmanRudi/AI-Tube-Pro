import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { ProjectService } from "../services/project.service";

const service = new ProjectService();

export class ProjectController {

  async create(req: AuthRequest, res: Response) {
    try {
      const result = await service.create(
        req.user!.id,
        req.body
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal membuat project"
      });
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      const result = await service.list(
        req.user!.id
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil project"
      });
    }
  }

  async detail(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID project tidak valid"
        });
      }

      const result = await service.detail(
        id,
        req.user!.id
      );

      if (!result) {
        return res.status(404).json({
          message: "Project tidak ditemukan"
        });
      }

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil detail project"
      });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID project tidak valid"
        });
      }

      const result = await service.update(
        id,
        req.body
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal update project"
      });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID project tidak valid"
        });
      }

      const result = await service.delete(
        id,
        req.user!.id
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal hapus project"
      });
    }
  }

}
