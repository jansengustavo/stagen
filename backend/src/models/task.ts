//Database schemas
import crypto from "crypto";
import pool from "../config/database";
import { Task } from "../types/Task";

export class TaskModel {
  async findAll(): Promise<Task[]> {
    const [rows]: any = await pool.query(
      "SELECT BIN_TO_UUID(task_id, 1) AS id, title, date, description, completed FROM tasks",
    );

    return rows.map((row: any) => ({
      ...row,
      completed: Boolean(row.completed),
    }));
  }

  async findById(id: string): Promise<Task | null> {
    const [rows]: any = await pool.query(
      "SELECT BIN_TO_UUID(task_id, 1) AS id, title, date, description, completed FROM tasks WHERE task_id = UUID_TO_BIN(?, 1)",
      [id],
    );

    if (!rows[0]) return null;

    return {
      ...rows[0],
      completed: Boolean(rows[0].completed),
    };
  }

  async create(task: Task): Promise<Task> {
    const id = crypto.randomUUID();

    await pool.query(
      "INSERT INTO tasks(task_id, title, date, description, completed) VALUES (UUID_TO_BIN(?, 1), ?, ?, ?, ?)",
      [id, task.title, task.date, task.description, task.completed ? 1 : 0],
    );

    return {
      id,
      title: task.title,
      date: task.date,
      description: task.description,
      completed: task.completed,
    };
  }

  async update(id: string, task: Partial<Task>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (task.title !== undefined) {
      fields.push("title = ?");
      values.push(task.title);
    }

    if (task.date !== undefined) {
      fields.push("date = ?");
      values.push(task.date);
    }

    if (task.description !== undefined) {
      fields.push("description = ?");
      values.push(task.description);
    }

    if (task.completed !== undefined) {
      fields.push("completed = ?");
      values.push(task.completed ? 1 : 0);
    }

    if (fields.length === 0) return;

    values.push(id);

    await pool.query(
      `UPDATE tasks SET ${fields.join(", ")} WHERE task_id = UUID_TO_BIN(?, 1)`,
      values,
    );
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM tasks WHERE task_id = UUID_TO_BIN(?, 1)", [
      id,
    ]);
  }
}
