//Request-response logic (handles req, sends res)
import { Request, Response } from "express";
import { TaskService } from "../services/taskService";

const taskService = new TaskService();

export class TaskController {
  async getAll(req: Request, res: Response) {
    try {
      const tasks = await taskService.getAllTasks();

      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const task = await taskService.createTask(req.body);

      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      await taskService.updateTask(id, req.body);

      const updated = await taskService.getTaskById(id);

      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      await taskService.deleteTask(id);

      return res.json({
        message: "Task removida",
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}
