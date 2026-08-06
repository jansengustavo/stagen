//Core "business" logic (calculations, complex tasks)
import { User } from "../types/User";
import { UserModel } from "../models/user";
import { generateToken } from "../utils/jwt";

export class UserService {
  private userModel = new UserModel();

  async login(email: string, password: string) {
    const user = await this.userModel.findByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.password !== password) {
      throw new Error("Senha inválida");
    }

    const token = generateToken(user.id!, user.email);

    return { token, userId: user.id };
  }

  async getUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async createUser(user: User) {
    if (!user.name || !user.email) {
      throw new Error("Nome e email são obrigatórios");
    }

    await this.userModel.create(user);
  }

  async updateUser(id: string, user: Partial<User>) {
    await this.userModel.update(id, user);
  }

  async deleteUser(id: string) {
    await this.userModel.delete(id);
  }
}
