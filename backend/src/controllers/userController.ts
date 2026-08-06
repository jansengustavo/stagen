//Request-response logic (handles req, sends res)
import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await userService.login(email, password);

      return res.status(200).json({
        token: result.token,
        userId: result.userId,
      });
    } catch (error: any) {
      return res.status(401).json({
        message: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
        });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      await userService.createUser(req.body);

      return res.status(201).json({
        message: "Usuário criado",
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      await userService.updateUser(id, req.body);

      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    await userService.deleteUser(id);

    return res.json({
      message: "Usuário removido",
    });
  }
}
