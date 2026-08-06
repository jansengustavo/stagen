//Database schemas
import { randomUUID } from "crypto";
import pool from "../config/database";
import { User } from "../types/User";

export class UserModel {
  async findByEmail(email: string): Promise<User | null> {
    const [rows]: any = await pool.query(
      "SELECT BIN_TO_UUID(user_id) AS id, email, name, password FROM users WHERE email = ?",
      [email],
    );

    return rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const [rows]: any = await pool.query(
      "SELECT BIN_TO_UUID(user_id) AS id, email, name, password FROM users WHERE user_id = UUID_TO_BIN(?)",
      [id],
    );

    return rows[0] || null;
  }

  async create(user: User): Promise<void> {
    const id = randomUUID();

    await pool.query(
      "INSERT INTO users(user_id, name, email, password) VALUES (UUID_TO_BIN(?), ?, ?, ?)",
      [id, user.name, user.email, user.password],
    );
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (user.name !== undefined) {
      fields.push("name=?");
      values.push(user.name);
    }
    if (user.email !== undefined) {
      fields.push("email=?");
      values.push(user.email);
    }
    if (user.password !== undefined) {
      fields.push("password=?");
      values.push(user.password);
    }

    if (fields.length === 0) return;

    values.push(id);
    await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE user_id = UUID_TO_BIN(?)`,
      values,
    );
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM users WHERE user_id = UUID_TO_BIN(?)", [id]);
  }
}
