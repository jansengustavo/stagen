//Core "business" logic (calculations, complex tasks)
import { Task } from "../types/Task";
import { TaskModel } from "../models/task";

export class TaskService {
  private taskModel = new TaskModel();

  async getAllTasks() {
    return await this.taskModel.findAll();
  }

  async getTaskById(id: string) {
    return await this.taskModel.findById(id);
  }

  async createTask(task: Task) {
    if (!task.title || !task.date) {
      throw new Error("Título e data são obrigatórios");
    }

    return await this.taskModel.create({
      ...task,
      description: task.description || "",
      completed: task.completed ?? false,
    });
  }

  async updateTask(id: string, task: Partial<Task>) {
    await this.taskModel.update(id, task);
  }

  async deleteTask(id: string) {
    await this.taskModel.delete(id);
  }
}
